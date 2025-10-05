import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameMode, DifficultyLevel } from '../types';
import './MainMenu.css';

interface MainMenuProps {
  onStartGame: (mode: GameMode, difficulty: DifficultyLevel) => void;
  onShowSettings?: () => void;
  playerProgress?: {
    totalGamesPlayed: number;
    totalStars: number;
    unlockedAnimals: string[];
  };
}

const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onShowSettings,
  playerProgress
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy');

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
      description: 'Race against the clock to find animals quickly',
      icon: '⏰',
      color: '#FF9800'
    },
    {
      id: 'story' as GameMode,
      title: 'Story Adventure',
      description: 'Help animals in their magical journey',
      icon: '📚',
      color: '#9C27B0'
    }
  ];

  const difficulties = [
    {
      id: 'easy' as DifficultyLevel,
      title: 'Easy',
      description: '3 animals, simple choices',
      icon: '🌟'
    },
    {
      id: 'medium' as DifficultyLevel,
      title: 'Medium',
      description: '4 animals, more variety',
      icon: '⭐'
    },
    {
      id: 'hard' as DifficultyLevel,
      title: 'Hard',
      description: '6 animals, challenging choices',
      icon: '🏆'
    }
  ];

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  const handleStartGame = () => {
    if (selectedMode) {
      onStartGame(selectedMode, selectedDifficulty);
    }
  };

  const handleBack = () => {
    setSelectedMode(null);
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
          🐾 Animal Match
        </h1>
        <p className="game-subtitle">
          Learn about animals while having fun!
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
            <span className="progress-icon">🐾</span>
            <span className="progress-value">{playerProgress.unlockedAnimals.length}</span>
            <span className="progress-label">Animals Unlocked</span>
          </div>
        </motion.div>
      )}

      {!selectedMode ? (
        // Mode Selection Screen
        <motion.div
          className="mode-selection"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2>Choose Game Mode</h2>
          <div className="modes-grid">
            {gameModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                className="mode-card"
                style={{ borderColor: mode.color }}
                onClick={() => handleModeSelect(mode.id)}
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

          {onShowSettings && (
            <motion.button
              className="settings-button"
              onClick={onShowSettings}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚙️ Settings
            </motion.button>
          )}
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