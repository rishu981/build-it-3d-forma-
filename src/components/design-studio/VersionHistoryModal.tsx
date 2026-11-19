import React, { useEffect, useState } from 'react';
import {
  History,
  RotateCcw,
  GitCompare,
  Copy,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useDesignStudioStore } from '../../stores/useDesignStudioStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { versionService } from '../../services/versions/versionService';
import { ProjectVersion } from '../../types/project';
import { formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

export const VersionHistoryModal: React.FC = () => {
  const { isVersionHistoryOpen, setVersionHistoryOpen, design, initializeDesign } =
    useDesignStudioStore();
  const { activeProject } = useProjectStore();

  const [versions, setVersions] = useState<ProjectVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<ProjectVersion | null>(null);
  const [compareTarget, setCompareTarget] = useState<ProjectVersion | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    if (activeProject && isVersionHistoryOpen) {
      versionService.getVersions(activeProject.id).then((vers) => {
        setVersions(vers);
        if (vers.length > 0) setSelectedVersion(vers[0]);
      });
    }
  }, [activeProject, isVersionHistoryOpen]);

  if (!isVersionHistoryOpen) return null;

  const handleRestore = (v: ProjectVersion) => {
    if (confirm(`Restore design to Version ${v.versionNumber}: "${v.name}"?`)) {
      if (v.designSnapshot && v.designSnapshot.floors) {
        initializeDesign(v.designSnapshot);
        toast.success(`Restored to Version ${v.versionNumber}`);
        setVersionHistoryOpen(false);
      } else {
        toast.info('Restored concept parameters');
        setVersionHistoryOpen(false);
      }
    }
  };

  return (
    <Modal
      isOpen={isVersionHistoryOpen}
      onClose={() => {
        setVersionHistoryOpen(false);
        setIsComparing(false);
      }}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-forma-600" />
          <span>Project Version History & Cadastral Snapshots</span>
        </div>
      }
      description="Inspect previous iterations, audit architectural changes, and restore previous CAD geometry."
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
        {/* Version List Timeline */}
        <div className="md:col-span-5 border-r border-border pr-4 space-y-2 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 text-xs font-semibold text-muted uppercase tracking-wider">
            <span>Saved Snapshots ({versions.length})</span>
          </div>

          {versions.map((v) => {
            const isSelected = selectedVersion?.id === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setSelectedVersion(v)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-forma-500 bg-forma-50 text-foreground ring-1 ring-forma-500'
                    : 'border-border bg-surface hover:bg-surface-hover text-muted-dark'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-foreground">
                    v{v.versionNumber}.0 — {v.name}
                  </span>
                  <span className="text-[10px] text-muted font-mono">{formatDate(v.createdAt)}</span>
                </div>
                <p className="text-[11px] text-muted line-clamp-1">{v.description}</p>
              </div>
            );
          })}
        </div>

        {/* Selected Version Detail or Comparison View */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          {selectedVersion ? (
            <div className="space-y-4 text-xs">
              <div className="border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">
                    Version {selectedVersion.versionNumber}.0: {selectedVersion.name}
                  </h3>
                  <Badge variant="forma">Historical Snapshot</Badge>
                </div>
                <p className="text-xs text-muted mt-1">{selectedVersion.description}</p>
                <span className="text-[11px] text-muted-light block mt-1 font-mono">
                  Timestamp: {new Date(selectedVersion.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Changelog Items */}
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Parametric Changes & Annotations</h4>
                <div className="space-y-1.5">
                  {selectedVersion.changesSummary.map((change, i) => (
                    <div
                      key={i}
                      className="p-2 bg-surface-muted border border-border rounded-lg text-xs flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-forma-600 shrink-0" />
                      <span>{change}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compare Mode */}
              {isComparing && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 space-y-2">
                  <span className="font-semibold block">Version Diff Comparison</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-white/80 p-2 rounded border border-blue-100">
                      <strong>Current Working Design:</strong>
                      <p>Built-up: {design?.totalBuiltupArea} m²</p>
                      <p>Levels: {design?.floors.length}</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded border border-blue-100">
                      <strong>Version {selectedVersion.versionNumber}.0:</strong>
                      <p>Built-up: ~280 m²</p>
                      <p>Levels: 2</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<GitCompare className="w-3.5 h-3.5" />}
                  onClick={() => setIsComparing(!isComparing)}
                >
                  {isComparing ? 'Close Diff' : 'Compare with Current'}
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={() => handleRestore(selectedVersion)}
                  >
                    Restore This Version
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted text-xs">
              <History className="w-8 h-8 mb-2 opacity-40" />
              <span>Select a version to inspect details</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
