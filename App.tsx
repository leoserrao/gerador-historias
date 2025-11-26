import React, { useState, useCallback } from 'react';
import { StoryForm } from './components/StoryForm';
import { StoryDisplay } from './components/StoryDisplay';
import { StoryConfig, StoryOutput } from './types';
import { generateStory } from './services/geminiService';

const App: React.FC = () => {
  const [storyOutput, setStoryOutput] = useState<StoryOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStory = useCallback(async (config: StoryConfig) => {
    setLoading(true);
    setError(null);
    setStoryOutput(null);
    try {
      const generated = await generateStory(config);
      setStoryOutput(generated);
    } catch (err: any) {
      console.error('Failed to generate story:', err);
      setError(err.message || 'Ocorreu um erro ao gerar a história.');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-8 text-center drop-shadow-md">
        Gerador de Histórias Mágico
      </h1>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-6 md:p-8 space-y-8">
        <StoryForm onGenerate={handleGenerateStory} isLoading={loading} />

        {loading && (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <div className="w-6 h-6 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
            <span>Gerando sua história...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erro: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {storyOutput && <StoryDisplay story={storyOutput} />}
      </div>
    </div>
  );
};

export default App;