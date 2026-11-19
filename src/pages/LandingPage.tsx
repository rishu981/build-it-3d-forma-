import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Sparkles,
  Layers,
  Compass,
  ArrowRight,
  CheckCircle2,
  Box,
  Cpu,
  PenTool,
  History,
  FileCheck,
  Zap,
  ChevronRight,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useUserStore } from '../stores/useUserStore';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthModal } = useUserStore();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-forma-100 selection:text-forma-900">
      {/* 1. Public Top Navigation */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-lg bg-forma-500 flex items-center justify-center text-white shadow-subtle">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-foreground flex items-center gap-1.5">
                FORMA
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-forma-100 text-forma-700 rounded font-semibold">
                  CAD AI
                </span>
              </span>
              <span className="text-[10px] text-muted tracking-wider uppercase font-medium">
                Architectural Platform
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-dark">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#showcase" className="hover:text-foreground transition-colors">
              Showcase
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAuthModal(true, 'signin')}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
              onClick={() => navigate('/dashboard')}
            >
              Open Studio
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-border bg-gradient-to-b from-surface to-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-forma-50 border border-forma-200 rounded-full text-xs font-medium text-forma-700">
                <Sparkles className="w-3.5 h-3.5 text-forma-600" />
                <span>Next-Gen Spatial AI for Architects & Homebuilders</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
                Design your dream home.{' '}
                <span className="text-forma-500 underline decoration-forma-200 underline-offset-4">
                  See it before it's built.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
                Turn your land, ideas and inspiration into detailed architectural layouts and
                interactive 3D house designs with AI.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  onClick={() => navigate('/create')}
                >
                  Create Your First Design
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  icon={<Box className="w-4 h-4" />}
                  onClick={() => navigate('/dashboard')}
                >
                  Explore Examples
                </Button>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-border/60">
                <div>
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-xs text-muted">Vector Parametric Geometry</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">&lt; 15s</p>
                  <p className="text-xs text-muted">CAD Generation Speed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">2D + 3D</p>
                  <p className="text-xs text-muted">Synchronized Viewports</p>
                </div>
              </div>
            </div>

            {/* Architectural 3D House Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-border shadow-modal bg-studio-bg">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <Badge variant="studio" size="sm">
                    Interactive 3D Viewport
                  </Badge>
                  <span className="text-[10px] text-studio-muted font-mono bg-studio-panel/80 px-2 py-0.5 rounded border border-studio-border">
                    16m × 22m Plot
                  </span>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80"
                  alt="Architectural Villa 3D Rendering"
                  className="w-full h-[440px] object-cover hover:scale-105 transition-transform duration-700"
                />

                {/* Floating CAD Overlay telemetry */}
                <div className="absolute bottom-4 left-4 right-4 bg-studio-panel/90 backdrop-blur-md p-3.5 rounded-xl border border-studio-border text-left">
                  <div className="flex items-center justify-between text-xs text-studio-text mb-2">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Villa Solarium — Model Synchronized
                    </span>
                    <span className="font-mono text-studio-muted">285.4 m² Built-up</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] text-studio-muted font-mono">
                    <div className="bg-studio-bg/60 p-1.5 rounded">Ground: 162 m²</div>
                    <div className="bg-studio-bg/60 p-1.5 rounded">Level 1: 123.4 m²</div>
                    <div className="bg-studio-bg/60 p-1.5 rounded text-emerald-400">Setbacks: OK</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section id="how-it-works" className="py-24 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Badge variant="forma" className="mb-3">
            Simple 3-Step Methodology
          </Badge>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">How It Works</h2>
          <p className="text-sm text-muted mt-2 max-w-xl mx-auto">
            From raw boundary measurements to interactive 3D spatial models in under three minutes.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-border bg-background/50 hover:bg-surface text-left transition-all hover:shadow-subtle">
              <div className="w-10 h-10 rounded-lg bg-forma-100 text-forma-700 font-bold flex items-center justify-center font-mono mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                1. Upload your plot & provide dimensions
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Enter your precise boundary width, length, road orientation and municipal setbacks.
                Upload drone photos or legal survey blueprints for AI spatial analysis.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-background/50 hover:bg-surface text-left transition-all hover:shadow-subtle">
              <div className="w-10 h-10 rounded-lg bg-forma-100 text-forma-700 font-bold flex items-center justify-center font-mono mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                2. Describe your dream home to AI
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Specify your desired room count, architectural style (Modern, Indian Courtyard, Luxury
                Villa), living preferences, parking and lifestyle zoning requirements.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-background/50 hover:bg-surface text-left transition-all hover:shadow-subtle">
              <div className="w-10 h-10 rounded-lg bg-forma-100 text-forma-700 font-bold flex items-center justify-center font-mono mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                3. Explore, customize and refine in 3D
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Inspect your generated design in interactive 3D orbit or 2D CAD. Move walls, resize
                bedrooms, select materials, and instruct your AI copilot with natural voice or text.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="forma" className="mb-3">
              Engineered for Precision
            </Badge>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Professional Architectural Capabilities
            </h2>
            <p className="text-sm text-muted mt-2">
              Built on strict geometric foundations rather than arbitrary image generation hallucinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border bg-surface text-left shadow-subtle">
              <Cpu className="w-6 h-6 text-forma-500 mb-4" />
              <h4 className="text-sm font-semibold text-foreground mb-1.5">
                AI-Powered Design Generation
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Generates structurally sensible, code-compliant volumetric spaces respecting solar
                angles, cross-ventilation, and room adjacency hierarchies.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-surface text-left shadow-subtle">
              <Layers className="w-6 h-6 text-forma-500 mb-4" />
              <h4 className="text-sm font-semibold text-foreground mb-1.5">Accurate 2D Floor Plans</h4>
              <p className="text-xs text-muted leading-relaxed">
                Interactive vector CAD editor with grid snap, wall thicknesses, exact dimensional
                callouts (e.g. 4.5m × 5.2m = 23.4 m²), and multi-floor switching.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-surface text-left shadow-subtle">
              <Box className="w-6 h-6 text-forma-500 mb-4" />
              <h4 className="text-sm font-semibold text-foreground mb-1.5">
                Interactive 3D Visualization
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                True Three.js / WebGL rendering with orbit navigation, cutaway sections, wireframe
                inspections, roof toggle, and material finishes.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-surface text-left shadow-subtle">
              <History className="w-6 h-6 text-forma-500 mb-4" />
              <h4 className="text-sm font-semibold text-foreground mb-1.5">
                Project Memory & Versioning
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Complete design revision tree with point-in-time restores, visual diff comparisons, and
                undo/redo tracking during live drafting.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-surface text-left shadow-subtle">
              <FileCheck className="w-6 h-6 text-forma-500 mb-4" />
              <h4 className="text-sm font-semibold text-foreground mb-1.5">
                Reference Image Analysis
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Upload aerial plot drone shots, site boundary surveys, or Pinterest facade inspirations;
                FORMA extracts architectural cues automatically.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-surface text-left shadow-subtle">
              <Sliders className="w-6 h-6 text-forma-500 mb-4" />
              <h4 className="text-sm font-semibold text-foreground mb-1.5">
                Full Element Customization
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Fine-tune every room, wall material, window sill elevation, door swing direction, and
                furniture placement in the contextual properties inspector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Showcase Gallery */}
      <section id="showcase" className="py-24 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge variant="forma" className="mb-2">
                Curated Designs
              </Badge>
              <h2 className="text-3xl font-bold text-foreground tracking-tight">
                Architectural Showcase
              </h2>
              <p className="text-sm text-muted mt-1">
                Explore real residential schemes generated and refined on the FORMA platform.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<ChevronRight className="w-3.5 h-3.5" />}
              iconPosition="right"
              onClick={() => navigate('/dashboard')}
              className="mt-4 md:mt-0"
            >
              Browse All Templates
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group rounded-xl overflow-hidden border border-border bg-background transition-all hover:shadow-card">
              <div className="h-56 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80"
                  alt="Villa Solarium"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge variant="studio" size="sm" className="absolute top-3 left-3">
                  Modern Villa
                </Badge>
              </div>
              <div className="p-5 text-left">
                <h4 className="font-semibold text-foreground text-sm">Villa Solarium</h4>
                <p className="text-xs text-muted mt-1">16m × 22m Plot • 2 Levels • 3 Bedrooms</p>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="font-mono text-forma-600 font-medium">285.4 m² Built-up</span>
                  <span
                    onClick={() => navigate('/studio/proj_villa_solarium')}
                    className="font-medium text-foreground hover:text-forma-600 cursor-pointer flex items-center gap-1"
                  >
                    Open in 3D <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            <div className="group rounded-xl overflow-hidden border border-border bg-background transition-all hover:shadow-card">
              <div className="h-56 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80"
                  alt="Skyline Urban Duplex"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge variant="studio" size="sm" className="absolute top-3 left-3">
                  Urban Duplex
                </Badge>
              </div>
              <div className="p-5 text-left">
                <h4 className="font-semibold text-foreground text-sm">Skyline Urban Duplex</h4>
                <p className="text-xs text-muted mt-1">10m × 18m Narrow Lot • 2 Levels • Micro Courtyard</p>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="font-mono text-forma-600 font-medium">198.0 m² Built-up</span>
                  <span
                    onClick={() => navigate('/studio/proj_skyline_duplex')}
                    className="font-medium text-foreground hover:text-forma-600 cursor-pointer flex items-center gap-1"
                  >
                    Open in 3D <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>

            <div className="group rounded-xl overflow-hidden border border-border bg-background transition-all hover:shadow-card">
              <div className="h-56 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80"
                  alt="Zenith Courtyard Residence"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <Badge variant="studio" size="sm" className="absolute top-3 left-3">
                  Indian Courtyard
                </Badge>
              </div>
              <div className="p-5 text-left">
                <h4 className="font-semibold text-foreground text-sm">Zenith Courtyard Residence</h4>
                <p className="text-xs text-muted mt-1">18m × 20m Square Plot • Central Aangan</p>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="font-mono text-forma-600 font-medium">220.0 m² Built-up</span>
                  <span
                    onClick={() => navigate('/studio/proj_zenith_courtyard')}
                    className="font-medium text-foreground hover:text-forma-600 cursor-pointer flex items-center gap-1"
                  >
                    Open in 3D <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-24 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Badge variant="forma" className="mb-3">
            Transparent Plans
          </Badge>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Flexible Architectural Plans
          </h2>
          <p className="text-sm text-muted mt-2 max-w-lg mx-auto">
            Start for free, earn credits with opt-in rewarded previews, or unlock unlimited professional CAD tooling.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 text-left">
            {/* Free Tier */}
            <div className="p-8 rounded-2xl border border-border bg-surface relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">Free Explorer</h3>
                  <Badge variant="outline">Personal</Badge>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">$0</span>
                  <span className="text-xs text-muted ml-1">/ month</span>
                </div>
                <p className="text-xs text-muted mb-6">
                  Perfect for homeowners exploring initial site layouts and floor plan concepts.
                </p>

                <ul className="space-y-3 text-xs text-muted-dark">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Basic 2D vector floor plan editor
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Interactive 3D Three.js house viewer
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    3 Active saved projects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    10 AI Generation credits / month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Opt-in rewarded sponsor credits (+5 credits)
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                className="w-full mt-8"
                onClick={() => navigate('/create')}
              >
                Start Free Project
              </Button>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-2xl border-2 border-forma-500 bg-surface relative flex flex-col justify-between shadow-card">
              <div className="absolute -top-3 right-6">
                <Badge variant="forma" size="sm">
                  Recommended for Professionals
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">Pro Architect</h3>
                  <Badge variant="forma">Full Studio</Badge>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">$49</span>
                  <span className="text-xs text-muted ml-1">/ month</span>
                </div>
                <p className="text-xs text-muted mb-6">
                  Designed for architectural studios, structural engineers and property developers.
                </p>

                <ul className="space-y-3 text-xs text-muted-dark">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forma-600" />
                    Unlimited 2D & 3D projects & revisions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forma-600" />
                    120 Monthly AI credits + Priority Copilot
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forma-600" />
                    Multi-level designs up to 5 floors
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forma-600" />
                    Vector DXF / SVG / PDF report exports
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forma-600" />
                    Custom material library & high-res rendering
                  </li>
                </ul>
              </div>

              <Button
                variant="primary"
                className="w-full mt-8"
                onClick={() => navigate('/subscription')}
              >
                Upgrade to Pro Architect
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-surface py-12 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-forma-500 flex items-center justify-center text-white">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm tracking-tight text-foreground">FORMA</span>
              </div>
              <p className="text-xs text-muted max-w-sm leading-relaxed">
                Empowering architects, builders, and homeowners with precision spatial AI CAD
                tooling. Design your dream home before breaking ground.
              </p>
              <p className="text-[11px] text-muted-light mt-4">
                © {new Date().getFullYear()} FORMA Architectural Systems Inc. All rights reserved.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
                Product
              </p>
              <ul className="space-y-2 text-xs text-muted">
                <li>
                  <a href="#features" className="hover:text-foreground">
                    2D Floor Planner
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-foreground">
                    Interactive 3D Engine
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-foreground">
                    AI Spatial Copilot
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-foreground">
                    CAD Geometry Schema
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
                Resources
              </p>
              <ul className="space-y-2 text-xs text-muted">
                <li>
                  <Link to="/templates" className="hover:text-foreground">
                    House Templates
                  </Link>
                </li>
                <li>
                  <Link to="/references" className="hover:text-foreground">
                    Reference Library
                  </Link>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground">
                    Pricing & Credits
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Municipal Bye-laws
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">
                Legal
              </p>
              <ul className="space-y-2 text-xs text-muted">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Architectural Disclaimer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Security & Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
