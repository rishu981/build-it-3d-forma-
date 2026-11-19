import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Layers,
  Clock,
  MoreVertical,
  ExternalLink,
  Copy,
  Trash2,
  Edit2,
} from 'lucide-react';
import { useProjectStore } from '../stores/useProjectStore';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Project, ProjectType } from '../types/project';
import { formatRelativeTime } from '../utils/formatters';
import { toast } from 'sonner';

export const ProjectsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, fetchProjects, deleteProject, duplicateProject } = useProjectStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || p.projectType === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">My Architectural Projects</h1>
          <p className="text-xs text-muted mt-1">
            Access, duplicate, and manage all your cadastral parcels and 3D house schemes.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/create')}
        >
          New Project
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
            placeholder="Search projects by name, location..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-surface-muted border border-border rounded-lg text-foreground focus:outline-none focus:border-forma-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-9 px-3 text-xs bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-forma-500"
          >
            <option value="all">All Types ({projects.length})</option>
            <option value="residential">Residential Houses</option>
            <option value="villa">Luxury Villas</option>
            <option value="duplex">Urban Duplexes</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-surface rounded-xl border border-dashed border-border">
          <FolderKanban className="w-10 h-10 text-muted mx-auto opacity-50" />
          <h3 className="text-sm font-semibold text-foreground">No Projects Found</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Try adjusting your search filters or start a new architectural design.
          </p>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/create')}
          >
            Create New Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-border bg-surface overflow-hidden shadow-subtle hover:border-forma-300 hover:shadow-card transition-all flex flex-col justify-between"
            >
              {/* Thumbnail */}
              <div
                className="h-44 relative bg-studio-bg overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/studio/${p.id}`)}
              >
                <img
                  src={
                    p.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge variant="studio" size="sm">
                    {p.projectType.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] font-mono bg-black/60 text-white px-2 py-0.5 rounded border border-white/10">
                    {p.plot.width}m × {p.plot.length}m
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="text-[10px] font-mono bg-forma-600/90 text-white px-2 py-0.5 rounded font-medium flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    {p.currentDesign.floors.length} Level(s)
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      onClick={() => navigate(`/studio/${p.id}`)}
                      className="font-semibold text-sm text-foreground hover:text-forma-600 cursor-pointer line-clamp-1"
                    >
                      {p.name}
                    </h3>

                    {/* Options Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                        className="p-1 rounded text-muted hover:text-foreground hover:bg-surface-hover"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === p.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-surface border border-border rounded-lg shadow-dropdown py-1 z-30 text-xs text-left">
                          <button
                            onClick={() => navigate(`/studio/${p.id}`)}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-hover text-foreground"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Open Studio
                          </button>
                          <button
                            onClick={async () => {
                              await duplicateProject(p.id);
                              toast.success('Duplicated project');
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-hover text-foreground"
                          >
                            <Copy className="w-3.5 h-3.5" /> Duplicate
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Delete project "${p.name}"?`)) {
                                await deleteProject(p.id);
                                toast.success('Deleted project');
                                setActiveMenuId(null);
                              }
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
                    {p.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(p.updatedAt)}
                  </span>
                  <span className="font-mono text-forma-600 font-semibold">
                    {p.currentDesign.totalBuiltupArea} m²
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
