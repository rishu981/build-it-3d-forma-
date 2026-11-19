import React, { useRef, useState, useEffect } from 'react';
import { useDesignStudioStore } from '../../stores/useDesignStudioStore';
import { Room, Wall, Door, Window, Staircase, FurnitureItem } from '../../types/geometry';
import { formatArea } from '../../utils/formatters';

const SCALE = 35; // 35 pixels = 1 meter at zoom 1.0

export const FloorPlanEditor: React.FC = () => {
  const {
    design,
    currentFloorLevel,
    activeTool,
    selection,
    zoom,
    panOffset,
    gridSnap,
    gridSize,
    setSelection,
    setCursorCoords,
    setPanOffset,
    updateRoom,
    addRoom,
    removeRoom,
    updateWall,
    removeWall,
  } = useDesignStudioStore();

  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Dragging elements
  const [draggedElement, setDraggedElement] = useState<{
    type: 'room';
    id: string;
    startX: number;
    startZ: number;
    initialRoomX: number;
    initialRoomZ: number;
  } | null>(null);

  if (!design) return null;

  const plot = design.plot;
  const currentFloor =
    design.floors.find((f) => f.floorLevel === currentFloorLevel) || design.floors[0];

  const plotPixelWidth = plot.width * SCALE;
  const plotPixelLength = plot.length * SCALE;

  // Center offset within SVG
  const centerOffsetX = 120 + panOffset.x;
  const centerOffsetZ = 80 + panOffset.y;

  // Snap to grid utility
  const snap = (val: number) => {
    if (!gridSnap) return val;
    return Math.round(val / gridSize) * gridSize;
  };

  // Convert SVG client coords to world meters
  const clientToWorld = (clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, z: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = clientX - rect.left;
    const svgY = clientY - rect.top;

    const meterX = (svgX - centerOffsetX) / (SCALE * zoom);
    const meterZ = (svgY - centerOffsetZ) / (SCALE * zoom);

    return {
      x: Math.round(meterX * 100) / 100,
      z: Math.round(meterZ * 100) / 100,
    };
  };

  // Mouse handlers
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const coords = clientToWorld(e.clientX, e.clientY);
    setCursorCoords(coords);

    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
    } else if (draggedElement) {
      const dxMeters = (e.clientX - draggedElement.startX) / (SCALE * zoom);
      const dzMeters = (e.clientY - draggedElement.startZ) / (SCALE * zoom);

      let newX = snap(draggedElement.initialRoomX + dxMeters);
      let newZ = snap(draggedElement.initialRoomZ + dzMeters);

      // Clamp within plot
      newX = Math.max(0, Math.min(plot.width - 2, newX));
      newZ = Math.max(0, Math.min(plot.length - 2, newZ));

      updateRoom(draggedElement.id, { x: newX, z: newZ });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'pan' || e.button === 1 || e.altKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    } else if (activeTool === 'add_room') {
      const coords = clientToWorld(e.clientX, e.clientY);
      addRoom({
        name: 'New Space',
        type: 'bedroom',
        x: snap(coords.x),
        z: snap(coords.z),
        width: 4.0,
        length: 3.5,
        wallHeight: 3.0,
        floorMaterial: 'parquet',
        wallMaterial: 'plaster_white',
        wallColor: '#FFFFFF',
        color: '#EBF3FB',
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedElement(null);
  };

  // Element drag start
  const handleRoomMouseDown = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    setSelection('room', room.id);

    if (activeTool === 'delete') {
      removeRoom(room.id);
      return;
    }

    if (activeTool === 'select') {
      setDraggedElement({
        type: 'room',
        id: room.id,
        startX: e.clientX,
        startZ: e.clientY,
        initialRoomX: room.x,
        initialRoomZ: room.z,
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-[#FAFBFC] overflow-hidden select-none cursor-crosshair">
      <svg
        ref={svgRef}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern
            id="cadGridSmall"
            width={0.5 * SCALE * zoom}
            height={0.5 * SCALE * zoom}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${0.5 * SCALE * zoom} 0 L 0 0 0 ${0.5 * SCALE * zoom}`}
              fill="none"
              stroke="#ECEFF3"
              strokeWidth="0.8"
            />
          </pattern>
          <pattern
            id="cadGridMajor"
            width={2.0 * SCALE * zoom}
            height={2.0 * SCALE * zoom}
            patternUnits="userSpaceOnUse"
          >
            <rect width={2.0 * SCALE * zoom} height={2.0 * SCALE * zoom} fill="url(#cadGridSmall)" />
            <path
              d={`M ${2.0 * SCALE * zoom} 0 L 0 0 0 ${2.0 * SCALE * zoom}`}
              fill="none"
              stroke="#DCE1E8"
              strokeWidth="1.2"
            />
          </pattern>

          {/* Hatch for garden / grass */}
          <pattern id="grassHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#E2EDE4" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Global background grid */}
        <rect width="100%" height="100%" fill="url(#cadGridMajor)" />

        {/* Transformed workspace group */}
        <g transform={`translate(${centerOffsetX}, ${centerOffsetZ}) scale(${zoom})`}>
          {/* 1. Plot Boundary & Ground */}
          <rect
            x={0}
            y={0}
            width={plotPixelWidth}
            height={plotPixelLength}
            fill="#FFFFFF"
            stroke="#1E232B"
            strokeWidth={2.5}
            rx={2}
            className="filter drop-shadow-sm"
          />

          {/* Setback zone hatch */}
          <rect
            x={plot.setbacks.left * SCALE}
            y={plot.setbacks.front * SCALE}
            width={(plot.width - plot.setbacks.left - plot.setbacks.right) * SCALE}
            height={(plot.length - plot.setbacks.front - plot.setbacks.rear) * SCALE}
            fill="#FAFCFE"
            stroke="#426B9C"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.8}
          />

          {/* Road Frontage Indicator */}
          <g>
            {plot.roadFacing === 'north' && (
              <g transform="translate(0, -35)">
                <rect x={0} y={0} width={plotPixelWidth} height={28} fill="#274162" rx={4} />
                <text
                  x={plotPixelWidth / 2}
                  y={18}
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  letterSpacing="1"
                >
                  ▲ NORTH APPROACH ROAD (12.0M WIDE) ▲
                </text>
              </g>
            )}
            {plot.roadFacing === 'south' && (
              <g transform={`translate(0, ${plotPixelLength + 8})`}>
                <rect x={0} y={0} width={plotPixelWidth} height={28} fill="#274162" rx={4} />
                <text
                  x={plotPixelWidth / 2}
                  y={18}
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  letterSpacing="1"
                >
                  ▼ SOUTH APPROACH ROAD (12.0M WIDE) ▼
                </text>
              </g>
            )}
          </g>

          {/* North Arrow Graphic */}
          <g transform={`translate(${plotPixelWidth + 35}, 30) rotate(${plot.northAngle})`}>
            <circle cx="0" cy="0" r="18" fill="#FFFFFF" stroke="#426B9C" strokeWidth="1.5" />
            <polygon points="0,-14 6,10 0,6" fill="#D32F2F" />
            <polygon points="0,-14 -6,10 0,6" fill="#1E232B" />
            <text x="0" y="-18" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#D32F2F">
              N
            </text>
          </g>

          {/* Dimension Lines around plot */}
          {/* Top Width */}
          <g transform="translate(0, -12)">
            <line x1={0} y1={0} x2={plotPixelWidth} y2={0} stroke="#737B89" strokeWidth="1" />
            <line x1={0} y1={-4} x2={0} y2={4} stroke="#737B89" strokeWidth="1" />
            <line x1={plotPixelWidth} y1={-4} x2={plotPixelWidth} y2={4} stroke="#737B89" strokeWidth="1" />
            <text
              x={plotPixelWidth / 2}
              y={-4}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="600"
              fill="#20242C"
              textAnchor="middle"
            >
              {plot.width.toFixed(1)}m
            </text>
          </g>

          {/* Left Length */}
          <g transform="translate(-14, 0)">
            <line x1={0} y1={0} x2={0} y2={plotPixelLength} stroke="#737B89" strokeWidth="1" />
            <line x1={-4} y1={0} x2={4} y2={0} stroke="#737B89" strokeWidth="1" />
            <line x1={-4} y1={plotPixelLength} x2={4} y2={plotPixelLength} stroke="#737B89" strokeWidth="1" />
            <text
              x={-8}
              y={plotPixelLength / 2}
              fontSize="10"
              fontFamily="monospace"
              fontWeight="600"
              fill="#20242C"
              textAnchor="middle"
              transform={`rotate(-90, -8, ${plotPixelLength / 2})`}
            >
              {plot.length.toFixed(1)}m
            </text>
          </g>

          {/* 2. Rooms Rendering */}
          {currentFloor.rooms.map((room) => {
            const rx = room.x * SCALE;
            const rz = room.z * SCALE;
            const rw = room.width * SCALE;
            const rl = room.length * SCALE;
            const isSelected = selection.type === 'room' && selection.id === room.id;

            return (
              <g
                key={room.id}
                onMouseDown={(e) => handleRoomMouseDown(e, room)}
                className="cursor-move group"
              >
                {/* Room Fill */}
                <rect
                  x={rx}
                  y={rz}
                  width={rw}
                  height={rl}
                  fill={room.color || '#E8EEF5'}
                  fillOpacity={0.88}
                  stroke={isSelected ? '#426B9C' : '#6A7888'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  rx={1}
                />

                {isSelected && (
                  <rect
                    x={rx - 4}
                    y={rz - 4}
                    width={rw + 8}
                    height={rl + 8}
                    fill="none"
                    stroke="#426B9C"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    pointerEvents="none"
                  />
                )}

                {/* Diagonal subtle corner tick */}
                <line x1={rx} y1={rz} x2={rx + 10} y2={rz + 10} stroke="#CBD5E1" strokeWidth="0.8" />

                {/* Room Typography / Labels */}
                {rw > 40 && rl > 30 && (
                  <g pointerEvents="none">
                    <text
                      x={rx + rw / 2}
                      y={rz + rl / 2 - 6}
                      fontSize={Math.max(10, Math.min(13, rw / 10))}
                      fontWeight="600"
                      fill="#20242C"
                      textAnchor="middle"
                    >
                      {room.name}
                    </text>
                    <text
                      x={rx + rw / 2}
                      y={rz + rl / 2 + 8}
                      fontSize="9.5"
                      fontFamily="monospace"
                      fill="#556070"
                      textAnchor="middle"
                    >
                      {room.width.toFixed(1)}m × {room.length.toFixed(1)}m
                    </text>
                    <text
                      x={rx + rw / 2}
                      y={rz + rl / 2 + 20}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="600"
                      fill="#426B9C"
                      textAnchor="middle"
                    >
                      {formatArea(room.width * room.length, design.units)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 3. Walls Rendering */}
          {currentFloor.walls.map((wall) => {
            const x1 = wall.start.x * SCALE;
            const z1 = wall.start.z * SCALE;
            const x2 = wall.end.x * SCALE;
            const z2 = wall.end.z * SCALE;
            const isSelected = selection.type === 'wall' && selection.id === wall.id;
            const strokeW = Math.max(2, (wall.thickness || 0.2) * SCALE);

            return (
              <g
                key={wall.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelection('wall', wall.id);
                  if (activeTool === 'delete') removeWall(wall.id);
                }}
                className="cursor-pointer"
              >
                <line
                  x1={x1}
                  y1={z1}
                  x2={x2}
                  y2={z2}
                  stroke={isSelected ? '#426B9C' : wall.isExterior ? '#1E232B' : '#4B5565'}
                  strokeWidth={strokeW}
                  strokeLinecap="square"
                />
              </g>
            );
          })}

          {/* 4. Doors Rendering */}
          {currentFloor.doors.map((door) => {
            const dx = door.position.x * SCALE;
            const dz = door.position.z * SCALE;
            const dw = door.width * SCALE;
            const isSelected = selection.type === 'door' && selection.id === door.id;

            return (
              <g
                key={door.id}
                transform={`translate(${dx}, ${dz}) rotate(${door.rotation})`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelection('door', door.id);
                }}
                className="cursor-pointer"
              >
                {/* Door opening gap */}
                <rect x={0} y={-4} width={dw} height={8} fill="#FFFFFF" />
                {/* Door leaf line */}
                <line x1={0} y1={0} x2={0} y2={-dw} stroke="#D32F2F" strokeWidth={2} />
                {/* 90-degree swing arc */}
                <path
                  d={`M ${dw} 0 A ${dw} ${dw} 0 0 0 0 ${-dw}`}
                  fill="none"
                  stroke="#D32F2F"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />
                {isSelected && (
                  <circle cx={dw / 2} cy={-dw / 2} r={dw / 2} fill="#426B9C" fillOpacity={0.2} />
                )}
              </g>
            );
          })}

          {/* 5. Windows Rendering */}
          {currentFloor.windows.map((win) => {
            const wx = win.position.x * SCALE;
            const wz = win.position.z * SCALE;
            const ww = win.width * SCALE;
            const isSelected = selection.type === 'window' && selection.id === win.id;

            return (
              <g
                key={win.id}
                transform={`translate(${wx}, ${wz}) rotate(${win.rotation})`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelection('window', win.id);
                }}
                className="cursor-pointer"
              >
                {/* Cutout gap */}
                <rect x={-ww / 2} y={-4} width={ww} height={8} fill="#FFFFFF" />
                {/* Window frame & double glass lines */}
                <rect
                  x={-ww / 2}
                  y={-3}
                  width={ww}
                  height={6}
                  fill="#E3F2FD"
                  stroke="#1976D2"
                  strokeWidth={1.5}
                />
                <line x1={-ww / 2} y1={0} x2={ww / 2} y2={0} stroke="#1976D2" strokeWidth={1} />
                {isSelected && (
                  <rect
                    x={-ww / 2 - 2}
                    y={-6}
                    width={ww + 4}
                    height={12}
                    fill="none"
                    stroke="#426B9C"
                    strokeWidth={1.5}
                    strokeDasharray="3 2"
                  />
                )}
              </g>
            );
          })}

          {/* 6. Stairs Rendering */}
          {currentFloor.stairs.map((stair) => {
            const sx = stair.position.x * SCALE;
            const sz = stair.position.z * SCALE;
            const sw = stair.width * SCALE;
            const sl = stair.length * SCALE;
            const numTreads = stair.stepsCount || 14;

            return (
              <g
                key={stair.id}
                transform={`translate(${sx}, ${sz}) rotate(${stair.rotation})`}
                className="cursor-pointer"
              >
                <rect x={0} y={0} width={sw} height={sl} fill="#F9F6F0" stroke="#785A46" strokeWidth={1.5} />
                {Array.from({ length: numTreads }).map((_, i) => (
                  <line
                    key={i}
                    x1={0}
                    y1={(sl / numTreads) * (i + 1)}
                    x2={sw}
                    y2={(sl / numTreads) * (i + 1)}
                    stroke="#B89C86"
                    strokeWidth={1}
                  />
                ))}
                {/* Up Direction Arrow */}
                <line x1={sw / 2} y1={sl - 8} x2={sw / 2} y2={12} stroke="#426B9C" strokeWidth={1.5} />
                <polygon
                  points={`${sw / 2},6 ${sw / 2 - 4},14 ${sw / 2 + 4},14`}
                  fill="#426B9C"
                />
                <text x={sw / 2} y={sl - 12} fontSize="9" fontWeight="bold" fill="#426B9C" textAnchor="middle">
                  UP
                </text>
              </g>
            );
          })}

          {/* 7. Furniture Symbols */}
          {currentFloor.furniture.map((item) => {
            const fx = item.position.x * SCALE;
            const fz = item.position.z * SCALE;
            const fw = item.width * SCALE;
            const fl = item.length * SCALE;

            return (
              <g
                key={item.id}
                transform={`translate(${fx}, ${fz}) rotate(${item.rotation})`}
                className="cursor-pointer opacity-75 hover:opacity-100"
              >
                <rect
                  x={0}
                  y={0}
                  width={fw}
                  height={fl}
                  fill="#F1F3F6"
                  stroke="#8B95A5"
                  strokeWidth={1}
                  rx={2}
                />
                <text
                  x={fw / 2}
                  y={fl / 2 + 3}
                  fontSize="8"
                  fill="#737B89"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {item.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
