import { Sticker, StickerCollection, StickerRarity, StickerReward, Animal } from '../types';

export class StickerManager {
  private static instance: StickerManager;
  private readonly STORAGE_KEY = 'animal-match-stickers';

  static getInstance(): StickerManager {
    if (!StickerManager.instance) {
      StickerManager.instance = new StickerManager();
    }
    return StickerManager.instance;
  }

  /**
   * Get rarity chance percentages
   */
  private getRarityChances(): { [key in StickerRarity]: number } {
    return {
      common: 0.60,     // 60%
      rare: 0.30,       // 30%
      epic: 0.08,       // 8%
      legendary: 0.02   // 2%
    };
  }

  /**
   * Determine sticker rarity based on random chance
   */
  private determineRarity(): StickerRarity {
    const rand = Math.random();
    const chances = this.getRarityChances();
    
    if (rand < chances.legendary) return 'legendary';
    if (rand < chances.legendary + chances.epic) return 'epic';
    if (rand < chances.legendary + chances.epic + chances.rare) return 'rare';
    return 'common';
  }

  /**
   * Get rarity multiplier for scoring
   */
  getRarityMultiplier(rarity: StickerRarity): number {
    const multipliers = {
      common: 1,
      rare: 2,
      epic: 5,
      legendary: 10
    };
    return multipliers[rarity];
  }

  /**
   * Get rarity color for UI display
   */
  getRarityColor(rarity: StickerRarity): string {
    const colors = {
      common: '#6B7280',    // Gray
      rare: '#3B82F6',      // Blue
      epic: '#8B5CF6',      // Purple
      legendary: '#F59E0B'  // Gold
    };
    return colors[rarity];
  }

  /**
   * Get rarity emoji for visual indication
   */
  getRarityEmoji(rarity: StickerRarity): string {
    const emojis = {
      common: '⭐',
      rare: '🌟',
      epic: '💫',
      legendary: '✨'
    };
    return emojis[rarity];
  }

  /**
   * Create a sticker from an animal
   */
  createSticker(animal: Animal, forceRarity?: StickerRarity): Sticker {
    const rarity = forceRarity || this.determineRarity();
    
    return {
      id: `sticker_${animal.id}_${Date.now()}`,
      animalId: animal.id,
      name: `${animal.name} Sticker`,
      emoji: animal.emoji,
      rarity,
      collectedDate: new Date().toISOString(),
      isNew: true
    };
  }

  /**
   * Load sticker collection from storage
   */
  loadCollection(): StickerCollection {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const collection = JSON.parse(saved);
        return this.calculateCollectionStats(collection.stickers || {});
      }
    } catch (error) {
      console.warn('Failed to load sticker collection:', error);
    }

    return {
      stickers: {},
      totalCollected: 0,
      rarityCount: { common: 0, rare: 0, epic: 0, legendary: 0 },
      completionPercentage: 0
    };
  }

  /**
   * Save sticker collection to storage
   */
  saveCollection(collection: StickerCollection): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
    } catch (error) {
      console.warn('Failed to save sticker collection:', error);
    }
  }

  /**
   * Add a sticker to the collection
   */
  addSticker(animal: Animal, forceRarity?: StickerRarity): StickerReward {
    const collection = this.loadCollection();
    const existingSticker = collection.stickers[animal.id];
    
    // If we already have this animal sticker, there's a chance to upgrade rarity
    let newSticker: Sticker;
    let isNewSticker = false;
    
    if (existingSticker) {
      // 20% chance to upgrade rarity if we already have this sticker
      if (Math.random() < 0.2 || forceRarity) {
        const targetRarity = forceRarity || this.getUpgradedRarity(existingSticker.rarity);
        if (targetRarity !== existingSticker.rarity) {
          newSticker = this.createSticker(animal, targetRarity);
          collection.stickers[animal.id] = newSticker;
          isNewSticker = true; // New rarity counts as new
        } else {
          newSticker = existingSticker;
        }
      } else {
        newSticker = existingSticker;
      }
    } else {
      // First time collecting this animal
      newSticker = this.createSticker(animal, forceRarity);
      collection.stickers[animal.id] = newSticker;
      isNewSticker = true;
    }

    // Update collection stats and save
    const updatedCollection = this.calculateCollectionStats(collection.stickers);
    this.saveCollection(updatedCollection);

    const rarityBonus = this.getRarityMultiplier(newSticker.rarity) * 10;

    return {
      sticker: newSticker,
      isNewSticker,
      rarityBonus
    };
  }

  /**
   * Get upgraded rarity (for duplicate stickers)
   */
  private getUpgradedRarity(currentRarity: StickerRarity): StickerRarity {
    const rarities: StickerRarity[] = ['common', 'rare', 'epic', 'legendary'];
    const currentIndex = rarities.indexOf(currentRarity);
    
    if (currentIndex < rarities.length - 1) {
      // 70% chance to upgrade to next tier, 30% chance to stay same
      return Math.random() < 0.7 ? rarities[currentIndex + 1] : currentRarity;
    }
    
    return currentRarity;
  }

  /**
   * Calculate collection statistics
   */
  private calculateCollectionStats(stickers: { [animalId: string]: Sticker }): StickerCollection {
    const stickerArray = Object.values(stickers);
    const totalCollected = stickerArray.length;
    
    const rarityCount = stickerArray.reduce((count, sticker) => {
      count[sticker.rarity]++;
      return count;
    }, { common: 0, rare: 0, epic: 0, legendary: 0 });

    // Assuming we have a total of around 30 animals for completion percentage
    const completionPercentage = Math.round((totalCollected / 30) * 100);

    return {
      stickers,
      totalCollected,
      rarityCount,
      completionPercentage: Math.min(completionPercentage, 100)
    };
  }

  /**
   * Get collection for display
   */
  getCollection(): StickerCollection {
    return this.loadCollection();
  }

  /**
   * Mark stickers as viewed (remove "new" flag)
   */
  markStickersAsViewed(stickerIds: string[]): void {
    const collection = this.loadCollection();
    
    Object.values(collection.stickers).forEach(sticker => {
      if (stickerIds.includes(sticker.id) || stickerIds.length === 0) {
        sticker.isNew = false;
      }
    });

    this.saveCollection(collection);
  }

  /**
   * Get new stickers count
   */
  getNewStickersCount(): number {
    const collection = this.loadCollection();
    return Object.values(collection.stickers).filter(sticker => sticker.isNew).length;
  }

  /**
   * Reset collection (for debugging/testing)
   */
  resetCollection(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const stickerManager = StickerManager.getInstance();