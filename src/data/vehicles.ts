import { Item } from '../types';

export const VEHICLES: Item[] = [
  // Easy vehicles: common things children often see or ride.
  { id: 'car', name: 'Car', emoji: '🚗', difficulty: 'easy', category: 'vehicles', subcategory: 'road', unlocked: true },
  { id: 'bus', name: 'Bus', emoji: '🚌', difficulty: 'easy', category: 'vehicles', subcategory: 'road', unlocked: true },
  { id: 'bicycle', name: 'Bicycle', emoji: '🚲', difficulty: 'easy', category: 'vehicles', subcategory: 'road', unlocked: true },
  { id: 'train', name: 'Train', emoji: '🚂', difficulty: 'easy', category: 'vehicles', subcategory: 'rail', unlocked: true },
  { id: 'boat', name: 'Boat', emoji: '🚤', difficulty: 'easy', category: 'vehicles', subcategory: 'water', unlocked: true },
  { id: 'airplane', name: 'Airplane', emoji: '✈️', difficulty: 'easy', category: 'vehicles', subcategory: 'air', unlocked: true },

  // Medium vehicles: recognizable with more details to compare.
  { id: 'truck', name: 'Truck', emoji: '🚚', difficulty: 'medium', category: 'vehicles', subcategory: 'road', unlocked: true },
  { id: 'tractor', name: 'Tractor', emoji: '🚜', difficulty: 'medium', category: 'vehicles', subcategory: 'work', unlocked: true },
  { id: 'motorcycle', name: 'Motorcycle', emoji: '🏍️', difficulty: 'medium', category: 'vehicles', subcategory: 'road', unlocked: true },
  { id: 'fire-truck', name: 'Fire Truck', emoji: '🚒', difficulty: 'medium', category: 'vehicles', subcategory: 'service', unlocked: true },
  { id: 'helicopter', name: 'Helicopter', emoji: '🚁', difficulty: 'medium', category: 'vehicles', subcategory: 'air', unlocked: true },
  { id: 'scooter', name: 'Scooter', emoji: '🛴', difficulty: 'medium', category: 'vehicles', subcategory: 'road', unlocked: true },

  // Hard vehicles: special-purpose vehicles and less common transport.
  { id: 'ambulance', name: 'Ambulance', emoji: '🚑', difficulty: 'hard', category: 'vehicles', subcategory: 'service', unlocked: true },
  { id: 'police-car', name: 'Police Car', emoji: '🚓', difficulty: 'hard', category: 'vehicles', subcategory: 'service', unlocked: true },
  { id: 'taxi', name: 'Taxi', emoji: '🚕', difficulty: 'hard', category: 'vehicles', subcategory: 'road', unlocked: true },
  { id: 'sailboat', name: 'Sailboat', emoji: '⛵', difficulty: 'hard', category: 'vehicles', subcategory: 'water', unlocked: true },
  { id: 'submarine', name: 'Submarine', emoji: '🚢', difficulty: 'hard', category: 'vehicles', subcategory: 'water', unlocked: true },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', difficulty: 'hard', category: 'vehicles', subcategory: 'space', unlocked: true },
];
