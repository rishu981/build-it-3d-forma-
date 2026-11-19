import { ProjectVersion } from '../../types/project';
import { HouseDesign } from '../../types/geometry';
import { apiClient, USE_MOCK_API } from '../api/client';

const VERSIONS_STORAGE_PREFIX = 'forma_versions_';

function getStoredVersions(projectId: string): ProjectVersion[] {
  try {
    const raw = localStorage.getItem(`${VERSIONS_STORAGE_PREFIX}${projectId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredVersions(projectId: string, versions: ProjectVersion[]): void {
  try {
    localStorage.setItem(`${VERSIONS_STORAGE_PREFIX}${projectId}`, JSON.stringify(versions));
  } catch (err) {
    console.warn('LocalStorage error while saving versions:', err);
  }
}

export const versionService = {
  async getVersions(projectId: string): Promise<ProjectVersion[]> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 150));
      const versions = getStoredVersions(projectId);
      if (versions.length === 0) {
        // Return realistic initial versions for demo
        const initial: ProjectVersion[] = [
          {
            id: `ver_${projectId}_v1`,
            versionNumber: 1,
            projectId,
            name: 'Initial Concept Layout',
            description: 'Basic 2-floor volumetric zoning based on initial client questionnaire.',
            changesSummary: ['Created initial floor envelope', 'Assigned preliminary room boundaries'],
            createdAt: '2026-10-12T10:45:00Z',
            designSnapshot: {} as HouseDesign,
          },
          {
            id: `ver_${projectId}_v2`,
            versionNumber: 2,
            projectId,
            name: 'Integrated Double-Height Living',
            description: 'Refined structural core and added open-riser floating staircase.',
            changesSummary: ['Expanded great room width by 1.2m', 'Relocated kitchen to south-east quadrant'],
            createdAt: '2026-10-15T16:20:00Z',
            designSnapshot: {} as HouseDesign,
          },
          {
            id: `ver_${projectId}_v3`,
            versionNumber: 3,
            projectId,
            name: 'Added Upper Cantilevered Balconies',
            description: 'Exterior facade optimization with timber slats and cantilevered terrace.',
            changesSummary: ['Added 5.4m master suite balcony', 'Adjusted window sill heights for daylighting'],
            createdAt: '2026-11-05T09:10:00Z',
            designSnapshot: {} as HouseDesign,
          },
        ];
        saveStoredVersions(projectId, initial);
        return initial;
      }
      return versions;
    }

    const { data } = await apiClient.get<ProjectVersion[]>(`/projects/${projectId}/versions`);
    return data;
  },

  async createVersion(
    projectId: string,
    design: HouseDesign,
    name: string,
    description: string,
    changesSummary: string[]
  ): Promise<ProjectVersion> {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 200));
      const versions = getStoredVersions(projectId);
      const nextVerNum = versions.length + 1;
      const newVersion: ProjectVersion = {
        id: `ver_${projectId}_v${nextVerNum}_${Date.now()}`,
        versionNumber: nextVerNum,
        projectId,
        name: name || `Revision ${nextVerNum}`,
        description: description || 'Iterative design update',
        changesSummary: changesSummary.length > 0 ? changesSummary : ['Updated room geometry and materials'],
        createdAt: new Date().toISOString(),
        designSnapshot: JSON.parse(JSON.stringify(design)),
      };
      versions.unshift(newVersion);
      saveStoredVersions(projectId, versions);
      return newVersion;
    }

    const { data } = await apiClient.post<ProjectVersion>(`/projects/${projectId}/versions`, {
      name,
      description,
      changesSummary,
      design,
    });
    return data;
  },
};
