import React, { useState, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import Settings from './components/Settings';
import StickerCollectionView from './components/StickerCollectionView';
import { GameMode, DifficultyLevel, PlayerProgress, GameSettings, Category, Achievement, CategoryProgressStats } from './types';
import { ACHIEVEMENTS } from './data/animals';
import { audioManager } from './utils/AudioManager';
import './App.css';

interface AppState {
  currentScreen: 'menu' | 'game' | 'settings';
  gameMode: GameMode | null;
  gameCategory: Category | null;
  gameDifficulty: DifficultyLevel | null;
  showStickerCollection: boolean;
}

const DEFAULT_CATEGORIES: Category[] = ['animals', 'numbers', 'alphabets', 'colors', 'fruits'];
const STARTER_ITEM_IDS = ['cow', 'pig', 'chicken', 'horse', 'sheep', 'duck', 'cat', 'dog', 'rabbit', 'frog'];

const createEmptyCategoryStats = (): CategoryProgressStats => ({
  gamesPlayed: 0,
  roundsPlayed: 0,
  correctRounds: 0,
  bestScore: 0
});

const createDefaultCategoryStats = (): { [key in Category]: CategoryProgressStats } => (
  DEFAULT_CATEGORIES.reduce((stats, category) => ({
    ...stats,
    [category]: createEmptyCategoryStats()
  }), {} as { [key in Category]: CategoryProgressStats })
);

const createDefaultProgress = (): PlayerProgress => ({
  totalGamesPlayed: 0,
  totalStars: 0,
  unlockedItems: [...STARTER_ITEM_IDS],
  unlockedCategories: [...DEFAULT_CATEGORIES],
  achievements: [],
  lastPlayedDate: new Date().toISOString(),
  perfectRounds: 0,
  categoryStats: createDefaultCategoryStats(),
  // Keep for backward compatibility
  unlockedAnimals: [...STARTER_ITEM_IDS],
  unlockedHabitats: ['farm']
});

const normalizeProgress = (progress: Partial<PlayerProgress>): PlayerProgress => {
  const defaults = createDefaultProgress();
  const savedCategoryStats = progress.categoryStats || {};

  return {
    ...defaults,
    ...progress,
    unlockedItems: progress.unlockedItems?.length ? progress.unlockedItems : defaults.unlockedItems,
    unlockedCategories: progress.unlockedCategories?.length ? progress.unlockedCategories : defaults.unlockedCategories,
    achievements: progress.achievements || defaults.achievements,
    unlockedAnimals: progress.unlockedAnimals || defaults.unlockedAnimals,
    unlockedHabitats: progress.unlockedHabitats || defaults.unlockedHabitats,
    perfectRounds: progress.perfectRounds || 0,
    categoryStats: DEFAULT_CATEGORIES.reduce((stats, category) => ({
      ...stats,
      [category]: {
        ...createEmptyCategoryStats(),
        ...(savedCategoryStats[category] || {})
      }
    }), {} as { [key in Category]: CategoryProgressStats })
  };
};

const getAchievementValue = (progress: PlayerProgress, type: Achievement['requirement']['type']) => {
  switch (type) {
    case 'games_played':
      return progress.totalGamesPlayed;
    case 'stars_earned':
      return progress.totalStars;
    case 'perfect_rounds':
      return progress.perfectRounds || 0;
    case 'items_unlocked':
      return progress.unlockedItems.length;
    case 'categories_unlocked':
      return progress.unlockedCategories.length;
    default:
      return 0;
  }
};

const unlockEligibleAchievements = (progress: PlayerProgress): { progress: PlayerProgress; unlocked: Achievement[] } => {
  const existingAchievementIds = new Set(progress.achievements.map(achievement => achievement.id));
  const unlocked = ACHIEVEMENTS
    .filter(achievement => !existingAchievementIds.has(achievement.id))
    .filter(achievement => getAchievementValue(progress, achievement.requirement.type) >= achievement.requirement.value)
    .map(achievement => ({
      ...achievement,
      unlockedDate: new Date().toISOString()
    }));

  return {
    progress: unlocked.length > 0
      ? { ...progress, achievements: [...progress.achievements, ...unlocked] }
      : progress,
    unlocked
  };
};

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'menu',
    gameMode: null,
    gameCategory: null,
    gameDifficulty: null,
    showStickerCollection: false
  });

  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(createDefaultProgress);
  const [achievementToast, setAchievementToast] = useState<Achievement | null>(null);

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
        setPlayerProgress(normalizeProgress(progress));
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

  useEffect(() => {
    audioManager.setSoundEnabled(gameSettings.soundEnabled);
  }, [gameSettings.soundEnabled]);

  useEffect(() => {
    if (!achievementToast) return;

    const timeout = window.setTimeout(() => {
      setAchievementToast(null);
    }, 4500);

    return () => window.clearTimeout(timeout);
  }, [achievementToast]);

  const handleStartGame = (mode: GameMode, difficulty: DifficultyLevel, category: Category) => {
    setAppState({
      currentScreen: 'game',
      gameMode: mode,
      gameCategory: category,
      gameDifficulty: difficulty,
      showStickerCollection: false
    });
  };

  const handleGameComplete = (score: number, stars: number, totalTime: number, totalRounds: number) => {
    // Update player progress
    setPlayerProgress(prev => {
      const normalizedPrev = normalizeProgress(prev);
      const playedDate = new Date().toISOString();
      const category = appState.gameCategory || 'animals';
      const previousCategoryStats = normalizedPrev.categoryStats?.[category] || createEmptyCategoryStats();
      const newProgress = {
        ...normalizedPrev,
        totalGamesPlayed: normalizedPrev.totalGamesPlayed + 1,
        totalStars: normalizedPrev.totalStars + stars,
        lastPlayedDate: playedDate,
        perfectRounds: (normalizedPrev.perfectRounds || 0) + (score === totalRounds ? totalRounds : 0),
        categoryStats: {
          ...normalizedPrev.categoryStats,
          [category]: {
            gamesPlayed: previousCategoryStats.gamesPlayed + 1,
            roundsPlayed: previousCategoryStats.roundsPlayed + totalRounds,
            correctRounds: previousCategoryStats.correctRounds + score,
            bestScore: Math.max(previousCategoryStats.bestScore, score),
            lastPlayedDate: playedDate
          }
        }
      };

      // Unlock new animals based on stars earned
      const totalStarsAfter = newProgress.totalStars;
      const newUnlockedAnimals = [...(normalizedPrev.unlockedAnimals || [])];

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
      newProgress.unlockedItems = Array.from(new Set([
        ...(normalizedPrev.unlockedItems || []),
        ...newUnlockedAnimals
      ]));

      const achievementResult = unlockEligibleAchievements(newProgress);
      if (achievementResult.unlocked.length > 0) {
        setAchievementToast(achievementResult.unlocked[0]);
      }

      return achievementResult.progress;
    });

    console.log(`Game completed! Score: ${score}, Stars: ${stars}, Time: ${totalTime}s`);
  };

  const handleBackToMenu = () => {
    setAppState({
      currentScreen: 'menu',
      gameMode: null,
      gameCategory: null,
      gameDifficulty: null,
      showStickerCollection: false
    });
  };

  const handleShowSettings = () => {
    setAppState(prev => ({ ...prev, currentScreen: 'settings', showStickerCollection: false }));
  };

  const handleShowStickerCollection = () => {
    setAppState(prev => ({ ...prev, showStickerCollection: true }));
  };

  const handleCloseStickerCollection = () => {
    setAppState(prev => ({ ...prev, showStickerCollection: false }));
  };

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setGameSettings(newSettings);
  };

  const handleResetProgress = () => {
    setPlayerProgress(createDefaultProgress());
    setAchievementToast(null);
  };

  const renderCurrentScreen = () => {
    switch (appState.currentScreen) {
      case 'game':
        if (appState.gameMode && appState.gameDifficulty && appState.gameCategory) {
          return (
            <Game
              mode={appState.gameMode}
              category={appState.gameCategory}
              difficulty={appState.gameDifficulty}
              onGameComplete={handleGameComplete}
              onBackToMenu={handleBackToMenu}
              unlockedItems={playerProgress.unlockedItems || []}
              // Keep for backward compatibility
              unlockedAnimals={playerProgress.unlockedAnimals}
              settings={gameSettings}
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
            onShowStickerCollection={handleShowStickerCollection}
            playerProgress={{
              totalGamesPlayed: playerProgress.totalGamesPlayed,
              totalStars: playerProgress.totalStars,
              unlockedAnimals: playerProgress.unlockedAnimals,
              unlockedItems: playerProgress.unlockedItems
            }}
            defaultDifficulty={gameSettings.difficulty}
          />
        );
    }
  };

  const appClassName = [
    'App',
    gameSettings.highContrast ? 'high-contrast' : '',
    gameSettings.reducedMotion ? 'reduced-motion' : '',
    `animation-${gameSettings.animationSpeed}`
  ].filter(Boolean).join(' ');

  return (
    <MotionConfig reducedMotion={gameSettings.reducedMotion ? 'always' : 'user'}>
      <div className={appClassName}>
        {renderCurrentScreen()}
        
        <StickerCollectionView 
          isOpen={appState.showStickerCollection}
          onClose={handleCloseStickerCollection}
        />

        {achievementToast && (
          <div className="achievement-toast" role="status" aria-live="polite">
            <span className="achievement-toast-icon" aria-hidden="true">{achievementToast.icon}</span>
            <div>
              <strong>Achievement unlocked!</strong>
              <span>{achievementToast.name}</span>
            </div>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}

export default App;
