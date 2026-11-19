import React, { useState } from 'react';
import {
  Library,
  UploadCloud,
  Search,
  Filter,
  FileText,
  Trash2,
  ExternalLink,
  Tag,
  Eye,
  Plus,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { UploadedAsset } from '../types/project';
import { uploadService } from '../services/uploads/uploadService';
import { toast } from 'sonner';

export const ReferenceLibraryPage: React.FC = () => {
  const [references, setReferences] = useState<UploadedAsset[]>([
    {
      id: 'ref_01',
      name: 'Modern_Timber_Balcony_Facade.jpg',
      fileType: 'reference_image',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      fileSizeBytes: 2450000,
      uploadedAt: '2026-10-12T10:35:00Z',
      notes: 'Cantilevered upper deck reference with warm natural cedar soffit.',
      tags: ['Facade', 'Cantilever', 'Modern'],
    },
    {
      id: 'ref_02',
      name: 'Indian_Courtyard_Aangan_Detail.jpg',
      fileType: 'reference_image',
      url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
      fileSizeBytes: 3100000,
      uploadedAt: '2026-10-14T11:20:00Z',
      notes: 'Central open water court with clay tiled verandah.',
      tags: ['Courtyard', 'Water Feature', 'Heritage'],
    },
    {
      id: 'ref_03',
      name: 'Ridgeview_Site_Topography_Survey.pdf',
      fileType: 'pdf_plan',
      url: '#',
      fileSizeBytes: 4200000,
      uploadedAt: '2026-10-15T09:00:00Z',
      notes: 'Contour lines at 0.5m intervals and municipal easement.',
      tags: ['Survey', 'Topography', 'PDF'],
    },
    {
      id: 'ref_04',
      name: 'Double_Height_Living_Glass.jpg',
      fileType: 'reference_image',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
      fileSizeBytes: 1980000,
      uploadedAt: '2026-10-18T14:15:00Z',
      notes: 'Seamless transition between indoor living hall and stone pool patio.',
      tags: ['Interior', 'Double Height', 'Glass'],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [previewAsset, setPreviewAsset] = useState<UploadedAsset | null>(null);

  const allTags = Array.from(new Set(references.flatMap((r) => r.tags || [])));

  const filtered = references.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || r.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleUploadNew = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      const asset = await uploadService.uploadFile(
        file,
        file.type.includes('pdf') ? 'pdf_plan' : 'reference_image'
      );
      setReferences([asset, ...references]);
      toast.success(`Added "${file.name}" to Reference Library`);
    } catch {
      toast.error('Failed to upload file');
    }
  };

  const handleDelete = (id: string) => {
    setReferences(references.filter((r) => r.id !== id));
    toast.success('Removed asset from library');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Reference Library</h1>
          <p className="text-xs text-muted mt-1">
            Site surveys, drone land imagery, and architectural inspirations indexed for AI retrieval.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,.pdf';
            input.onchange = (e: any) => handleUploadNew(e.target.files);
            input.click();
          }}
        >
          Upload Reference
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface p-3 rounded-xl border border-border shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search references by name, tag, or note..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-surface-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-forma-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium shrink-0 ${
              selectedTag === 'all'
                ? 'bg-forma-500 text-white'
                : 'bg-surface-muted text-muted hover:text-foreground'
            }`}
          >
            All ({references.length})
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium shrink-0 ${
                selectedTag === t
                  ? 'bg-forma-500 text-white'
                  : 'bg-surface-muted text-muted hover:text-foreground'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="rounded-xl border border-border bg-surface overflow-hidden shadow-subtle hover:border-forma-300 hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div
              className="h-44 bg-surface-muted relative overflow-hidden cursor-pointer group"
              onClick={() => setPreviewAsset(asset)}
            >
              {asset.fileType === 'pdf_plan' ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-red-500 bg-red-50/50">
                  <FileText className="w-12 h-12" />
                  <span className="text-[11px] font-mono text-muted mt-2">PDF Document</span>
                </div>
              ) : (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}

              <div className="absolute top-2.5 right-2.5">
                <Badge variant="studio" size="sm">
                  {asset.fileType.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4
                  onClick={() => setPreviewAsset(asset)}
                  className="text-xs font-semibold text-foreground truncate hover:text-forma-600 cursor-pointer"
                >
                  {asset.name}
                </h4>
                <p className="text-[11px] text-muted mt-1 line-clamp-2 leading-relaxed">
                  {asset.notes || 'No notes added.'}
                </p>

                {/* Tags */}
                {asset.tags && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {asset.tags.map((tg) => (
                      <span
                        key={tg}
                        className="text-[10px] font-mono px-1.5 py-0.5 bg-surface-muted border border-border rounded text-muted"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted">
                <span className="font-mono">{(asset.fileSizeBytes / 1024 / 1024).toFixed(1)} MB</span>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="p-1 text-muted hover:text-semantic-error rounded hover:bg-surface-hover transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Asset Preview Modal */}
      <Modal
        isOpen={!!previewAsset}
        onClose={() => setPreviewAsset(null)}
        maxWidth="lg"
        title={previewAsset?.name}
      >
        {previewAsset && (
          <div className="space-y-4 text-xs">
            {previewAsset.fileType === 'pdf_plan' ? (
              <div className="py-12 bg-surface-muted rounded-xl text-center space-y-2">
                <FileText className="w-12 h-12 text-red-500 mx-auto" />
                <p className="font-semibold text-foreground">{previewAsset.name}</p>
                <p className="text-muted text-[11px]">Vector CAD blueprints & legal land survey.</p>
              </div>
            ) : (
              <img
                src={previewAsset.url}
                alt={previewAsset.name}
                className="w-full max-h-[450px] object-cover rounded-xl border border-border"
              />
            )}

            <div className="p-3 bg-surface-muted rounded-xl space-y-1">
              <span className="font-semibold text-foreground">AI Extracted Features</span>
              <p className="text-muted leading-relaxed">
                {previewAsset.notes || 'No description provided.'}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
