import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import Settings from './components/Settings';
import { GameMode, DifficultyLevel, PlayerProgress, GameSettings } from './types';
import './App.css';

interface AppState {
  currentScreen: 'menu' | 'game' | 'settings';
  gameMode: GameMode | null;
  gameDifficulty: DifficultyLevel | null;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'menu',
    gameMode: null,
    gameDifficulty: null
  });

  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>({
    totalGamesPlayed: 0,
    totalStars: 0,
    unlockedAnimals: ['cow', 'pig', 'chicken', 'horse', 'sheep', 'duck', 'cat', 'dog', 'rabbit', 'frog'],
    unlockedHabitats: ['farm'],
    achievements: [],
    lastPlayedDate: new Date().toISOString()
  });

  const [gameSettings, setGameSettings] = useState<GameSettings>({
    soundEnabled: true,
    musicEnabled: true,
    autoPlayPrompts: true,
    difficulty: 'easy',
    timeLimit: 15,
    animationSpeed: 'normal',
    highContrast: false,
    reducedMotion: false
  });

  // Load progress and settings from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('animalMatchProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setPlayerProgress(progress);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }

    const savedSettings = localStorage.getItem('animalMatchSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setGameSettings(settings);
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  // Save progress and settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('animalMatchProgress', JSON.stringify(playerProgress));
  }, [playerProgress]);

  useEffect(() => {
    localStorage.setItem('animalMatchSettings', JSON.stringify(gameSettings));
  }, [gameSettings]);

  const handleStartGame = (mode: GameMode, difficulty: DifficultyLevel) => {
    setAppState({
      currentScreen: 'game',
      gameMode: mode,
      gameDifficulty: difficulty
    });
  };

  const handleGameComplete = (score: number, stars: number, totalTime: number) => {
    // Update player progress
    setPlayerProgress(prev => {
      const newProgress = {
        ...prev,
        totalGamesPlayed: prev.totalGamesPlayed + 1,
        totalStars: prev.totalStars + stars,
        lastPlayedDate: new Date().toISOString()
      };

      // Unlock new animals based on stars earned
      const totalStarsAfter = newProgress.totalStars;
      const newUnlockedAnimals = [...prev.unlockedAnimals];

      // Unlock forest animals at 10 stars
      if (totalStarsAfter >= 10 && !newUnlockedAnimals.includes('bear')) {
        newUnlockedAnimals.push('bear', 'fox', 'wolf', 'deer', 'owl', 'squirrel');
      }

      // Unlock ocean animals at 25 stars
      if (totalStarsAfter >= 25 && !newUnlockedAnimals.includes('fish')) {
        newUnlockedAnimals.push('fish', 'dolphin', 'whale', 'octopus', 'crab');
      }

      // Unlock jungle animals at 50 stars
      if (totalStarsAfter >= 50 && !newUnlockedAnimals.includes('lion')) {
        newUnlockedAnimals.push('lion', 'tiger', 'elephant', 'monkey', 'gorilla', 'parrot');
      }

      newProgress.unlockedAnimals = newUnlockedAnimals;

      return newProgress;
    });

    console.log(`Game completed! Score: ${score}, Stars: ${stars}, Time: ${totalTime}s`);
  };

  const handleBackToMenu = () => {
    setAppState({
      currentScreen: 'menu',
      gameMode: null,
      gameDifficulty: null
    });
  };

  const handleShowSettings = () => {
    setAppState(prev => ({ ...prev, currentScreen: 'settings' }));
  };

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setGameSettings(newSettings);
  };

  const handleResetProgress = () => {
    const defaultProgress: PlayerProgress = {
      totalGamesPlayed: 0,
      totalStars: 0,
      unlockedAnimals: ['cow', 'pig', 'chicken', 'horse', 'sheep', 'duck', 'cat', 'dog', 'rabbit', 'frog'],
      unlockedHabitats: ['farm'],
      achievements: [],
      lastPlayedDate: new Date().toISOString()
    };
    setPlayerProgress(defaultProgress);
  };

  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case 'game':
        if (appState.gameMode && appState.gameDifficulty) {
          return (
            <Game
              mode={appState.gameMode}
              difficulty={appState.gameDifficulty}
              onGameComplete={handleGameComplete}
              onBackToMenu={handleBackToMenu}
              unlockedAnimals={playerProgress.unlockedAnimals}
            />
          );
        }
        return <div>Error: Game mode not selected</div>;

      case 'settings':
        return (
          <Settings
            settings={gameSettings}
            playerProgress={playerProgress}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
            onBackToMenu={handleBackToMenu}
          />
        );

      case 'menu':
      default:
        return (
          <MainMenu
            onStartGame={handleStartGame}
            onShowSettings={handleShowSettings}
            playerProgress={{
              totalGamesPlayed: playerProgress.totalGamesPlayed,
              totalStars: playerProgress.totalStars,
              unlockedAnimals: playerProgress.unlockedAnimals
            }}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
