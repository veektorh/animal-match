import { Animal, Habitat, Achievement, StoryChapter } from '../types';

// Animal library with emojis for easy visual representation
export const ANIMALS: Animal[] = [
  // Easy - Farm Animals
  { id: 'cow', name: 'Cow', emoji: '🐄', difficulty: 'easy', habitat: 'farm', unlocked: true },
  { id: 'pig', name: 'Pig', emoji: '🐷', difficulty: 'easy', habitat: 'farm', unlocked: true },
  { id: 'chicken', name: 'Chicken', emoji: '🐔', difficulty: 'easy', habitat: 'farm', unlocked: true },
  { id: 'horse', name: 'Horse', emoji: '🐎', difficulty: 'easy', habitat: 'farm', unlocked: true },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', difficulty: 'easy', habitat: 'farm', unlocked: true },
  { id: 'duck', name: 'Duck', emoji: '🦆', difficulty: 'easy', habitat: 'farm', unlocked: true },

  // Easy - Common Wild Animals
  { id: 'cat', name: 'Cat', emoji: '🐱', difficulty: 'easy', habitat: 'wild', unlocked: true },
  { id: 'dog', name: 'Dog', emoji: '🐶', difficulty: 'easy', habitat: 'wild', unlocked: true },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', difficulty: 'easy', habitat: 'wild', unlocked: true },
  { id: 'frog', name: 'Frog', emoji: '🐸', difficulty: 'easy', habitat: 'wild', unlocked: true },

  // Medium - Forest Animals
  { id: 'bear', name: 'Bear', emoji: '🐻', difficulty: 'medium', habitat: 'forest', unlocked: false },
  { id: 'fox', name: 'Fox', emoji: '🦊', difficulty: 'medium', habitat: 'forest', unlocked: false },
  { id: 'wolf', name: 'Wolf', emoji: '🐺', difficulty: 'medium', habitat: 'forest', unlocked: false },
  { id: 'deer', name: 'Deer', emoji: '🦌', difficulty: 'medium', habitat: 'forest', unlocked: false },
  { id: 'owl', name: 'Owl', emoji: '🦉', difficulty: 'medium', habitat: 'forest', unlocked: false },
  { id: 'squirrel', name: 'Squirrel', emoji: '🐿️', difficulty: 'medium', habitat: 'forest', unlocked: false },

  // Medium - Ocean Animals
  { id: 'fish', name: 'Fish', emoji: '🐟', difficulty: 'medium', habitat: 'ocean', unlocked: false },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬', difficulty: 'medium', habitat: 'ocean', unlocked: false },
  { id: 'whale', name: 'Whale', emoji: '🐋', difficulty: 'medium', habitat: 'ocean', unlocked: false },
  { id: 'octopus', name: 'Octopus', emoji: '🐙', difficulty: 'medium', habitat: 'ocean', unlocked: false },
  { id: 'crab', name: 'Crab', emoji: '🦀', difficulty: 'medium', habitat: 'ocean', unlocked: false },

  // Hard - Jungle Animals
  { id: 'lion', name: 'Lion', emoji: '🦁', difficulty: 'hard', habitat: 'jungle', unlocked: false },
  { id: 'tiger', name: 'Tiger', emoji: '🐅', difficulty: 'hard', habitat: 'jungle', unlocked: false },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', difficulty: 'hard', habitat: 'jungle', unlocked: false },
  { id: 'monkey', name: 'Monkey', emoji: '🐵', difficulty: 'hard', habitat: 'jungle', unlocked: false },
  { id: 'gorilla', name: 'Gorilla', emoji: '🦍', difficulty: 'hard', habitat: 'jungle', unlocked: false },
  { id: 'parrot', name: 'Parrot', emoji: '🦜', difficulty: 'hard', habitat: 'jungle', unlocked: false },

  // Hard - Arctic Animals
  { id: 'penguin', name: 'Penguin', emoji: '🐧', difficulty: 'hard', habitat: 'arctic', unlocked: false },
  { id: 'polar-bear', name: 'Polar Bear', emoji: '🐻‍❄️', difficulty: 'hard', habitat: 'arctic', unlocked: false },
  { id: 'seal', name: 'Seal', emoji: '🦭', difficulty: 'hard', habitat: 'arctic', unlocked: false },

  // Hard - Desert Animals
  { id: 'camel', name: 'Camel', emoji: '🐪', difficulty: 'hard', habitat: 'desert', unlocked: false },
  { id: 'snake', name: 'Snake', emoji: '🐍', difficulty: 'hard', habitat: 'desert', unlocked: false },
  { id: 'lizard', name: 'Lizard', emoji: '🦎', difficulty: 'hard', habitat: 'desert', unlocked: false },
];

// Achievements system
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-game',
    name: 'First Steps',
    description: 'Play your first game!',
    icon: '🌟',
    requirement: { type: 'games_played', value: 1 }
  },
  {
    id: 'animal-lover',
    name: 'Animal Lover',
    description: 'Play 10 games',
    icon: '❤️',
    requirement: { type: 'games_played', value: 10 }
  },
  {
    id: 'star-collector',
    name: 'Star Collector',
    description: 'Earn 50 stars',
    icon: '⭐',
    requirement: { type: 'stars_earned', value: 50 }
  },
  {
    id: 'perfect-player',
    name: 'Perfect Player',
    description: 'Get 5 perfect rounds',
    icon: '🏆',
    requirement: { type: 'perfect_rounds', value: 5 }
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Unlock 15 animals',
    icon: '🗺️',
    requirement: { type: 'animals_unlocked', value: 15 }
  }
];

// Story mode chapters
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'farm-adventure',
    title: 'Farm Adventure',
    description: 'Help farmer Joe find all his farm animals!',
    backgroundImage: '/assets/images/farm-background.jpg',
    animals: ANIMALS.filter(animal => animal.habitat === 'farm')
  },
  {
    id: 'forest-friends',
    title: 'Forest Friends',
    description: 'Explore the magical forest and meet woodland creatures!',
    backgroundImage: '/assets/images/forest-background.jpg',
    animals: ANIMALS.filter(animal => animal.habitat === 'forest'),
    unlockRequirement: { starsRequired: 10, previousChapter: 'farm-adventure' }
  },
  {
    id: 'ocean-expedition',
    title: 'Ocean Expedition',
    description: 'Dive deep into the ocean and discover sea life!',
    backgroundImage: '/assets/images/ocean-background.jpg',
    animals: ANIMALS.filter(animal => animal.habitat === 'ocean'),
    unlockRequirement: { starsRequired: 25, previousChapter: 'forest-friends' }
  },
  {
    id: 'jungle-safari',
    title: 'Jungle Safari',
    description: 'Go on an exciting safari through the wild jungle!',
    backgroundImage: '/assets/images/jungle-background.jpg',
    animals: ANIMALS.filter(animal => animal.habitat === 'jungle'),
    unlockRequirement: { starsRequired: 50, previousChapter: 'ocean-expedition' }
  }
];

// Utility functions for working with animal data
export const getAnimalsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Animal[] => {
  return ANIMALS.filter(animal => animal.difficulty === difficulty);
};

export const getAnimalsByHabitat = (habitat: Habitat): Animal[] => {
  return ANIMALS.filter(animal => animal.habitat === habitat);
};

export const getUnlockedAnimals = (unlockedIds: string[]): Animal[] => {
  return ANIMALS.filter(animal => animal.unlocked || unlockedIds.includes(animal.id));
};

export const getRandomAnimals = (count: number, difficulty?: 'easy' | 'medium' | 'hard', exclude?: string[]): Animal[] => {
  let pool = ANIMALS;
  
  if (difficulty) {
    pool = getAnimalsByDifficulty(difficulty);
  }
  
  if (exclude) {
    pool = pool.filter(animal => !exclude.includes(animal.id));
  }
  
  // Shuffle and take the requested count
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Encouraging messages for different scenarios
export const ENCOURAGEMENT_MESSAGES = {
  correct: [
    "Great job! You found the {animal}!",
    "Excellent! That's the {animal}!",
    "Perfect! You're amazing!",
    "Wonderful! You got it right!",
    "Fantastic work!"
  ],
  incorrect: [
    "Not quite! Try again!",
    "Oops! Give it another try!",
    "Almost there! You can do it!",
    "That's okay! Try again!",
    "Good try! Look for the {animal}!"
  ],
  timeUp: [
    "Time's up! Let's try another one!",
    "No worries! Here's another chance!",
    "That's okay! Let's keep playing!"
  ]
};

export const getRandomMessage = (type: keyof typeof ENCOURAGEMENT_MESSAGES, animalName?: string): string => {
  const messages = ENCOURAGEMENT_MESSAGES[type];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  return animalName ? randomMessage.replace('{animal}', animalName) : randomMessage;
};