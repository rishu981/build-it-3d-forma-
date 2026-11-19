import { HouseDesign, ValidationIssue, Room } from '../types/geometry';

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  groundCoverageRatio: number;
  totalBuiltupArea: number;
}

export function validateDesignGeometry(design: HouseDesign): ValidationResult {
  const issues: ValidationIssue[] = [];
  const plot = design.plot;
  const usableWidth = plot.width - (plot.setbacks.left + plot.setbacks.right);
  const usableLength = plot.length - (plot.setbacks.front + plot.setbacks.rear);

  let groundFloorArea = 0;
  let totalBuiltup = 0;

  design.floors.forEach((floor) => {
    let floorArea = 0;
    const rooms = floor.rooms || [];

    rooms.forEach((room) => {
      const roomArea = room.width * room.length;
      floorArea += roomArea;

      // 1. Check positive dimensions
      if (room.width <= 0 || room.length <= 0) {
        issues.push({
          id: `invalid-dim-${room.id}`,
          severity: 'error',
          message: `Room "${room.name}" has invalid dimensions (${room.width}m × ${room.length}m).`,
          elementId: room.id,
          elementType: 'room',
          floorLevel: floor.floorLevel,
        });
      }

      // 2. Minimum habitable size check (e.g. at least 1.2m for powder rooms, 2.4m for standard rooms)
      if (room.width < 1.0 || room.length < 1.0) {
        issues.push({
          id: `small-dim-${room.id}`,
          severity: 'warning',
          message: `Room "${room.name}" is unusually narrow (< 1.0m). Check architectural clearance.`,
          elementId: room.id,
          elementType: 'room',
          floorLevel: floor.floorLevel,
        });
      }

      // 3. Boundary check relative to plot and setbacks
      const roomRight = room.x + room.width;
      const roomBottom = room.z + room.length;

      // If room extends beyond plot
      if (room.x < 0 || room.z < 0 || roomRight > plot.width || roomBottom > plot.length) {
        issues.push({
          id: `boundary-overflow-${room.id}`,
          severity: 'error',
          message: `Room "${room.name}" extends beyond the plot boundaries.`,
          elementId: room.id,
          elementType: 'room',
          floorLevel: floor.floorLevel,
        });
      } else if (
        room.x < plot.setbacks.left ||
        room.z < plot.setbacks.front ||
        roomRight > plot.width - plot.setbacks.right ||
        roomBottom > plot.length - plot.setbacks.rear
      ) {
        issues.push({
          id: `setback-encroach-${room.id}`,
          severity: 'warning',
          message: `Room "${room.name}" encroaches into mandatory setback zones.`,
          elementId: room.id,
          elementType: 'room',
          floorLevel: floor.floorLevel,
        });
      }
    });

    // 4. Check room-to-room overlap on the same floor
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const r1 = rooms[i];
        const r2 = rooms[j];
        if (checkOverlap(r1, r2)) {
          issues.push({
            id: `overlap-${r1.id}-${r2.id}`,
            severity: 'warning',
            message: `Spatial overlap detected between "${r1.name}" and "${r2.name}".`,
            elementId: r1.id,
            elementType: 'room',
            floorLevel: floor.floorLevel,
          });
        }
      }
    }

    if (floor.floorLevel === 0) {
      groundFloorArea = floorArea;
    }
    totalBuiltup += floorArea;
  });

  const plotArea = plot.width * plot.length;
  const groundCoverageRatio = plotArea > 0 ? (groundFloorArea / plotArea) * 100 : 0;

  if (groundCoverageRatio > 75) {
    issues.push({
      id: 'high-ground-coverage',
      severity: 'warning',
      message: `Ground coverage is ${groundCoverageRatio.toFixed(1)}%, which may exceed local municipal maximums (typically 60-70%).`,
    });
  }

  return {
    isValid: issues.filter((i) => i.severity === 'error').length === 0,
    issues,
    groundCoverageRatio,
    totalBuiltupArea: totalBuiltup,
  };
}

function checkOverlap(r1: Room, r2: Room): boolean {
  // Allow a tiny margin of 0.05m for adjacent touching walls
  const margin = 0.05;
  return !(
    r1.x + r1.width <= r2.x + margin ||
    r2.x + r2.width <= r1.x + margin ||
    r1.z + r1.length <= r2.z + margin ||
    r2.z + r2.length <= r1.z + margin
  );
}
