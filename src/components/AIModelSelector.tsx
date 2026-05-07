import { useState } from 'react';
import { useLanguage } from '@/lib/useLanguage';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'good' | 'better' | 'best';
  icon: string;
}

const aiModels: AIModel[] = [
  {
    id: 'groq-llama3-70b',
    name: 'Llama 3 70B',
    provider: 'Groq',
    description: 'Fast inference with excellent reasoning',
    speed: 'fast',
    quality: 'best',
    icon: '🚀',
  },
  {
    id: 'groq-mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: 'Groq',
    description: 'Balanced performance for most tasks',
    speed: 'fast',
    quality: 'better',
    icon: '⚡',
  },
  {
    id: 'groq-llama3-8b',
    name: 'Llama 3 8B',
    provider: 'Groq',
    description: 'Quick responses for simple tasks',
    speed: 'fast',
    quality: 'good',
    icon: '🏃',
  },
  {
    id: 'openai-gpt4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Advanced reasoning and analysis',
    speed: 'medium',
    quality: 'best',
    icon: '🧠',
  },
  {
    id: 'openai-gpt3.5',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    description: 'Reliable performance for everyday tasks',
    speed: 'fast',
    quality: 'better',
    icon: '💬',
  },
  {
    id: 'anthropic-claude',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: ' nuanced understanding and analysis',
    speed: 'medium',
    quality: 'best',
    icon: '🎯',
  },
];

interface AIModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  className?: string;
}

export function AIModelSelector({ selectedModel, onModelChange, className = '' }: AIModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  
  const selectedModelData = aiModels.find(model => model.id === selectedModel) || aiModels[0];

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'slow': return 'text-red-400';
      default: return 'text-textMuted';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'best': return 'text-purple-400';
      case 'better': return 'text-blue-400';
      case 'good': return 'text-textMuted';
      default: return 'text-textMuted';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/10"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{selectedModelData.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text">{selectedModelData.name}</span>
              <span className="text-xs text-textMuted">{selectedModelData.provider}</span>
            </div>
            <p className="text-xs text-textMuted">{selectedModelData.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-xs">
            <span className={getSpeedColor(selectedModelData.speed)}>
              {language === 'es' ? 'Veloz' : 'Fast'}
            </span>
            <span className={getQualityColor(selectedModelData.quality)}>
              {selectedModelData.quality}
            </span>
          </div>
          <svg
            className={`h-4 w-4 text-textMuted transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-xl border border-white/10 bg-background/95 backdrop-blur-sm shadow-lg">
          <div className="max-h-80 overflow-y-auto">
            {aiModels.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/5 focus:bg-white/5 focus:outline-none ${
                  selectedModel === model.id ? 'bg-white/5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{model.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text">{model.name}</span>
                      <span className="text-xs text-textMuted">{model.provider}</span>
                    </div>
                    <p className="text-xs text-textMuted">{model.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-3 text-xs">
                    <span className={getSpeedColor(model.speed)}>
                      {language === 'es' ? 'Veloz' : 'Fast'}
                    </span>
                    <span className={getQualityColor(model.quality)}>
                      {model.quality}
                    </span>
                  </div>
                  {selectedModel === model.id && (
                    <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
