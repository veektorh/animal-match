import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameBoard from './GameBoard';
import ProgressBar from './ProgressBar';
import { useGame } from '../hooks/useGame';
import { GameMode, DifficultyLevel, Animal, PlayerProgress } from '../types';
import './Game.css';

interface GameProps {
  mode: GameMode;
  difficulty: DifficultyLevel;
  onGameComplete?: (score: number, stars: number, totalTime: number) => void;
  onBackToMenu?: () => void;
  unlockedAnimals?: string[];
}

const Game: React.FC<GameProps> = ({
  mode,
  difficulty,
  onGameComplete,
  onBackToMenu,
  unlockedAnimals = []
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Game configuration based on mode
  const getGameConfig = () => {
    switch (mode) {
      case 'timed':
        return { roundCount: 10, timeLimit: 15 };
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
    endGame,
    resetGame,
    currentRoundNumber,
    totalRounds,
    isComplete,
    hasTimeLimit
  } = useGame({
    mode,
    difficulty,
    roundCount: config.roundCount,
    timeLimit: config.timeLimit,
    unlockedAnimals
  });

  const handleStartGame = () => {
    setGameStarted(true);
    startGame();
  };

  const handleAnimalSelect = useCallback((animal: Animal) => {
    // This is handled by GameBoard, just for tracking
    console.log('Animal selected:', animal.name);
  }, []);

  const handleRoundComplete = useCallback((wasCorrect: boolean) => {
    const completedSession = nextRound(wasCorrect);
    
    if (completedSession) {
      // Game is complete
      const totalTime = completedSession.endTime ? 
        (completedSession.endTime - completedSession.startTime) / 1000 : 0;
      
      setShowResults(true);
      
      if (onGameComplete) {
        onGameComplete(completedSession.score, completedSession.stars, totalTime);
      }
    }
  }, [nextRound, onGameComplete]);

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
        return 'Find animals quickly before time runs out!';
      case 'story':
        return 'Help the animals in their magical adventure!';
      case 'free-play':
      default:
        return 'Take your time and have fun learning about animals!';
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
          transition={{ duration: 0.5 }}
        >
          <h1>{getModeTitle()}</h1>
          <p className="mode-description">{getModeDescription()}</p>
          
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
          transition={{ duration: 0.5 }}
        >
          <h1>🎉 Great Job!</h1>
          
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
          transition={{ duration: 0.3 }}
        >
          <GameBoard
            currentRound={currentRound}
            onAnimalSelect={handleAnimalSelect}
            onRoundComplete={handleRoundComplete}
            showTimer={hasTimeLimit}
            timeRemaining={timeRemaining}
          />
        </motion.div>
      </AnimatePresence>
      
      {!isRoundActive && isGameActive && (
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