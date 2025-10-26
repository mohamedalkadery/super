import React, { useState, useCallback } from 'react';
import { generateWallpapers } from './services/geminiService';
import { PromptForm } from './components/PromptForm';
import { ImageGrid } from './components/ImageGrid';
import { FullScreenModal } from './components/FullScreenModal';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LogoIcon } from './components/icons/LogoIcon';
import { AspectRatio } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [initialPrompt, setInitialPrompt] = useState<string>('');

  const handleGenerate = useCallback(async (currentPrompt: string) => {
    if (!currentPrompt.trim()) {
      setError('Please enter a prompt to generate wallpapers.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setImages([]);
    setInitialPrompt(currentPrompt); // Save prompt for remixing

    try {
      const generatedImages = await generateWallpapers(currentPrompt, aspectRatio);
      setImages(generatedImages);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [aspectRatio]);

  const handleRemix = useCallback(() => {
    if (initialPrompt) {
      setSelectedImage(null); // Close modal before remixing
      handleGenerate(initialPrompt);
    }
  }, [initialPrompt, handleGenerate]);
  
  const handleDownload = useCallback(() => {
    if (!selectedImage) return;
    const link = document.createElement('a');
    link.href = selectedImage;
    const fileName = `${initialPrompt.substring(0, 20).replace(/\s+/g, '_')}_wallpaper.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedImage, initialPrompt]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4">
      <header className="w-full max-w-4xl text-center my-8">
        <div className="flex items-center justify-center gap-4 mb-2">
            <LogoIcon />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                Vibe Wallpaper
            </h1>
        </div>
        <p className="text-gray-400 text-lg">Craft the perfect wallpaper for your phone.</p>
      </header>
      
      <main className="w-full max-w-4xl flex-grow">
        <PromptForm
          prompt={prompt}
          setPrompt={setPrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          onSubmit={() => handleGenerate(prompt)}
          isLoading={isLoading}
        />

        {error && (
          <div className="mt-6 text-center bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
            <div className='flex flex-col items-center justify-center text-center mt-12'>
                <LoadingSpinner />
                <p className='mt-4 text-lg text-gray-400'>Generating your vibes...</p>
                <p className='text-sm text-gray-500'>This can take a moment.</p>
            </div>
        )}

        {!isLoading && images.length === 0 && !error && (
            <div className="text-center mt-12 text-gray-500">
                <p>Describe your mood, a scene, or a style to begin.</p>
                <p className="mt-2 text-sm">e.g., "Bioluminescent forest at night"</p>
            </div>
        )}

        <ImageGrid images={images} onImageClick={setSelectedImage} />
      </main>

      {selectedImage && (
        <FullScreenModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={handleDownload}
          onRemix={handleRemix}
          isLoadingRemix={isLoading}
        />
      )}

      <footer className="w-full max-w-4xl text-center py-6 mt-8 text-gray-600 text-sm">
        <p>Powered by Gemini</p>
      </footer>
    </div>
  );
};

export default App;
