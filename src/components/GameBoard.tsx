import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import ItemCard from './ItemCard';
import HabitatBackground from './HabitatBackground';
import StickerRewardPopup from './StickerRewardPopup';
import { Item, GameRound, FeedbackState, StickerReward, Category, Habitat } from '../types';
import { audioManager } from '../utils/AudioManager';
import { stickerManager } from '../utils/StickerManager';
import { getCategoryDisplayName } from '../data/items';
import './GameBoard.css';

interface GameBoardProps {
  currentRound: GameRound;
  onItemSelect: (item: Item) => void;
  onRoundComplete: (correct: boolean) => void;
  showTimer?: boolean;
  timeRemaining?: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
  currentRound,
  onItemSelect,
  onRoundComplete,
  showTimer = false,
  timeRemaining = 0
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: null, message: '', showConfetti: false });
  const [feedbackItems, setFeedbackItems] = useState<{ [key: string]: 'correct' | 'incorrect' | null }>({});
  const [stickerReward, setStickerReward] = useState<StickerReward | null>(null);
  const lastAnnouncedRoundId = useRef<string | null>(null);

  // Text-to-speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  };

  // Generate category-specific prompt
  const getPromptText = useCallback((item: Item): string => {
    const categoryName = getCategoryDisplayName(item.category).toLowerCase();
    
    // Special cases for different categories
    if (item.category === 'numbers') {
      return `Can you find the number ${item.name}?`;
    } else if (item.category === 'alphabets') {
      return `Can you find the letter ${item.name}?`;
    } else if (item.category === 'colors') {
      return `Can you find the color ${item.name}?`;
    } else if (item.category === 'fruits') {
      return `Can you find the fruit ${item.name}?`;
    } else {
      // Default for animals or other categories
      return `Can you find the ${item.name}?`;
    }
  }, []);

  // Message helper functions
  const getRandomCorrectMessage = (itemName: string) => {
    const messages = [
      `Great job! You found the ${itemName}!`,
      `Excellent! That's the ${itemName}!`,
      `Perfect! You selected the ${itemName}!`,
      `Amazing! The ${itemName} is correct!`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRandomIncorrectMessage = (correctItem: Item) => {
    const categoryName = getCategoryDisplayName(correctItem.category).toLowerCase();
    let itemDescription = correctItem.name;
    
    // Add category context for clarity
    if (correctItem.category === 'numbers') {
      itemDescription = `number ${correctItem.name}`;
    } else if (correctItem.category === 'alphabets') {
      itemDescription = `letter ${correctItem.name}`;
    } else if (correctItem.category === 'colors') {
      itemDescription = `color ${correctItem.name}`;
    } else if (correctItem.category === 'fruits') {
      itemDescription = `fruit ${correctItem.name}`;
    }
    
    const messages = [
      `Not quite! Look for the ${itemDescription}.`,
      `Try again! Find the ${itemDescription}.`,
      `Good try! Can you spot the ${itemDescription}?`,
      `Keep looking for the ${itemDescription}!`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRandomTimeUpMessage = () => {
    const messages = [
      "Time's up! Don't worry, you'll get it next time!",
      "No worries! Let's try another one!",
      "That's okay! Keep practicing!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Announce the prompt when round changes (prevent duplicates)
  useEffect(() => {
    if (lastAnnouncedRoundId.current !== currentRound.id) {
      const prompt = getPromptText(currentRound.targetItem);
      speak(prompt);
      lastAnnouncedRoundId.current = currentRound.id;
    }
  }, [currentRound.id, getPromptText]);

  // Handle time up
  useEffect(() => {
    if (showTimer && timeRemaining === 0 && !selectedItem) {
      handleTimeUp();
    }
  }, [timeRemaining, showTimer, selectedItem]);

  const handleItemClick = (item: Item) => {
    if (selectedItem) return; // Prevent multiple selections

    setSelectedItem(item);
    onItemSelect(item);

    const isCorrect = item.id === currentRound.targetItem.id;
    
    if (isCorrect) {
      handleCorrectAnswer(item);
    } else {
      handleIncorrectAnswer(item);
    }
  };

  const handleCorrectAnswer = (item: Item) => {
    const message = getRandomCorrectMessage(item.name);
    setFeedback({ 
      type: 'correct', 
      message, 
      showConfetti: true 
    });
    
    setFeedbackItems({ [item.id]: 'correct' });
    speak(message);
    
    // Play celebration sound
    audioManager.playUISound('celebration');

    // Award sticker for correct answer
    const reward = stickerManager.addSticker(item);
    
    // Complete round after animation, then show sticker reward if it's new
    setTimeout(() => {
      onRoundComplete(true);
      resetFeedback();
      
      // Show sticker reward popup after a brief delay
      setTimeout(() => {
        if (reward.isNewSticker) {
          setStickerReward(reward);
        }
      }, 500);
    }, 2000);
  };

  const handleIncorrectAnswer = (item: Item) => {
    const message = getRandomIncorrectMessage(currentRound.targetItem);
    setFeedback({ 
      type: 'incorrect', 
      message,
      showConfetti: false 
    });
    
    setFeedbackItems({ [item.id]: 'incorrect' });
    speak(message);
    
    // Play error sound
    audioManager.playUISound('incorrect');

    // Allow another try after feedback
    setTimeout(() => {
      setSelectedItem(null);
      setFeedbackItems({});
      setFeedback({ type: null, message: '', showConfetti: false });
    }, 1500);
  };

  const handleTimeUp = () => {
    const message = getRandomTimeUpMessage();
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
    setSelectedItem(null);
    setFeedback({ type: null, message: '', showConfetti: false });
    setFeedbackItems({});
  };

  const handleCloseStickerReward = () => {
    setStickerReward(null);
  };

  const formatTime = (seconds: number): string => {
    return `${seconds}s`;
  };

  return (
    <div className="game-board">
      <HabitatBackground habitat={(currentRound.targetItem.subcategory as Habitat) || 'farm'} />
      
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
          <h2 id="target-hint">{getPromptText(currentRound.targetItem)} {currentRound.targetItem.emoji}</h2>
          <button 
            className="repeat-button"
            onClick={() => speak(getPromptText(currentRound.targetItem))}
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
        className="items-grid"
        role="radiogroup"
        aria-labelledby="target-hint"
        aria-describedby="feedback-message"
      >
        {currentRound.options.map((item, index) => (
          <ItemCard
            key={item.id}
            item={item}
            isTarget={item.id === currentRound.targetItem.id}
            onClick={handleItemClick}
            disabled={!!selectedItem}
            showFeedback={feedbackItems[item.id]}
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

      <StickerRewardPopup 
        reward={stickerReward}
        onClose={handleCloseStickerReward}
      />
    </div>
  );
};

export default GameBoard;