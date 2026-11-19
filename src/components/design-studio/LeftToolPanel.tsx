import React from 'react';
import {
  MousePointer,
  Hand,
  Square,
  DoorOpen,
  AppWindow,
  Spline,
  Armchair,
  Ruler,
  Trash2,
  PlusCircle,
  Building,
} from 'lucide-react';
import { useDesignStudioStore } from '../../stores/useDesignStudioStore';
import { StudioTool } from '../../types/geometry';

export const LeftToolPanel: React.FC = () => {
  const { activeTool, setActiveTool } = useDesignStudioStore();

  const tools: {
    id: StudioTool;
    name: string;
    shortcut: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'select', name: 'Select & Move', shortcut: 'V', icon: MousePointer },
    { id: 'pan', name: 'Pan Viewport', shortcut: 'H', icon: Hand },
    { id: 'add_room', name: 'Add Room Space', shortcut: 'R', icon: Square },
    { id: 'draw_wall', name: 'Draw Wall', shortcut: 'W', icon: Spline },
    { id: 'add_door', name: 'Insert Door', shortcut: 'D', icon: DoorOpen },
    { id: 'add_window', name: 'Insert Window', shortcut: 'Win', icon: AppWindow },
    { id: 'add_staircase', name: 'Add Staircase', shortcut: 'S', icon: Building },
    { id: 'add_furniture', name: 'Add Furniture', shortcut: 'F', icon: Armchair },
    { id: 'measure', name: 'Dimension Tool', shortcut: 'M', icon: Ruler },
    { id: 'delete', name: 'Delete Object', shortcut: 'Del', icon: Trash2 },
  ];

  return (
    <aside className="w-14 bg-surface border-r border-border flex flex-col items-center py-3 gap-1 shrink-0 select-none z-20 shadow-subtle">
      {tools.map((t) => {
        const Icon = t.icon;
        const isActive = activeTool === t.id;

        return (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all relative group ${
              isActive
                ? 'bg-forma-500 text-white shadow-sm'
                : 'text-muted-dark hover:text-foreground hover:bg-surface-hover'
            }`}
            title={`${t.name} (${t.shortcut})`}
          >
            <Icon className="w-4 h-4" />

            {/* Hover Tooltip */}
            <div className="absolute left-14 px-2 py-1 bg-studio-panel text-white text-[11px] rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              <span className="font-semibold">{t.name}</span>
              <span className="text-muted-light font-mono ml-1.5 bg-black/40 px-1 py-0.2 rounded text-[10px]">
                {t.shortcut}
              </span>
            </div>
          </button>
        );
      })}
    </aside>
  );
};
