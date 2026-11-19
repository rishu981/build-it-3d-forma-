import { HouseDesign, Plot, MeasurementUnit } from './geometry';

export type ProjectType =
  | 'residential'
  | 'villa'
  | 'duplex'
  | 'apartment'
  | 'commercial'
  | 'other';

export type ProjectStatus = 'draft' | 'in_progress' | 'ready' | 'archived';

export interface DesignPreferences {
  style:
    | 'modern'
    | 'contemporary'
    | 'minimalist'
    | 'traditional_indian'
    | 'luxury_villa'
    | 'industrial'
    | 'scandinavian'
    | 'custom';
  bedrooms: number;
  bathrooms: number;
  floorsCount: number;
  kitchenType: 'open_plan' | 'enclosed' | 'island' | 'parallel';
  hasLivingRoom: boolean;
  hasDiningRoom: boolean;
  hasParking: boolean;
  parkingVehicles?: number;
  hasBalcony: boolean;
  hasGarden: boolean;
  hasTerrace: boolean;
  staircasePreference: 'internal' | 'external' | 'spiral' | 'grand';
  specialRequirements?: string;
  budgetTier?: 'standard' | 'premium' | 'luxury';
}

export interface UploadedAsset {
  id: string;
  projectId?: string;
  name: string;
  fileType: 'land_photo' | 'plot_document' | 'reference_image' | 'existing_building' | 'pdf_plan';
  url: string;
  fileSizeBytes: number;
  dimensions?: { width: number; height: number };
  uploadedAt: string;
  notes?: string;
  tags?: string[];
  analyzedFeatures?: {
    orientationDetected?: string;
    estimatedTerrain?: string;
    notableConstraints?: string[];
  };
}

export interface ProjectVersion {
  id: string;
  versionNumber: number;
  projectId: string;
  name: string;
  description: string;
  changesSummary: string[];
  createdAt: string;
  designSnapshot: HouseDesign;
  thumbnailUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location?: string;
  projectType: ProjectType;
  status: ProjectStatus;
  plot: Plot;
  preferences: DesignPreferences;
  currentDesign: HouseDesign;
  uploadedFiles: UploadedAsset[];
  versionsCount: number;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
}

export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus;
  projectType?: ProjectType;
  sortBy?: 'updatedAt' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}
