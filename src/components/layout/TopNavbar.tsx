import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  HelpCircle,
  Plus,
  ChevronRight,
  Sparkles,
  LogOut,
  User,
  CreditCard,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useUserStore } from '../../stores/useUserStore';
import { useProjectStore } from '../../stores/useProjectStore';

export const TopNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setAuthModal } = useUserStore();
  const { activeProject } = useProjectStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Generate breadcrumb based on current pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getBreadcrumbLabel = (seg: string, index: number) => {
    if (seg === 'dashboard') return 'Dashboard';
    if (seg === 'projects') return 'Projects';
    if (seg === 'create') return 'Create Project';
    if (seg === 'studio') return 'Design Studio';
    if (seg === 'templates') return 'Architectural Templates';
    if (seg === 'references') return 'Reference Library';
    if (seg === 'ai-assistant') return 'AI Assistant';
    if (seg === 'subscription') return 'Subscription & Credits';
    if (seg === 'settings') return 'Settings';
    if (index === 1 && pathSegments[0] === 'studio' && activeProject) {
      return activeProject.name;
    }
    return seg;
  };

  return (
    <header className="h-14 bg-surface border-b border-border px-6 flex items-center justify-between z-20 shrink-0">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted">
        <Link to="/dashboard" className="hover:text-foreground transition-colors font-medium">
          FORMA
        </Link>
        {pathSegments.map((seg, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 text-muted-light" />
            <span
              className={
                idx === pathSegments.length - 1
                  ? 'font-semibold text-foreground truncate max-w-[200px]'
                  : 'hover:text-foreground transition-colors'
              }
            >
              {getBreadcrumbLabel(seg, idx)}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center w-80 relative">
        <Search className="w-3.5 h-3.5 absolute left-3 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search projects, CAD layers, reference tags... (⌘K)"
          className="w-full h-8 pl-8 pr-3 text-xs bg-surface-muted border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:border-forma-500 focus:bg-surface transition-all"
        />
        <kbd className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded text-muted">
          ⌘K
        </kbd>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Quick New Project Button */}
        <Button
          size="sm"
          variant="primary"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => navigate('/create')}
        >
          New Project
        </Button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-muted hover:text-foreground hover:bg-surface-hover rounded-md transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-forma-500 rounded-full ring-2 ring-surface" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-surface border border-border rounded-xl shadow-dropdown p-3 z-50 text-left animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-semibold text-foreground">Notifications</span>
                <span className="text-[10px] text-forma-600 font-medium cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="py-2 space-y-2 text-xs">
                <div className="p-2 bg-surface-muted rounded-md border border-border-subtle">
                  <p className="font-medium text-foreground">AI Generation Finished</p>
                  <p className="text-[11px] text-muted">Villa Solarium 3D mesh compiled successfully.</p>
                  <span className="text-[10px] text-muted-light mt-1 block">10 mins ago</span>
                </div>
                <div className="p-2 rounded-md hover:bg-surface-hover">
                  <p className="font-medium text-foreground">Municipal Setback Verified</p>
                  <p className="text-[11px] text-muted">3.0m street setback complies with residential bye-laws.</p>
                  <span className="text-[10px] text-muted-light mt-1 block">2 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Link */}
        <button
          onClick={() => window.open('https://help.forma-arch.com', '_blank')}
          className="p-2 text-muted hover:text-foreground hover:bg-surface-hover rounded-md transition-colors"
          title="Architectural Documentation & Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-forma-500/20 transition-all"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-border"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-dropdown py-1.5 z-50 text-left animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-[11px] text-muted truncate">{user.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-forma-100 text-forma-700 rounded font-semibold">
                    {user.plan.toUpperCase()} ARCHITECT
                  </span>
                  <span className="text-[10px] text-muted font-mono">{user.credits.balance} credits</span>
                </div>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-muted-dark hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Profile Settings
                </button>
                <button
                  onClick={() => {
                    navigate('/subscription');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-muted-dark hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Subscription & Credits
                </button>
                <button
                  onClick={() => {
                    navigate('/references');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-muted-dark hover:text-foreground hover:bg-surface-hover transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Site Reference Library
                </button>
              </div>

              <div className="border-t border-border pt-1">
                <button
                  onClick={() => {
                    setAuthModal(true, 'signin');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-semantic-error hover:bg-semantic-errorBg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
