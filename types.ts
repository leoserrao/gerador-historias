export interface StoryConfig {
  genre: string;
  hero: string;
  villain: string;
}

export interface StoryOutput {
  title: string;
  characters: string[];
  plot: string;
}

export enum Genre {
  FANTASY = 'Fantasia',
  SCIFI = 'Ficção Científica',
  MYSTERY = 'Mistério',
  ADVENTURE = 'Aventura',
  HORROR = 'Terror',
  ROMANCE = 'Romance',
}