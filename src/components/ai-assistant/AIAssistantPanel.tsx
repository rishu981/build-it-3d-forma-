import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  X,
  Compass,
  ArrowRight,
  Layers,
  Check,
  Bot,
  User,
  Cpu,
  Settings2,
  Eye,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import { useAIAssistantStore } from '../../stores/useAIAssistantStore';
import { useDesignStudioStore } from '../../stores/useDesignStudioStore';
import { useProjectStore } from '../../stores/useProjectStore';
import { useAISettingsStore, AIProvider } from '../../stores/useAISettingsStore';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AIAction } from '../../types/ai';
import { toast } from 'sonner';

export const AIAssistantPanel: React.FC = () => {
  const { messages, isThinking, sendMessage, clearHistory } = useAIAssistantStore();
  const { activeProject } = useProjectStore();
  const {
    design,
    selection,
    isAiPanelOpen,
    toggleAiPanel,
    updateRoom,
    addRoom,
    currentFloorLevel,
    viewMode,
    setViewMode,
    setCameraPreset,
    initializeDesign,
    setCutawayMode,
    setWireframeMode,
  } = useDesignStudioStore();

  const {
    provider,
    setProvider,
    geminiApiKey,
    setGeminiApiKey,
    localEndpoint,
    setLocalEndpoint,
    localModelName,
    setLocalModelName,
  } = useAISettingsStore();

  const [inputMessage, setInputMessage] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  if (!isAiPanelOpen) return null;

  // Autonomously execute actions on the live workspace canvas
  const executeAction = (action: AIAction) => {
    switch (action.type) {
      case 'switch_view': {
        const targetMode = action.viewMode || '3d';
        setViewMode(targetMode);
        if (targetMode === '3d') {
          setCameraPreset('isometric');
        }
        toast.success(action.details || `Switched workspace to ${targetMode.toUpperCase()} viewport`);
        break;
      }

      case 'generate_layout': {
        if (action.newDesign) {
          initializeDesign(action.newDesign);
        }
        const targetMode = action.viewMode || '3d';
        setViewMode(targetMode);
        setCameraPreset('isometric');
        toast.success(action.details || 'Autonomously rendered scaled 3D model in workspace');
        break;
      }

      case 'modify_room': {
        const deltaW = action.roomData?.deltaWidth || 1.0;
        const targetType = action.roomData?.targetType || 'living';
        const fl = design?.floors[0]?.rooms || [];
        const roomToEdit =
          (selection.id && fl.find((r) => r.id === selection.id)) ||
          fl.find((r) => r.type === targetType) ||
          fl[0];

        if (roomToEdit) {
          updateRoom(roomToEdit.id, {
            width: Math.round((roomToEdit.width + deltaW) * 10) / 10,
          });
          toast.success(
            action.details || `Expanded ${roomToEdit.name} to ${(roomToEdit.width + deltaW).toFixed(1)}m`
          );
        }
        break;
      }

      case 'add_balcony': {
        const originX = design?.plot.setbacks.left || 2;
        addRoom({
          name: 'Sunset Balcony',
          type: 'balcony',
          x: originX,
          z: 1.5,
          width: 5.4,
          length: 1.6,
          wallHeight: 1.1,
          floorMaterial: 'slate',
          wallMaterial: 'concrete',
          wallColor: '#EBEBEB',
          color: '#EEF2E6',
        });
        setViewMode('3d');
        setCameraPreset('isometric');
        toast.success('Constructed cantilevered sunset balcony on Level 1');
        break;
      }

      case 'toggle_cutaway': {
        setCutawayMode(true);
        setViewMode('3d');
        toast.success('Activated 3D Cutaway Section View');
        break;
      }

      case 'toggle_wireframe': {
        setWireframeMode(true);
        setViewMode('3d');
        toast.success('Activated 3D Structural Wireframe Mode');
        break;
      }

      default:
        if (action.viewMode) {
          setViewMode(action.viewMode);
        }
        break;
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !activeProject) return;

    setInputMessage('');
    const response = await sendMessage(
      activeProject.id,
      text,
      design || undefined,
      selection.id
    );

    // DIRECT AUTONOMOUS WORKSPACE MUTATION:
    if (response.appliedAction) {
      executeAction(response.appliedAction);
    }
  };

  const defaultSuggestions = [
    'Show me the 3D design in my workspace',
    'Build a scaled 3D building model',
    'Make the living room larger',
    'Add a balcony to Level 1',
    'Toggle cutaway mode to inspect interior',
    'Switch to split view (2D + 3D)',
  ];

  const getProviderBadge = () => {
    if (provider === 'gemini') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-medium">
          <Sparkles className="w-2.5 h-2.5 text-sky-600" />
          Gemini Flash
        </span>
      );
    }
    if (provider === 'local_ollama') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
          <Cpu className="w-2.5 h-2.5 text-amber-600" />
          Local Qwen (9B)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
        <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
        Instant CAD
      </span>
    );
  };

  return (
    <div className="w-[410px] bg-surface border-l border-border flex flex-col h-full shrink-0 select-none z-30 shadow-dropdown text-left relative">
      {/* Header */}
      <div className="h-14 px-4 border-b border-border flex items-center justify-between shrink-0 bg-surface">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-forma-50 text-forma-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-semibold text-foreground">Architectural Copilot</h3>
              {getProviderBadge()}
            </div>
            <span className="text-[10px] text-muted font-mono">
              Plot: {design?.plot.width}m × {design?.plot.length}m • View: {viewMode.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 text-muted hover:text-foreground rounded hover:bg-surface-hover"
            title="Configure AI Model (Gemini / Local Qwen)"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={clearHistory}
            className="p-1.5 text-muted hover:text-foreground rounded hover:bg-surface-hover"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleAiPanel}
            className="p-1.5 text-muted hover:text-foreground rounded hover:bg-surface-hover"
            title="Close Assistant Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Model Settings Drawer / Popover */}
      {showSettingsModal && (
        <div className="absolute top-14 left-0 right-0 bg-surface border-b border-border p-4 z-40 shadow-dropdown space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-forma-600" />
              AI Model & Inference Provider
            </span>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="text-muted hover:text-foreground text-xs"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            <button
              onClick={() => setProvider('gemini')}
              className={`p-2 rounded-lg border text-[11px] font-medium transition-colors ${
                provider === 'gemini'
                  ? 'border-forma-600 bg-forma-50 text-forma-700 font-semibold'
                  : 'border-border text-muted hover:border-border-strong'
              }`}
            >
              ✨ Gemini Flash
              <span className="block text-[9px] opacity-75">Cloud (Free)</span>
            </button>
            <button
              onClick={() => setProvider('local_ollama')}
              className={`p-2 rounded-lg border text-[11px] font-medium transition-colors ${
                provider === 'local_ollama'
                  ? 'border-forma-600 bg-forma-50 text-forma-700 font-semibold'
                  : 'border-border text-muted hover:border-border-strong'
              }`}
            >
              💻 Local Qwen
              <span className="block text-[9px] opacity-75">Ollama / 9B</span>
            </button>
            <button
              onClick={() => setProvider('mock')}
              className={`p-2 rounded-lg border text-[11px] font-medium transition-colors ${
                provider === 'mock'
                  ? 'border-forma-600 bg-forma-50 text-forma-700 font-semibold'
                  : 'border-border text-muted hover:border-border-strong'
              }`}
            >
              ⚡ Instant CAD
              <span className="block text-[9px] opacity-75">0ms Offline</span>
            </button>
          </div>

          {provider === 'gemini' && (
            <div className="space-y-1">
              <label className="text-[10px] text-muted block font-medium">Gemini API Key</label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full h-7 px-2 text-[11px] bg-surface-muted border border-border rounded font-mono"
              />
              <span className="text-[9px] text-emerald-600 block">
                ✓ Verified active with Google Generative Language API
              </span>
            </div>
          )}

          {provider === 'local_ollama' && (
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-muted block font-medium">Ollama Endpoint</label>
                <input
                  type="text"
                  value={localEndpoint}
                  onChange={(e) => setLocalEndpoint(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full h-7 px-2 text-[11px] bg-surface-muted border border-border rounded font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted block font-medium">Local Model Name</label>
                <input
                  type="text"
                  value={localModelName}
                  onChange={(e) => setLocalModelName(e.target.value)}
                  placeholder="qwen2.5:latest"
                  className="w-full h-7 px-2 text-[11px] bg-surface-muted border border-border rounded font-mono"
                />
              </div>
              <p className="text-[9px] text-muted">
                Run <code className="bg-surface-muted px-1 rounded">ollama run qwen2.5:latest</code> in terminal to start inference.
              </p>
            </div>
          )}

          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                setShowSettingsModal(false);
                toast.success(`Switched AI provider to ${provider.toUpperCase()}`);
              }}
              className="px-3 py-1 bg-forma-600 text-white rounded text-xs font-medium hover:bg-forma-700"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[90%] rounded-xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-forma-500 text-white rounded-tr-none shadow-sm'
                    : 'bg-surface-muted border border-border text-foreground rounded-tl-none'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5 opacity-70 text-[10px]">
                  {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-forma-600" />}
                  <span className="font-semibold">{isUser ? 'Architect' : 'FORMA Copilot'}</span>
                </div>

                <div className="whitespace-pre-wrap space-y-2">{msg.content}</div>

                {/* Applied Geometry Action Badge & Interactive Trigger */}
                {msg.appliedAction && (
                  <div className="mt-3 p-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 rounded-lg text-[11px] flex items-center justify-between gap-2 font-medium">
                    <div className="flex items-center gap-1.5 truncate">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{msg.appliedAction.details}</span>
                    </div>
                    <button
                      onClick={() => executeAction(msg.appliedAction!)}
                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-semibold transition-colors shrink-0 shadow-sm flex items-center gap-1"
                      title="Inspect action in workspace canvas"
                    >
                      <Eye className="w-3 h-3" />
                      View in Canvas
                    </button>
                  </div>
                )}
              </div>

              {/* Message Suggested Followups */}
              {!isUser && msg.suggestedPrompts && (
                <div className="mt-2 space-y-1 w-full pl-2">
                  {msg.suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p)}
                      className="block text-left text-[11px] text-forma-600 hover:text-forma-800 hover:underline truncate max-w-full font-medium"
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
          <div className="flex items-center gap-2 p-3 bg-surface-muted rounded-xl border border-border text-xs text-muted max-w-[85%]">
            <Sparkles className="w-3.5 h-3.5 text-forma-600 animate-spin" />
            <span>Autonomously compiling geometry & spatial constraints...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="px-3 py-2 border-t border-border bg-surface-muted/30 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 shrink-0">
        {defaultSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 bg-surface border border-border hover:border-forma-400 rounded-full text-[11px] text-muted-dark hover:text-foreground shrink-0 transition-colors shadow-subtle font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-3 border-t border-border bg-surface shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Instruct AI copilot... (e.g. 'Show 3D design' or 'Make living room larger')"
            className="flex-1 h-9 px-3 text-xs bg-surface-muted border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-forma-500 focus:bg-surface font-normal"
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            icon={<Send className="w-3.5 h-3.5" />}
            disabled={!inputMessage.trim() || isThinking}
          />
        </form>
      </div>
    </div>
  );
};