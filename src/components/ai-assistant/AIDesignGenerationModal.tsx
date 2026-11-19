import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Box,
  Sliders,
  Compass,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input, Textarea } from '../common/Input';
import { Badge } from '../common/Badge';
import { useDesignStudioStore } from '../../stores/useDesignStudioStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { useUserStore } from '../../stores/useUserStore';
import { aiService } from '../../services/ai/aiService';
import { ARCHITECTURAL_STYLES } from '../../constants/designStyles';
import { AIDesignGenerationResponse, GenerationStageId } from '../../types/ai';
import { toast } from 'sonner';

export const AIDesignGenerationModal: React.FC = () => {
  const { isGenerationModalOpen, setGenerationModalOpen, updateDesign, initializeDesign } =
    useDesignStudioStore();
  const { activeProject } = useProjectStore();
  const { deductCredits } = useUserStore();

  const [style, setStyle] = useState('modern');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [floors, setFloors] = useState(2);
  const [kitchenType, setKitchenType] = useState('island');
  const [prompt, setPrompt] = useState('Emphasize natural light and cross ventilation in living zones');

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState<GenerationStageId | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [generationResult, setGenerationResult] = useState<AIDesignGenerationResponse | null>(null);

  if (!isGenerationModalOpen) return null;

  const stagesList: { id: GenerationStageId; label: string }[] = [
    { id: 'understanding_requirements', label: '1. Understanding spatial requirements & lifestyle brief' },
    { id: 'analyzing_plot', label: '2. Analyzing plot boundaries, setbacks & solar orientation' },
    { id: 'preparing_layout', label: '3. Preparing room adjacency matrices & volumetric zoning' },
    { id: 'validating_dimensions', label: '4. Validating code clearances & structural spans' },
    { id: 'building_floorplan', label: '5. Building vector 2D floor plans & wall fenestrations' },
    { id: 'rendering_3d', label: '6. Compiling interactive Three.js 3D house model' },
  ];

  const handleStartGeneration = async () => {
    if (!activeProject) return;

    // Check credits
    if (!deductCredits(10)) {
      toast.error('Insufficient AI credits. Please top up or watch a rewarded preview.');
      return;
    }

    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const response = await aiService.generateDesign(
        {
          projectId: activeProject.id,
          plot: activeProject.plot,
          preferences: {
            ...activeProject.preferences,
            style: style as any,
            bedrooms,
            bathrooms,
            floorsCount: floors,
            kitchenType: kitchenType as any,
          },
          additionalPrompt: prompt,
        },
        (stage, percent, message) => {
          setCurrentStage(stage);
          setProgressPercent(percent);
          setStatusMessage(message);
        }
      );

      setGenerationResult(response);
      toast.success('AI Architectural Scheme Generated Successfully!');
    } catch (err: any) {
      toast.error('Generation failed: ' + (err.message || 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToStudio = () => {
    if (!generationResult) return;
    initializeDesign(generationResult.design);
    setGenerationModalOpen(false);
    toast.success('Generated layout applied to Design Studio canvas');
  };

  return (
    <Modal
      isOpen={isGenerationModalOpen}
      onClose={() => !isGenerating && setGenerationModalOpen(false)}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-forma-600" />
          <span>AI Spatial House Layout Generator</span>
        </div>
      }
      description="Autonomous CAD spatial reasoning engine for code-compliant floor plans and 3D house models."
    >
      <div className="space-y-6 text-left">
        {!isGenerating && !generationResult ? (
          /* Parameter Configuration Form */
          <div className="space-y-4 text-xs">
            {/* Style Selection */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">
                Architectural Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {ARCHITECTURAL_STYLES.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setStyle(st.id)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      style === st.id
                        ? 'border-forma-500 bg-forma-50 font-semibold text-forma-800 ring-1 ring-forma-500'
                        : 'border-border bg-surface hover:bg-surface-hover text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{st.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Numeric Program */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input
                label="Bedrooms"
                type="number"
                min="1"
                max="6"
                value={bedrooms}
                onChange={(e) => setBedrooms(parseInt(e.target.value, 10) || 1)}
              />
              <Input
                label="Bathrooms"
                type="number"
                min="1"
                max="6"
                value={bathrooms}
                onChange={(e) => setBathrooms(parseInt(e.target.value, 10) || 1)}
              />
              <Input
                label="Building Floors"
                type="number"
                min="1"
                max="3"
                value={floors}
                onChange={(e) => setFloors(parseInt(e.target.value, 10) || 1)}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-foreground">Kitchen Format</label>
                <select
                  value={kitchenType}
                  onChange={(e) => setKitchenType(e.target.value)}
                  className="w-full h-9 px-2 text-xs bg-surface border border-border rounded-md shadow-subtle"
                >
                  <option value="island">Gourmet Island</option>
                  <option value="open_plan">Open Plan</option>
                  <option value="enclosed">Enclosed Traditional</option>
                </select>
              </div>
            </div>

            <Textarea
              label="Custom Directives & Spatial Goals"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Include a double-height living room facing the garden; place master suite on first floor with terrace..."
              rows={2}
            />

            <div className="p-3 bg-surface-muted rounded-lg border border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-forma-600" />
                <span className="text-muted">
                  Boundaries: {activeProject?.plot.width}m × {activeProject?.plot.length}m •{' '}
                  {activeProject?.plot.roadFacing.toUpperCase()} Road
                </span>
              </div>
              <span className="font-mono text-forma-600 font-semibold">Cost: 10 Credits</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setGenerationModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={handleStartGeneration}
              >
                Generate Design Proposal
              </Button>
            </div>
          </div>
        ) : isGenerating ? (
          /* Multi-Stage Generation Progress Pipeline */
          <div className="py-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-forma-50 text-forma-600 flex items-center justify-center mx-auto animate-pulse">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Compiling Architectural Layout</h3>
              <p className="text-xs text-muted max-w-sm mx-auto">{statusMessage}</p>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between text-xs font-mono text-muted">
                <span>Pipeline Status</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2.5 bg-surface-active rounded-full overflow-hidden">
                <div
                  className="h-full bg-forma-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* 6 Stages Checklist */}
            <div className="space-y-2 max-w-md mx-auto text-xs">
              {stagesList.map((s, idx) => {
                const stageIndex = stagesList.findIndex((item) => item.id === currentStage);
                const isCompleted = stageIndex > idx;
                const isCurrent = currentStage === s.id;

                return (
                  <div
                    key={s.id}
                    className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-forma-50 text-forma-800 font-semibold border border-forma-200'
                        : isCompleted
                        ? 'text-emerald-700 bg-emerald-50/50'
                        : 'text-muted opacity-50'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Sparkles className="w-4 h-4 text-forma-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-muted-light shrink-0" />
                    )}
                    <span>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Generation Result Showcase */
          generationResult && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-emerald-900 text-sm">
                    {generationResult.summary.title}
                  </h4>
                </div>
                <p className="text-emerald-800 text-xs leading-relaxed">
                  {generationResult.summary.description}
                </p>
              </div>

              {/* Highlights & Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border border-border bg-surface space-y-1.5">
                  <span className="font-semibold text-foreground block">Spatial Highlights</span>
                  <ul className="space-y-1 text-muted text-[11px]">
                    {generationResult.summary.architecturalHighlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-forma-600">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-border bg-surface space-y-1.5">
                  <span className="font-semibold text-foreground block">Building Statistics</span>
                  <div className="space-y-1 text-muted text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span>Total Built-up:</span>
                      <strong className="text-foreground">{generationResult.summary.totalArea} m²</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Levels Generated:</span>
                      <strong className="text-foreground">
                        {generationResult.design.floors.length} Floor(s)
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Bedrooms:</span>
                      <strong className="text-foreground">
                        {generationResult.summary.roomsSummary.Bedrooms}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                  onClick={() => setGenerationResult(null)}
                >
                  Reconfigure
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  onClick={handleApplyToStudio}
                >
                  Load Into Design Studio
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </Modal>
  );
};
