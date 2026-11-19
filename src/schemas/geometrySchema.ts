import { z } from 'zod';

export const MeasurementUnitSchema = z.enum(['meters', 'feet']);
export const PlotShapeSchema = z.enum(['rectangular', 'square', 'l-shaped', 'custom']);
export const DirectionSchema = z.enum(['north', 'south', 'east', 'west']);

export const SetbacksSchema = z.object({
  front: z.number().min(0),
  rear: z.number().min(0),
  left: z.number().min(0),
  right: z.number().min(0),
});

export const PlotSchema = z.object({
  width: z.number().positive('Plot width must be greater than 0'),
  length: z.number().positive('Plot length must be greater than 0'),
  unit: MeasurementUnitSchema,
  shape: PlotShapeSchema,
  roadFacing: DirectionSchema,
  northAngle: z.number().default(0),
  maxFloors: z.number().int().min(1).max(10).default(2),
  setbacks: SetbacksSchema,
  existingStructuresDescription: z.string().optional(),
  surveyNumber: z.string().optional(),
  soilType: z.string().optional(),
});

export const RoomTypeSchema = z.enum([
  'living',
  'bedroom',
  'master_bedroom',
  'kitchen',
  'dining',
  'bathroom',
  'ensuite',
  'balcony',
  'garage',
  'staircase',
  'corridor',
  'utility',
  'office',
  'courtyard',
  'terrace',
  'foyer',
]);

export const FloorMaterialSchema = z.enum([
  'hardwood',
  'tile_ceramic',
  'marble',
  'polished_concrete',
  'parquet',
  'slate',
  'carpet',
]);

export const WallMaterialSchema = z.enum([
  'plaster_white',
  'exposed_brick',
  'concrete',
  'timber_slats',
  'stone_cladding',
  'charcoal_render',
]);

export const RoomSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  type: RoomTypeSchema,
  x: z.number(),
  z: z.number(),
  width: z.number().positive('Room width must be positive'),
  length: z.number().positive('Room length must be positive'),
  wallHeight: z.number().min(2).max(10).default(3.0),
  floorLevel: z.number().int().min(0).default(0),
  floorMaterial: FloorMaterialSchema.default('tile_ceramic'),
  wallMaterial: WallMaterialSchema.default('plaster_white'),
  wallColor: z.string().default('#FFFFFF'),
  color: z.string().default('#E8EEF5'),
  ceilingHeight: z.number().optional(),
  hasAttachedBath: z.boolean().optional(),
});

export const WallSchema = z.object({
  id: z.string(),
  floorLevel: z.number().int().min(0).default(0),
  start: z.object({ x: z.number(), z: z.number() }),
  end: z.object({ x: z.number(), z: z.number() }),
  thickness: z.number().min(0.05).max(1.0).default(0.2),
  height: z.number().min(1).max(10).default(3.0),
  isExterior: z.boolean().default(false),
  material: WallMaterialSchema.default('plaster_white'),
  color: z.string().optional(),
});

export const DoorSchema = z.object({
  id: z.string(),
  floorLevel: z.number().int().min(0).default(0),
  roomId: z.string().optional(),
  wallId: z.string().optional(),
  position: z.object({ x: z.number(), z: z.number() }),
  width: z.number().min(0.6).max(3.0).default(0.9),
  height: z.number().min(1.8).max(3.5).default(2.1),
  rotation: z.number().default(0),
  type: z.enum(['single', 'double', 'sliding', 'pocket', 'bifold']).default('single'),
  openDirection: z.enum(['inside', 'outside']).optional(),
});

export const WindowSchema = z.object({
  id: z.string(),
  floorLevel: z.number().int().min(0).default(0),
  roomId: z.string().optional(),
  wallId: z.string().optional(),
  position: z.object({ x: z.number(), z: z.number() }),
  width: z.number().min(0.5).max(6.0).default(1.5),
  height: z.number().min(0.5).max(3.0).default(1.4),
  sillHeight: z.number().min(0).max(2.0).default(0.9),
  rotation: z.number().default(0),
  type: z.enum(['casement', 'sliding', 'fixed', 'picture', 'clerestory', 'louver']).default('sliding'),
});

export const StaircaseSchema = z.object({
  id: z.string(),
  floorLevel: z.number().int().min(0).default(0),
  position: z.object({ x: z.number(), z: z.number() }),
  width: z.number().positive().default(1.1),
  length: z.number().positive().default(3.0),
  rotation: z.number().default(0),
  direction: z.enum(['up', 'down']).default('up'),
  type: z.enum(['straight', 'l-shape', 'u-shape', 'spiral']).default('straight'),
  stepsCount: z.number().int().positive().default(16),
});

export const FurnitureItemSchema = z.object({
  id: z.string(),
  floorLevel: z.number().int().min(0).default(0),
  name: z.string(),
  category: z.enum(['seating', 'bed', 'table', 'kitchen', 'bath', 'storage', 'vehicle', 'decor', 'plants']),
  position: z.object({ x: z.number(), z: z.number() }),
  width: z.number().positive(),
  length: z.number().positive(),
  height: z.number().positive(),
  rotation: z.number().default(0),
  modelType: z.string(),
  color: z.string().optional(),
});

export const FloorPlanSchema = z.object({
  floorLevel: z.number().int().min(0),
  name: z.string(),
  rooms: z.array(RoomSchema).default([]),
  walls: z.array(WallSchema).default([]),
  doors: z.array(DoorSchema).default([]),
  windows: z.array(WindowSchema).default([]),
  stairs: z.array(StaircaseSchema).default([]),
  furniture: z.array(FurnitureItemSchema).default([]),
});

export const HouseDesignSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  version: z.number().default(1),
  units: MeasurementUnitSchema.default('meters'),
  plot: PlotSchema,
  floors: z.array(FloorPlanSchema).min(1),
  roofType: z.enum(['flat', 'pitched', 'hip', 'terrace_garden', 'shed', 'parapet']).default('flat'),
  roofPitchAngle: z.number().optional(),
  architecturalStyle: z.string().default('Modern Minimalist'),
  exteriorFinish: WallMaterialSchema.default('plaster_white'),
  foundationHeight: z.number().default(0.45),
  totalBuiltupArea: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});
