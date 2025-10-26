import React from 'react';
import { AspectRatio, ASPECT_RATIOS } from '../types';
import { GenerateIcon } from './icons/GenerateIcon';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (aspectRatio: AspectRatio) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, aspectRatio, setAspectRatio, onSubmit, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700 sticky top-4 z-10">
      <div className="flex flex-col md:flex-row gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your vibe... e.g., 'rainy cyberpunk lo-fi'"
          className="w-full flex-grow bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-500 resize-none"
          rows={2}
          disabled={isLoading}
        />
        <div className="flex items-center gap-3">
            <select 
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                disabled={isLoading}
                className="bg-gray-900 border border-gray-600 rounded-lg p-3 h-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                aria-label="Aspect Ratio"
            >
                {ASPECT_RATIOS.map(ratio => (
                    <option key={ratio} value={ratio}>{ratio}</option>
                ))}
            </select>
            <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
            <GenerateIcon />
            {isLoading ? 'Generating...' : 'Generate'}
            </button>
        </div>
      </div>
    </div>
  );
};
