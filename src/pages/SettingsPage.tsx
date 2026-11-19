import React, { useState } from 'react';
import {
  User,
  Shield,
  Palette,
  Bell,
  HardDrive,
  Cpu,
  Lock,
  Save,
  Moon,
  Sun,
} from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useAISettingsStore } from '../stores/useAISettingsStore';
import { Input, Textarea } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, theme, setTheme } = useUserStore();
  const aiSettings = useAISettingsStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance' | 'ai' | 'storage'>('profile');
  const [name, setName] = useState(user.name);
  const [company, setCompany] = useState(user.companyName || '');
  const [email, setEmail] = useState(user.email);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, companyName: company, email });
    toast.success('Settings updated successfully');
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 text-left">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Account & Studio Settings</h1>
        <p className="text-xs text-muted mt-1">
          Configure architectural studio profile, AI reasoning preferences, and workspace appearance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Settings Navigation Tabs */}
        <div className="md:col-span-3 space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
              activeTab === 'profile'
                ? 'bg-forma-50 text-forma-700 font-semibold'
                : 'text-muted-dark hover:bg-surface-hover'
            }`}
          >
            <User className="w-4 h-4" /> Profile & Studio
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
              activeTab === 'security'
                ? 'bg-forma-50 text-forma-700 font-semibold'
                : 'text-muted-dark hover:bg-surface-hover'
            }`}
          >
            <Shield className="w-4 h-4" /> Account Security
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
              activeTab === 'appearance'
                ? 'bg-forma-50 text-forma-700 font-semibold'
                : 'text-muted-dark hover:bg-surface-hover'
            }`}
          >
            <Palette className="w-4 h-4" /> Appearance & Theme
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
              activeTab === 'ai'
                ? 'bg-forma-50 text-forma-700 font-semibold'
                : 'text-muted-dark hover:bg-surface-hover'
            }`}
          >
            <Cpu className="w-4 h-4" /> AI Copilot Behavior
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
              activeTab === 'storage'
                ? 'bg-forma-50 text-forma-700 font-semibold'
                : 'text-muted-dark hover:bg-surface-hover'
            }`}
          >
            <HardDrive className="w-4 h-4" /> Storage & Cache
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="md:col-span-9 bg-surface p-6 rounded-2xl border border-border shadow-subtle">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border">
                Architectural Identity
              </h3>

              <div className="flex items-center gap-4 py-2">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border border-border"
                />
                <div>
                  <Button type="button" variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-[11px] text-muted mt-1">Recommended: 256×256px JPG or PNG</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Work Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Studio / Firm Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Vance Architecture Group"
              />

              <div className="pt-4 flex justify-end">
                <Button type="submit" variant="primary" size="sm" icon={<Save className="w-3.5 h-3.5" />}>
                  Save Profile
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border">
                Security & Authentication
              </h3>
              <Input label="Current Password" type="password" placeholder="••••••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••••••" />
              <Input label="Confirm New Password" type="password" placeholder="••••••••••••" />

              <div className="p-3 bg-surface-muted rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground block">Two-Factor Authentication</span>
                  <span className="text-muted">Protect CAD project data with TOTP authenticator app</span>
                </div>
                <Badge variant="outline">Disabled</Badge>
              </div>

              <div className="pt-2 flex justify-end">
                <Button variant="primary" size="sm" onClick={() => toast.success('Password updated')}>
                  Update Password
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border">
                Interface Appearance
              </h3>
              <p className="text-muted">
                Choose your primary workspace theme. The 3D Three.js viewport always utilizes a dedicated charcoal studio background (#171B22) for photometric contrast.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'border-forma-500 bg-forma-50 ring-1 ring-forma-500'
                      : 'border-border bg-surface hover:bg-surface-hover'
                  }`}
                >
                  <Sun className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                  <span className="font-semibold text-foreground">Clean Studio (Light)</span>
                  <p className="text-[11px] text-muted mt-1">High-clarity architectural drawing standard</p>
                </div>

                <div
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                    theme === 'dark'
                      ? 'border-forma-500 bg-forma-50 ring-1 ring-forma-500'
                      : 'border-border bg-surface hover:bg-surface-hover'
                  }`}
                >
                  <Moon className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                  <span className="font-semibold text-foreground">Dark Charcoal</span>
                  <p className="text-[11px] text-muted mt-1">Reduced eye strain for night drafting</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-5 text-xs">
              <div className="border-b border-border pb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  AI Model Provider & Local LLM Integration
                </h3>
                <p className="text-muted mt-0.5">
                  Choose between the built-in Mock Simulator, your local Qwen 9B model via Ollama / LM Studio, or the free Google Gemini API.
                </p>
              </div>

              {/* Provider Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => aiSettings.setProvider('mock')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    aiSettings.provider === 'mock'
                      ? 'border-forma-500 bg-forma-50 text-foreground ring-1 ring-forma-500'
                      : 'border-border bg-surface hover:bg-surface-hover text-muted-dark'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground">Mock Simulator</span>
                    <Badge variant={aiSettings.provider === 'mock' ? 'forma' : 'outline'} size="sm">
                      Offline
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Zero setup, instant mathematical architectural CAD generator.
                  </p>
                </div>

                <div
                  onClick={() => aiSettings.setProvider('local_ollama')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    aiSettings.provider === 'local_ollama'
                      ? 'border-forma-500 bg-forma-50 text-foreground ring-1 ring-forma-500'
                      : 'border-border bg-surface hover:bg-surface-hover text-muted-dark'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground">Local Qwen (Ollama)</span>
                    <Badge variant={aiSettings.provider === 'local_ollama' ? 'forma' : 'outline'} size="sm">
                      Private
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Runs 100% on your GPU/CPU via Ollama or LM Studio. No API costs.
                  </p>
                </div>

                <div
                  onClick={() => aiSettings.setProvider('gemini')}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    aiSettings.provider === 'gemini'
                      ? 'border-forma-500 bg-forma-50 text-foreground ring-1 ring-forma-500'
                      : 'border-border bg-surface hover:bg-surface-hover text-muted-dark'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-foreground">Google Gemini API</span>
                    <Badge variant={aiSettings.provider === 'gemini' ? 'forma' : 'outline'} size="sm">
                      Free Tier
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted leading-relaxed">
                    Free API key via Google AI Studio (Gemini 1.5/2.0 Flash).
                  </p>
                </div>
              </div>

              {/* Local Ollama / Qwen Configuration */}
              {aiSettings.provider === 'local_ollama' && (
                <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Local Ollama / LM Studio Settings</span>
                    <Badge variant="outline" size="sm">OpenAI / Ollama API</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Local Server Endpoint"
                      value={aiSettings.localEndpoint}
                      onChange={(e) => aiSettings.setLocalEndpoint(e.target.value)}
                      placeholder="http://localhost:11434"
                    />
                    <Input
                      label="Model Name"
                      value={aiSettings.localModelName}
                      onChange={(e) => aiSettings.setLocalModelName(e.target.value)}
                      placeholder="qwen2.5:latest or qwen2.5:7b"
                    />
                  </div>

                  <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                    <p className="font-semibold">💡 How to run Qwen locally with Ollama:</p>
                    <p>1. Open your terminal and run: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">ollama run qwen2.5:latest</code></p>
                    <p>2. To allow web requests from your browser, set: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">set OLLAMA_ORIGINS=*</code> before starting Ollama.</p>
                  </div>
                </div>
              )}

              {/* Gemini API Configuration */}
              {aiSettings.provider === 'gemini' && (
                <div className="p-4 rounded-xl bg-surface-muted border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Google Gemini API Settings</span>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="text-forma-600 font-semibold hover:underline"
                    >
                      Get Free API Key ↗
                    </a>
                  </div>

                  <Input
                    label="Gemini API Key"
                    type="password"
                    value={aiSettings.geminiApiKey}
                    onChange={(e) => aiSettings.setGeminiApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                  />

                  <div className="space-y-1">
                    <label className="block font-medium text-foreground">Gemini Model</label>
                    <select
                      value={aiSettings.geminiModel}
                      onChange={(e) => aiSettings.setGeminiModel(e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-surface border border-border rounded-md"
                    >
                      <option value="gemini-flash-latest">Gemini Flash Latest (Fast & Recommended)</option>
                      <option value="gemini-3.8-flash">Gemini 3.8 Flash</option>
                      <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
                      <option value="gemini-pro-latest">Gemini Pro Latest</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-4 space-y-3">
                <h4 className="font-semibold text-foreground">Architectural Code Bye-laws</h4>
                <label className="flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer">
                  <div>
                    <span className="font-semibold text-foreground block">Enforce Municipal Setbacks</span>
                    <span className="text-muted">Prevent rooms from encroaching into perimeter buffer zones</span>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-forma-600" />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-border cursor-pointer">
                  <div>
                    <span className="font-semibold text-foreground block">Daylight & Solar Optimization</span>
                    <span className="text-muted">Prioritize living spaces and master bedrooms along optimal solar orientation</span>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded text-forma-600" />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold text-foreground pb-2 border-b border-border">
                Storage & Cache Management
              </h3>
              <div className="p-3 bg-surface-muted rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted">CAD Mesh & Document Cache:</span>
                  <span className="font-mono font-bold text-foreground">42.8 MB / 5.0 GB</span>
                </div>
                <div className="h-2 bg-surface-active rounded-full overflow-hidden">
                  <div className="h-full bg-forma-500" style={{ width: '12%' }} />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success('Temporary CAD mesh cache cleared')}
                >
                  Clear Mesh Cache
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
