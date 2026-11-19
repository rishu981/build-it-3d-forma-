# FORMA — AI-Powered Architectural Design Platform

> Next-Generation Spatial AI CAD Platform for Architects, Homebuilders, and Property Developers.

FORMA is a production-oriented architectural software frontend built in **React + TypeScript + Three.js + React Three Fiber + Tailwind CSS**. It integrates vector 2D CAD floor planning with synchronized real-time 3D WebGL volumetric inspection, powered by an autonomous, context-aware AI spatial copilot.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Build** | React 18, TypeScript, Vite 5, Tailwind CSS |
| **State Management** | Zustand (undo/redo geometry history, active selection, viewport state, AI streaming) |
| **3D Engine** | Three.js, `@react-three/fiber`, `@react-three/drei` (photometric lighting, OrbitControls, material shaders, code-split chunking) |
| **2D CAD Engine** | Precision SVG Vector Canvas (0.5m grid snapping, real-time coordinate transformations, dimension callouts) |
| **Validation** | Zod Schema Validation (`HouseDesignSchema`, `PlotSchema`, structural setback checks) |
| **Routing** | React Router v6 |
| **Server & API Layer** | Axios API client with pluggable Mock Adapter (`VITE_USE_MOCK_API=true`) |
| **Icons & Feedback** | Lucide React, Sonner |

---

## 📐 Application Architecture & Key Modules

```
src/
├── app/
├── components/
│   ├── common/              # Button, Input, Modal, Badge, AuthModal
│   ├── layout/              # Sidebar (collapsible), TopNavbar (breadcrumbs, search)
│   ├── floor-planner/       # FloorPlanEditor (2D interactive vector canvas)
│   ├── three-dimensional/   # HouseViewer3D (React Three Fiber 3D scene)
│   ├── design-studio/       # TopToolbar, LeftToolPanel, PropertiesPanel, StatusBar, VersionHistoryModal
│   └── ai-assistant/        # AIAssistantPanel (copilot chat), AIDesignGenerationModal (6-stage pipeline)
├── pages/
│   ├── LandingPage.tsx      # Public showcase, features, pricing, methodology
│   ├── DashboardPage.tsx    # CAD project management, quick-start workflows, telemetry
│   ├── CreateProjectPage.tsx# 5-step Project Wizard (Plot dimensions, setbacks, file uploads, preferences)
│   ├── DesignStudioPage.tsx # Flagship Fullscreen Studio (2D, 3D, and Split views)
│   ├── ProjectsListPage.tsx # Project search, filters, duplicate/rename/delete
│   ├── TemplatesPage.tsx    # Curated architectural templates with instant cloning
│   ├── ReferenceLibraryPage.tsx # Drone imagery, legal survey PDFs, inspiration gallery
│   ├── SubscriptionPage.tsx # Credit ledger, plan comparison & Opt-in Rewarded Ad Adapter
│   └── SettingsPage.tsx     # Studio profile, municipal bye-laws, theme, cache management
├── services/
│   ├── api/client.ts        # Axios client with JWT interceptor & mock switch
│   ├── ai/aiService.ts      # Multi-stage generation & contextual copilot reasoning
│   ├── projects/projectService.ts # LocalStorage / Backend persistence
│   ├── versions/versionService.ts # Version history & snapshot restores
│   ├── billing/billingService.ts  # Credits & Rewarded Ad Provider Adapter
│   └── uploads/uploadService.ts  # Multipart file upload handler
├── stores/
│   ├── useDesignStudioStore.ts # Central CAD state, undo/redo stacks, active tool, selection
│   ├── useProjectStore.ts      # Active project, CRUD operations
│   ├── useAIAssistantStore.ts  # Streaming messages & generation progress
│   └── useUserStore.ts         # User profile, credits, theme
├── schemas/
│   ├── geometrySchema.ts    # Zod validation for HouseDesign, Rooms, Walls, Doors, Windows
│   └── projectSchema.ts     # Step-by-step wizard validation
└── types/
    ├── geometry.ts          # Core CAD data contracts (Plot, Room, Wall, Door, Window)
    ├── project.ts           # Project, DesignPreferences, UploadedAsset, Version
    ├── ai.ts                # AI generation events & messages
    └── billing.ts           # Plans, credit transactions & telemetry
```

---

## ⚡ Core Features

1. **Precision 2D Floor Plan Editor**
   - True architectural vector canvas with 0.5m grid snapping and millimeter precision.
   - Interactive drag-to-reposition room zoning.
   - Exact dimensional callouts (e.g. `5.5m × 4.5m = 24.8 m²`).
   - Exterior vs interior wall thicknesses (`0.23m` vs `0.12m`).
   - Multi-floor level switching (`Ground`, `Level 1`, `Level 2`, `+ Add Floor`).
   - Boundary & setback overflow validation.

2. **Interactive 3D WebGL House Viewer**
   - Three.js + React Three Fiber in a dedicated `#171B22` charcoal viewport.
   - Consumes the **exact same structured geometry schema** as the 2D CAD editor.
   - Photometric directional sunlight with soft shadows and ground grid.
   - Camera presets: Isometric, Front Elevation, Top Ortho, Side Elevation.
   - Toggles: Show/Hide Roof, Furniture, Cutaway Sections, Wireframe mode, 3D Room Badges.
   - 3D Element Selection: Clicking a room in 3D highlights it and selects it in the properties inspector.

3. **Autonomous AI Spatial Copilot**
   - Aware of plot dimensions, road orientation, current floor level, and active selections.
   - Direct spatial modifications (e.g. expands room width, adds cantilevered balconies, reconfigures kitchens).
   - 6-stage structured generation pipeline:
     1. Synthesizing client brief & constraints
     2. Analyzing plot boundaries & solar orientation
     3. Volumetric zoning & room adjacency matrices
     4. Code compliance & structural span validation
     5. Generating 2D vector CAD layouts
     6. Compiling 3D Three.js mesh model

4. **Multi-Step Project Creation Wizard**
   - Step 1: Project Information (Name, location, project typology)
   - Step 2: Plot Information (Width, length, units, shape, road facing, setbacks)
   - Step 3: Site Imagery & Survey PDF upload
   - Step 4: Architectural Preferences (Modern Minimalist, Contemporary Villa, Traditional Indian Courtyard, Luxury Mediterranean, Industrial Loft, Scandinavian)
   - Step 5: Summary Review & Immediate Studio Launch

5. **Opt-in Rewarded Ad Adapter**
   - Production adapter interface `RewardedAdProviderAdapter` for future AdSense / AdMob for Web integration.
   - Non-intrusive, explicit user choice to earn +5 compute credits.
   - Client never trusts unverified balances; backend token exchange simulation.

---

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Compile production bundle with type checking
npm run build

# Preview production build
npm run preview
```

FORMA operates in standalone Mock Mode by default (`VITE_USE_MOCK_API=true`), pre-populated with realistic multi-story projects (*Villa Solarium*, *Skyline Urban Duplex*, *Zenith Courtyard Residence*). To connect to a live Node.js/Express + MongoDB/FalkorDB/Chroma backend, set `VITE_USE_MOCK_API=false` and configure `VITE_API_BASE_URL`.
