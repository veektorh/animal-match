import { useState, useCallback, useEffect, useMemo } from 'react';
import { GameSession, GameRound, Item, GameMode, DifficultyLevel, Category, RoundOutcome, RoundResult } from '../types';
import { getItemsByCategory } from '../data/items';

interface UseGameProps {
  mode: GameMode;
  category: Category;
  difficulty: DifficultyLevel;
  roundCount?: number;
  timeLimit?: number;
  unlockedItems?: string[];
  unlockedAnimals?: string[]; // Keep for backward compatibility
  practiceItemIds?: string[];
}

export const useGame = ({
  mode,
  category,
  difficulty,
  roundCount = 5,
  timeLimit,
  unlockedItems = [],
  unlockedAnimals = [],
  practiceItemIds = []
}: UseGameProps) => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isRoundActive, setIsRoundActive] = useState(false);
  const unlockedItemIds = useMemo(
    () => new Set([...unlockedItems, ...unlockedAnimals]),
    [unlockedItems, unlockedAnimals]
  );
  const practiceItemIdSet = useMemo(() => new Set(practiceItemIds), [practiceItemIds]);

  const getBaseOptionCount = useCallback(() => {
    return difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 6;
  }, [difficulty]);

  const getAdaptiveOptionCount = useCallback((correctStreak = 0, lastWasCorrect = true) => {
    const baseOptionCount = getBaseOptionCount();
    const adjustment = correctStreak >= 2 ? 1 : lastWasCorrect ? 0 : -1;

    return Math.max(2, Math.min(6, baseOptionCount + adjustment));
  }, [getBaseOptionCount]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRoundActive && timeRemaining > 0 && timeLimit) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRoundActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRoundActive, timeRemaining, timeLimit]);

  const generateRound = useCallback((targetItem: Item, roundIndex: number, optionCount = getBaseOptionCount()): GameRound => {
    
    // Get items from the same category and difficulty level
    const allCategoryItems = getItemsByCategory(category);
    const allDifficultyItems = allCategoryItems.filter(item => item.difficulty === difficulty);
    
    let possibleOptions = allDifficultyItems.filter(
      item => item.id !== targetItem.id && 
      (item.unlocked || unlockedItemIds.has(item.id))
    );

    // If not enough unlocked items of this difficulty, include easier ones
    if (possibleOptions.length < optionCount - 1) {
      const easyItems = allCategoryItems.filter(item => 
        item.difficulty === 'easy' &&
        item.id !== targetItem.id && 
        (item.unlocked || unlockedItemIds.has(item.id))
      );
      possibleOptions = [...possibleOptions, ...easyItems].slice(0, Math.max(possibleOptions.length, optionCount - 1));
    }

    // Randomly select options
    const selectedOptions = possibleOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, optionCount - 1);

    // Add target item and shuffle
    const allOptions = [targetItem, ...selectedOptions].sort(() => Math.random() - 0.5);

    return {
      id: `round-${roundIndex}`,
      targetItem,
      options: allOptions,
      difficulty,
      timeLimit,
      optionCount
    };
  }, [category, difficulty, getBaseOptionCount, timeLimit, unlockedItemIds]);

  const generateGameSession = useCallback((): GameSession => {
    // Get available items for the category and difficulty
    const allCategoryItems = getItemsByCategory(category);
    const practiceItems = mode === 'practice'
      ? allCategoryItems.filter(item =>
        practiceItemIdSet.has(item.id) &&
        (item.unlocked || unlockedItemIds.has(item.id))
      )
      : [];
    const availableItems = allCategoryItems.filter(item => 
      item.difficulty === difficulty && 
      (item.unlocked || unlockedItemIds.has(item.id))
    );
    
    // If weak-spot practice has saved targets, use those first.
    let gameItems = practiceItems.length > 0 ? practiceItems : availableItems;
    if (gameItems.length < roundCount && practiceItems.length === 0) {
      const easyItems = allCategoryItems.filter(item => 
        item.difficulty === 'easy' && 
        (item.unlocked || unlockedItemIds.has(item.id))
      );
      gameItems = [...availableItems, ...easyItems].slice(0, roundCount);
    }

    if (gameItems.length === 0) {
      gameItems = allCategoryItems.filter(item => item.unlocked || unlockedItemIds.has(item.id));
    }

    // Generate rounds
    const rounds: GameRound[] = [];
    const usedItems = new Set<string>();

    for (let i = 0; i < roundCount; i++) {
      // Select target item (avoid repeats)
      const availableTargets = gameItems.filter(item => !usedItems.has(item.id));
      const targetItem = availableTargets.length > 0 
        ? availableTargets[Math.floor(Math.random() * availableTargets.length)]
        : gameItems[Math.floor(Math.random() * gameItems.length)];

      usedItems.add(targetItem.id);
      rounds.push(generateRound(targetItem, i));
    }

    return {
      id: `game-${Date.now()}`,
      mode,
      category,
      difficulty,
      rounds,
      currentRoundIndex: 0,
      score: 0,
      stars: 0,
      startTime: Date.now(),
      correctStreak: 0,
      roundResults: []
    };
  }, [mode, category, difficulty, roundCount, generateRound, practiceItemIdSet, unlockedItemIds]);

  const startGame = useCallback(() => {
    const session = generateGameSession();
    setGameSession(session);
    setCurrentRound(session.rounds[0]);
    setIsGameActive(true);
    setIsRoundActive(true);
    
    if (timeLimit) {
      setTimeRemaining(timeLimit);
    }
  }, [generateGameSession, timeLimit]);

  const nextRound = useCallback((outcome: RoundOutcome | boolean) => {
    if (!gameSession || !currentRound) return;

    const roundOutcome: RoundOutcome = typeof outcome === 'boolean'
      ? { correct: outcome, attempts: 1 }
      : outcome;
    const wasCorrect = roundOutcome.correct;
    const cleanCorrect = wasCorrect && roundOutcome.attempts <= 1;
    const roundResult: RoundResult = {
      ...roundOutcome,
      attempts: Math.max(1, roundOutcome.attempts),
      roundId: currentRound.id,
      targetItemId: currentRound.targetItem.id,
      targetItemName: currentRound.targetItem.name,
      category,
      difficulty,
      mode
    };

    // Update session score and stars
    const nextCorrectStreak = cleanCorrect ? (gameSession.correctStreak || 0) + 1 : 0;
    const updatedSession = {
      ...gameSession,
      score: gameSession.score + (wasCorrect ? 1 : 0),
      stars: gameSession.stars + (wasCorrect ? 1 : 0),
      correctStreak: nextCorrectStreak,
      roundResults: [...(gameSession.roundResults || []), roundResult]
    };

    // Check if game is complete
    const nextRoundIndex = updatedSession.currentRoundIndex + 1;
    
    if (nextRoundIndex >= updatedSession.rounds.length) {
      // Game complete
      updatedSession.endTime = Date.now();
      setGameSession(updatedSession);
      setIsGameActive(false);
      setIsRoundActive(false);
      return updatedSession; // Return final session for completion handling
    }

    // Move to next round
    updatedSession.currentRoundIndex = nextRoundIndex;
    const nextRoundData = generateRound(
      updatedSession.rounds[nextRoundIndex].targetItem,
      nextRoundIndex,
      getAdaptiveOptionCount(nextCorrectStreak, wasCorrect)
    );
    updatedSession.rounds[nextRoundIndex] = nextRoundData;
    
    setGameSession(updatedSession);
    setCurrentRound(nextRoundData);
    setIsRoundActive(true);
    
    if (timeLimit) {
      setTimeRemaining(timeLimit);
    }

    return null; // Game continues
  }, [gameSession, currentRound, timeLimit, generateRound, getAdaptiveOptionCount, category, difficulty, mode]);

  const pauseGame = useCallback(() => {
    setIsRoundActive(false);
  }, []);

  const resumeGame = useCallback(() => {
    if (isGameActive) {
      setIsRoundActive(true);
    }
  }, [isGameActive]);

  const endGame = useCallback(() => {
    if (gameSession) {
      const endedSession = { ...gameSession, endTime: Date.now() };
      setGameSession(endedSession);
    }
    setIsGameActive(false);
    setIsRoundActive(false);
    return gameSession;
  }, [gameSession]);

  const resetGame = useCallback(() => {
    setGameSession(null);
    setCurrentRound(null);
    setTimeRemaining(0);
    setIsGameActive(false);
    setIsRoundActive(false);
  }, []);

  return {
    // State
    gameSession,
    currentRound,
    timeRemaining,
    isGameActive,
    isRoundActive,
    
    // Actions
    startGame,
    nextRound,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,

    // Computed values
    currentRoundNumber: gameSession ? gameSession.currentRoundIndex + 1 : 0,
    totalRounds: roundCount,
    progress: gameSession ? ((gameSession.currentRoundIndex) / gameSession.rounds.length) * 100 : 0,
    isComplete: gameSession ? gameSession.currentRoundIndex >= gameSession.rounds.length : false,
    hasTimeLimit: !!timeLimit
  };
};
