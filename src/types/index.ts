// Core game types
export interface Animal {
  id: string;
  name: string;
  emoji: string; // Using emojis for easy visual representation
  imageUrl?: string; // Optional for custom images
  soundUrl?: string; // Animal sound file
  difficulty: DifficultyLevel;
  habitat: Habitat;
  unlocked: boolean;
}

export interface GameRound {
  id: string;
  targetAnimal: Animal;
  options: Animal[];
  difficulty: DifficultyLevel;
  timeLimit?: number; // in seconds
}

export interface GameSession {
  id: string;
  mode: GameMode;
  difficulty: DifficultyLevel;
  rounds: GameRound[];
  currentRoundIndex: number;
  score: number;
  stars: number;
  startTime: number;
  endTime?: number;
}

export interface PlayerProgress {
  totalGamesPlayed: number;
  totalStars: number;
  unlockedAnimals: string[];
  unlockedHabitats: string[];
  achievements: Achievement[];
  lastPlayedDate: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate?: string;
  requirement: {
    type: 'games_played' | 'stars_earned' | 'perfect_rounds' | 'animals_unlocked';
    value: number;
  };
}

export type GameMode = 'free-play' | 'timed' | 'story';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type Habitat = 'farm' | 'wild' | 'ocean' | 'forest' | 'jungle' | 'arctic' | 'desert';

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  autoPlayPrompts: boolean;
  difficulty: DifficultyLevel;
  timeLimit: number;
  animationSpeed: 'slow' | 'normal' | 'fast';
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface FeedbackState {
  type: 'correct' | 'incorrect' | 'encouraging' | null;
  message: string;
  showConfetti: boolean;
}

// Story mode specific types
export interface StoryChapter {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  animals: Animal[];
  unlockRequirement?: {
    starsRequired: number;
    previousChapter?: string;
  };
}

// Sticker collection types
export type StickerRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Sticker {
  id: string;
  animalId: string;
  name: string;
  emoji: string;
  rarity: StickerRarity;
  collectedDate?: string;
  isNew?: boolean;
}

export interface StickerCollection {
  stickers: { [animalId: string]: Sticker };
  totalCollected: number;
  rarityCount: { [key in StickerRarity]: number };
  completionPercentage: number;
}

export interface StickerReward {
  sticker: Sticker;
  isNewSticker: boolean;
  rarityBonus: number;
}