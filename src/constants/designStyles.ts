import { FloorMaterial, WallMaterial } from '../types/geometry';

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  exteriorFinish: WallMaterial;
  interiorFlooring: FloorMaterial;
  wallColor: string;
  roofType: 'flat' | 'pitched' | 'hip' | 'terrace_garden' | 'shed';
  badge: string;
}

export const ARCHITECTURAL_STYLES: StyleOption[] = [
  {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean planar geometry, large floor-to-ceiling glass fenestrations, white stucco and charcoal accents.',
    exteriorFinish: 'plaster_white',
    interiorFlooring: 'polished_concrete',
    wallColor: '#FDFDFD',
    roofType: 'flat',
    badge: 'Popular',
  },
  {
    id: 'contemporary',
    name: 'Contemporary Villa',
    description: 'Articulated volumes, cantilevered balconies, natural timber slats and recessed ambient lighting.',
    exteriorFinish: 'timber_slats',
    interiorFlooring: 'hardwood',
    wallColor: '#F5F5F0',
    roofType: 'terrace_garden',
    badge: 'Trending',
  },
  {
    id: 'traditional_indian',
    name: 'Traditional Indian / Courtyard',
    description: 'Central open-to-sky courtyard (Aangan), terracotta finishes, shaded verandahs and natural cross ventilation.',
    exteriorFinish: 'exposed_brick',
    interiorFlooring: 'tile_ceramic',
    wallColor: '#FFFBF5',
    roofType: 'pitched',
    badge: 'Heritage',
  },
  {
    id: 'luxury_villa',
    name: 'Luxury Mediterranean Villa',
    description: 'Symmetrical stone facades, high vaulted ceilings, expansive terraces and double-height living zones.',
    exteriorFinish: 'stone_cladding',
    interiorFlooring: 'marble',
    wallColor: '#F8F7F4',
    roofType: 'hip',
    badge: 'Premium',
  },
  {
    id: 'industrial',
    name: 'Industrial Loft',
    description: 'Exposed structural steel, raw architectural concrete, open plan spaces and black framed grid glass.',
    exteriorFinish: 'concrete',
    interiorFlooring: 'polished_concrete',
    wallColor: '#EBEBEB',
    roofType: 'shed',
    badge: 'Urban',
  },
  {
    id: 'scandinavian',
    name: 'Nordic Scandinavian',
    description: 'Warm light woods, gentle neutral hues, functional storage integration and maximum daylight capture.',
    exteriorFinish: 'timber_slats',
    interiorFlooring: 'parquet',
    wallColor: '#FAFAFA',
    roofType: 'pitched',
    badge: 'Minimal',
  },
];
