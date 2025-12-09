import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameMode, DifficultyLevel, Category } from '../types';
import { stickerManager } from '../utils/StickerManager';
import { getCategoryInfo, getCategoryEmoji, getCategoryDisplayName } from '../data/items';
import './MainMenu.css';

interface MainMenuProps {
  onStartGame: (mode: GameMode, difficulty: DifficultyLevel, category: Category) => void;
  onShowSettings?: () => void;
  onShowStickerCollection?: () => void;
  playerProgress?: {
    totalGamesPlayed: number;
    totalStars: number;
    unlockedAnimals?: string[];
    unlockedItems?: string[];
  };
}

const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onShowSettings,
  onShowStickerCollection,
  playerProgress
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy');
  const [newStickersCount, setNewStickersCount] = useState(0);

  useEffect(() => {
    // Update new stickers count when component mounts
    setNewStickersCount(stickerManager.getNewStickersCount());
  }, []);

  const categories: { id: Category; title: string; description: string; icon: string; color: string }[] = [
    {
      id: 'animals',
      title: 'Animals',
      description: 'Learn about different animals and their habitats',
      icon: '🐾',
      color: '#4CAF50'
    },
    {
      id: 'numbers',
      title: 'Numbers',
      description: 'Practice counting and number recognition',
      icon: '🔢',
      color: '#2196F3'
    },
    {
      id: 'alphabets',
      title: 'Letters',
      description: 'Learn the alphabet and letter recognition',
      icon: '🔤',
      color: '#FF9800'
    },
    {
      id: 'colors',
      title: 'Colors',
      description: 'Identify and learn different colors',
      icon: '🎨',
      color: '#9C27B0'
    },
    {
      id: 'fruits',
      title: 'Fruits',
      description: 'Discover various fruits and healthy foods',
      icon: '🍎',
      color: '#FF5722'
    }
  ];

  const gameModes = [
    {
      id: 'free-play' as GameMode,
      title: 'Free Play',
      description: 'Take your time and learn at your own pace',
      icon: '🎮',
      color: '#4CAF50'
    },
    {
      id: 'timed' as GameMode,
      title: 'Timed Challenge',
      description: 'Race against the clock to match quickly',
      icon: '⏰',
      color: '#FF9800'
    },
    {
      id: 'story' as GameMode,
      title: 'Story Adventure',
      description: 'Explore magical learning adventures',
      icon: '📚',
      color: '#9C27B0'
    }
  ];

  const difficulties = [
    {
      id: 'easy' as DifficultyLevel,
      title: 'Easy',
      description: '3 options, simple choices',
      icon: '🌟'
    },
    {
      id: 'medium' as DifficultyLevel,
      title: 'Medium',
      description: '4 options, more variety',
      icon: '⭐'
    },
    {
      id: 'hard' as DifficultyLevel,
      title: 'Hard',
      description: '6 options, challenging choices',
      icon: '🏆'
    }
  ];

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  const handleStartGame = () => {
    if (selectedMode && selectedCategory) {
      onStartGame(selectedMode, selectedDifficulty, selectedCategory);
    }
  };

  const handleBack = () => {
    if (selectedMode) {
      setSelectedMode(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  return (
    <div className="main-menu">
      <motion.div
        className="menu-header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="game-title">
          🎯 Learning Match
        </h1>
        <p className="game-subtitle">
          Learn and have fun with interactive matching!
        </p>
      </motion.div>

      {playerProgress && (
        <motion.div
          className="progress-summary"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="progress-item">
            <span className="progress-icon">🎮</span>
            <span className="progress-value">{playerProgress.totalGamesPlayed}</span>
            <span className="progress-label">Games Played</span>
          </div>
          <div className="progress-item">
            <span className="progress-icon">⭐</span>
            <span className="progress-value">{playerProgress.totalStars}</span>
            <span className="progress-label">Stars Earned</span>
          </div>
          <div className="progress-item">
            <span className="progress-icon">🎯</span>
            <span className="progress-value">{(playerProgress.unlockedItems?.length || playerProgress.unlockedAnimals?.length || 0)}</span>
            <span className="progress-label">Items Unlocked</span>
          </div>
        </motion.div>
      )}

      {/* Menu Actions */}
      <motion.div
        className="menu-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {onShowStickerCollection && (
          <motion.button
            className="action-button sticker-button"
            onClick={onShowStickerCollection}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📚 Sticker Collection
            {newStickersCount > 0 && (
              <span className="notification-badge">{newStickersCount}</span>
            )}
          </motion.button>
        )}
        {onShowSettings && (
          <motion.button
            className="action-button settings-button"
            onClick={onShowSettings}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️ Settings
          </motion.button>
        )}
      </motion.div>

      {!selectedCategory ? (
        // Category Selection Screen
        <motion.div
          className="category-selection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2>Choose Learning Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className="category-card"
                style={{ borderColor: category.color }}
                onClick={() => handleCategorySelect(category.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCategorySelect(category.id);
                  }
                }}
                aria-label={`Select ${category.title} category`}
              >
                <div className="category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : !selectedMode ? (
        // Mode Selection Screen
        <motion.div
          className="mode-selection"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="selection-header">
            <button className="back-button" onClick={handleBack} aria-label="Go back">
              ← Back
            </button>
            <h2>Choose Game Mode</h2>
            <div></div> {/* Spacer for flexbox */}
          </div>

          <div className="selected-category-info">
            <span className="category-icon">
              {categories.find(c => c.id === selectedCategory)?.icon}
            </span>
            <span className="category-title">
              {categories.find(c => c.id === selectedCategory)?.title}
            </span>
          </div>

          <div className="modes-grid">
            {gameModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                className="mode-card"
                style={{ borderColor: mode.color }}
                onClick={() => handleModeSelect(mode.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleModeSelect(mode.id);
                  }
                }}
                aria-label={`Select ${mode.title} game mode`}
              >
                <div className="mode-icon" style={{ color: mode.color }}>
                  {mode.icon}
                </div>
                <h3>{mode.title}</h3>
                <p>{mode.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        // Difficulty Selection Screen
        <motion.div
          className="difficulty-selection"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="selection-header">
            <button className="back-button" onClick={handleBack} aria-label="Go back">
              ← Back
            </button>
            <h2>Choose Difficulty</h2>
            <div></div> {/* Spacer for flexbox */}
          </div>

          <div className="selected-mode-info">
            <span className="mode-icon">
              {gameModes.find(m => m.id === selectedMode)?.icon}
            </span>
            <span className="mode-title">
              {gameModes.find(m => m.id === selectedMode)?.title}
            </span>
          </div>

          <div className="difficulties-grid">
            {difficulties.map((difficulty, index) => (
              <motion.div
                key={difficulty.id}
                className={`difficulty-card ${selectedDifficulty === difficulty.id ? 'selected' : ''}`}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                role="radio"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedDifficulty(difficulty.id);
                  }
                }}
                aria-checked={selectedDifficulty === difficulty.id}
                aria-label={`Select ${difficulty.title} difficulty`}
              >
                <div className="difficulty-icon">{difficulty.icon}</div>
                <h3>{difficulty.title}</h3>
                <p>{difficulty.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            className="start-game-button"
            onClick={handleStartGame}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Start Game
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default MainMenu;