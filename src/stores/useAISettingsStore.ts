import { create } from 'zustand';

export type AIProvider = 'mock' | 'local_ollama' | 'local_openai' | 'gemini';

interface AISettingsState {
  provider: AIProvider;
  localEndpoint: string;
  localModelName: string;
  geminiApiKey: string;
  geminiModel: string;

  setProvider: (provider: AIProvider) => void;
  setLocalEndpoint: (endpoint: string) => void;
  setLocalModelName: (model: string) => void;
  setGeminiApiKey: (key: string) => void;
  setGeminiModel: (model: string) => void;
}

const STORAGE_KEY = 'forma_ai_settings';

// Default user key verified working on Google AI Studio
const DEFAULT_GEMINI_KEY = 'AIzaSyC8unPmk5Ts_W1d2zuIUfyUBiVQBWrgh-M';
const DEFAULT_MODEL = 'gemini-flash-latest';

function getInitialSettings(): Partial<AISettingsState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure we use the working key and model if empty or deprecated
      return {
        ...parsed,
        geminiApiKey: parsed.geminiApiKey || DEFAULT_GEMINI_KEY,
        geminiModel: parsed.geminiModel === 'gemini-1.5-flash' ? DEFAULT_MODEL : (parsed.geminiModel || DEFAULT_MODEL),
        provider: parsed.provider || 'gemini',
      };
    }
  } catch {}
  return {
    provider: 'gemini',
    geminiApiKey: DEFAULT_GEMINI_KEY,
    geminiModel: DEFAULT_MODEL,
    localEndpoint: 'http://localhost:11434',
    localModelName: 'qwen2.5:latest',
  };
}

export const useAISettingsStore = create<AISettingsState>((set, get) => {
  const initial = getInitialSettings();

  const persist = (updates: Partial<AISettingsState>) => {
    try {
      const state = { ...get(), ...updates };
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          provider: state.provider,
          localEndpoint: state.localEndpoint,
          localModelName: state.localModelName,
          geminiApiKey: state.geminiApiKey,
          geminiModel: state.geminiModel,
        })
      );
    } catch (err) {
      console.warn('Failed to save AI settings:', err);
    }
  };

  return {
    provider: (initial.provider as AIProvider) || 'gemini',
    localEndpoint: initial.localEndpoint || 'http://localhost:11434',
    localModelName: initial.localModelName || 'qwen2.5:latest',
    geminiApiKey: initial.geminiApiKey || DEFAULT_GEMINI_KEY,
    geminiModel: initial.geminiModel || DEFAULT_MODEL,

    setProvider: (provider) => {
      set({ provider });
      persist({ provider });
    },
    setLocalEndpoint: (localEndpoint) => {
      set({ localEndpoint });
      persist({ localEndpoint });
    },
    setLocalModelName: (localModelName) => {
      set({ localModelName });
      persist({ localModelName });
    },
    setGeminiApiKey: (geminiApiKey) => {
      set({ geminiApiKey });
      persist({ geminiApiKey });
    },
    setGeminiModel: (geminiModel) => {
      set({ geminiModel });
      persist({ geminiModel });
    },
  };
});
