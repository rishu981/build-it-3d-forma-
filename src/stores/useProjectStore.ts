import { create } from 'zustand';
import { Project, ProjectFilters } from '../types/project';
import { projectService } from '../services/projects/projectService';
import { HouseDesign } from '../types/geometry';

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  error: string | null;

  fetchProjects: (filters?: ProjectFilters) => Promise<void>;
  loadProject: (id: string) => Promise<Project | null>;
  createProject: (data: Partial<Project>) => Promise<Project>;
  updateActiveDesign: (design: HouseDesign) => Promise<void>;
  duplicateProject: (id: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  setActiveProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  activeProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectService.getProjects(filters);
      set({ projects, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load projects', isLoading: false });
    }
  },

  loadProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectService.getProjectById(id);
      set({ activeProject: project, isLoading: false });
      return project;
    } catch (err: any) {
      set({ error: err.message || 'Failed to load project', isLoading: false });
      return null;
    }
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await projectService.createProject(data);
      set((state) => ({
        projects: [newProject, ...state.projects],
        activeProject: newProject,
        isLoading: false,
      }));
      return newProject;
    } catch (err: any) {
      set({ error: err.message || 'Failed to create project', isLoading: false });
      throw err;
    }
  },

  updateActiveDesign: async (design) => {
    const { activeProject } = get();
    if (!activeProject) return;

    try {
      const updatedDesign = await projectService.updateDesign(activeProject.id, design);
      set({
        activeProject: {
          ...activeProject,
          currentDesign: updatedDesign,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      console.error('Failed to update design:', err);
    }
  },

  duplicateProject: async (id) => {
    const duplicated = await projectService.duplicateProject(id);
    set((state) => ({ projects: [duplicated, ...state.projects] }));
    return duplicated;
  },

  deleteProject: async (id) => {
    await projectService.deleteProject(id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      activeProject: state.activeProject?.id === id ? null : state.activeProject,
    }));
  },

  setActiveProject: (project) => set({ activeProject: project }),
}));
