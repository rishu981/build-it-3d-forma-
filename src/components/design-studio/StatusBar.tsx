import React, { useState } from 'react';
import {
  Layers,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize,
  AlertCircle,
  CheckCircle2,
  Crosshair,
  Ruler,
} from 'lucide-react';
import { useDesignStudioStore } from '../../stores/useDesignStudioStore';

export const StatusBar: React.FC = () => {
  const {
    design,
    currentFloorLevel,
    setFloorLevel,
    addNewFloor,
    zoom,
    setZoom,
    cursorCoords,
    validationIssues,
    gridSnap,
    toggleGridSnap,
  } = useDesignStudioStore();

  const [showIssuesModal, setShowIssuesModal] = useState(false);

  if (!design) return null;

  const errorCount = validationIssues.filter((i) => i.severity === 'error').length;
  const warningCount = validationIssues.filter((i) => i.severity === 'warning').length;

  return (
    <footer className="h-10 bg-surface border-t border-border px-4 flex items-center justify-between shrink-0 select-none z-20 text-xs text-muted">
      {/* Left: Floor Selector & Add Floor */}
      <div className="flex items-center gap-1.5">
        <Layers className="w-3.5 h-3.5 text-muted-dark mr-1" />
        <div className="flex items-center bg-surface-muted p-0.5 rounded border border-border">
          {design.floors.map((floor) => (
            <button
              key={floor.floorLevel}
              onClick={() => setFloorLevel(floor.floorLevel)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                currentFloorLevel === floor.floorLevel
                  ? 'bg-surface text-forma-700 font-semibold shadow-subtle'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {floor.floorLevel === 0
                ? 'Ground Level'
                : floor.floorLevel === 1
                ? 'Level 1'
                : `Level ${floor.floorLevel}`}
            </button>
          ))}

          <button
            onClick={addNewFloor}
            className="p-1 hover:text-forma-600 rounded transition-colors text-muted"
            title="Add Upper Floor"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Center: Cursor Coordinates & Grid Snap */}
      <div className="flex items-center gap-4 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-muted">
          <Crosshair className="w-3.5 h-3.5 text-muted-light" />
          <span>
            X: <strong className="text-foreground">{cursorCoords.x.toFixed(2)}</strong>m | Z:{' '}
            <strong className="text-foreground">{cursorCoords.z.toFixed(2)}</strong>m
          </span>
        </div>

        <button
          onClick={toggleGridSnap}
          className={`px-2 py-0.5 rounded border text-[10px] font-medium transition-colors ${
            gridSnap
              ? 'bg-forma-50 border-forma-200 text-forma-700'
              : 'border-border text-muted hover:text-foreground'
          }`}
        >
          Snap: 0.5m
        </button>
      </div>

      {/* Right: Zoom Controls & Validation Badge */}
      <div className="flex items-center gap-3">
        {/* Validation Status Indicator */}
        <button
          onClick={() => setShowIssuesModal(!showIssuesModal)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
            errorCount > 0
              ? 'bg-semantic-errorBg border-semantic-error/30 text-semantic-error'
              : warningCount > 0
              ? 'bg-semantic-warningBg border-semantic-warning/30 text-semantic-warning'
              : 'bg-semantic-successBg border-semantic-success/20 text-semantic-success'
          }`}
        >
          {errorCount > 0 ? (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorCount} Error{errorCount > 1 ? 's' : ''}</span>
            </>
          ) : warningCount > 0 ? (
            <>
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{warningCount} Warning{warningCount > 1 ? 's' : ''}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CAD Verified</span>
            </>
          )}
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center bg-surface-muted rounded border border-border p-0.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}
            className="p-1 text-muted hover:text-foreground rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[10px] text-foreground font-semibold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(3.0, z + 0.1))}
            className="p-1 text-muted hover:text-foreground rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1.0)}
            className="p-1 text-muted hover:text-foreground rounded ml-0.5"
            title="Reset Zoom (100%)"
          >
            <Maximize className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
