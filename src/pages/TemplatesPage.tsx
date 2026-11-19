import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  Layers,
  Sparkles,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useProjectStore } from '../stores/useProjectStore';
import { ARCHITECTURAL_STYLES } from '../constants/designStyles';
import { toast } from 'sonner';

export const TemplatesPage: React.FC = () => {
  const navigate = useNavigate();
  const { createProject } = useProjectStore();

  const templates = [
    {
      id: 'tmpl_solarium',
      title: 'Villa Solarium Pavilion',
      style: 'Modern Minimalist',
      floors: 2,
      bedrooms: 3,
      dimensions: '16m × 22m',
      area: 285.4,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      description: 'Expansive double-height living room, cantilevered sunset balcony and integrated double garage.',
    },
    {
      id: 'tmpl_skyline',
      title: 'Skyline Urban Duplex',
      style: 'Contemporary Townhouse',
      floors: 2,
      bedrooms: 3,
      dimensions: '10m × 18m',
      area: 198.0,
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
      description: 'Narrow lot optimization with central open lightwell, passive stack cooling and rear private terrace.',
    },
    {
      id: 'tmpl_zenith',
      title: 'Zenith Courtyard Residence',
      style: 'Traditional Indian / Vernacular',
      floors: 1,
      bedrooms: 4,
      dimensions: '18m × 20m',
      area: 220.0,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80',
      description: 'Central open-to-sky water court (Aangan), terracotta finishes, deep shaded verandahs and natural airflow.',
    },
    {
      id: 'tmpl_scandi',
      title: 'Nordic Light Chalet',
      style: 'Scandinavian Minimal',
      floors: 2,
      bedrooms: 3,
      dimensions: '14m × 18m',
      area: 215.0,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
      description: 'Gabled timber roof, triple-glazed thermal fenestrations and open plan dining-kitchen hub.',
    },
  ];

  const handleUseTemplate = async (tmpl: typeof templates[0]) => {
    try {
      const proj = await createProject({
        name: `${tmpl.title} Design`,
        description: tmpl.description,
        projectType: 'villa',
        status: 'draft',
        plot: {
          width: 16,
          length: 22,
          unit: 'meters',
          shape: 'rectangular',
          roadFacing: 'north',
          northAngle: 0,
          maxFloors: tmpl.floors,
          setbacks: { front: 3, rear: 2, left: 2, right: 2 },
        },
        preferences: {
          style: 'modern',
          bedrooms: tmpl.bedrooms,
          bathrooms: 3,
          floorsCount: tmpl.floors,
          kitchenType: 'island',
          hasLivingRoom: true,
          hasDiningRoom: true,
          hasParking: true,
          hasBalcony: true,
          hasGarden: true,
          hasTerrace: true,
          staircasePreference: 'internal',
        },
      });

      toast.success(`Template "${tmpl.title}" cloned! Opening studio...`);
      navigate(`/studio/${proj.id}`);
    } catch {
      toast.error('Failed to clone template');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-left">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Predefined House Templates</h1>
        <p className="text-xs text-muted mt-1">
          Architect-verified residential layouts engineered for specific parcel aspect ratios and municipal bye-laws.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="rounded-2xl border border-border bg-surface overflow-hidden shadow-subtle hover:border-forma-300 hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div className="h-56 relative bg-studio-bg overflow-hidden group">
              <img
                src={tmpl.image}
                alt={tmpl.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <Badge variant="studio" size="sm">
                  {tmpl.style}
                </Badge>
                <span className="text-[10px] font-mono bg-black/60 text-white px-2 py-0.5 rounded border border-white/10">
                  {tmpl.dimensions}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-base text-foreground">{tmpl.title}</h3>
                  <span className="text-xs font-mono font-semibold text-forma-600">
                    {tmpl.area} m² Built-up
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{tmpl.description}</p>

                <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2 text-xs text-muted font-mono">
                  <div>
                    <span className="text-[10px] uppercase block text-muted-light">Levels</span>
                    <strong className="text-foreground">{tmpl.floors} Floor(s)</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase block text-muted-light">Bedrooms</span>
                    <strong className="text-foreground">{tmpl.bedrooms} Suites</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase block text-muted-light">Orientation</span>
                    <strong className="text-foreground">Daylight Max</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  iconPosition="right"
                  onClick={() => handleUseTemplate(tmpl)}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
