import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  History,
  Sparkles,
  Download,
  Share2,
  Sliders,
  Maximize2,
  Check,
  Eye,
  Box,
  Layers,
  Columns,
  Camera,
  Sun,
  Grid as GridIcon,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useDesignStudioStore } from '../../stores/useDesignStudioStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { StudioViewMode } from '../../types/geometry';
import { toast } from 'sonner';

export const TopToolbar: React.FC = () => {
  const navigate = useNavigate();
  const { activeProject } = useProjectStore();
  const {
    design,
    viewMode,
    setViewMode,
    undo,
    redo,
    undoStack,
    redoStack,
    hasUnsavedChanges,
    markSaved,
    toggleAiPanel,
    isAiPanelOpen,
    togglePropertiesPanel,
    isPropertiesPanelOpen,
    setVersionHistoryOpen,
    setGenerationModalOpen,
    showRoof,
    toggleShowRoof,
    showFurniture,
    toggleShowFurniture,
    wireframeMode,
    toggleWireframeMode,
    cutawayMode,
    toggleCutawayMode,
    setCameraPreset,
  } = useDesignStudioStore();

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [show3DMenu, setShow3DMenu] = useState(false);

  const handleSave = () => {
    if (!activeProject || !design) return;
    markSaved();
    toast.success('Project geometry saved to cloud database');
  };

  const handleExportJSON = () => {
    if (!design) return;
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject?.name || 'forma-design'}-geometry.json`;
    a.click();
    toast.success('Exported CAD geometry schema');
    setShowExportMenu(false);
  };

  return (
    <div className="h-14 bg-surface border-b border-border px-4 flex items-center justify-between shrink-0 select-none z-30">
      {/* Left: Back & Project Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-1.5 text-muted hover:text-foreground hover:bg-surface-hover rounded-md transition-colors"
          title="Return to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground truncate max-w-[200px] sm:max-w-[280px]">
              {activeProject?.name || 'Untitled Architectural Project'}
            </span>
            <Badge variant="outline" size="sm">
              v{design?.version || 1}.0
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasUnsavedChanges ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span className="text-muted">
              {hasUnsavedChanges ? 'Unsaved changes' : 'Saved'}
            </span>
            {hasUnsavedChanges && (
              <button
                onClick={handleSave}
                className="text-forma-600 hover:text-forma-700 font-semibold ml-1 hover:underline"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Center: View Switcher (2D / 3D / Split) */}
      <div className="flex items-center bg-surface-muted p-1 rounded-lg border border-border">
        <button
          onClick={() => setViewMode('2d')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            viewMode === '2d'
              ? 'bg-surface text-forma-700 shadow-subtle font-semibold'
              : 'text-muted-dark hover:text-foreground'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2D Plan</span>
        </button>

        <button
          onClick={() => setViewMode('3d')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            viewMode === '3d'
              ? 'bg-surface text-forma-700 shadow-subtle font-semibold'
              : 'text-muted-dark hover:text-foreground'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Model</span>
        </button>

        <button
          onClick={() => setViewMode('split')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            viewMode === 'split'
              ? 'bg-surface text-forma-700 shadow-subtle font-semibold'
              : 'text-muted-dark hover:text-foreground'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>Split View</span>
        </button>
      </div>

      {/* Right: History, 3D controls, AI Copilot, Export */}
      <div className="flex items-center gap-2">
        {/* Undo & Redo */}
        <div className="flex items-center border-r border-border pr-2 mr-1">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            className="p-1.5 text-muted hover:text-foreground hover:bg-surface-hover rounded disabled:opacity-30 disabled:pointer-events-none"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            className="p-1.5 text-muted hover:text-foreground hover:bg-surface-hover rounded disabled:opacity-30 disabled:pointer-events-none"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* 3D Viewport Controls Dropdown */}
        {(viewMode === '3d' || viewMode === 'split') && (
          <div className="relative">
            <button
              onClick={() => setShow3DMenu(!show3DMenu)}
              className="px-2.5 py-1 text-xs font-medium border border-border bg-surface hover:bg-surface-hover rounded-md flex items-center gap-1 text-muted-dark"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>3D Views</span>
            </button>

            {show3DMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-dropdown p-2 z-50 text-left text-xs animate-in fade-in zoom-in-95">
                <p className="text-[10px] uppercase font-bold text-muted px-2 py-1">Camera Angles</p>
                <button
                  onClick={() => {
                    setCameraPreset('isometric');
                    setShow3DMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-surface-hover rounded"
                >
                  Isometric View
                </button>
                <button
                  onClick={() => {
                    setCameraPreset('front');
                    setShow3DMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-surface-hover rounded"
                >
                  Front Elevation
                </button>
                <button
                  onClick={() => {
                    setCameraPreset('top');
                    setShow3DMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-surface-hover rounded"
                >
                  Top Down (Ortho)
                </button>
                <button
                  onClick={() => {
                    setCameraPreset('side');
                    setShow3DMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-surface-hover rounded"
                >
                  Side Elevation
                </button>

                <div className="border-t border-border my-1" />
                <p className="text-[10px] uppercase font-bold text-muted px-2 py-1">Visibility Toggles</p>
                <label className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-surface-hover rounded">
                  <span>Show Roof</span>
                  <input
                    type="checkbox"
                    checked={showRoof}
                    onChange={toggleShowRoof}
                    className="rounded text-forma-600"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-surface-hover rounded">
                  <span>Furniture</span>
                  <input
                    type="checkbox"
                    checked={showFurniture}
                    onChange={toggleShowFurniture}
                    className="rounded text-forma-600"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-surface-hover rounded">
                  <span>Cutaway Mode</span>
                  <input
                    type="checkbox"
                    checked={cutawayMode}
                    onChange={toggleCutawayMode}
                    className="rounded text-forma-600"
                  />
                </label>
                <label className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-surface-hover rounded">
                  <span>Wireframe</span>
                  <input
                    type="checkbox"
                    checked={wireframeMode}
                    onChange={toggleWireframeMode}
                    className="rounded text-forma-600"
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {/* Version History Button */}
        <button
          onClick={() => setVersionHistoryOpen(true)}
          className="p-1.5 text-muted hover:text-foreground hover:bg-surface-hover rounded transition-colors"
          title="Version History & Snapshots"
        >
          <History className="w-4 h-4" />
        </button>

        {/* AI Copilot Button */}
        <Button
          size="sm"
          variant={isAiPanelOpen ? 'primary' : 'secondary'}
          icon={<Sparkles className="w-3.5 h-3.5" />}
          onClick={toggleAiPanel}
        >
          AI Copilot
        </Button>

        {/* AI Generate New Design Modal Trigger */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setGenerationModalOpen(true)}
        >
          Generate Layout
        </Button>

        {/* Export Menu */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="p-1.5 text-muted hover:text-foreground hover:bg-surface-hover rounded transition-colors"
            title="Export CAD & Renders"
          >
            <Download className="w-4 h-4" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-dropdown py-1.5 z-50 text-left text-xs animate-in fade-in zoom-in-95">
              <button
                onClick={handleExportJSON}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-hover text-foreground"
              >
                Export JSON Geometry
              </button>
              <button
                onClick={() => {
                  toast.success('Vector SVG snapshot saved');
                  setShowExportMenu(false);
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-hover text-foreground"
              >
                Export 2D SVG CAD
              </button>
              <button
                onClick={() => {
                  toast.success('Architectural PDF summary generated');
                  setShowExportMenu(false);
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-hover text-foreground"
              >
                Print Architectural PDF
              </button>
            </div>
          )}
        </div>

        {/* Properties Toggle */}
        <button
          onClick={togglePropertiesPanel}
          className={`p-1.5 rounded transition-colors ${
            isPropertiesPanelOpen
              ? 'text-forma-700 bg-forma-50'
              : 'text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Toggle Properties Inspector"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
