import { create } from 'zustand';
import { AIMessage, GenerationStageId } from '../types/ai';
import { MOCK_AI_MESSAGES } from '../mock/mockData';
import { aiService } from '../services/ai/aiService';
import { HouseDesign } from '../types/geometry';

interface AIAssistantState {
  messages: AIMessage[];
  isThinking: boolean;
  activeGenerationStage: GenerationStageId | null;
  generationProgress: number;
  generationStatusText: string;

  sendMessage: (
    projectId: string,
    content: string,
    currentDesign?: HouseDesign,
    selectedElementId?: string | null
  ) => Promise<AIMessage>;
  clearHistory: () => void;
  setGenerationProgress: (stage: GenerationStageId | null, progress: number, text: string) => void;
}

export const useAIAssistantStore = create<AIAssistantState>((set, get) => ({
  messages: MOCK_AI_MESSAGES,
  isThinking: false,
  activeGenerationStage: null,
  generationProgress: 0,
  generationStatusText: '',

  sendMessage: async (projectId, content, currentDesign, selectedElementId) => {
    const userMsg: AIMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isThinking: true,
    }));

    try {
      const response = await aiService.sendChatMessage(
        projectId,
        content,
        get().messages,
        currentDesign,
        selectedElementId
      );

      set((state) => ({
        messages: [...state.messages, response],
        isThinking: false,
      }));

      return response;
    } catch (err) {
      const errorMsg: AIMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an error processing your architectural instruction. Please check the network or try again.',
        timestamp: new Date().toISOString(),
      };
      set((state) => ({
        messages: [...state.messages, errorMsg],
        isThinking: false,
      }));
      return errorMsg;
    }
  },

  clearHistory: () => set({ messages: [] }),

  setGenerationProgress: (stage, progress, text) =>
    set({
      activeGenerationStage: stage,
      generationProgress: progress,
      generationStatusText: text,
    }),
}));
