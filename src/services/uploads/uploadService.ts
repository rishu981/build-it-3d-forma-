import { UploadedAsset } from '../../types/project';
import { apiClient, USE_MOCK_API } from '../api/client';

export interface UploadProgressCallback {
  (progressPercent: number): void;
}

export const uploadService = {
  async uploadFile(
    file: File,
    fileType: UploadedAsset['fileType'],
    projectId?: string,
    onProgress?: UploadProgressCallback
  ): Promise<UploadedAsset> {
    if (USE_MOCK_API) {
      // Simulate multi-part upload chunks
      for (let p = 10; p <= 100; p += 30) {
        onProgress?.(p);
        await new Promise((r) => setTimeout(r, 120));
      }
      onProgress?.(100);

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);

      const asset: UploadedAsset = {
        id: `upload_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        projectId,
        name: file.name,
        fileType,
        url: objectUrl,
        fileSizeBytes: file.size,
        uploadedAt: new Date().toISOString(),
        tags: [fileType.replace('_', ' ')],
        analyzedFeatures: {
          orientationDetected: 'Level ground, clear horizon boundaries',
          estimatedTerrain: 'Dry granular terrain with standard compaction',
          notableConstraints: ['North approach road', 'Adjacent low-density perimeter'],
        },
      };

      return asset;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    if (projectId) formData.append('projectId', projectId);

    const { data } = await apiClient.post<UploadedAsset>('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percent);
        }
      },
    });

    return data;
  },
};
