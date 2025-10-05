import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickerCollection, StickerRarity } from '../types';
import { stickerManager } from '../utils/StickerManager';
import { ANIMALS } from '../data/animals';
import './StickerCollectionView.css';

interface StickerCollectionViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const StickerCollectionView: React.FC<StickerCollectionViewProps> = ({ isOpen, onClose }) => {
  const [collection, setCollection] = useState<StickerCollection>({ 
    stickers: {}, 
    totalCollected: 0, 
    rarityCount: { common: 0, rare: 0, epic: 0, legendary: 0 },
    completionPercentage: 0 
  });
  const [selectedRarity, setSelectedRarity] = useState<StickerRarity | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'date'>('name');

  useEffect(() => {
    if (isOpen) {
      loadCollection();
      // Mark all stickers as viewed when opening the collection
      stickerManager.markStickersAsViewed([]);
    }
  }, [isOpen]);

  const loadCollection = () => {
    const currentCollection = stickerManager.getCollection();
    setCollection(currentCollection);
  };

  const getFilteredAndSortedStickers = () => {
    let stickers = Object.values(collection.stickers);

    // Filter by rarity
    if (selectedRarity !== 'all') {
      stickers = stickers.filter(sticker => sticker.rarity === selectedRarity);
    }

    // Sort stickers
    stickers.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          const rarityOrder = ['common', 'rare', 'epic', 'legendary'];
          return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
        case 'date':
          return new Date(b.collectedDate || 0).getTime() - new Date(a.collectedDate || 0).getTime();
        default:
          return 0;
      }
    });

    return stickers;
  };

  const getUncollectedAnimals = () => {
    const collectedAnimalIds = Object.keys(collection.stickers);
    return ANIMALS.filter((animal) => !collectedAnimalIds.includes(animal.id));
  };

  if (!isOpen) return null;

  const filteredStickers = getFilteredAndSortedStickers();
  const uncollectedAnimals = getUncollectedAnimals();

  return (
    <AnimatePresence>
      <motion.div
        className="sticker-collection-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="sticker-collection-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="collection-header">
            <div className="header-content">
              <h2>🏆 Sticker Collection</h2>
              <button
                className="close-button"
                onClick={onClose}
                aria-label="Close collection"
              >
                ✕
              </button>
            </div>
            
            {/* Stats */}
            <div className="collection-stats">
              <div className="stat-card">
                <span className="stat-number">{collection.totalCollected}</span>
                <span className="stat-label">Collected</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{collection.completionPercentage}%</span>
                <span className="stat-label">Complete</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{collection.rarityCount.legendary}</span>
                <span className="stat-label">Legendary</span>
              </div>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="collection-controls">
            <div className="filter-section">
              <label>Filter by rarity:</label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value as StickerRarity | 'all')}
                className="filter-select"
              >
                <option value="all">All Rarities</option>
                <option value="common">⭐ Common ({collection.rarityCount.common})</option>
                <option value="rare">🌟 Rare ({collection.rarityCount.rare})</option>
                <option value="epic">💫 Epic ({collection.rarityCount.epic})</option>
                <option value="legendary">✨ Legendary ({collection.rarityCount.legendary})</option>
              </select>
            </div>

            <div className="sort-section">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'rarity' | 'date')}
                className="sort-select"
              >
                <option value="name">Name</option>
                <option value="rarity">Rarity</option>
                <option value="date">Date Collected</option>
              </select>
            </div>
          </div>

          {/* Sticker Grid */}
          <div className="sticker-grid-container">
            <div className="sticker-grid">
              {/* Collected Stickers */}
              {filteredStickers.map((sticker, index) => (
                <motion.div
                  key={sticker.id}
                  className="sticker-card collected"
                  style={{ borderColor: stickerManager.getRarityColor(sticker.rarity) }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div 
                    className="sticker-background"
                    style={{ backgroundColor: `${stickerManager.getRarityColor(sticker.rarity)}20` }}
                  >
                    <span className="sticker-emoji">{sticker.emoji}</span>
                    {sticker.isNew && (
                      <span className="new-badge">NEW!</span>
                    )}
                  </div>
                  
                  <div className="sticker-info">
                    <h4 className="sticker-name">{sticker.name}</h4>
                    <div className="rarity-info">
                      <span className="rarity-emoji">
                        {stickerManager.getRarityEmoji(sticker.rarity)}
                      </span>
                      <span 
                        className="rarity-text"
                        style={{ color: stickerManager.getRarityColor(sticker.rarity) }}
                      >
                        {sticker.rarity}
                      </span>
                    </div>
                    {sticker.collectedDate && (
                      <div className="collection-date">
                        {new Date(sticker.collectedDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Uncollected Animals (when showing all) */}
              {selectedRarity === 'all' && uncollectedAnimals.map((animal, index: number) => (
                <motion.div
                  key={`uncollected-${animal.id}`}
                  className="sticker-card uncollected"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (filteredStickers.length + index) * 0.05 }}
                >
                  <div className="sticker-background">
                    <span className="sticker-emoji mystery">❓</span>
                  </div>
                  <div className="sticker-info">
                    <h4 className="sticker-name mystery">???</h4>
                    <div className="rarity-info">
                      <span className="rarity-text mystery">Unknown</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredStickers.length === 0 && selectedRarity !== 'all' && (
              <div className="empty-state">
                <span className="empty-emoji">🔍</span>
                <h3>No {selectedRarity} stickers yet!</h3>
                <p>Keep playing to collect more stickers of this rarity.</p>
              </div>
            )}

            {collection.totalCollected === 0 && (
              <div className="empty-state">
                <span className="empty-emoji">🎮</span>
                <h3>Start Your Collection!</h3>
                <p>Play Animal Match to earn your first stickers!</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-header">
              <span>Collection Progress</span>
              <span>{collection.completionPercentage}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${collection.completionPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StickerCollectionView;