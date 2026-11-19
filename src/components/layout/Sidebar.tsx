import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  PenTool,
  Library,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Building2,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { useUserStore } from '../../stores/useUserStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { Badge } from '../common/Badge';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const { user, isSidebarCollapsed, toggleSidebar } = useUserStore();
  const { activeProject, projects } = useProjectStore();
  const navigate = useNavigate();

  // Pick target design studio project: active project or latest project
  const studioProjectId = activeProject?.id || (projects.length > 0 ? projects[0].id : 'proj_villa_solarium');

  const navigationItems = [
    { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { name: 'My Projects', to: '/projects', icon: FolderKanban, badge: projects.length.toString() },
    { name: 'Design Studio', to: `/studio/${studioProjectId}`, icon: PenTool, activeHighlight: true },
    { name: 'Templates', to: '/templates', icon: BookOpen },
    { name: 'Reference Library', to: '/references', icon: Library },
    { name: 'AI Copilot', to: '/ai-assistant', icon: Sparkles, badge: 'Active' },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'h-screen bg-surface border-r border-border flex flex-col shrink-0 transition-all duration-200 z-30 select-none relative',
        isSidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <div
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-forma-500 flex items-center justify-center text-white shrink-0 shadow-subtle">
            <Building2 className="w-5 h-5" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                FORMA
                <span className="text-[10px] font-mono px-1 py-0.2 bg-forma-100 text-forma-800 rounded font-normal">
                  CAD AI
                </span>
              </span>
              <span className="text-[10px] text-muted tracking-wide uppercase font-medium">
                Architectural Platform
              </span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="p-1 rounded text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group relative',
                  isActive
                    ? 'bg-forma-50 text-forma-700 font-semibold'
                    : 'text-muted-dark hover:bg-surface-hover hover:text-foreground',
                  isSidebarCollapsed && 'justify-center px-0'
                )
              }
              title={isSidebarCollapsed ? item.name : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
              {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}

              {!isSidebarCollapsed && item.badge && (
                <span
                  className={cn(
                    'ml-auto text-[11px] px-1.5 py-0.5 rounded-full font-mono',
                    item.badge === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-surface-active text-muted'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Area: Credits & User */}
      <div className="p-3 border-t border-border space-y-2 bg-surface">
        {/* Credits Pill */}
        <div
          onClick={() => navigate('/subscription')}
          className={cn(
            'p-2.5 rounded-lg border border-border bg-surface-muted cursor-pointer hover:border-forma-300 transition-colors',
            isSidebarCollapsed ? 'text-center p-2' : ''
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-forma-600">
              <Zap className="w-3.5 h-3.5 fill-forma-500 text-forma-500" />
              {!isSidebarCollapsed && (
                <span className="text-xs font-semibold text-foreground">AI Credits</span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xs font-mono font-bold text-forma-600">
                {user.credits.balance}
              </span>
            )}
          </div>
          {!isSidebarCollapsed && (
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted">
              <span>{user.plan.toUpperCase()} Plan</span>
              <span className="text-forma-600 font-medium hover:underline">Top Up</span>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          onClick={() => navigate('/settings')}
          className={cn(
            'flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors',
            isSidebarCollapsed && 'justify-center p-1'
          )}
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
          />
          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">{user.name}</span>
              <span className="text-[11px] text-muted truncate">{user.companyName || user.email}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
