import React, { useMemo, useState, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import MainMenu from './components/MainMenu';
import Game from './components/Game';
import Settings from './components/Settings';
import StickerCollectionView from './components/StickerCollectionView';
import {
  GameMode,
  DifficultyLevel,
  PlayerProgress,
  GameSettings,
  Category,
  Achievement,
  CategoryProgressStats,
  GameSession,
  ProgressBreakdown,
  ItemProgressStats,
  RoundResult
} from './types';
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
const DEFAULT_DIFFICULTIES: DifficultyLevel[] = ['easy', 'medium', 'hard'];
const DEFAULT_GAME_MODES: GameMode[] = ['free-play', 'timed', 'story', 'practice'];
const STARTER_ITEM_IDS = ['cow', 'pig', 'chicken', 'horse', 'sheep', 'duck', 'cat', 'dog', 'rabbit', 'frog'];

const createEmptyProgressBreakdown = (): ProgressBreakdown => ({
  gamesPlayed: 0,
  roundsPlayed: 0,
  correctRounds: 0,
  bestScore: 0
});

const createDefaultDifficultyStats = (): { [key in DifficultyLevel]: ProgressBreakdown } => (
  DEFAULT_DIFFICULTIES.reduce((stats, difficulty) => ({
    ...stats,
    [difficulty]: createEmptyProgressBreakdown()
  }), {} as { [key in DifficultyLevel]: ProgressBreakdown })
);

const createDefaultModeStats = (): { [key in GameMode]: ProgressBreakdown } => (
  DEFAULT_GAME_MODES.reduce((stats, mode) => ({
    ...stats,
    [mode]: createEmptyProgressBreakdown()
  }), {} as { [key in GameMode]: ProgressBreakdown })
);

const createEmptyCategoryStats = (): CategoryProgressStats => ({
  ...createEmptyProgressBreakdown(),
  byDifficulty: createDefaultDifficultyStats(),
  byMode: createDefaultModeStats()
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
  difficultyStats: createDefaultDifficultyStats(),
  modeStats: createDefaultModeStats(),
  itemStats: {},
  // Keep for backward compatibility
  unlockedAnimals: [...STARTER_ITEM_IDS],
  unlockedHabitats: ['farm']
});

const normalizeProgress = (progress: Partial<PlayerProgress>): PlayerProgress => {
  const defaults = createDefaultProgress();
  const savedCategoryStats = progress.categoryStats || {};
  const savedDifficultyStats = progress.difficultyStats || {};
  const savedModeStats = progress.modeStats || {};

  return {
    ...defaults,
    ...progress,
    unlockedItems: progress.unlockedItems?.length ? progress.unlockedItems : defaults.unlockedItems,
    unlockedCategories: progress.unlockedCategories?.length ? progress.unlockedCategories : defaults.unlockedCategories,
    achievements: progress.achievements || defaults.achievements,
    unlockedAnimals: progress.unlockedAnimals || defaults.unlockedAnimals,
    unlockedHabitats: progress.unlockedHabitats || defaults.unlockedHabitats,
    perfectRounds: progress.perfectRounds || 0,
    difficultyStats: DEFAULT_DIFFICULTIES.reduce((stats, difficulty) => ({
      ...stats,
      [difficulty]: {
        ...createEmptyProgressBreakdown(),
        ...(savedDifficultyStats[difficulty] || {})
      }
    }), {} as { [key in DifficultyLevel]: ProgressBreakdown }),
    modeStats: DEFAULT_GAME_MODES.reduce((stats, mode) => ({
      ...stats,
      [mode]: {
        ...createEmptyProgressBreakdown(),
        ...(savedModeStats[mode] || {})
      }
    }), {} as { [key in GameMode]: ProgressBreakdown }),
    itemStats: progress.itemStats || defaults.itemStats,
    categoryStats: DEFAULT_CATEGORIES.reduce((stats, category) => ({
      ...stats,
      [category]: normalizeCategoryStats(savedCategoryStats[category])
    }), {} as { [key in Category]: CategoryProgressStats })
  };
};

const normalizeCategoryStats = (stats?: CategoryProgressStats): CategoryProgressStats => {
  const savedByDifficulty = stats?.byDifficulty || {};
  const savedByMode = stats?.byMode || {};

  return {
    ...createEmptyCategoryStats(),
    ...(stats || {}),
    byDifficulty: DEFAULT_DIFFICULTIES.reduce((byDifficulty, difficulty) => ({
      ...byDifficulty,
      [difficulty]: {
        ...createEmptyProgressBreakdown(),
        ...(savedByDifficulty[difficulty] || {})
      }
    }), {} as { [key in DifficultyLevel]: ProgressBreakdown }),
    byMode: DEFAULT_GAME_MODES.reduce((byMode, mode) => ({
      ...byMode,
      [mode]: {
        ...createEmptyProgressBreakdown(),
        ...(savedByMode[mode] || {})
      }
    }), {} as { [key in GameMode]: ProgressBreakdown })
  };
};

const updateProgressBreakdown = (
  stats: ProgressBreakdown | undefined,
  score: number,
  totalRounds: number,
  playedDate: string
): ProgressBreakdown => {
  const current = {
    ...createEmptyProgressBreakdown(),
    ...(stats || {})
  };

  return {
    ...current,
    gamesPlayed: current.gamesPlayed + 1,
    roundsPlayed: current.roundsPlayed + totalRounds,
    correctRounds: current.correctRounds + score,
    bestScore: Math.max(current.bestScore, score),
    lastPlayedDate: playedDate
  };
};

const updateItemProgress = (
  itemStats: { [itemId: string]: ItemProgressStats },
  result: RoundResult,
  playedDate: string
): { [itemId: string]: ItemProgressStats } => {
  const current = itemStats[result.targetItemId] || {
    itemId: result.targetItemId,
    itemName: result.targetItemName,
    category: result.category,
    difficulty: result.difficulty,
    roundsPlayed: 0,
    correctRounds: 0,
    missedRounds: 0,
    attempts: 0,
    extraAttempts: 0
  };
  const attempts = Math.max(1, result.attempts);

  return {
    ...itemStats,
    [result.targetItemId]: {
      ...current,
      itemName: result.targetItemName,
      category: result.category,
      difficulty: result.difficulty,
      roundsPlayed: current.roundsPlayed + 1,
      correctRounds: current.correctRounds + (result.correct ? 1 : 0),
      missedRounds: current.missedRounds + (result.correct ? 0 : 1),
      attempts: current.attempts + attempts,
      extraAttempts: current.extraAttempts + Math.max(0, attempts - 1),
      lastPlayedDate: playedDate,
      lastCorrectDate: result.correct ? playedDate : current.lastCorrectDate
    }
  };
};

const getPracticeNeedScore = (stats: ItemProgressStats): number => (
  (stats.missedRounds * 3) + (stats.extraAttempts * 2)
);

const getWeakPracticeItemIds = (progress: PlayerProgress, category: Category): string[] => (
  Object.values(progress.itemStats || {})
    .filter(stats => stats.category === category && getPracticeNeedScore(stats) > 0)
    .sort((a, b) => getPracticeNeedScore(b) - getPracticeNeedScore(a))
    .slice(0, 8)
    .map(stats => stats.itemId)
);

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

  const weakPracticeItemsByCategory = useMemo(() => (
    DEFAULT_CATEGORIES.reduce((practiceItems, category) => ({
      ...practiceItems,
      [category]: getWeakPracticeItemIds(playerProgress, category)
    }), {} as { [key in Category]: string[] })
  ), [playerProgress]);

  const handleStartGame = (mode: GameMode, difficulty: DifficultyLevel, category: Category) => {
    setAppState({
      currentScreen: 'game',
      gameMode: mode,
      gameCategory: category,
      gameDifficulty: difficulty,
      showStickerCollection: false
    });
  };

  const handleGameComplete = (
    score: number,
    stars: number,
    totalTime: number,
    totalRounds: number,
    session: GameSession
  ) => {
    // Update player progress
    setPlayerProgress(prev => {
      const normalizedPrev = normalizeProgress(prev);
      const playedDate = new Date().toISOString();
      const category = session.category || appState.gameCategory || 'animals';
      const difficulty = session.difficulty || appState.gameDifficulty || 'easy';
      const mode = session.mode || appState.gameMode || 'free-play';
      const roundResults = session.roundResults || [];
      const previousCategoryStats = normalizedPrev.categoryStats?.[category] || createEmptyCategoryStats();
      const updatedCategoryBreakdown = updateProgressBreakdown(previousCategoryStats, score, totalRounds, playedDate);
      const updatedCategoryStats: CategoryProgressStats = {
        ...previousCategoryStats,
        ...updatedCategoryBreakdown,
        byDifficulty: {
          ...(previousCategoryStats.byDifficulty || {}),
          [difficulty]: updateProgressBreakdown(previousCategoryStats.byDifficulty?.[difficulty], score, totalRounds, playedDate)
        },
        byMode: {
          ...(previousCategoryStats.byMode || {}),
          [mode]: updateProgressBreakdown(previousCategoryStats.byMode?.[mode], score, totalRounds, playedDate)
        }
      };
      const updatedItemStats = roundResults.reduce(
        (stats, result) => updateItemProgress(stats, result, playedDate),
        { ...(normalizedPrev.itemStats || {}) }
      );
      const newProgress = {
        ...normalizedPrev,
        totalGamesPlayed: normalizedPrev.totalGamesPlayed + 1,
        totalStars: normalizedPrev.totalStars + stars,
        lastPlayedDate: playedDate,
        perfectRounds: (normalizedPrev.perfectRounds || 0) + (score === totalRounds ? totalRounds : 0),
        categoryStats: {
          ...normalizedPrev.categoryStats,
          [category]: updatedCategoryStats
        },
        difficultyStats: {
          ...(normalizedPrev.difficultyStats || {}),
          [difficulty]: updateProgressBreakdown(normalizedPrev.difficultyStats?.[difficulty], score, totalRounds, playedDate)
        },
        modeStats: {
          ...(normalizedPrev.modeStats || {}),
          [mode]: updateProgressBreakdown(normalizedPrev.modeStats?.[mode], score, totalRounds, playedDate)
        },
        itemStats: updatedItemStats
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
              practiceItemIds={
                appState.gameMode === 'practice' && appState.gameCategory
                  ? weakPracticeItemsByCategory[appState.gameCategory] || []
                  : []
              }
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
            weakPracticeItemsByCategory={weakPracticeItemsByCategory}
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
