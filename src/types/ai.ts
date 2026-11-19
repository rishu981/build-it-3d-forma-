import { HouseDesign, Plot, StudioViewMode } from './geometry';
import { DesignPreferences } from './project';

export type ActionType =
  | 'switch_view'
  | 'generate_layout'
  | 'modify_room'
  | 'add_room'
  | 'add_balcony'
  | 'adjust_dimensions'
  | 'change_style'
  | 'regenerate'
  | 'toggle_cutaway'
  | 'toggle_wireframe';

export interface AIAction {
  type: ActionType;
  details: string;
  affectedElementId?: string;
  viewMode?: StudioViewMode;
  newDesign?: HouseDesign;
  roomData?: any;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  imageUrl?: string;
  appliedAction?: AIAction;
  suggestedPrompts?: string[];
}

export interface AIDesignGenerationRequest {
  projectId: string;
  plot: Plot;
  preferences: DesignPreferences;
  referenceImageIds?: string[];
  additionalPrompt?: string;
}

export type GenerationStageId =
  | 'understanding_requirements'
  | 'analyzing_plot'
  | 'preparing_layout'
  | 'validating_dimensions'
  | 'building_floorplan'
  | 'rendering_3d';

export interface GenerationStageProgress {
  id: GenerationStageId;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  message?: string;
}

export interface AIDesignGenerationResponse {
  design: HouseDesign;
  summary: {
    title: string;
    description: string;
    totalArea: number;
    roomsSummary: Record<string, number>;
    architecturalHighlights: string[];
    complianceNotes: string[];
  };
  warnings?: string[];
}

export interface PlotAnalysisResult {
  detectedBoundaryAspect?: string;
  suggestedBuildingFootprint: {
    width: number;
    length: number;
    coveragePercentage: number;
  };
  ventilationAndSunlightNotes: string[];
  setbackRecommendations: {
    front: number;
    rear: number;
    left: number;
    right: number;
  };
  suggestedRoomPlacements: string[];
}
