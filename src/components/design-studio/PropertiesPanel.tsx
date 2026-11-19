import React from 'react';
import {
  Square,
  Sliders,
  Trash2,
  Info,
  Maximize2,
  Paintbrush,
  Layers,
  Compass,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useDesignStudioStore } from '../../stores/useDesignStudioStore';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { FloorMaterial, WallMaterial, RoomType, DoorType, WindowType } from '../../types/geometry';
import { formatArea } from '../../utils/formatters';

export const PropertiesPanel: React.FC = () => {
  const {
    design,
    currentFloorLevel,
    selection,
    clearSelection,
    updateRoom,
    removeRoom,
    updateWall,
    removeWall,
    updateDoor,
    removeDoor,
    updateWindow,
    removeWindow,
    groundCoverageRatio,
    totalBuiltupArea,
    validationIssues,
  } = useDesignStudioStore();

  if (!design) return null;

  const currentFloor =
    design.floors.find((f) => f.floorLevel === currentFloorLevel) || design.floors[0];

  // Selected entities lookup
  const selectedRoom =
    selection.type === 'room'
      ? currentFloor.rooms.find((r) => r.id === selection.id)
      : null;

  const selectedWall =
    selection.type === 'wall'
      ? currentFloor.walls.find((w) => w.id === selection.id)
      : null;

  const selectedDoor =
    selection.type === 'door'
      ? currentFloor.doors.find((d) => d.id === selection.id)
      : null;

  const selectedWindow =
    selection.type === 'window'
      ? currentFloor.windows.find((win) => win.id === selection.id)
      : null;

  const plot = design.plot;

  return (
    <aside className="w-80 bg-surface border-l border-border flex flex-col h-full overflow-y-auto shrink-0 select-none z-20 text-left p-4 space-y-5">
      {/* 1. ROOM PROPERTIES INSPECTOR */}
      {selectedRoom ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Square className="w-4 h-4 text-forma-600" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Room Inspector
              </h3>
            </div>
            <button
              onClick={clearSelection}
              className="text-xs text-muted hover:text-foreground"
            >
              Done
            </button>
          </div>

          <Input
            label="Room Label"
            value={selectedRoom.name}
            onChange={(e) => updateRoom(selectedRoom.id, { name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Width (m)"
              type="number"
              step="0.1"
              value={selectedRoom.width}
              onChange={(e) =>
                updateRoom(selectedRoom.id, { width: Math.max(0.5, parseFloat(e.target.value) || 0) })
              }
            />
            <Input
              label="Length (m)"
              type="number"
              step="0.1"
              value={selectedRoom.length}
              onChange={(e) =>
                updateRoom(selectedRoom.id, { length: Math.max(0.5, parseFloat(e.target.value) || 0) })
              }
            />
          </div>

          <div className="p-3 rounded-lg bg-surface-muted border border-border flex items-center justify-between">
            <span className="text-xs text-muted">Floor Area</span>
            <span className="text-sm font-mono font-bold text-forma-600">
              {formatArea(selectedRoom.width * selectedRoom.length, design.units)}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">Room Type Category</label>
            <select
              value={selectedRoom.type}
              onChange={(e) => updateRoom(selectedRoom.id, { type: e.target.value as RoomType })}
              className="w-full h-8 px-2 text-xs bg-surface border border-border rounded-md shadow-subtle focus:outline-none focus:border-forma-500"
            >
              <option value="living">Living Room</option>
              <option value="master_bedroom">Master Bedroom</option>
              <option value="bedroom">Standard Bedroom</option>
              <option value="kitchen">Kitchen</option>
              <option value="dining">Dining Room</option>
              <option value="bathroom">Bathroom</option>
              <option value="ensuite">En-suite Bath</option>
              <option value="balcony">Balcony</option>
              <option value="garage">Garage / Carport</option>
              <option value="staircase">Staircase Hall</option>
              <option value="corridor">Passage / Hallway</option>
              <option value="utility">Utility / Laundry</option>
              <option value="office">Study / Office</option>
              <option value="courtyard">Courtyard</option>
              <option value="terrace">Roof Terrace</option>
              <option value="foyer">Entrance Foyer</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">Floor Flooring Finish</label>
            <select
              value={selectedRoom.floorMaterial}
              onChange={(e) =>
                updateRoom(selectedRoom.id, { floorMaterial: e.target.value as FloorMaterial })
              }
              className="w-full h-8 px-2 text-xs bg-surface border border-border rounded-md shadow-subtle focus:outline-none focus:border-forma-500"
            >
              <option value="hardwood">Natural Hardwood Parquet</option>
              <option value="tile_ceramic">Ceramic Porcelain Tiles</option>
              <option value="marble">Italian Calacatta Marble</option>
              <option value="polished_concrete">Polished Architectural Concrete</option>
              <option value="slate">Rustic Slate Stone</option>
              <option value="carpet">Acoustic Wool Carpet</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">Wall Finish Material</label>
            <select
              value={selectedRoom.wallMaterial}
              onChange={(e) =>
                updateRoom(selectedRoom.id, { wallMaterial: e.target.value as WallMaterial })
              }
              className="w-full h-8 px-2 text-xs bg-surface border border-border rounded-md shadow-subtle focus:outline-none focus:border-forma-500"
            >
              <option value="plaster_white">Smooth White Plaster</option>
              <option value="timber_slats">Vertical Acoustic Timber Slats</option>
              <option value="exposed_brick">Exposed Wire-cut Terracotta Brick</option>
              <option value="concrete">Architectural Off-form Concrete</option>
              <option value="stone_cladding">Travertine Stone Cladding</option>
              <option value="charcoal_render">Charcoal Micro-cement Render</option>
            </select>
          </div>

          <Input
            label="Clear Wall Height (m)"
            type="number"
            step="0.1"
            value={selectedRoom.wallHeight}
            onChange={(e) =>
              updateRoom(selectedRoom.id, {
                wallHeight: Math.max(2.0, parseFloat(e.target.value) || 3.0),
              })
            }
          />

          <div className="pt-2">
            <Button
              variant="destructive"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              className="w-full"
              onClick={() => removeRoom(selectedRoom.id)}
            >
              Delete Room Space
            </Button>
          </div>
        </div>
      ) : selectedWall ? (
        /* 2. WALL PROPERTIES INSPECTOR */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Wall Inspector
            </h3>
            <button onClick={clearSelection} className="text-xs text-muted hover:text-foreground">
              Done
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Thickness (m)"
              type="number"
              step="0.05"
              value={selectedWall.thickness}
              onChange={(e) =>
                updateWall(selectedWall.id, { thickness: parseFloat(e.target.value) || 0.2 })
              }
            />
            <Input
              label="Height (m)"
              type="number"
              step="0.1"
              value={selectedWall.height}
              onChange={(e) =>
                updateWall(selectedWall.id, { height: parseFloat(e.target.value) || 3.0 })
              }
            />
          </div>

          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={selectedWall.isExterior}
              onChange={(e) => updateWall(selectedWall.id, { isExterior: e.target.checked })}
              className="rounded text-forma-600"
            />
            <span>Exterior Load-bearing Wall</span>
          </label>

          <Button
            variant="destructive"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            className="w-full"
            onClick={() => removeWall(selectedWall.id)}
          >
            Delete Wall
          </Button>
        </div>
      ) : selectedDoor ? (
        /* 3. DOOR PROPERTIES INSPECTOR */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Door Inspector
            </h3>
            <button onClick={clearSelection} className="text-xs text-muted hover:text-foreground">
              Done
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Clear Width (m)"
              type="number"
              step="0.05"
              value={selectedDoor.width}
              onChange={(e) =>
                updateDoor(selectedDoor.id, { width: parseFloat(e.target.value) || 0.9 })
              }
            />
            <Input
              label="Clear Height (m)"
              type="number"
              step="0.05"
              value={selectedDoor.height}
              onChange={(e) =>
                updateDoor(selectedDoor.id, { height: parseFloat(e.target.value) || 2.1 })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">Door Typology</label>
            <select
              value={selectedDoor.type}
              onChange={(e) => updateDoor(selectedDoor.id, { type: e.target.value as DoorType })}
              className="w-full h-8 px-2 text-xs bg-surface border border-border rounded-md shadow-subtle"
            >
              <option value="single">Single Hinged Swing</option>
              <option value="double">Double French Doors</option>
              <option value="sliding">Pocket Sliding Door</option>
              <option value="bifold">Folding Bifold Panel</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">Swing Angle</label>
            <select
              value={selectedDoor.rotation}
              onChange={(e) =>
                updateDoor(selectedDoor.id, { rotation: parseInt(e.target.value, 10) })
              }
              className="w-full h-8 px-2 text-xs bg-surface border border-border rounded-md shadow-subtle"
            >
              <option value={0}>0° (Facing North)</option>
              <option value={90}>90° (Facing East)</option>
              <option value={180}>180° (Facing South)</option>
              <option value={270}>270° (Facing West)</option>
            </select>
          </div>

          <Button
            variant="destructive"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            className="w-full"
            onClick={() => removeDoor(selectedDoor.id)}
          >
            Delete Door
          </Button>
        </div>
      ) : selectedWindow ? (
        /* 4. WINDOW PROPERTIES INSPECTOR */
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Window Fenestration
            </h3>
            <button onClick={clearSelection} className="text-xs text-muted hover:text-foreground">
              Done
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Width (m)"
              type="number"
              step="0.1"
              value={selectedWindow.width}
              onChange={(e) =>
                updateWindow(selectedWindow.id, { width: parseFloat(e.target.value) || 1.5 })
              }
            />
            <Input
              label="Height (m)"
              type="number"
              step="0.1"
              value={selectedWindow.height}
              onChange={(e) =>
                updateWindow(selectedWindow.id, { height: parseFloat(e.target.value) || 1.4 })
              }
            />
          </div>

          <Input
            label="Sill Elevation from Floor (m)"
            type="number"
            step="0.1"
            value={selectedWindow.sillHeight}
            onChange={(e) =>
              updateWindow(selectedWindow.id, { sillHeight: parseFloat(e.target.value) || 0.9 })
            }
          />

          <Button
            variant="destructive"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            className="w-full"
            onClick={() => removeWindow(selectedWindow.id)}
          >
            Delete Window
          </Button>
        </div>
      ) : (
        /* 5. DEFAULT: PLOT & OVERALL SPATIAL METRICS */
        <div className="space-y-4">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-forma-600" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Parcel Telemetry
              </h3>
            </div>
            <p className="text-[11px] text-muted mt-0.5">Click any room or wall to inspect.</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted">Plot Boundaries</span>
              <span className="font-mono font-medium text-foreground">
                {plot.width}m × {plot.length}m
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted">Gross Plot Area</span>
              <span className="font-mono font-medium text-foreground">
                {Math.round(plot.width * plot.length)} m²
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted">Total Built-up Area</span>
              <span className="font-mono font-bold text-forma-600">
                {formatArea(totalBuiltupArea, design.units)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted">Ground Coverage</span>
              <span className="font-mono font-medium text-foreground">
                {groundCoverageRatio.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border-subtle">
              <span className="text-muted">Road Access</span>
              <span className="capitalize font-medium text-foreground">{plot.roadFacing} Facing</span>
            </div>
          </div>

          {/* Setbacks Summary */}
          <div className="p-3 rounded-lg bg-surface-muted border border-border space-y-1.5 text-xs">
            <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider block">
              Municipal Setbacks
            </span>
            <div className="grid grid-cols-2 gap-2 text-muted-dark font-mono text-[11px]">
              <div>Front: {plot.setbacks.front}m</div>
              <div>Rear: {plot.setbacks.rear}m</div>
              <div>Left: {plot.setbacks.left}m</div>
              <div>Right: {plot.setbacks.right}m</div>
            </div>
          </div>

          {/* Validation Status */}
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-foreground mb-2">Code Validation Status</h4>
            {validationIssues.length === 0 ? (
              <div className="p-2.5 rounded-lg bg-semantic-successBg border border-semantic-success/20 flex items-center gap-2 text-xs text-semantic-success">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>All spatial boundaries & setbacks compliant</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {validationIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-2 rounded-lg bg-semantic-warningBg border border-semantic-warning/20 text-[11px] text-semantic-warning flex items-start gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
