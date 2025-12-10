import { Item } from '../types';

// Fruits
export const FRUITS: Item[] = [
  // Easy fruits (common, recognizable)
  { id: 'apple', name: 'Apple', emoji: '🍎', difficulty: 'easy', category: 'fruits', subcategory: 'common', unlocked: true },
  { id: 'banana', name: 'Banana', emoji: '🍌', difficulty: 'easy', category: 'fruits', subcategory: 'common', unlocked: true },
  { id: 'orange-fruit', name: 'Orange', emoji: '🍊', difficulty: 'easy', category: 'fruits', subcategory: 'citrus', unlocked: true },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', difficulty: 'easy', category: 'fruits', subcategory: 'berries', unlocked: true },
  { id: 'grape', name: 'Grape', emoji: '🍇', difficulty: 'easy', category: 'fruits', subcategory: 'berries', unlocked: true },

  // Medium fruits (moderately common)
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', difficulty: 'medium', category: 'fruits', subcategory: 'melons', unlocked: true },
  { id: 'pineapple', name: 'Pineapple', emoji: '🍍', difficulty: 'medium', category: 'fruits', subcategory: 'tropical', unlocked: true },
  { id: 'lemon', name: 'Lemon', emoji: '🍋', difficulty: 'medium', category: 'fruits', subcategory: 'citrus', unlocked: true },
  { id: 'pear', name: 'Pear', emoji: '🍐', difficulty: 'medium', category: 'fruits', subcategory: 'common', unlocked: true },
  { id: 'blueberry', name: 'Blueberry', emoji: '🫐', difficulty: 'medium', category: 'fruits', subcategory: 'berries', unlocked: true },

  // Hard fruits (less common or vegetables often confused as fruits)
  { id: 'avocado', name: 'Avocado', emoji: '🥑', difficulty: 'hard', category: 'fruits', subcategory: 'tropical', unlocked: true },
  { id: 'mango', name: 'Mango', emoji: '🥭', difficulty: 'hard', category: 'fruits', subcategory: 'tropical', unlocked: true },
  { id: 'peach', name: 'Peach', emoji: '🍑', difficulty: 'hard', category: 'fruits', subcategory: 'common', unlocked: true },
  { id: 'cucumber', name: 'Cucumber', emoji: '🥒', difficulty: 'hard', category: 'fruits', subcategory: 'vegetables', unlocked: true },
  { id: 'carrot', name: 'Carrot', emoji: '🥕', difficulty: 'hard', category: 'fruits', subcategory: 'vegetables', unlocked: true },
];