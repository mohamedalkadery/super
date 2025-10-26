import React, { useEffect } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { RemixIcon } from './icons/RemixIcon';
import { CloseIcon } from './icons/CloseIcon';

interface FullScreenModalProps {
  imageUrl: string;
  onClose: () => void;
  onDownload: () => void;
  onRemix: () => void;
  isLoadingRemix: boolean;
}

export const FullScreenModal: React.FC<FullScreenModalProps> = ({ imageUrl, onClose, onDownload, onRemix, isLoadingRemix }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full h-full max-w-sm max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Selected wallpaper"
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center gap-4">
            <button
                onClick={onDownload}
                className="flex items-center gap-2 bg-gray-200 text-gray-900 font-bold py-3 px-6 rounded-full hover:bg-white transition-colors transform hover:scale-105 shadow-lg"
            >
                <DownloadIcon />
                Download
            </button>
            <button
                onClick={onRemix}
                disabled={isLoadingRemix}
                className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-full hover:bg-indigo-500 disabled:bg-indigo-800 transition-colors transform hover:scale-105 shadow-lg"
            >
                <RemixIcon />
                Remix
            </button>
        </div>
         <button
            onClick={onClose}
            className="absolute top-0 right-0 m-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
            aria-label="Close"
        >
            <CloseIcon />
        </button>
      </div>
    </div>
  );
};
