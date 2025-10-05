import { useState, useCallback, useEffect } from 'react';
import { GameSession, GameRound, Animal, GameMode, DifficultyLevel, PlayerProgress } from '../types';
import { ANIMALS, getAnimalsByDifficulty, getRandomAnimals, getUnlockedAnimals } from '../data/animals';

interface UseGameProps {
  mode: GameMode;
  difficulty: DifficultyLevel;
  roundCount?: number;
  timeLimit?: number;
  unlockedAnimals?: string[];
}

export const useGame = ({ mode, difficulty, roundCount = 5, timeLimit, unlockedAnimals = [] }: UseGameProps) => {
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isRoundActive, setIsRoundActive] = useState(false);

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

  const generateRound = useCallback((targetAnimal: Animal, roundIndex: number): GameRound => {
    const optionCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 6;
    
    // Get animals that could be confused with target (same difficulty level)
    const allDifficultyAnimals = getAnimalsByDifficulty(difficulty);
    const availableUnlocked = getUnlockedAnimals(unlockedAnimals);
    
    let possibleOptions = allDifficultyAnimals.filter(
      animal => animal.id !== targetAnimal.id && 
      (animal.unlocked || unlockedAnimals.includes(animal.id))
    );

    // If not enough unlocked animals of this difficulty, include easier ones
    if (possibleOptions.length < optionCount - 1) {
      const easyAnimals = getAnimalsByDifficulty('easy').filter(
        animal => animal.id !== targetAnimal.id && 
        (animal.unlocked || unlockedAnimals.includes(animal.id))
      );
      possibleOptions = [...possibleOptions, ...easyAnimals].slice(0, Math.max(possibleOptions.length, optionCount - 1));
    }

    // Randomly select options
    const selectedOptions = possibleOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, optionCount - 1);

    // Add target animal and shuffle
    const allOptions = [targetAnimal, ...selectedOptions].sort(() => Math.random() - 0.5);

    return {
      id: `round-${roundIndex}`,
      targetAnimal,
      options: allOptions,
      difficulty,
      timeLimit
    };
  }, [difficulty, timeLimit]);

  const generateGameSession = useCallback((): GameSession => {
    // Get available animals for the difficulty
    const allUnlockedAnimals = getUnlockedAnimals(unlockedAnimals);
    const availableAnimals = allUnlockedAnimals.filter(animal => animal.difficulty === difficulty);
    
    // If not enough unlocked animals of this difficulty, include easier ones
    let gameAnimals = availableAnimals;
    if (gameAnimals.length < roundCount) {
      const easyAnimals = allUnlockedAnimals.filter(animal => animal.difficulty === 'easy');
      gameAnimals = [...availableAnimals, ...easyAnimals].slice(0, roundCount);
    }

    // Generate rounds
    const rounds: GameRound[] = [];
    const usedAnimals = new Set<string>();

    for (let i = 0; i < roundCount; i++) {
      // Select target animal (avoid repeats)
      const availableTargets = gameAnimals.filter(animal => !usedAnimals.has(animal.id));
      const targetAnimal = availableTargets.length > 0 
        ? availableTargets[Math.floor(Math.random() * availableTargets.length)]
        : gameAnimals[Math.floor(Math.random() * gameAnimals.length)];

      usedAnimals.add(targetAnimal.id);
      rounds.push(generateRound(targetAnimal, i));
    }

    return {
      id: `game-${Date.now()}`,
      mode,
      difficulty,
      rounds,
      currentRoundIndex: 0,
      score: 0,
      stars: 0,
      startTime: Date.now()
    };
  }, [mode, difficulty, roundCount, generateRound, unlockedAnimals]);

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

  const nextRound = useCallback((wasCorrect: boolean) => {
    if (!gameSession || !currentRound) return;

    // Update session score and stars
    const updatedSession = {
      ...gameSession,
      score: gameSession.score + (wasCorrect ? 1 : 0),
      stars: gameSession.stars + (wasCorrect ? 1 : 0)
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
    const nextRoundData = updatedSession.rounds[nextRoundIndex];
    
    setGameSession(updatedSession);
    setCurrentRound(nextRoundData);
    setIsRoundActive(true);
    
    if (timeLimit) {
      setTimeRemaining(timeLimit);
    }

    return null; // Game continues
  }, [gameSession, currentRound, timeLimit]);

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