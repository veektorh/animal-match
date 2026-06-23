import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameBoard from './GameBoard';
import ProgressBar from './ProgressBar';
import { useGame } from '../hooks/useGame';
import { GameMode, DifficultyLevel, Category, Item, GameSettings } from '../types';
import { getCategoryDisplayName } from '../data/items';
import './Game.css';

interface GameProps {
  mode: GameMode;
  category: Category;
  difficulty: DifficultyLevel;
  onGameComplete?: (score: number, stars: number, totalTime: number, totalRounds: number) => void;
  onBackToMenu?: () => void;
  unlockedItems?: string[];
  unlockedAnimals?: string[]; // Keep for backward compatibility
  settings?: GameSettings;
}

interface StoryConfig {
  title: string;
  intro: string;
  mission: string;
  complete: string;
  badge: string;
}

const STORY_CONFIGS: Record<Category, StoryConfig> = {
  animals: {
    title: 'Habitat Helper',
    intro: 'Visit friendly habitats and help each animal find its place.',
    mission: 'Listen closely and choose the animal the helper is looking for.',
    complete: 'You helped the habitats feel bright and busy again!',
    badge: '🌿'
  },
  numbers: {
    title: 'Counting Quest',
    intro: 'Follow the number trail and collect the missing counting stones.',
    mission: 'Match each spoken number before the trail fades.',
    complete: 'The number trail is complete from start to finish!',
    badge: '🔢'
  },
  alphabets: {
    title: 'Letter Library',
    intro: 'Open the story shelves by finding each missing letter.',
    mission: 'Look for the letter named in the prompt.',
    complete: 'The letter shelves are back in order!',
    badge: '🔤'
  },
  colors: {
    title: 'Rainbow Rescue',
    intro: 'Bring color back to the rainbow one match at a time.',
    mission: 'Find the color that belongs in each rainbow beam.',
    complete: 'The rainbow is glowing with every color again!',
    badge: '🎨'
  },
  fruits: {
    title: 'Garden Picnic',
    intro: 'Help pack a cheerful picnic basket with tasty fruit matches.',
    mission: 'Choose the fruit named in the picnic clue.',
    complete: 'The picnic basket is full and ready to share!',
    badge: '🍎'
  }
};

const Game: React.FC<GameProps> = ({
  mode,
  category,
  difficulty,
  onGameComplete,
  onBackToMenu,
  unlockedItems = [],
  unlockedAnimals = [], // Keep for backward compatibility
  settings
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const timeLimit = settings?.timeLimit || 15;
  const reducedMotion = settings?.reducedMotion || false;
  const storyConfig = mode === 'story' ? STORY_CONFIGS[category] : null;

  // Game configuration based on mode
  const getGameConfig = () => {
    switch (mode) {
      case 'timed':
        return { roundCount: 10, timeLimit };
      case 'story':
        return { roundCount: 8, timeLimit: undefined };
      case 'free-play':
      default:
        return { roundCount: 5, timeLimit: undefined };
    }
  };

  const config = getGameConfig();
  
  const {
    gameSession,
    currentRound,
    timeRemaining,
    isGameActive,
    isRoundActive,
    startGame,
    nextRound,
    pauseGame,
    resumeGame,
    resetGame,
    currentRoundNumber,
    totalRounds,
    hasTimeLimit
  } = useGame({
    mode,
    category,
    difficulty,
    roundCount: config.roundCount,
    timeLimit: config.timeLimit,
    unlockedItems,
    unlockedAnimals // Keep for backward compatibility
  });

  const handleStartGame = () => {
    setGameStarted(true);
    startGame();
  };

  const handleItemSelect = useCallback((item: Item) => {
    // This is handled by GameBoard, just for tracking
    console.log('Item selected:', item.name);
  }, []);

  const handleRoundComplete = useCallback((wasCorrect: boolean) => {
    const completedSession = nextRound(wasCorrect);
    
    if (completedSession) {
      // Game is complete
      const totalTime = completedSession.endTime ? 
        (completedSession.endTime - completedSession.startTime) / 1000 : 0;
      
      setShowResults(true);
      
      if (onGameComplete) {
        onGameComplete(completedSession.score, completedSession.stars, totalTime, completedSession.rounds.length);
      }
    }
  }, [nextRound, onGameComplete]);

  const motionTransition = { duration: reducedMotion ? 0 : 0.3 };
  const showPauseOverlay = !isRoundActive && isGameActive && (!hasTimeLimit || timeRemaining > 0);

  const handlePlayAgain = () => {
    setShowResults(false);
    setGameStarted(false);
    resetGame();
  };

  const handleBackToMenu = () => {
    resetGame();
    setGameStarted(false);
    setShowResults(false);
    if (onBackToMenu) {
      onBackToMenu();
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'timed':
        return 'Timed Challenge';
      case 'story':
        return 'Story Adventure';
      case 'free-play':
      default:
        return 'Free Play';
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'timed':
        return 'Find items quickly before time runs out!';
      case 'story':
        return storyConfig?.intro || 'Discover items in their magical adventure!';
      case 'free-play':
      default:
        return 'Take your time and have fun learning!';
    }
  };

  // Game start screen
  if (!gameStarted) {
    return (
      <div className="game-container">
        <motion.div
          className="game-start-screen"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
        >
          <h1>{getModeTitle()}</h1>
          <p className="mode-description">{getModeDescription()}</p>

          {storyConfig && (
            <div className="story-intro" aria-label={`${storyConfig.title} story chapter`}>
              <div className="story-badge" aria-hidden="true">{storyConfig.badge}</div>
              <div>
                <h2>{storyConfig.title}</h2>
                <p>{storyConfig.mission}</p>
              </div>
            </div>
          )}
          
          <div className="game-info">
            <div className="info-item">
              <span className="info-label">Difficulty:</span>
              <span className="info-value">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Rounds:</span>
              <span className="info-value">{config.roundCount}</span>
            </div>
            {config.timeLimit && (
              <div className="info-item">
                <span className="info-label">Time per round:</span>
                <span className="info-value">{config.timeLimit}s</span>
              </div>
            )}
          </div>
          
          <motion.button
            className="start-button"
            onClick={handleStartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Start Game
          </motion.button>
          
          <button className="back-button" onClick={handleBackToMenu}>
            ← Back to Menu
          </button>
        </motion.div>
      </div>
    );
  }

  // Game results screen
  if (showResults && gameSession) {
    const accuracy = gameSession.rounds.length > 0 ? 
      (gameSession.score / gameSession.rounds.length) * 100 : 0;
    
    const totalTime = gameSession.endTime ? 
      Math.round((gameSession.endTime - gameSession.startTime) / 1000) : 0;

    return (
      <div className="game-container">
        <motion.div
          className="game-results"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
        >
          <h1>🎉 Great Job!</h1>
          {storyConfig && (
            <p className="story-complete-message">
              {storyConfig.complete}
            </p>
          )}
          
          <div className="results-grid">
            <div className="result-card">
              <div className="result-icon">🎯</div>
              <div className="result-label">Score</div>
              <div className="result-value">{gameSession.score}/{gameSession.rounds.length}</div>
            </div>
            
            <div className="result-card">
              <div className="result-icon">⭐</div>
              <div className="result-label">Stars</div>
              <div className="result-value">{gameSession.stars}</div>
            </div>
            
            <div className="result-card">
              <div className="result-icon">📊</div>
              <div className="result-label">Accuracy</div>
              <div className="result-value">{Math.round(accuracy)}%</div>
            </div>
            
            {mode === 'timed' && (
              <div className="result-card">
                <div className="result-icon">⏱️</div>
                <div className="result-label">Time</div>
                <div className="result-value">{totalTime}s</div>
              </div>
            )}
          </div>
          
          <div className="result-buttons">
            <motion.button
              className="play-again-button"
              onClick={handlePlayAgain}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Play Again
            </motion.button>
            
            <button className="back-button" onClick={handleBackToMenu}>
              🏠 Back to Menu
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active game
  if (!currentRound) {
    return (
      <div className="game-container">
        <div className="loading">Loading next round...</div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        {storyConfig && (
          <div className="story-banner">
            <span className="story-banner-badge" aria-hidden="true">{storyConfig.badge}</span>
            <div>
              <strong>{storyConfig.title}</strong>
              <span>{getCategoryDisplayName(category)} chapter · {storyConfig.mission}</span>
            </div>
          </div>
        )}

        <div className="game-controls">
          <button
            className="pause-button"
            onClick={isRoundActive ? pauseGame : resumeGame}
            aria-label={isRoundActive ? "Pause game" : "Resume game"}
          >
            {isRoundActive ? '⏸️' : '▶️'}
          </button>
          
          <div className="game-title">
            {getModeTitle()} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </div>
          
          <button className="quit-button" onClick={handleBackToMenu}>
            ❌ Quit
          </button>
        </div>
        
        <ProgressBar
          currentRound={currentRoundNumber}
          totalRounds={totalRounds}
          stars={gameSession?.stars || 0}
          maxStars={totalRounds}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentRound.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={motionTransition}
        >
          <GameBoard
            currentRound={currentRound}
            onItemSelect={handleItemSelect}
            onRoundComplete={handleRoundComplete}
            showTimer={hasTimeLimit}
            timeRemaining={timeRemaining}
            autoPlayPrompts={settings?.autoPlayPrompts ?? true}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      </AnimatePresence>
      
      {showPauseOverlay && (
        <motion.div
          className="pause-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="pause-content">
            <h2>Game Paused</h2>
            <button className="resume-button" onClick={resumeGame}>
              ▶️ Resume
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Game;
