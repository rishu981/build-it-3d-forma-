import { create } from 'zustand';
import {
  HouseDesign,
  StudioViewMode,
  StudioTool,
  SelectionState,
  ValidationIssue,
  Room,
  Wall,
  Door,
  Window,
  Staircase,
  FurnitureItem,
} from '../types/geometry';
import { validateDesignGeometry } from '../utils/geometryValidation';

interface DesignStudioState {
  // Core design
  design: HouseDesign | null;
  currentFloorLevel: number;
  viewMode: StudioViewMode;
  activeTool: StudioTool;
  selection: SelectionState;

  // Viewport 2D
  zoom: number;
  panOffset: { x: number; y: number };
  gridSnap: boolean;
  gridSize: number; // in meters (default 0.5m)
  cursorCoords: { x: number; z: number };

  // 3D Visual Options
  showRoof: boolean;
  showFurniture: boolean;
  showInteriorWalls: boolean;
  showDimensions: boolean;
  showRoomLabels: boolean;
  wireframeMode: boolean;
  cutawayMode: boolean;
  cameraPreset: 'front' | 'top' | 'side' | 'isometric' | 'reset' | null;

  // History & Validation
  undoStack: HouseDesign[];
  redoStack: HouseDesign[];
  hasUnsavedChanges: boolean;
  validationIssues: ValidationIssue[];
  groundCoverageRatio: number;
  totalBuiltupArea: number;

  // UI Panels
  isAiPanelOpen: boolean;
  isPropertiesPanelOpen: boolean;
  isVersionHistoryOpen: boolean;
  isGenerationModalOpen: boolean;

  // Actions
  initializeDesign: (design: HouseDesign) => void;
  setViewMode: (mode: StudioViewMode) => void;
  setActiveTool: (tool: StudioTool) => void;
  setFloorLevel: (level: number) => void;
  addNewFloor: () => void;
  setSelection: (type: SelectionState['type'], id: string | null) => void;
  clearSelection: () => void;

  // Viewport controls
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setPanOffset: (offset: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  setCursorCoords: (coords: { x: number; z: number }) => void;
  toggleGridSnap: () => void;

  // 3D Options
  toggleShowRoof: () => void;
  toggleShowFurniture: () => void;
  toggleShowInteriorWalls: () => void;
  toggleShowDimensions: () => void;
  toggleShowRoomLabels: () => void;
  toggleWireframeMode: () => void;
  toggleCutawayMode: () => void;
  setWireframeMode: (val: boolean) => void;
  setCutawayMode: (val: boolean) => void;
  setCameraPreset: (preset: 'front' | 'top' | 'side' | 'isometric' | 'reset' | null) => void;

  // Geometry manipulation (with undo/redo push)
  updateDesign: (updater: (design: HouseDesign) => HouseDesign) => void;
  addRoom: (room: Omit<Room, 'id' | 'floorLevel'>) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  removeRoom: (roomId: string) => void;

  addWall: (wall: Omit<Wall, 'id' | 'floorLevel'>) => void;
  updateWall: (wallId: string, updates: Partial<Wall>) => void;
  removeWall: (wallId: string) => void;

  addDoor: (door: Omit<Door, 'id' | 'floorLevel'>) => void;
  updateDoor: (doorId: string, updates: Partial<Door>) => void;
  removeDoor: (doorId: string) => void;

  addWindow: (win: Omit<Window, 'id' | 'floorLevel'>) => void;
  updateWindow: (winId: string, updates: Partial<Window>) => void;
  removeWindow: (winId: string) => void;

  addFurniture: (item: Omit<FurnitureItem, 'id' | 'floorLevel'>) => void;
  updateFurniture: (itemId: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (itemId: string) => void;

  undo: () => void;
  redo: () => void;
  markSaved: () => void;

  // UI Panels
  toggleAiPanel: () => void;
  togglePropertiesPanel: () => void;
  setVersionHistoryOpen: (open: boolean) => void;
  setGenerationModalOpen: (open: boolean) => void;
}

export const useDesignStudioStore = create<DesignStudioState>((set, get) => ({
  design: null,
  currentFloorLevel: 0,
  viewMode: '2d',
  activeTool: 'select',
  selection: { type: null, id: null },

  zoom: 1,
  panOffset: { x: 0, y: 0 },
  gridSnap: true,
  gridSize: 0.5,
  cursorCoords: { x: 0, z: 0 },

  showRoof: true,
  showFurniture: true,
  showInteriorWalls: true,
  showDimensions: true,
  showRoomLabels: true,
  wireframeMode: false,
  cutawayMode: false,
  cameraPreset: null,

  undoStack: [],
  redoStack: [],
  hasUnsavedChanges: false,
  validationIssues: [],
  groundCoverageRatio: 0,
  totalBuiltupArea: 0,

  isAiPanelOpen: false,
  isPropertiesPanelOpen: true,
  isVersionHistoryOpen: false,
  isGenerationModalOpen: false,

  initializeDesign: (design) => {
    const validation = validateDesignGeometry(design);
    set({
      design,
      currentFloorLevel: 0,
      undoStack: [],
      redoStack: [],
      hasUnsavedChanges: false,
      selection: { type: null, id: null },
      validationIssues: validation.issues,
      groundCoverageRatio: validation.groundCoverageRatio,
      totalBuiltupArea: validation.totalBuiltupArea,
    });
  },

  setViewMode: (viewMode) => set({ viewMode }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setFloorLevel: (currentFloorLevel) => set({ currentFloorLevel, selection: { type: null, id: null } }),

  addNewFloor: () => {
    const { design } = get();
    if (!design) return;

    const nextLevel = design.floors.length;
    const newFloor = {
      floorLevel: nextLevel,
      name: nextLevel === 1 ? 'First Floor' : nextLevel === 2 ? 'Second Floor' : `Floor ${nextLevel}`,
      rooms: [],
      walls: [],
      doors: [],
      windows: [],
      stairs: [],
      furniture: [],
    };

    get().updateDesign((prev) => ({
      ...prev,
      floors: [...prev.floors, newFloor],
    }));
    set({ currentFloorLevel: nextLevel });
  },

  setSelection: (type, id) => set({ selection: { type, id } }),
  clearSelection: () => set({ selection: { type: null, id: null } }),

  setZoom: (zoom) =>
    set((state) => ({
      zoom: Math.min(3.5, Math.max(0.2, typeof zoom === 'function' ? zoom(state.zoom) : zoom)),
    })),

  setPanOffset: (panOffset) =>
    set((state) => ({
      panOffset: typeof panOffset === 'function' ? panOffset(state.panOffset) : panOffset,
    })),

  setCursorCoords: (cursorCoords) => set({ cursorCoords }),
  toggleGridSnap: () => set((state) => ({ gridSnap: !state.gridSnap })),

  toggleShowRoof: () => set((state) => ({ showRoof: !state.showRoof })),
  toggleShowFurniture: () => set((state) => ({ showFurniture: !state.showFurniture })),
  toggleShowInteriorWalls: () => set((state) => ({ showInteriorWalls: !state.showInteriorWalls })),
  toggleShowDimensions: () => set((state) => ({ showDimensions: !state.showDimensions })),
  toggleShowRoomLabels: () => set((state) => ({ showRoomLabels: !state.showRoomLabels })),
  toggleWireframeMode: () => set((state) => ({ wireframeMode: !state.wireframeMode })),
  toggleCutawayMode: () => set((state) => ({ cutawayMode: !state.cutawayMode })),
  setWireframeMode: (val) => set({ wireframeMode: val }),
  setCutawayMode: (val) => set({ cutawayMode: val }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),

  updateDesign: (updater) => {
    const { design, undoStack } = get();
    if (!design) return;

    // Snapshot for undo
    const snapshot = JSON.parse(JSON.stringify(design));
    const newDesign = updater(design);
    const validation = validateDesignGeometry(newDesign);

    set({
      design: newDesign,
      undoStack: [...undoStack.slice(-30), snapshot],
      redoStack: [],
      hasUnsavedChanges: true,
      validationIssues: validation.issues,
      groundCoverageRatio: validation.groundCoverageRatio,
      totalBuiltupArea: validation.totalBuiltupArea,
    });
  },

  addRoom: (roomData) => {
    const { currentFloorLevel } = get();
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => {
        if (floor.floorLevel === currentFloorLevel) {
          const newRoom: Room = {
            ...roomData,
            id: `rm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            floorLevel: currentFloorLevel,
          };
          return { ...floor, rooms: [...floor.rooms, newRoom] };
        }
        return floor;
      });
      return { ...design, floors };
    });
  },

  updateRoom: (roomId, updates) => {
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => ({
        ...floor,
        rooms: floor.rooms.map((r) => (r.id === roomId ? { ...r, ...updates } : r)),
      }));
      return { ...design, floors };
    });
  },

  removeRoom: (roomId) => {
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => ({
        ...floor,
        rooms: floor.rooms.filter((r) => r.id !== roomId),
      }));
      return { ...design, floors };
    });
    set({ selection: { type: null, id: null } });
  },

  addWall: (wallData) => {
    const { currentFloorLevel } = get();
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => {
        if (floor.floorLevel === currentFloorLevel) {
          const newWall: Wall = {
            ...wallData,
            id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            floorLevel: currentFloorLevel,
          };
          return { ...floor, walls: [...floor.walls, newWall] };
        }
        return floor;
      });
      return { ...design, floors };
    });
  },

  updateWall: (wallId, updates) => {
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => ({
        ...floor,
        walls: floor.walls.map((w) => (w.id === wallId ? { ...w, ...updates } : w)),
      }));
      return { ...design, floors };
    });
  },

  removeWall: (wallId) => {
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => ({
        ...floor,
        walls: floor.walls.filter((w) => w.id !== wallId),
      }));
      return { ...design, floors };
    });
    set({ selection: { type: null, id: null } });
  },

  addDoor: (doorData) => {
    const { currentFloorLevel } = get();
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => {
        if (floor.floorLevel === currentFloorLevel) {
          const newDoor: Door = {
            ...doorData,
            id: `d_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            floorLevel: currentFloorLevel,
          };
          return { ...floor, doors: [...floor.doors, newDoor] };
        }
        return floor;
      });
      return { ...design, floors };
    });
  },

  updateDoor: (doorId, updates) => {
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => ({
        ...floor,
        doors: floor.doors.map((d) => (d.id === doorId ? { ...d, ...updates } : d)),
      }));
      return { ...design, floors };
    });
  },

  removeDoor: (doorId) => {
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => ({
        ...floor,
        doors: floor.doors.filter((d) => d.id !== doorId),
      }));
      return { ...design, floors };
    });
    set({ selection: { type: null, id: null } });
  },

  addWindow: (winData) => {
    const { currentFloorLevel } = get();
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => {
        if (floor.floorLevel === currentFloorLevel) {
          const newWin: Window = {
            ...winData,
            id: `win_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            floorLevel: currentFloorLevel,
          };
          return { ...floor, windows: [...floor.windows, newWin] };
        }
        return floor;
      });
      return { ...design, floors };
    });
  },

  updateWindow: (winId, updates) => {
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => ({
        ...floor,
        windows: floor.windows.map((w) => (w.id === winId ? { ...w, ...updates } : w)),
      }));
      return { ...design, floors };
    });
  },

  removeWindow: (winId) => {
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => ({
        ...floor,
        windows: floor.windows.filter((w) => w.id !== winId),
      }));
      return { ...design, floors };
    });
    set({ selection: { type: null, id: null } });
  },

  addFurniture: (itemData) => {
    const { currentFloorLevel } = get();
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => {
        if (floor.floorLevel === currentFloorLevel) {
          const newItem: FurnitureItem = {
            ...itemData,
            id: `furn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            floorLevel: currentFloorLevel,
          };
          return { ...floor, furniture: [...floor.furniture, newItem] };
        }
        return floor;
      });
      return { ...design, floors };
    });
  },

  updateFurniture: (itemId, updates) => {
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => ({
        ...floor,
        furniture: floor.furniture.map((f) => (f.id === itemId ? { ...f, ...updates } : f)),
      }));
      return { ...design, floors };
    });
  },

  removeFurniture: (itemId) => {
    get().updateDesign((design) => {
      const floors = design.floors.map((floor) => ({
        ...floor,
        furniture: floor.furniture.filter((f) => f.id !== itemId),
      }));
      return { ...design, floors };
    });
    set({ selection: { type: null, id: null } });
  },

  undo: () => {
    const { design, undoStack, redoStack } = get();
    if (!design || undoStack.length === 0) return;

    const previous = undoStack[undoStack.length - 1];
    const newUndo = undoStack.slice(0, undoStack.length - 1);
    const newRedo = [JSON.parse(JSON.stringify(design)), ...redoStack];
    const validation = validateDesignGeometry(previous);

    set({
      design: previous,
      undoStack: newUndo,
      redoStack: newRedo,
      hasUnsavedChanges: true,
      validationIssues: validation.issues,
      groundCoverageRatio: validation.groundCoverageRatio,
      totalBuiltupArea: validation.totalBuiltupArea,
    });
  },

  redo: () => {
    const { design, undoStack, redoStack } = get();
    if (!design || redoStack.length === 0) return;

    const next = redoStack[0];
    const newRedo = redoStack.slice(1);
    const newUndo = [...undoStack, JSON.parse(JSON.stringify(design))];
    const validation = validateDesignGeometry(next);

    set({
      design: next,
      undoStack: newUndo,
      redoStack: newRedo,
      hasUnsavedChanges: true,
      validationIssues: validation.issues,
      groundCoverageRatio: validation.groundCoverageRatio,
      totalBuiltupArea: validation.totalBuiltupArea,
    });
  },

  markSaved: () => set({ hasUnsavedChanges: false }),

  toggleAiPanel: () => set((state) => ({ isAiPanelOpen: !state.isAiPanelOpen })),
  togglePropertiesPanel: () => set((state) => ({ isPropertiesPanelOpen: !state.isPropertiesPanelOpen })),
  setVersionHistoryOpen: (isVersionHistoryOpen) => set({ isVersionHistoryOpen }),
  setGenerationModalOpen: (isGenerationModalOpen) => set({ isGenerationModalOpen }),
}));
