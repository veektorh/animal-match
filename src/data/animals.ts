import { Animal, Habitat, Achievement, StoryChapter, Category } from '../types';

// Animal library with emojis for easy visual representation  
export const ANIMALS: Animal[] = [
  // Easy - Farm Animals
  { id: 'cow', name: 'Cow', emoji: '🐄', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'farm', unlocked: true },
  { id: 'pig', name: 'Pig', emoji: '🐷', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'farm', unlocked: true },
  { id: 'chicken', name: 'Chicken', emoji: '🐔', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'farm', unlocked: true },
  { id: 'horse', name: 'Horse', emoji: '🐎', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'farm', unlocked: true },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'farm', unlocked: true },
  { id: 'duck', name: 'Duck', emoji: '🦆', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'farm', unlocked: true },

  // Easy - Common Wild Animals
  { id: 'cat', name: 'Cat', emoji: '🐱', difficulty: 'easy', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'dog', name: 'Dog', emoji: '🐶', difficulty: 'easy', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', difficulty: 'easy', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'frog', name: 'Frog', emoji: '🐸', difficulty: 'easy', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },

  // Medium - Forest Animals
  { id: 'bear', name: 'Bear', emoji: '🐻', difficulty: 'medium', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },
  { id: 'fox', name: 'Fox', emoji: '🦊', difficulty: 'medium', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },
  { id: 'wolf', name: 'Wolf', emoji: '🐺', difficulty: 'medium', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },
  { id: 'deer', name: 'Deer', emoji: '🦌', difficulty: 'medium', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },
  { id: 'owl', name: 'Owl', emoji: '🦉', difficulty: 'medium', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },
  { id: 'squirrel', name: 'Squirrel', emoji: '🐿️', difficulty: 'medium', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },

  // Medium - Ocean Animals
  { id: 'fish', name: 'Fish', emoji: '🐟', difficulty: 'medium', category: 'animals', subcategory: 'ocean', habitat: 'ocean', unlocked: true },
  { id: 'dolphin', name: 'Dolphin', emoji: '🐬', difficulty: 'medium', category: 'animals', subcategory: 'ocean', habitat: 'ocean', unlocked: true },
  { id: 'whale', name: 'Whale', emoji: '🐋', difficulty: 'medium', category: 'animals', subcategory: 'ocean', habitat: 'ocean', unlocked: true },
  { id: 'octopus', name: 'Octopus', emoji: '🐙', difficulty: 'medium', category: 'animals', subcategory: 'ocean', habitat: 'ocean', unlocked: true },
  { id: 'crab', name: 'Crab', emoji: '🦀', difficulty: 'medium', category: 'animals', subcategory: 'ocean', habitat: 'ocean', unlocked: true },

  // Hard - Jungle Animals
  { id: 'lion', name: 'Lion', emoji: '🦁', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'tiger', name: 'Tiger', emoji: '🐅', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'monkey', name: 'Monkey', emoji: '🐵', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'gorilla', name: 'Gorilla', emoji: '🦍', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'parrot', name: 'Parrot', emoji: '🦜', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },

  // Hard - Arctic Animals
  { id: 'penguin', name: 'Penguin', emoji: '🐧', difficulty: 'hard', category: 'animals', subcategory: 'arctic', habitat: 'arctic', unlocked: true },
  { id: 'polar-bear', name: 'Polar Bear', emoji: '🐻‍❄️', difficulty: 'hard', category: 'animals', subcategory: 'arctic', habitat: 'arctic', unlocked: true },
  { id: 'seal', name: 'Seal', emoji: '🦭', difficulty: 'hard', category: 'animals', subcategory: 'arctic', habitat: 'arctic', unlocked: true },

  // Hard - Desert Animals
  { id: 'camel', name: 'Camel', emoji: '🐪', difficulty: 'hard', category: 'animals', subcategory: 'desert', habitat: 'desert', unlocked: true },
  { id: 'snake', name: 'Snake', emoji: '🐍', difficulty: 'hard', category: 'animals', subcategory: 'desert', habitat: 'desert', unlocked: true },
  { id: 'lizard', name: 'Lizard', emoji: '🦎', difficulty: 'hard', category: 'animals', subcategory: 'desert', habitat: 'desert', unlocked: true },

  // Additional Easy Animals - More Farm & Pets
  { id: 'goat', name: 'Goat', emoji: '🐐', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'farm', unlocked: true },
  { id: 'turkey', name: 'Turkey', emoji: '🦃', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'farm', unlocked: true },
  { id: 'rooster', name: 'Rooster', emoji: '🐓', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'farm', unlocked: true },
  { id: 'mouse', name: 'Mouse', emoji: '🐭', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'wild', unlocked: true },
  { id: 'hamster', name: 'Hamster', emoji: '🐹', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'wild', unlocked: true },
  { id: 'turtle', name: 'Turtle', emoji: '🐢', difficulty: 'easy', category: 'animals', subcategory: 'farm', habitat: 'wild', unlocked: true },

  // Additional Medium Animals - More Forest Creatures
  { id: 'raccoon', name: 'Raccoon', emoji: '🦝', difficulty: 'medium', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },
  { id: 'beaver', name: 'Beaver', emoji: '🦫', difficulty: 'medium', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },
  { id: 'hedgehog', name: 'Hedgehog', emoji: '🦔', difficulty: 'medium', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },
  { id: 'bat', name: 'Bat', emoji: '🦇', difficulty: 'medium', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },
  { id: 'woodpecker', name: 'Woodpecker', emoji: '🐦', difficulty: 'medium', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },

  // Additional Ocean/Water Animals
  { id: 'shark', name: 'Shark', emoji: '🦈', difficulty: 'medium', category: 'animals', subcategory: 'ocean', habitat: 'ocean', unlocked: true },
  { id: 'seahorse', name: 'Seahorse', emoji: '🐠', difficulty: 'medium', category: 'animals', subcategory: 'ocean', habitat: 'ocean', unlocked: true },
  { id: 'jellyfish', name: 'Jellyfish', emoji: '🪼', difficulty: 'medium', category: 'animals', subcategory: 'ocean', habitat: 'ocean', unlocked: true },
  { id: 'starfish', name: 'Starfish', emoji: '✴️', difficulty: 'medium', category: 'animals', subcategory: 'ocean', habitat: 'ocean', unlocked: true },
  { id: 'lobster', name: 'Lobster', emoji: '🦞', difficulty: 'medium', category: 'animals', subcategory: 'ocean', habitat: 'ocean', unlocked: true },
  { id: 'shrimp', name: 'Shrimp', emoji: '🦐', difficulty: 'medium', category: 'animals', subcategory: 'ocean', habitat: 'ocean', unlocked: true },

  // Additional Jungle/Safari Animals
  { id: 'giraffe', name: 'Giraffe', emoji: '🦒', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'zebra', name: 'Zebra', emoji: '🦓', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'rhinoceros', name: 'Rhinoceros', emoji: '🦏', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'hippopotamus', name: 'Hippopotamus', emoji: '🦛', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'leopard', name: 'Leopard', emoji: '🐆', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'cheetah', name: 'Cheetah', emoji: '🐆', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'flamingo', name: 'Flamingo', emoji: '🦩', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },
  { id: 'toucan', name: 'Toucan', emoji: '🦜', difficulty: 'hard', category: 'animals', subcategory: 'jungle', habitat: 'jungle', unlocked: true },

  // Additional Arctic/Cold Climate Animals
  { id: 'walrus', name: 'Walrus', emoji: '🦭', difficulty: 'hard', category: 'animals', subcategory: 'arctic', habitat: 'arctic', unlocked: true },
  { id: 'arctic-fox', name: 'Arctic Fox', emoji: '🦊', difficulty: 'hard', category: 'animals', subcategory: 'arctic', habitat: 'arctic', unlocked: true },
  { id: 'reindeer', name: 'Reindeer', emoji: '🦌', difficulty: 'hard', category: 'animals', subcategory: 'arctic', habitat: 'arctic', unlocked: true },
  { id: 'moose', name: 'Moose', emoji: '🫎', difficulty: 'hard', category: 'animals', subcategory: 'arctic', habitat: 'arctic', unlocked: true },  // Additional Desert Animals
  { id: 'scorpion', name: 'Scorpion', emoji: '🦂', difficulty: 'hard', category: 'animals', subcategory: 'desert', habitat: 'desert', unlocked: true },
  { id: 'fennec-fox', name: 'Fennec Fox', emoji: '🦊', difficulty: 'hard', category: 'animals', subcategory: 'desert', habitat: 'desert', unlocked: true },

  // Flying Animals (Various Habitats)
  { id: 'eagle', name: 'Eagle', emoji: '🦅', difficulty: 'medium', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'swan', name: 'Swan', emoji: '🦢', difficulty: 'medium', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'peacock', name: 'Peacock', emoji: '🦚', difficulty: 'medium', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'hummingbird', name: 'Hummingbird', emoji: '🐦', difficulty: 'medium', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },

  // Insects & Small Creatures
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋', difficulty: 'easy', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'bee', name: 'Bee', emoji: '🐝', difficulty: 'easy', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'ladybug', name: 'Ladybug', emoji: '🐞', difficulty: 'easy', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'ant', name: 'Ant', emoji: '🐜', difficulty: 'easy', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'spider', name: 'Spider', emoji: '🕷️', difficulty: 'medium', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'caterpillar', name: 'Caterpillar', emoji: '🐛', difficulty: 'easy', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },

  // Exotic/Special Animals
  { id: 'panda', name: 'Panda', emoji: '🐼', difficulty: 'hard', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },
  { id: 'koala', name: 'Koala', emoji: '🐨', difficulty: 'hard', category: 'animals', subcategory: 'forest', habitat: 'forest', unlocked: true },
  { id: 'kangaroo', name: 'Kangaroo', emoji: '🦘', difficulty: 'hard', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'alpaca', name: 'Alpaca', emoji: '🦙', difficulty: 'medium', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },

  // Prehistoric/Fantasy (for advanced learners)
  { id: 'dinosaur', name: 'Dinosaur', emoji: '🦕', difficulty: 'hard', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'dragon', name: 'Dragon', emoji: '🐉', difficulty: 'hard', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄', difficulty: 'hard', category: 'animals', subcategory: 'wild', habitat: 'wild', unlocked: true },
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
    requirement: { type: 'items_unlocked', value: 15 }
  }
];

// Story mode chapters
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'farm-adventure',
    title: 'Farm Adventure',
    description: 'Help farmer Joe find all his farm animals!',
    backgroundImage: '/assets/images/farm-background.jpg',
    category: 'animals' as Category,
    items: ANIMALS.filter(animal => animal.habitat === 'farm')
  },
  {
    id: 'forest-friends',
    title: 'Forest Friends',
    description: 'Explore the magical forest and meet woodland creatures!',
    backgroundImage: '/assets/images/forest-background.jpg',
    category: 'animals' as Category,
    items: ANIMALS.filter(animal => animal.habitat === 'forest'),
    unlockRequirement: { starsRequired: 10, previousChapter: 'farm-adventure' }
  },
  {
    id: 'ocean-expedition',
    title: 'Ocean Expedition',
    description: 'Dive deep into the ocean and discover sea life!',
    backgroundImage: '/assets/images/ocean-background.jpg',
    category: 'animals' as Category,
    items: ANIMALS.filter(animal => animal.habitat === 'ocean'),
    unlockRequirement: { starsRequired: 25, previousChapter: 'forest-friends' }
  },
  {
    id: 'jungle-safari',
    title: 'Jungle Safari',
    description: 'Go on an exciting safari through the wild jungle!',
    backgroundImage: '/assets/images/jungle-background.jpg',
    category: 'animals' as Category,
    items: ANIMALS.filter(animal => animal.habitat === 'jungle'),
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
