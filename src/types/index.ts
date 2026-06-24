// Core game types
export type Category = 'animals' | 'numbers' | 'alphabets' | 'colors' | 'fruits';

export interface Item {
  id: string;
  name: string;
  emoji: string; // Legacy fallback for older stickers and saved data
  imageUrl?: string; // Optional for custom images
  soundUrl?: string; // Sound file for the item
  visual?: ItemVisual;
  content?: LocalizedItemContentMap;
  difficulty: DifficultyLevel;
  category: Category;
  subcategory?: string; // For animals: habitat, for others: grouping
  unlocked: boolean;
}

export type LocaleCode = 'en';

export interface LocalizedItemContent {
  name?: string;
  prompt?: string;
  hint?: string;
  example?: string;
  soundText?: string;
}

export type LocalizedItemContentMap = {
  [key in LocaleCode]?: LocalizedItemContent;
};

export interface ItemVisual {
  kind: 'animal' | 'number' | 'letter' | 'color' | 'fruit';
  background: string;
  accent: string;
  secondaryAccent?: string;
  textColor?: string;
  label?: string;
  detail?: string;
  pattern?: 'none' | 'spots' | 'stripes' | 'dots';
  value?: number;
}

// Keep Animal interface for backward compatibility
export interface Animal extends Item {
  habitat: Habitat;
}

export interface GameRound {
  id: string;
  targetItem: Item;
  options: Item[];
  difficulty: DifficultyLevel;
  timeLimit?: number; // in seconds
  optionCount?: number;
}

export interface RoundOutcome {
  correct: boolean;
  attempts: number;
  selectedItemId?: string;
  timedOut?: boolean;
}

export interface RoundResult extends RoundOutcome {
  roundId: string;
  targetItemId: string;
  targetItemName: string;
  category: Category;
  difficulty: DifficultyLevel;
  mode: GameMode;
}

export interface GameSession {
  id: string;
  mode: GameMode;
  category: Category;
  difficulty: DifficultyLevel;
  rounds: GameRound[];
  currentRoundIndex: number;
  score: number;
  stars: number;
  startTime: number;
  endTime?: number;
  correctStreak?: number;
  roundResults: RoundResult[];
}

export interface PlayerProgress {
  totalGamesPlayed: number;
  totalStars: number;
  unlockedItems: string[];
  unlockedCategories: Category[];
  achievements: Achievement[];
  lastPlayedDate: string;
  perfectRounds?: number;
  categoryStats?: { [key in Category]?: CategoryProgressStats };
  difficultyStats?: { [key in DifficultyLevel]?: ProgressBreakdown };
  modeStats?: { [key in GameMode]?: ProgressBreakdown };
  itemStats?: { [itemId: string]: ItemProgressStats };
  // Keep for backward compatibility
  unlockedAnimals?: string[];
  unlockedHabitats?: string[];
}

export interface ProgressBreakdown {
  gamesPlayed: number;
  roundsPlayed: number;
  correctRounds: number;
  bestScore: number;
  lastPlayedDate?: string;
}

export interface CategoryProgressStats extends ProgressBreakdown {
  byDifficulty?: { [key in DifficultyLevel]?: ProgressBreakdown };
  byMode?: { [key in GameMode]?: ProgressBreakdown };
}

export interface ItemProgressStats {
  itemId: string;
  itemName: string;
  category: Category;
  difficulty: DifficultyLevel;
  roundsPlayed: number;
  correctRounds: number;
  missedRounds: number;
  attempts: number;
  extraAttempts: number;
  lastPlayedDate?: string;
  lastCorrectDate?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate?: string;
  requirement: {
    type: 'games_played' | 'stars_earned' | 'perfect_rounds' | 'items_unlocked' | 'categories_unlocked';
    value: number;
  };
}

export type GameMode = 'free-play' | 'timed' | 'story' | 'practice';
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
  items: Item[];
  category: Category;
  unlockRequirement?: {
    starsRequired: number;
    previousChapter?: string;
  };
}

// Sticker collection types
export type StickerRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Sticker {
  id: string;
  itemId: string;
  name: string;
  emoji: string;
  category: Category;
  rarity: StickerRarity;
  collectedDate?: string;
  isNew?: boolean;
}

export interface StickerCollection {
  stickers: { [itemId: string]: Sticker };
  totalCollected: number;
  rarityCount: { [key in StickerRarity]: number };
  completionPercentage: number;
  categoryProgress: { [key in Category]: number };
}

export interface StickerReward {
  sticker: Sticker;
  isNewSticker: boolean;
  rarityBonus: number;
}
