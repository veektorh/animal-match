import { Item } from '../types';

// Numbers 1-10
export const NUMBERS: Item[] = [
  // Easy numbers (1-5)
  { id: 'one', name: 'One', emoji: '1️⃣', difficulty: 'easy', category: 'numbers', subcategory: 'basic', unlocked: true },
  { id: 'two', name: 'Two', emoji: '2️⃣', difficulty: 'easy', category: 'numbers', subcategory: 'basic', unlocked: true },
  { id: 'three', name: 'Three', emoji: '3️⃣', difficulty: 'easy', category: 'numbers', subcategory: 'basic', unlocked: true },
  { id: 'four', name: 'Four', emoji: '4️⃣', difficulty: 'easy', category: 'numbers', subcategory: 'basic', unlocked: true },
  { id: 'five', name: 'Five', emoji: '5️⃣', difficulty: 'easy', category: 'numbers', subcategory: 'basic', unlocked: true },

  // Medium numbers (6-8)
  { id: 'six', name: 'Six', emoji: '6️⃣', difficulty: 'medium', category: 'numbers', subcategory: 'intermediate', unlocked: true },
  { id: 'seven', name: 'Seven', emoji: '7️⃣', difficulty: 'medium', category: 'numbers', subcategory: 'intermediate', unlocked: true },
  { id: 'eight', name: 'Eight', emoji: '8️⃣', difficulty: 'medium', category: 'numbers', subcategory: 'intermediate', unlocked: true },

  // Hard numbers (9-10)
  { id: 'nine', name: 'Nine', emoji: '9️⃣', difficulty: 'hard', category: 'numbers', subcategory: 'advanced', unlocked: true },
  { id: 'ten', name: 'Ten', emoji: '🔟', difficulty: 'hard', category: 'numbers', subcategory: 'advanced', unlocked: true },
];