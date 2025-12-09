import { Item } from '../types';

// Colors
export const COLORS: Item[] = [
  // Easy colors (primary colors)
  { id: 'red', name: 'Red', emoji: '🔴', difficulty: 'easy', category: 'colors', subcategory: 'primary', unlocked: true },
  { id: 'blue', name: 'Blue', emoji: '🔵', difficulty: 'easy', category: 'colors', subcategory: 'primary', unlocked: true },
  { id: 'yellow', name: 'Yellow', emoji: '🟡', difficulty: 'easy', category: 'colors', subcategory: 'primary', unlocked: true },

  // Medium colors (secondary colors and common colors)
  { id: 'green', name: 'Green', emoji: '🟢', difficulty: 'medium', category: 'colors', subcategory: 'secondary', unlocked: true },
  { id: 'orange', name: 'Orange', emoji: '🟠', difficulty: 'medium', category: 'colors', subcategory: 'secondary', unlocked: true },
  { id: 'purple', name: 'Purple', emoji: '🟣', difficulty: 'medium', category: 'colors', subcategory: 'secondary', unlocked: true },
  { id: 'pink', name: 'Pink', emoji: '🩷', difficulty: 'medium', category: 'colors', subcategory: 'tints', unlocked: true },

  // Hard colors (neutral colors)
  { id: 'white', name: 'White', emoji: '⚪', difficulty: 'hard', category: 'colors', subcategory: 'neutral', unlocked: true },
  { id: 'black', name: 'Black', emoji: '⚫', difficulty: 'hard', category: 'colors', subcategory: 'neutral', unlocked: true },
  { id: 'brown', name: 'Brown', emoji: '🤎', difficulty: 'hard', category: 'colors', subcategory: 'neutral', unlocked: true },
];