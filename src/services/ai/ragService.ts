import { HouseDesign } from '../../types/geometry';
import { Project, UploadedAsset } from '../../types/project';
import { projectService } from '../projects/projectService';

export interface RAGContext {
  projectId: string;
  projectName: string;
  plotTelemetry: {
    dimensions: string;
    areaSqMeters: number;
    roadFacing: string;
    northOrientation: string;
    setbacks: string;
    maxFloors: number;
    groundCoverage: string;
  };
  spatialInventory: {
    totalBuiltupArea: string;
    floorsCount: number;
    rooms: { name: string; dimensions: string; area: string; level: number }[];
  };
  referenceDocuments: {
    fileName: string;
    type: string;
    notes: string;
    tags: string[];
  }[];
  regulatoryGuidelines: string[];
}

export const ragService = {
  async retrieveProjectContext(
    projectId: string,
    query: string,
    currentDesign?: HouseDesign
  ): Promise<RAGContext> {
    const project = await projectService.getProjectById(projectId);

    const plot = currentDesign?.plot || project?.plot || {
      width: 16,
      length: 22,
      unit: 'meters',
      shape: 'rectangular',
      roadFacing: 'north',
      northAngle: 0,
      maxFloors: 2,
      setbacks: { front: 3, rear: 2, left: 2, right: 2 },
    };

    const plotArea = plot.width * plot.length;
    const rooms = (currentDesign?.floors || []).flatMap((f) =>
      f.rooms.map((r) => ({
        name: r.name,
        dimensions: `${r.width}m × ${r.length}m`,
        area: `${(r.width * r.length).toFixed(1)} m²`,
        level: f.floorLevel,
      }))
    );

    let totalArea = 0;
    rooms.forEach((r) => {
      const a = parseFloat(r.area);
      if (!isNaN(a)) totalArea += a;
    });

    const groundCoverage =
      plotArea > 0 ? `${((totalArea / plotArea) * 100).toFixed(1)}%` : 'N/A';

    // Reference files attached to this project
    const uploadedFiles: UploadedAsset[] = project?.uploadedFiles || [];
    const referenceDocs = uploadedFiles.map((f) => ({
      fileName: f.name,
      type: f.fileType.replace('_', ' '),
      notes: f.notes || 'Verified site cadastral reference document',
      tags: f.tags || [],
    }));

    return {
      projectId,
      projectName: project?.name || 'Architectural Project',
      plotTelemetry: {
        dimensions: `${plot.width}m width × ${plot.length}m length`,
        areaSqMeters: Math.round(plotArea),
        roadFacing: `${plot.roadFacing.toUpperCase()} approach road`,
        northOrientation: `${plot.northAngle || 0}° from vertical axis`,
        setbacks: `Front: ${plot.setbacks.front}m, Rear: ${plot.setbacks.rear}m, Left: ${plot.setbacks.left}m, Right: ${plot.setbacks.right}m`,
        maxFloors: plot.maxFloors || 2,
        groundCoverage,
      },
      spatialInventory: {
        totalBuiltupArea: `${totalArea.toFixed(1)} m²`,
        floorsCount: currentDesign?.floors.length || 1,
        rooms,
      },
      referenceDocuments: referenceDocs,
      regulatoryGuidelines: [
        `Front setback buffer of ${plot.setbacks.front}m must remain clear of permanent structural columns.`,
        'Habitable spaces (bedrooms, living room) require at least 10% floor area in operable fenestrations for natural ventilation.',
        'Staircase riser maximum: 175mm, tread minimum: 250mm, clear flight width: 1000mm minimum.',
      ],
    };
  },

  formatContextPrompt(context: RAGContext): string {
    const roomsList = context.spatialInventory.rooms
      .map((r) => `- Level ${r.level}: ${r.name} (${r.dimensions}, ${r.area})`)
      .join('\n');

    const refsList =
      context.referenceDocuments.length > 0
        ? context.referenceDocuments
            .map((d) => `- ${d.fileName} [${d.type}]: ${d.notes} (Tags: ${d.tags.join(', ')})`)
            .join('\n')
        : '- No additional site blueprints attached.';

    const guidelines = context.regulatoryGuidelines.map((g) => `- ${g}`).join('\n');

    return `=== FORMA CAD ARCHITECTURAL RAG CONTEXT ===
Project: ${context.projectName} (ID: ${context.projectId})
Plot Dimensions: ${context.plotTelemetry.dimensions} (${context.plotTelemetry.areaSqMeters} m²)
Approach Road: ${context.plotTelemetry.roadFacing}
Mandatory Setbacks: ${context.plotTelemetry.setbacks}
Building Capacity: ${context.plotTelemetry.maxFloors} Allowed Floors
Total Built-up Area: ${context.spatialInventory.totalBuiltupArea} (Ground Coverage: ${context.plotTelemetry.groundCoverage})

Current Floor Plan Spatial Inventory:
${roomsList || '- No rooms placed yet.'}

Retrieved Reference Documents & Surveys:
${refsList}

Municipal Regulatory Guidelines:
${guidelines}
==========================================`;
  },
};
