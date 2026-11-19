import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2,
  Compass,
  UploadCloud,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input, Textarea } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { useProjectStore } from '../stores/useProjectStore';
import { ARCHITECTURAL_STYLES } from '../constants/designStyles';
import { uploadService } from '../services/uploads/uploadService';
import { UploadedAsset, ProjectType } from '../types/project';
import { Direction, MeasurementUnit, PlotShape } from '../types/geometry';
import { toast } from 'sonner';

export const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createProject } = useProjectStore();

  const initialStep = searchParams.get('step') ? parseInt(searchParams.get('step')!, 10) : 1;
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Wizard persistent form state
  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    description: '',
    location: '',
    projectType: 'residential' as ProjectType,

    // Step 2
    plotWidth: 15.0,
    plotLength: 20.0,
    unit: 'meters' as MeasurementUnit,
    shape: 'rectangular' as PlotShape,
    roadFacing: 'north' as Direction,
    northAngle: 0,
    maxFloors: 2,
    setbackFront: 2.5,
    setbackRear: 1.5,
    setbackLeft: 1.5,
    setbackRight: 1.5,
    existingStructures: '',

    // Step 3
    uploadedFiles: [] as UploadedAsset[],

    // Step 4
    style: 'modern',
    bedrooms: 3,
    bathrooms: 3,
    floorsCount: 2,
    kitchenType: 'open_plan' as 'open_plan' | 'enclosed' | 'island' | 'parallel',
    hasLivingRoom: true,
    hasDiningRoom: true,
    hasParking: true,
    parkingVehicles: 2,
    hasBalcony: true,
    hasGarden: true,
    hasTerrace: true,
    staircasePreference: 'internal' as 'internal' | 'external' | 'spiral' | 'grand',
    specialRequirements: '',
    budgetTier: 'premium' as 'standard' | 'premium' | 'luxury',
  });

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drag and drop handlers
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 25 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds 25MB limit.`);
        continue;
      }

      const fileType = file.type.includes('pdf')
        ? 'pdf_plan'
        : file.name.toLowerCase().includes('site') || file.name.toLowerCase().includes('plot')
        ? 'land_photo'
        : 'reference_image';

      try {
        setUploadProgress(10);
        const asset = await uploadService.uploadFile(file, fileType, undefined, (p) =>
          setUploadProgress(p)
        );
        setFormData((prev) => ({
          ...prev,
          uploadedFiles: [...prev.uploadedFiles, asset],
        }));
        toast.success(`Uploaded "${file.name}"`);
      } catch {
        toast.error(`Failed to upload "${file.name}"`);
      } finally {
        setUploadProgress(null);
      }
    }
  };

  const removeFile = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((f) => f.id !== id),
    }));
  };

  // Step validation
  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        toast.error('Please enter a project name');
        return false;
      }
    } else if (currentStep === 2) {
      if (formData.plotWidth <= 0 || formData.plotLength <= 0) {
        toast.error('Plot dimensions must be greater than zero');
        return false;
      }
      if (
        formData.setbackFront + formData.setbackRear >= formData.plotLength ||
        formData.setbackLeft + formData.setbackRight >= formData.plotWidth
      ) {
        toast.error('Setbacks exceed total plot dimensions. Please adjust setbacks.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const newProject = await createProject({
        name: formData.name,
        description: formData.description,
        location: formData.location,
        projectType: formData.projectType,
        status: 'draft',
        plot: {
          width: Number(formData.plotWidth),
          length: Number(formData.plotLength),
          unit: formData.unit,
          shape: formData.shape,
          roadFacing: formData.roadFacing,
          northAngle: Number(formData.northAngle),
          maxFloors: Number(formData.maxFloors),
          setbacks: {
            front: Number(formData.setbackFront),
            rear: Number(formData.setbackRear),
            left: Number(formData.setbackLeft),
            right: Number(formData.setbackRight),
          },
          existingStructuresDescription: formData.existingStructures,
        },
        preferences: {
          style: formData.style as any,
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          floorsCount: Number(formData.floorsCount),
          kitchenType: formData.kitchenType,
          hasLivingRoom: formData.hasLivingRoom,
          hasDiningRoom: formData.hasDiningRoom,
          hasParking: formData.hasParking,
          parkingVehicles: Number(formData.parkingVehicles),
          hasBalcony: formData.hasBalcony,
          hasGarden: formData.hasGarden,
          hasTerrace: formData.hasTerrace,
          staircasePreference: formData.staircasePreference,
          specialRequirements: formData.specialRequirements,
          budgetTier: formData.budgetTier,
        },
        uploadedFiles: formData.uploadedFiles,
      });

      toast.success('Project created! Initializing Design Studio...');
      navigate(`/studio/${newProject.id}`);
    } catch (err) {
      toast.error('Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Project Info', icon: Building2 },
    { num: 2, title: 'Plot Dimensions', icon: Compass },
    { num: 3, title: 'Site Photos', icon: UploadCloud },
    { num: 4, title: 'Preferences', icon: Sliders },
    { num: 5, title: 'Review & Build', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8 text-left">
        {/* Wizard Header */}
        <div className="text-center space-y-1">
          <Badge variant="forma">Architectural Project Wizard</Badge>
          <h1 className="text-2xl font-bold text-foreground">Create Architectural Project</h1>
          <p className="text-xs text-muted max-w-md mx-auto">
            Provide verifiable parcel measurements, site imagery, and design intent to prepare your CAD workspace.
          </p>
        </div>

        {/* Step Indicator Tracker */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-subtle">
          <div className="grid grid-cols-5 gap-2">
            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = s.num === currentStep;
              const isDone = s.num < currentStep;

              return (
                <div
                  key={s.num}
                  onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                  className={`flex flex-col items-center text-center p-2 rounded-lg transition-all ${
                    isActive
                      ? 'bg-forma-50 border border-forma-200 text-forma-700'
                      : isDone
                      ? 'cursor-pointer hover:bg-surface-hover text-foreground'
                      : 'opacity-40 text-muted pointer-events-none'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono mb-1.5 ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isActive
                        ? 'bg-forma-600 text-white'
                        : 'bg-surface-active text-muted'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="text-[11px] font-medium truncate w-full hidden sm:block">
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 shadow-subtle">
          {/* STEP 1: PROJECT INFO */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">Step 1 — Project Information</h2>
                <p className="text-xs text-muted mt-0.5">
                  General details identifying this architectural commission or personal build.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Project Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Villa Solarium, Horizon Duplex Residence"
                  required
                />

                <Textarea
                  label="Project Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe client desires, environmental context, or lifestyle expectations..."
                  rows={3}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Site Location (Optional)"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Ridgeview Heights, Sector 12"
                  />

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-foreground">Project Type</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) =>
                        setFormData({ ...formData, projectType: e.target.value as ProjectType })
                      }
                      className="w-full h-9 px-3 text-sm bg-surface text-foreground border border-border rounded-md shadow-subtle focus:outline-none focus:border-forma-500"
                    >
                      <option value="residential">Residential House</option>
                      <option value="villa">Luxury Villa</option>
                      <option value="duplex">Duplex Townhouse</option>
                      <option value="apartment">Multi-Family Apartment</option>
                      <option value="commercial">Commercial / Mixed-use</option>
                      <option value="other">Other Spatial Type</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PLOT INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">Step 2 — Plot & Boundary Information</h2>
                <p className="text-xs text-muted mt-0.5">
                  Accurate, verified dimensions are crucial. FORMA strictly relies on manual dimensions rather than guessing from photos.
                </p>
              </div>

              {/* Units & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={`Plot Width (${formData.unit === 'meters' ? 'm' : 'ft'}) *`}
                  type="number"
                  step="0.1"
                  value={formData.plotWidth}
                  onChange={(e) => setFormData({ ...formData, plotWidth: parseFloat(e.target.value) || 0 })}
                  suffix={formData.unit === 'meters' ? 'm' : 'ft'}
                />

                <Input
                  label={`Plot Length (${formData.unit === 'meters' ? 'm' : 'ft'}) *`}
                  type="number"
                  step="0.1"
                  value={formData.plotLength}
                  onChange={(e) => setFormData({ ...formData, plotLength: parseFloat(e.target.value) || 0 })}
                  suffix={formData.unit === 'meters' ? 'm' : 'ft'}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-foreground">Measurement Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as MeasurementUnit })}
                    className="w-full h-9 px-3 text-sm bg-surface text-foreground border border-border rounded-md shadow-subtle focus:outline-none focus:border-forma-500"
                  >
                    <option value="meters">Meters (m / m²)</option>
                    <option value="feet">Feet (ft / sq ft)</option>
                  </select>
                </div>
              </div>

              {/* Plot Shape & Road Orientation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-foreground">Plot Geometry Shape</label>
                  <select
                    value={formData.shape}
                    onChange={(e) => setFormData({ ...formData, shape: e.target.value as PlotShape })}
                    className="w-full h-9 px-3 text-sm bg-surface text-foreground border border-border rounded-md shadow-subtle focus:outline-none focus:border-forma-500"
                  >
                    <option value="rectangular">Rectangular</option>
                    <option value="square">Square</option>
                    <option value="l-shaped">L-Shaped</option>
                    <option value="custom">Custom Polygon</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-foreground">Road Facing Direction</label>
                  <select
                    value={formData.roadFacing}
                    onChange={(e) => setFormData({ ...formData, roadFacing: e.target.value as Direction })}
                    className="w-full h-9 px-3 text-sm bg-surface text-foreground border border-border rounded-md shadow-subtle focus:outline-none focus:border-forma-500"
                  >
                    <option value="north">North Facing</option>
                    <option value="south">South Facing</option>
                    <option value="east">East Facing</option>
                    <option value="west">West Facing</option>
                  </select>
                </div>

                <Input
                  label="Permitted Floors Count"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.maxFloors}
                  onChange={(e) => setFormData({ ...formData, maxFloors: parseInt(e.target.value, 10) || 1 })}
                />
              </div>

              {/* Municipal Setbacks */}
              <div className="p-4 rounded-xl border border-border bg-surface-muted space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-forma-600" />
                  <span className="text-xs font-semibold text-foreground">
                    Mandatory Municipal Setbacks ({formData.unit === 'meters' ? 'm' : 'ft'})
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Input
                    label="Front (Road) Setback"
                    type="number"
                    step="0.1"
                    value={formData.setbackFront}
                    onChange={(e) => setFormData({ ...formData, setbackFront: parseFloat(e.target.value) || 0 })}
                  />
                  <Input
                    label="Rear Setback"
                    type="number"
                    step="0.1"
                    value={formData.setbackRear}
                    onChange={(e) => setFormData({ ...formData, setbackRear: parseFloat(e.target.value) || 0 })}
                  />
                  <Input
                    label="Left Setback"
                    type="number"
                    step="0.1"
                    value={formData.setbackLeft}
                    onChange={(e) => setFormData({ ...formData, setbackLeft: parseFloat(e.target.value) || 0 })}
                  />
                  <Input
                    label="Right Setback"
                    type="number"
                    step="0.1"
                    value={formData.setbackRight}
                    onChange={(e) => setFormData({ ...formData, setbackRight: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <Input
                label="Existing Structures or Trees (Optional)"
                value={formData.existingStructures}
                onChange={(e) => setFormData({ ...formData, existingStructures: e.target.value })}
                placeholder="e.g. Mature oak tree on south-west boundary, existing boundary wall on north"
              />
            </div>
          )}

          {/* STEP 3: UPLOAD PHOTOGRAPHS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">Step 3 — Upload Site Photographs & References</h2>
                <p className="text-xs text-muted mt-0.5">
                  Upload drone imagery, site parcel boundaries, legal survey PDFs, or elevation references.
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files);
                }}
                className="border-2 border-dashed border-border hover:border-forma-400 rounded-xl p-8 text-center bg-surface-muted/50 transition-colors cursor-pointer"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'image/*,.pdf';
                  input.onchange = (e: any) => handleFileUpload(e.target.files);
                  input.click();
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-forma-50 text-forma-600 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Click to browse files or drag and drop here
                </p>
                <p className="text-xs text-muted mt-1">
                  Supports JPG, PNG, WEBP, and PDF documents up to 25MB each
                </p>
              </div>

              {uploadProgress !== null && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted">
                    <span>Uploading and analyzing document...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-surface-active rounded-full overflow-hidden">
                    <div
                      className="h-full bg-forma-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Uploaded File Previews */}
              {formData.uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground">
                    Uploaded Assets ({formData.uploadedFiles.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {formData.uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 rounded-lg border border-border bg-surface flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {file.fileType === 'pdf_plan' ? (
                            <FileText className="w-5 h-5 text-red-500 shrink-0" />
                          ) : (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-10 h-10 rounded object-cover border border-border shrink-0"
                            />
                          )}
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                            <span className="text-[10px] text-muted font-mono">
                              {(file.fileSizeBytes / 1024 / 1024).toFixed(2)} MB • {file.fileType.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1.5 text-muted hover:text-semantic-error rounded hover:bg-surface-hover"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: DESIGN PREFERENCES */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">Step 4 — Design & Spatial Preferences</h2>
                <p className="text-xs text-muted mt-0.5">
                  Select your architectural aesthetic and functional spatial program.
                </p>
              </div>

              {/* Architectural Style Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-foreground">Architectural Style</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {ARCHITECTURAL_STYLES.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setFormData({ ...formData, style: st.id })}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        formData.style === st.id
                          ? 'border-forma-500 bg-forma-50/50 ring-1 ring-forma-500'
                          : 'border-border bg-surface hover:border-forma-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-foreground">{st.name}</span>
                        <Badge variant="outline" size="sm">
                          {st.badge}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bed, Bath, Floors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Input
                  label="Bedrooms"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value, 10) || 1 })}
                />
                <Input
                  label="Bathrooms"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value, 10) || 1 })}
                />
                <Input
                  label="Floors to Build"
                  type="number"
                  min="1"
                  max={formData.maxFloors}
                  value={formData.floorsCount}
                  onChange={(e) => setFormData({ ...formData, floorsCount: parseInt(e.target.value, 10) || 1 })}
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-foreground">Kitchen Layout</label>
                  <select
                    value={formData.kitchenType}
                    onChange={(e) => setFormData({ ...formData, kitchenType: e.target.value as any })}
                    className="w-full h-9 px-3 text-sm bg-surface text-foreground border border-border rounded-md shadow-subtle focus:outline-none focus:border-forma-500"
                  >
                    <option value="open_plan">Open Plan with Island</option>
                    <option value="enclosed">Enclosed Traditional</option>
                    <option value="island">Gourmet Island</option>
                    <option value="parallel">Parallel Galley</option>
                  </select>
                </div>
              </div>

              {/* Toggles for Amenities */}
              <div className="p-4 rounded-xl border border-border bg-surface-muted space-y-3">
                <label className="block text-xs font-semibold text-foreground">
                  Special Features & Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasParking}
                      onChange={(e) => setFormData({ ...formData, hasParking: e.target.checked })}
                      className="rounded border-border text-forma-600 focus:ring-forma-500"
                    />
                    <span>Covered Parking</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasBalcony}
                      onChange={(e) => setFormData({ ...formData, hasBalcony: e.target.checked })}
                      className="rounded border-border text-forma-600 focus:ring-forma-500"
                    />
                    <span>Balconies</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasGarden}
                      onChange={(e) => setFormData({ ...formData, hasGarden: e.target.checked })}
                      className="rounded border-border text-forma-600 focus:ring-forma-500"
                    />
                    <span>Garden / Courtyard</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasTerrace}
                      onChange={(e) => setFormData({ ...formData, hasTerrace: e.target.checked })}
                      className="rounded border-border text-forma-600 focus:ring-forma-500"
                    />
                    <span>Roof Terrace</span>
                  </label>
                </div>
              </div>

              <Textarea
                label="Special Requirements or Architectural Notes"
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                placeholder="e.g. Master bedroom must have morning sunlight; double-height living room; provision for home office..."
                rows={2}
              />
            </div>
          )}

          {/* STEP 5: REVIEW & CREATE */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">Step 5 — Review Project Configuration</h2>
                <p className="text-xs text-muted mt-0.5">
                  Confirm the parameters before launching your CAD workspace and 3D environment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Left Summary Box */}
                <div className="p-4 rounded-xl border border-border bg-surface-muted/50 space-y-3">
                  <h4 className="font-semibold text-foreground border-b border-border pb-1.5">
                    Plot & Boundary Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-muted-dark">
                    <div>
                      <span className="text-muted block text-[10px] uppercase">Plot Size</span>
                      <span className="font-mono font-medium text-foreground">
                        {formData.plotWidth}m × {formData.plotLength}m (
                        {Math.round(formData.plotWidth * formData.plotLength)} m²)
                      </span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px] uppercase">Road Access</span>
                      <span className="font-medium text-foreground capitalize">
                        {formData.roadFacing} Facing
                      </span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px] uppercase">Floors Allowed</span>
                      <span className="font-medium text-foreground">{formData.maxFloors} Level(s)</span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px] uppercase">Municipal Setbacks</span>
                      <span className="font-mono font-medium text-foreground">
                        F: {formData.setbackFront}m | R: {formData.setbackRear}m
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Summary Box */}
                <div className="p-4 rounded-xl border border-border bg-surface-muted/50 space-y-3">
                  <h4 className="font-semibold text-foreground border-b border-border pb-1.5">
                    Program & Styling Intent
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-muted-dark">
                    <div>
                      <span className="text-muted block text-[10px] uppercase">Architectural Style</span>
                      <span className="font-medium text-foreground capitalize">
                        {formData.style.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px] uppercase">Room Schedule</span>
                      <span className="font-medium text-foreground">
                        {formData.bedrooms} Beds, {formData.bathrooms} Baths
                      </span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px] uppercase">Kitchen Format</span>
                      <span className="font-medium text-foreground capitalize">
                        {formData.kitchenType.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted block text-[10px] uppercase">Site Assets</span>
                      <span className="font-medium text-foreground">
                        {formData.uploadedFiles.length} file(s) attached
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-forma-50 border border-forma-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-forma-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-forma-800">Ready to initialize CAD Studio</p>
                  <p className="text-[11px] text-forma-700 mt-0.5 leading-relaxed">
                    Clicking "Create Project" will construct your geometric plot boundaries and initialize the 2D
                    vector layout and 3D WebGL renderer. You can prompt the AI copilot inside the studio at any time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={handleBack}
              >
                Previous Step
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            )}

            {currentStep < 5 ? (
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={handleNext}
              >
                Continue to Step {currentStep + 1}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                icon={<Sparkles className="w-4 h-4" />}
                onClick={handleFinalSubmit}
              >
                Create Project & Open Studio
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
