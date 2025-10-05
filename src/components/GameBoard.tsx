import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import AnimalCard from './AnimalCard';
import { Animal, GameRound, FeedbackState } from '../types';
import { getRandomMessage } from '../data/animals';
import './GameBoard.css';

interface GameBoardProps {
  currentRound: GameRound;
  onAnimalSelect: (animal: Animal) => void;
  onRoundComplete: (correct: boolean) => void;
  showTimer?: boolean;
  timeRemaining?: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  currentRound,
  onAnimalSelect,
  onRoundComplete,
  showTimer = false,
  timeRemaining = 0
}) => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: null, message: '', showConfetti: false });
  const [feedbackAnimals, setFeedbackAnimals] = useState<{ [key: string]: 'correct' | 'incorrect' | null }>({});

  // Text-to-speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  // Announce the prompt when round changes
  useEffect(() => {
    const prompt = `Can you find the ${currentRound.targetAnimal.name}?`;
    speak(prompt);
  }, [currentRound.id]);

  // Handle time up
  useEffect(() => {
    if (showTimer && timeRemaining === 0 && !selectedAnimal) {
      handleTimeUp();
    }
  }, [timeRemaining, showTimer, selectedAnimal]);

  const handleAnimalClick = (animal: Animal) => {
    if (selectedAnimal) return; // Prevent multiple selections

    setSelectedAnimal(animal);
    onAnimalSelect(animal);

    const isCorrect = animal.id === currentRound.targetAnimal.id;
    
    if (isCorrect) {
      handleCorrectAnswer(animal);
    } else {
      handleIncorrectAnswer(animal);
    }
  };

  const handleCorrectAnswer = (animal: Animal) => {
    const message = getRandomMessage('correct', animal.name);
    setFeedback({ 
      type: 'correct', 
      message, 
      showConfetti: true 
    });
    
    setFeedbackAnimals({ [animal.id]: 'correct' });
    speak(message);

    // Complete round after animation
    setTimeout(() => {
      onRoundComplete(true);
      resetFeedback();
    }, 2000);
  };

  const handleIncorrectAnswer = (animal: Animal) => {
    const message = getRandomMessage('incorrect', currentRound.targetAnimal.name);
    setFeedback({ 
      type: 'incorrect', 
      message,
      showConfetti: false 
    });
    
    setFeedbackAnimals({ [animal.id]: 'incorrect' });
    speak(message);

    // Allow another try after feedback
    setTimeout(() => {
      setSelectedAnimal(null);
      setFeedbackAnimals({});
      setFeedback({ type: null, message: '', showConfetti: false });
    }, 1500);
  };

  const handleTimeUp = () => {
    const message = getRandomMessage('timeUp');
    setFeedback({ 
      type: 'encouraging', 
      message,
      showConfetti: false 
    });
    speak(message);

    setTimeout(() => {
      onRoundComplete(false);
      resetFeedback();
    }, 2000);
  };

  const resetFeedback = () => {
    setSelectedAnimal(null);
    setFeedback({ type: null, message: '', showConfetti: false });
    setFeedbackAnimals({});
  };

  const formatTime = (seconds: number): string => {
    return `${seconds}s`;
  };

  return (
    <div className="game-board">
      {feedback.showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="game-header">
        <motion.div 
          className="prompt"
          key={currentRound.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 id="target-hint">Can you find the {currentRound.targetAnimal.name}? {currentRound.targetAnimal.emoji}</h2>
          <button 
            className="repeat-button"
            onClick={() => speak(`Can you find the ${currentRound.targetAnimal.name}?`)}
            aria-label="Repeat the question"
          >
            🔊
          </button>
        </motion.div>

        {showTimer && (
          <motion.div 
            className={`timer ${timeRemaining <= 10 ? 'warning' : ''}`}
            animate={{ scale: timeRemaining <= 5 && timeRemaining > 0 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: timeRemaining <= 5 && timeRemaining > 0 ? Infinity : 0 }}
          >
            ⏰ {formatTime(timeRemaining)}
          </motion.div>
        )}
      </div>

      <div 
        className="animals-grid"
        role="radiogroup"
        aria-labelledby="target-hint"
        aria-describedby="feedback-message"
      >
        {currentRound.options.map((animal, index) => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            isTarget={animal.id === currentRound.targetAnimal.id}
            onClick={handleAnimalClick}
            disabled={!!selectedAnimal}
            showFeedback={feedbackAnimals[animal.id]}
            index={index}
          />
        ))}
      </div>

      <AnimatePresence>
        {feedback.type && (
          <motion.div
            id="feedback-message"
            className={`feedback-message ${feedback.type}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            aria-live="polite"
            aria-atomic="true"
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameBoard;