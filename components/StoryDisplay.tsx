import React from 'react';
import { StoryOutput } from '../types';

interface StoryDisplayProps {
  story: StoryOutput;
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ story }) => {
  return (
    <div className="bg-white rounded-lg p-6 md:p-8 shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">{story.title}</h2>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-blue-200 pb-2">Personagens</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {story.characters.map((char, index) => (
            <li key={index} className="text-base">{char}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-blue-200 pb-2">Enredo</h3>
        {story.plot.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-3 text-gray-700 leading-relaxed text-base">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};