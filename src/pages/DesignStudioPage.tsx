import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { useDesignStudioStore } from '../stores/useDesignStudioStore';
import { useProjectStore } from '../stores/useProjectStore';
import { TopToolbar } from '../components/design-studio/TopToolbar';
import { LeftToolPanel } from '../components/design-studio/LeftToolPanel';
import { PropertiesPanel } from '../components/design-studio/PropertiesPanel';
import { StatusBar } from '../components/design-studio/StatusBar';
import { FloorPlanEditor } from '../components/floor-planner/FloorPlanEditor';
import { AIAssistantPanel } from '../components/ai-assistant/AIAssistantPanel';
import { AIDesignGenerationModal } from '../components/ai-assistant/AIDesignGenerationModal';
import { VersionHistoryModal } from '../components/design-studio/VersionHistoryModal';
import { Loader2 } from 'lucide-react';

const HouseViewer3D = lazy(() =>
  import('../components/three-dimensional/HouseViewer3D').then((m) => ({ default: m.HouseViewer3D }))
);

export const DesignStudioPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { loadProject, activeProject } = useProjectStore();
  const { design, initializeDesign, viewMode, isPropertiesPanelOpen } = useDesignStudioStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const targetId = projectId || 'proj_villa_solarium';
      const proj = await loadProject(targetId);
      if (proj && proj.currentDesign) {
        initializeDesign(proj.currentDesign);
      }
      setIsLoading(false);
    };
    init();
  }, [projectId, loadProject, initializeDesign]);

  if (isLoading || !design) {
    return (
      <div className="h-screen w-screen bg-[#171B22] flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 text-forma-400 animate-spin" />
        <p className="text-xs font-mono text-studio-muted">Initializing 2D CAD & 3D WebGL Engine...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden select-none">
      {/* 1. Top Studio Toolbar */}
      <TopToolbar />

      {/* 2. Main Studio Work Area */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left CAD Drafting Tool Panel */}
        <LeftToolPanel />

        {/* Center Viewport (2D, 3D, or Split) */}
        <div className="flex-1 relative overflow-hidden bg-[#FAFBFC]">
          {viewMode === '2d' && <FloorPlanEditor />}
          {viewMode === '3d' && (
            <Suspense
              fallback={
                <div className="w-full h-full bg-[#171B22] flex flex-col items-center justify-center text-studio-muted">
                  <Loader2 className="w-7 h-7 text-forma-400 animate-spin mb-2" />
                  <span className="text-xs font-mono">Loading WebGL 3D Viewport...</span>
                </div>
              }
            >
              <HouseViewer3D />
            </Suspense>
          )}
          {viewMode === 'split' && (
            <div className="flex w-full h-full">
              <div className="w-1/2 h-full border-r border-border relative">
                <FloorPlanEditor />
              </div>
              <div className="w-1/2 h-full relative">
                <Suspense
                  fallback={
                    <div className="w-full h-full bg-[#171B22] flex flex-col items-center justify-center text-studio-muted">
                      <Loader2 className="w-7 h-7 text-forma-400 animate-spin mb-2" />
                      <span className="text-xs font-mono">Loading WebGL 3D Viewport...</span>
                    </div>
                  }
                >
                  <HouseViewer3D />
                </Suspense>
              </div>
            </div>
          )}
        </div>

        {/* Contextual Properties Inspector (Right Panel) */}
        {isPropertiesPanelOpen && <PropertiesPanel />}

        {/* Persistent / Toggleable AI Architectural Copilot Panel */}
        <AIAssistantPanel />
      </div>

      {/* 3. Bottom Status Bar */}
      <StatusBar />

      {/* Overlays / Modals */}
      <AIDesignGenerationModal />
      <VersionHistoryModal />
    </div>
  );
};
