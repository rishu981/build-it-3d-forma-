import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Compass,
  UploadCloud,
  FileImage,
  BookOpen,
  MoreVertical,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  HardDrive,
  FolderOpen,
  Copy,
  Trash2,
  ExternalLink,
  Edit2,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useProjectStore } from '../stores/useProjectStore';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { formatRelativeTime } from '../utils/formatters';
import { Project } from '../types/project';
import { projectService } from '../services/projects/projectService';
import { toast } from 'sonner';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { projects, fetchProjects, deleteProject, duplicateProject } = useProjectStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renameProjectTarget, setRenameProjectTarget] = useState<Project | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleDuplicate = async (p: Project) => {
    try {
      await duplicateProject(p.id);
      toast.success(`Duplicated "${p.name}"`);
    } catch {
      toast.error('Failed to duplicate project');
    }
  };

  const handleDelete = async (p: Project) => {
    if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
      try {
        await deleteProject(p.id);
        toast.success(`Deleted "${p.name}"`);
      } catch {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameProjectTarget || !renameValue.trim()) return;

    try {
      await projectService.updateProject(renameProjectTarget.id, { name: renameValue });
      fetchProjects();
      toast.success('Project renamed successfully');
      setRenameProjectTarget(null);
    } catch {
      toast.error('Failed to rename project');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-left">
      {/* 1. Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {getGreeting()}, {user.name}
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage your CAD parcels, 2D floor plans, and interactive 3D architectural models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<Sparkles className="w-3.5 h-3.5 text-forma-600" />}
            onClick={() => navigate('/ai-assistant')}
          >
            AI Spatial Copilot
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/create')}
          >
            Create New Project
          </Button>
        </div>
      </div>

      {/* 2. Usage & Credits Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-surface shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-muted uppercase tracking-wider">
              Available Credits
            </span>
            <p className="text-xl font-bold font-mono text-forma-600 mt-1">{user.credits.balance}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-forma-50 flex items-center justify-center text-forma-600">
            <Zap className="w-4 h-4 fill-forma-500" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-muted uppercase tracking-wider">
              Designs Generated
            </span>
            <p className="text-xl font-bold font-mono text-foreground mt-1">
              {user.credits.totalUsed + 12}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Layers className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-muted uppercase tracking-wider">
              Active Projects
            </span>
            <p className="text-xl font-bold font-mono text-foreground mt-1">{projects.length}</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <FolderOpen className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-surface shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-muted uppercase tracking-wider">
              CAD Storage
            </span>
            <p className="text-xl font-bold font-mono text-foreground mt-1">42.8 MB</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <HardDrive className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. Quick-Start Workflows */}
      <div>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
          Quick Start Workflows
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/create?mode=empty')}
            className="p-4 rounded-xl border border-border bg-surface hover:border-forma-400 hover:shadow-subtle cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-forma-50 text-forma-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-foreground">Start from Empty Plot</h3>
            <p className="text-[11px] text-muted mt-1">
              Input plot dimensions manually & draft custom CAD from scratch.
            </p>
          </div>

          <div
            onClick={() => navigate('/create?step=3')}
            className="p-4 rounded-xl border border-border bg-surface hover:border-forma-400 hover:shadow-subtle cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-foreground">Upload Land Photos</h3>
            <p className="text-[11px] text-muted mt-1">
              Analyze drone pictures, survey blueprints and site terrain.
            </p>
          </div>

          <div
            onClick={() => navigate('/references')}
            className="p-4 rounded-xl border border-border bg-surface hover:border-forma-400 hover:shadow-subtle cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileImage className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-foreground">Reference Inspiration</h3>
            <p className="text-[11px] text-muted mt-1">
              Feed elevation aesthetics and style references to the AI.
            </p>
          </div>

          <div
            onClick={() => navigate('/templates')}
            className="p-4 rounded-xl border border-border bg-surface hover:border-forma-400 hover:shadow-subtle cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-foreground">Predefined Templates</h3>
            <p className="text-[11px] text-muted mt-1">
              Browse proven villa, townhouse, and courtyard layouts.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Recent Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Recent Projects</h2>
            <p className="text-xs text-muted">Continue drafting in 2D or inspecting in 3D</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/projects')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            iconPosition="right"
          >
            View All ({projects.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-border bg-surface overflow-hidden shadow-subtle hover:border-forma-300 hover:shadow-card transition-all flex flex-col justify-between"
            >
              {/* Card Image Thumbnail */}
              <div
                className="h-44 relative bg-studio-bg overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/studio/${project.id}`)}
              >
                <img
                  src={
                    project.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge variant="studio" size="sm">
                    {project.projectType.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] font-mono bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded border border-white/10">
                    {project.plot.width}m × {project.plot.length}m
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="text-[10px] font-mono bg-forma-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {project.currentDesign.floors.length} Floor
                    {project.currentDesign.floors.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => navigate(`/studio/${project.id}`)}
                      className="font-semibold text-sm text-foreground hover:text-forma-600 cursor-pointer line-clamp-1"
                    >
                      {project.name}
                    </h3>

                    {/* Three-dot dropdown menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === project.id ? null : project.id);
                        }}
                        className="p-1 rounded text-muted hover:text-foreground hover:bg-surface-hover"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === project.id && (
                        <div
                          className="absolute right-0 mt-1 w-36 bg-surface border border-border rounded-lg shadow-dropdown py-1 z-30 text-xs text-left"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              navigate(`/studio/${project.id}`);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-hover text-foreground"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Open Studio
                          </button>
                          <button
                            onClick={() => {
                              setRenameProjectTarget(project);
                              setRenameValue(project.name);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-hover text-foreground"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Rename
                          </button>
                          <button
                            onClick={() => {
                              handleDuplicate(project);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-hover text-foreground"
                          >
                            <Copy className="w-3.5 h-3.5" /> Duplicate
                          </button>
                          <div className="border-t border-border my-1" />
                          <button
                            onClick={() => {
                              handleDelete(project);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-semantic-errorBg text-semantic-error"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(project.updatedAt)}
                  </span>

                  <span className="font-mono text-forma-600 font-medium">
                    {project.currentDesign.totalBuiltupArea} m²
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Recent Activity Feed */}
      <div className="p-6 rounded-xl border border-border bg-surface text-left">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Studio Activity</h3>
        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                AI Copilot applied cantilevered balcony update to{' '}
                <span className="text-forma-600 font-semibold">Villa Solarium</span>.
              </p>
              <p className="text-[11px] text-muted">Level 1 sunset balcony added with safety glass railing • 15 mins ago</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                Saved revision snapshot <span className="font-mono">v4.0</span> for{' '}
                <span className="text-forma-600 font-semibold">Villa Solarium</span>.
              </p>
              <p className="text-[11px] text-muted">Version tagged by Marcus Vance • 2 hours ago</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-forma-500 mt-1.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">
                Uploaded survey blueprint <span className="font-mono">Cadastral_Plot_Survey_Map.pdf</span>.
              </p>
              <p className="text-[11px] text-muted">Site geometry validated with 3.0m road setback • Yesterday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rename Project Modal */}
      <Modal
        isOpen={!!renameProjectTarget}
        onClose={() => setRenameProjectTarget(null)}
        title="Rename Architectural Project"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4">
          <Input
            label="Project Name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="e.g. Modern Hillside Pavilion"
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRenameProjectTarget(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
