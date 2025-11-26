import React, { useState } from 'react';
import { StoryConfig, Genre } from '../types';

interface StoryFormProps {
  onGenerate: (config: StoryConfig) => void;
  isLoading: boolean;
}

export const StoryForm: React.FC<StoryFormProps> = ({ onGenerate, isLoading }) => {
  const [genre, setGenre] = useState<string>(Genre.FANTASY);
  const [hero, setHero] = useState<string>('');
  const [villain, setVillain] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (hero.trim() === '' || villain.trim() === '') {
      alert('Por favor, preencha o nome do Herói e do Vilão.');
      return;
    }
    onGenerate({ genre, hero, villain });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Defina sua História</h2>
      
      <div className="mb-6">
        <label htmlFor="genre" className="block text-gray-700 text-sm font-semibold mb-2">
          Gênero:
        </label>
        <select
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          disabled={isLoading}
        >
          {Object.values(Genre).map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="hero" className="block text-gray-700 text-sm font-semibold mb-2">
          Nome do Herói:
        </label>
        <input
          type="text"
          id="hero"
          value={hero}
          onChange={(e) => setHero(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          placeholder="Ex: Arthur, Elara, Kael"
          disabled={isLoading}
          required
        />
      </div>

      <div className="mb-8">
        <label htmlFor="villain" className="block text-gray-700 text-sm font-semibold mb-2">
          Nome do Vilão:
        </label>
        <input
          type="text"
          id="villain"
          value={villain}
          onChange={(e) => setVillain(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          placeholder="Ex: Malak, Xylos, Corvina"
          disabled={isLoading}
          required
        />
      </div>

      <button
        type="submit"
        className={`w-full py-3 px-6 rounded-md text-white font-bold text-lg transition-all duration-300
          ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
        disabled={isLoading}
      >
        {isLoading ? 'Gerando...' : 'Gerar História'}
      </button>
    </form>
  );
};