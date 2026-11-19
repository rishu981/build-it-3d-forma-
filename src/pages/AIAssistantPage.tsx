import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Compass,
  ArrowRight,
  Layers,
  FileCheck,
  Building2,
  CheckCircle2,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { useAIAssistantStore } from '../stores/useAIAssistantStore';
import { useProjectStore } from '../stores/useProjectStore';
import { useDesignStudioStore } from '../stores/useDesignStudioStore';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const AIAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const { messages, isThinking, sendMessage, clearHistory } = useAIAssistantStore();
  const { projects, activeProject, setActiveProject } = useProjectStore();
  const { initializeDesign, setViewMode, setCameraPreset } = useDesignStudioStore();
  const [inputVal, setInputVal] = useState('');

  const currentProj = activeProject || (projects.length > 0 ? projects[0] : null);

  const handleSend = async (text?: string) => {
    const q = text || inputVal;
    if (!q.trim() || !currentProj) return;
    setInputVal('');
    const res = await sendMessage(currentProj.id, q, currentProj.currentDesign);
    if (res.appliedAction?.newDesign) {
      initializeDesign(res.appliedAction.newDesign);
    }
  };

  const handleOpenStudio = (mode: '2d' | '3d' | 'split' = '3d') => {
    if (!currentProj) return;
    setViewMode(mode);
    if (mode === '3d') setCameraPreset('isometric');
    navigate(`/studio/${currentProj.id}`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 text-left h-full flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">AI Spatial Copilot</h1>
          <p className="text-xs text-muted mt-1">
            Autonomous architectural consulting, code validation, and parametric spatial reasoning.
          </p>
        </div>

        {/* Project Selector & Studio Navigation */}
        <div className="flex items-center gap-3">
          {projects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Active Project:</span>
              <select
                value={currentProj?.id}
                onChange={(e) => {
                  const found = projects.find((p) => p.id === e.target.value);
                  if (found) setActiveProject(found);
                }}
                className="h-8 px-2 text-xs bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:border-forma-500 font-medium"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleOpenStudio('3d')}
            icon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Open 3D Studio
          </Button>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="flex-1 bg-surface border border-border rounded-2xl shadow-subtle flex flex-col overflow-hidden min-h-[480px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] rounded-xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-forma-500 text-white'
                      : 'bg-surface-muted border border-border text-foreground'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">{m.content}</div>

                  {m.appliedAction && (
                    <div className="mt-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between gap-3 text-emerald-900 dark:text-emerald-300 font-medium">
                      <span>✓ {m.appliedAction.details}</span>
                      <button
                        onClick={() => {
                          if (m.appliedAction?.newDesign) {
                            initializeDesign(m.appliedAction.newDesign);
                          }
                          handleOpenStudio(m.appliedAction?.viewMode || '3d');
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors shrink-0 flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect in Studio
                      </button>
                    </div>
                  )}
                </div>

                {!isUser && m.suggestedPrompts && (
                  <div className="mt-2 space-y-1 pl-2">
                    {m.suggestedPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(p)}
                        className="block text-left text-xs text-forma-600 hover:underline"
                      >
                        → {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-muted p-3 bg-surface-muted rounded-xl w-fit">
              <Sparkles className="w-4 h-4 text-forma-600 animate-spin" />
              <span>Analyzing parcel constraints & compiling 3D spatial geometry...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 border-t border-border bg-surface-muted/30 flex gap-2 overflow-x-auto whitespace-nowrap">
          {[
            'Show me the 3D design in my workspace',
            'Build a scaled 3D building model',
            'Make the living room larger',
            'Add a balcony to Level 1',
            'Optimize ground floor cross ventilation',
            'Verify municipal setback compliance',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 bg-surface border border-border rounded-full text-xs text-muted-dark hover:text-foreground shrink-0 shadow-subtle hover:border-forma-400 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-surface">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Instruct AI copilot... (e.g. 'Build scaled 3D building model' or 'Add a sunset balcony')"
              className="flex-1 h-10 px-4 text-xs bg-surface-muted border border-border rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:border-forma-500 focus:bg-surface"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Send className="w-4 h-4" />}
              disabled={!inputVal.trim() || isThinking}
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};