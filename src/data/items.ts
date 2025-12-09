import { Item, Category } from '../types';
import { ANIMALS } from './animals';
import { NUMBERS } from './numbers';
import { ALPHABETS } from './alphabets';
import { COLORS } from './colors';
import { FRUITS } from './fruits';

// All items organized by category
export const ALL_ITEMS: { [key in Category]: Item[] } = {
  animals: ANIMALS,
  numbers: NUMBERS,
  alphabets: ALPHABETS,
  colors: COLORS,
  fruits: FRUITS,
};

// Flattened array of all items
export const ITEMS: Item[] = [
  ...ANIMALS,
  ...NUMBERS,
  ...ALPHABETS,
  ...COLORS,
  ...FRUITS,
];

// Helper functions for filtering items
export const getItemsByCategory = (category: Category): Item[] => {
  return ALL_ITEMS[category] || [];
};

export const getItemsByDifficulty = (category: Category, difficulty: string): Item[] => {
  return getItemsByCategory(category).filter(item => item.difficulty === difficulty);
};

export const getUnlockedItems = (category: Category): Item[] => {
  return getItemsByCategory(category).filter(item => item.unlocked);
};

export const getCategoryInfo = () => {
  return Object.keys(ALL_ITEMS).map((category: string) => {
    const categoryItems = ALL_ITEMS[category as Category];
    const totalItems = categoryItems.length;
    const unlockedItems = categoryItems.filter(item => item.unlocked).length;
    
    return {
      category: category as Category,
      totalItems,
      unlockedItems,
      completionPercentage: Math.round((unlockedItems / totalItems) * 100),
      emoji: getCategoryEmoji(category as Category),
      displayName: getCategoryDisplayName(category as Category),
    };
  });
};

export const getCategoryEmoji = (category: Category): string => {
  const emojiMap: { [key in Category]: string } = {
    animals: '🐾',
    numbers: '🔢',
    alphabets: '🔤',
    colors: '🎨',
    fruits: '🍎',
  };
  return emojiMap[category];
};

export const getCategoryDisplayName = (category: Category): string => {
  const displayNameMap: { [key in Category]: string } = {
    animals: 'Animals',
    numbers: 'Numbers',
    alphabets: 'Letters',
    colors: 'Colors',
    fruits: 'Fruits',
  };
  return displayNameMap[category];
};

// Export individual categories for backward compatibility
export { ANIMALS, NUMBERS, ALPHABETS, COLORS, FRUITS };