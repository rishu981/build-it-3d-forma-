import { z } from 'zod';
import { PlotSchema } from './geometrySchema';

export const Step1ProjectInfoSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters'),
  description: z.string().default(''),
  location: z.string().optional(),
  projectType: z.enum([
    'residential',
    'villa',
    'duplex',
    'apartment',
    'commercial',
    'other',
  ]),
});

export const Step2PlotInfoSchema = z.object({
  width: z.coerce.number().min(3, 'Plot width must be at least 3m / 10ft'),
  length: z.coerce.number().min(3, 'Plot length must be at least 3m / 10ft'),
  unit: z.enum(['meters', 'feet']),
  shape: z.enum(['rectangular', 'square', 'l-shaped', 'custom']),
  roadFacing: z.enum(['north', 'south', 'east', 'west']),
  northAngle: z.coerce.number().min(0).max(360).default(0),
  maxFloors: z.coerce.number().min(1).max(5).default(2),
  setbackFront: z.coerce.number().min(0).default(1.5),
  setbackRear: z.coerce.number().min(0).default(1.0),
  setbackLeft: z.coerce.number().min(0).default(1.0),
  setbackRight: z.coerce.number().min(0).default(1.0),
  existingStructures: z.string().optional(),
});

export const Step4PreferencesSchema = z.object({
  style: z.enum([
    'modern',
    'contemporary',
    'minimalist',
    'traditional_indian',
    'luxury_villa',
    'industrial',
    'scandinavian',
    'custom',
  ]),
  bedrooms: z.coerce.number().min(1).max(10),
  bathrooms: z.coerce.number().min(1).max(10),
  floorsCount: z.coerce.number().min(1).max(5),
  kitchenType: z.enum(['open_plan', 'enclosed', 'island', 'parallel']),
  hasLivingRoom: z.boolean().default(true),
  hasDiningRoom: z.boolean().default(true),
  hasParking: z.boolean().default(true),
  parkingVehicles: z.coerce.number().min(0).max(4).default(1),
  hasBalcony: z.boolean().default(true),
  hasGarden: z.boolean().default(true),
  hasTerrace: z.boolean().default(true),
  staircasePreference: z.enum(['internal', 'external', 'spiral', 'grand']).default('internal'),
  specialRequirements: z.string().optional(),
  budgetTier: z.enum(['standard', 'premium', 'luxury']).default('premium'),
});
