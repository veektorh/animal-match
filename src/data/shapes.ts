import { Item } from '../types';

export const SHAPES: Item[] = [
  // Easy shapes: the first shape vocabulary most children meet.
  { id: 'circle', name: 'Circle', emoji: '●', difficulty: 'easy', category: 'shapes', subcategory: 'basic', unlocked: true },
  { id: 'square', name: 'Square', emoji: '■', difficulty: 'easy', category: 'shapes', subcategory: 'basic', unlocked: true },
  { id: 'triangle', name: 'Triangle', emoji: '▲', difficulty: 'easy', category: 'shapes', subcategory: 'basic', unlocked: true },
  { id: 'rectangle', name: 'Rectangle', emoji: '▰', difficulty: 'easy', category: 'shapes', subcategory: 'basic', unlocked: true },
  { id: 'star-shape', name: 'Star', emoji: '★', difficulty: 'easy', category: 'shapes', subcategory: 'basic', unlocked: true },
  { id: 'heart-shape', name: 'Heart', emoji: '♥', difficulty: 'easy', category: 'shapes', subcategory: 'basic', unlocked: true },

  // Medium shapes: still familiar, with more visual comparison.
  { id: 'oval', name: 'Oval', emoji: '⬭', difficulty: 'medium', category: 'shapes', subcategory: 'curved', unlocked: true },
  { id: 'diamond', name: 'Diamond', emoji: '◆', difficulty: 'medium', category: 'shapes', subcategory: 'angled', unlocked: true },
  { id: 'pentagon', name: 'Pentagon', emoji: '⬟', difficulty: 'medium', category: 'shapes', subcategory: 'polygon', unlocked: true },
  { id: 'hexagon', name: 'Hexagon', emoji: '⬢', difficulty: 'medium', category: 'shapes', subcategory: 'polygon', unlocked: true },
  { id: 'crescent', name: 'Crescent', emoji: '☾', difficulty: 'medium', category: 'shapes', subcategory: 'curved', unlocked: true },
  { id: 'cross', name: 'Cross', emoji: '✚', difficulty: 'medium', category: 'shapes', subcategory: 'compound', unlocked: true },

  // Hard shapes: more advanced geometry vocabulary.
  { id: 'trapezoid', name: 'Trapezoid', emoji: '▱', difficulty: 'hard', category: 'shapes', subcategory: 'polygon', unlocked: true },
  { id: 'parallelogram', name: 'Parallelogram', emoji: '▰', difficulty: 'hard', category: 'shapes', subcategory: 'polygon', unlocked: true },
  { id: 'octagon', name: 'Octagon', emoji: '🛑', difficulty: 'hard', category: 'shapes', subcategory: 'polygon', unlocked: true },
  { id: 'semicircle', name: 'Semicircle', emoji: '◠', difficulty: 'hard', category: 'shapes', subcategory: 'curved', unlocked: true },
  { id: 'arrow', name: 'Arrow', emoji: '➜', difficulty: 'hard', category: 'shapes', subcategory: 'compound', unlocked: true },
  { id: 'kite-shape', name: 'Kite', emoji: '⬖', difficulty: 'hard', category: 'shapes', subcategory: 'polygon', unlocked: true },
];
