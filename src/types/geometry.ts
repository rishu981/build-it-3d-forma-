export type MeasurementUnit = 'meters' | 'feet';

export type PlotShape = 'rectangular' | 'square' | 'l-shaped' | 'custom';

export type Direction = 'north' | 'south' | 'east' | 'west';

export interface Setbacks {
  front: number; // in current units (default meters)
  rear: number;
  left: number;
  right: number;
}

export interface Plot {
  width: number;
  length: number;
  unit: MeasurementUnit;
  shape: PlotShape;
  roadFacing: Direction;
  northAngle: number; // in degrees from Y-up (0 = top/North)
  maxFloors: number;
  setbacks: Setbacks;
  existingStructuresDescription?: string;
  surveyNumber?: string;
  soilType?: string;
}

export type RoomType =
  | 'living'
  | 'bedroom'
  | 'master_bedroom'
  | 'kitchen'
  | 'dining'
  | 'bathroom'
  | 'ensuite'
  | 'balcony'
  | 'garage'
  | 'staircase'
  | 'corridor'
  | 'utility'
  | 'office'
  | 'courtyard'
  | 'terrace'
  | 'foyer';

export type FloorMaterial =
  | 'hardwood'
  | 'tile_ceramic'
  | 'marble'
  | 'polished_concrete'
  | 'parquet'
  | 'slate'
  | 'carpet';

export type WallMaterial =
  | 'plaster_white'
  | 'exposed_brick'
  | 'concrete'
  | 'timber_slats'
  | 'stone_cladding'
  | 'charcoal_render';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  x: number; // position relative to plot origin (setback corner)
  z: number;
  width: number;
  length: number;
  wallHeight: number; // in meters (typically 3.0)
  floorLevel: number;
  floorMaterial: FloorMaterial;
  wallMaterial: WallMaterial;
  wallColor: string;
  color: string; // 2D floor plan tint
  ceilingHeight?: number;
  hasAttachedBath?: boolean;
}

export interface Wall {
  id: string;
  floorLevel: number;
  start: { x: number; z: number };
  end: { x: number; z: number };
  thickness: number; // e.g. 0.23m exterior, 0.12m interior
  height: number; // e.g. 3.0m
  isExterior: boolean;
  material: WallMaterial;
  color?: string;
}

export type DoorType = 'single' | 'double' | 'sliding' | 'pocket' | 'bifold';

export interface Door {
  id: string;
  floorLevel: number;
  roomId?: string;
  wallId?: string;
  position: { x: number; z: number };
  width: number; // e.g. 0.9m
  height: number; // e.g. 2.1m
  rotation: number; // 0, 90, 180, 270 degrees
  type: DoorType;
  openDirection?: 'inside' | 'outside';
}

export type WindowType = 'casement' | 'sliding' | 'fixed' | 'picture' | 'clerestory' | 'louver';

export interface Window {
  id: string;
  floorLevel: number;
  roomId?: string;
  wallId?: string;
  position: { x: number; z: number };
  width: number; // e.g. 1.5m
  height: number; // e.g. 1.4m
  sillHeight: number; // elevation from floor e.g. 0.9m
  rotation: number;
  type: WindowType;
}

export type StairType = 'straight' | 'l-shape' | 'u-shape' | 'spiral';

export interface Staircase {
  id: string;
  floorLevel: number;
  position: { x: number; z: number };
  width: number; // e.g. 1.1m
  length: number; // e.g. 3.2m
  rotation: number;
  direction: 'up' | 'down';
  type: StairType;
  stepsCount: number;
}

export type FurnitureCategory =
  | 'seating'
  | 'bed'
  | 'table'
  | 'kitchen'
  | 'bath'
  | 'storage'
  | 'vehicle'
  | 'decor'
  | 'plants';

export interface FurnitureItem {
  id: string;
  floorLevel: number;
  name: string;
  category: FurnitureCategory;
  position: { x: number; z: number };
  width: number;
  length: number;
  height: number;
  rotation: number;
  modelType: string;
  color?: string;
}

export interface FloorPlan {
  floorLevel: number; // 0 = Ground Floor, 1 = First Floor, 2 = Second Floor, etc.
  name: string;
  rooms: Room[];
  walls: Wall[];
  doors: Door[];
  windows: Window[];
  stairs: Staircase[];
  furniture: FurnitureItem[];
}

export type RoofType = 'flat' | 'pitched' | 'hip' | 'terrace_garden' | 'shed' | 'parapet';

export interface HouseDesign {
  id: string;
  projectId: string;
  version: number;
  units: MeasurementUnit;
  plot: Plot;
  floors: FloorPlan[];
  roofType: RoofType;
  roofPitchAngle?: number;
  architecturalStyle: string;
  exteriorFinish: WallMaterial;
  foundationHeight: number; // default 0.45m
  totalBuiltupArea: number; // in square units
  createdAt: string;
  updatedAt: string;
}

export type StudioViewMode = '2d' | '3d' | 'split';

export type StudioTool =
  | 'select'
  | 'pan'
  | 'draw_wall'
  | 'add_room'
  | 'add_door'
  | 'add_window'
  | 'add_staircase'
  | 'add_furniture'
  | 'measure'
  | 'delete';

export interface SelectionState {
  type: 'room' | 'wall' | 'door' | 'window' | 'staircase' | 'furniture' | 'plot' | null;
  id: string | null;
}

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  elementId?: string;
  elementType?: string;
  floorLevel?: number;
}
