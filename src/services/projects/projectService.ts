import { Project, ProjectFilters } from '../../types/project';
import { HouseDesign } from '../../types/geometry';
import { MOCK_PROJECTS } from '../../mock/mockData';
import { apiClient, USE_MOCK_API } from '../api/client';

const STORAGE_KEY = 'forma_local_projects';

function getStoredProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PROJECTS));
      return MOCK_PROJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_PROJECTS;
  }
}

function saveStoredProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.warn('LocalStorage error while saving projects:', err);
  }
}

export const projectService = {
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 200));
      let projects = getStoredProjects();
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        projects = projects.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.location?.toLowerCase().includes(query)
        );
      }
      if (filters?.projectType) {
        projects = projects.filter((p) => p.projectType === filters.projectType);
      }
      return projects;
    }

    const { data } = await apiClient.get<Project[]>('/projects', { params: filters });
    return data;
  },

  async getProjectById(id: string): Promise<Project | null> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 150));
      const projects = getStoredProjects();
      return projects.find((p) => p.id === id) || null;
    }

    const { data } = await apiClient.get<Project>(`/projects/${id}`);
    return data;
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 300));
      const projects = getStoredProjects();
      const newProject: Project = {
        id: `proj_${Date.now()}`,
        name: project.name || 'Untitled Architectural Project',
        description: project.description || '',
        location: project.location || '',
        projectType: project.projectType || 'residential',
        status: 'draft',
        plot: project.plot || {
          width: 15,
          length: 20,
          unit: 'meters',
          shape: 'rectangular',
          roadFacing: 'north',
          northAngle: 0,
          maxFloors: 2,
          setbacks: { front: 2, rear: 1.5, left: 1.5, right: 1.5 },
        },
        preferences: project.preferences || {
          style: 'modern',
          bedrooms: 3,
          bathrooms: 2,
          floorsCount: 2,
          kitchenType: 'open_plan',
          hasLivingRoom: true,
          hasDiningRoom: true,
          hasParking: true,
          parkingVehicles: 1,
          hasBalcony: true,
          hasGarden: true,
          hasTerrace: true,
          staircasePreference: 'internal',
        },
        currentDesign: project.currentDesign || {
          id: `des_${Date.now()}`,
          projectId: `proj_${Date.now()}`,
          version: 1,
          units: project.plot?.unit || 'meters',
          roofType: 'flat',
          architecturalStyle: 'Modern Minimalist',
          exteriorFinish: 'plaster_white',
          foundationHeight: 0.45,
          totalBuiltupArea: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          plot: project.plot!,
          floors: [
            {
              floorLevel: 0,
              name: 'Ground Floor',
              rooms: [],
              walls: [],
              doors: [],
              windows: [],
              stairs: [],
              furniture: [],
            },
          ],
        },
        uploadedFiles: project.uploadedFiles || [],
        versionsCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnailUrl:
          project.thumbnailUrl ||
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      };

      projects.unshift(newProject);
      saveStoredProjects(projects);
      return newProject;
    }

    const { data } = await apiClient.post<Project>('/projects', project);
    return data;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 200));
      const projects = getStoredProjects();
      const idx = projects.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error('Project not found');

      projects[idx] = {
        ...projects[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveStoredProjects(projects);
      return projects[idx];
    }

    const { data } = await apiClient.patch<Project>(`/projects/${id}`, updates);
    return data;
  },

  async updateDesign(projectId: string, design: HouseDesign): Promise<HouseDesign> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 200));
      const projects = getStoredProjects();
      const idx = projects.findIndex((p) => p.id === projectId);
      if (idx === -1) throw new Error('Project not found');

      projects[idx].currentDesign = {
        ...design,
        updatedAt: new Date().toISOString(),
      };
      projects[idx].updatedAt = new Date().toISOString();
      saveStoredProjects(projects);
      return projects[idx].currentDesign;
    }

    const { data } = await apiClient.patch<HouseDesign>(`/projects/${projectId}/designs/${design.id}`, design);
    return data;
  },

  async deleteProject(id: string): Promise<boolean> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 150));
      let projects = getStoredProjects();
      projects = projects.filter((p) => p.id !== id);
      saveStoredProjects(projects);
      return true;
    }

    await apiClient.delete(`/projects/${id}`);
    return true;
  },

  async duplicateProject(id: string): Promise<Project> {
    const original = await this.getProjectById(id);
    if (!original) throw new Error('Project not found');

    const duplicateData: Partial<Project> = {
      ...original,
      name: `${original.name} (Copy)`,
      id: `proj_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.createProject(duplicateData);
  },
};
