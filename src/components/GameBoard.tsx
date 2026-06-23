import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import ItemCard from './ItemCard';
import HabitatBackground from './HabitatBackground';
import StickerRewardPopup from './StickerRewardPopup';
import { Item, GameRound, FeedbackState, StickerReward, Habitat } from '../types';
import { audioManager } from '../utils/AudioManager';
import { stickerManager } from '../utils/StickerManager';
import './GameBoard.css';

interface GameBoardProps {
  currentRound: GameRound;
  onItemSelect: (item: Item) => void;
  onRoundComplete: (correct: boolean) => void;
  showTimer?: boolean;
  timeRemaining?: number;
  autoPlayPrompts?: boolean;
  reducedMotion?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  currentRound,
  onItemSelect,
  onRoundComplete,
  showTimer = false,
  timeRemaining = 0,
  autoPlayPrompts = true,
  reducedMotion = false
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: null, message: '', showConfetti: false });
  const [feedbackItems, setFeedbackItems] = useState<{ [key: string]: 'correct' | 'incorrect' | null }>({});
  const [stickerReward, setStickerReward] = useState<StickerReward | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const lastAnnouncedRoundId = useRef<string | null>(null);

  // Text-to-speech function
  const speak = useCallback((text: string, force = false) => {
    if (!force && !autoPlayPrompts) return;

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
    }
  }, [autoPlayPrompts]);

  // Generate category-specific prompt
  const getPromptText = useCallback((item: Item): string => {
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

  const getLearningHint = (item: Item): string => {
    if (item.category === 'numbers') {
      const numberHints: Record<string, string> = {
        one: 'One means 1 thing.',
        two: 'Two means 2 things.',
        three: 'Three means 3 things.',
        four: 'Four means 4 things.',
        five: 'Five means 5 things.',
        six: 'Six means 6 things.',
        seven: 'Seven means 7 things.',
        eight: 'Eight means 8 things.',
        nine: 'Nine means 9 things.',
        ten: 'Ten means 10 things.'
      };
      return numberHints[item.id] || `Look for the number named ${item.name}.`;
    }

    if (item.category === 'alphabets') {
      const letterExamples: Record<string, string> = {
        a: 'A starts apple.',
        b: 'B starts banana.',
        c: 'C starts cat.',
        d: 'D starts dog.',
        e: 'E starts egg.',
        f: 'F starts fish.',
        g: 'G starts grape.',
        h: 'H starts horse.',
        i: 'I starts igloo.',
        j: 'J starts juice.',
        k: 'K starts kite.',
        l: 'L starts lemon.',
        m: 'M starts mango.',
        n: 'N starts nest.',
        o: 'O starts orange.',
        p: 'P starts pig.',
        q: 'Q starts queen.',
        r: 'R starts rabbit.',
        s: 'S starts sheep.',
        t: 'T starts turtle.',
        u: 'U starts umbrella.',
        v: 'V starts violin.',
        w: 'W starts whale.',
        x: 'X can start x-ray.',
        y: 'Y starts yellow.',
        z: 'Z starts zebra.'
      };
      return letterExamples[item.id] || `Look for the letter ${item.name}.`;
    }

    if (item.category === 'colors') {
      return `The answer is the ${item.name.toLowerCase()} color.`;
    }

    if (item.category === 'fruits') {
      return `${item.name} is the fruit named in the clue.`;
    }

    if (item.subcategory) {
      return `${item.name} belongs with the ${item.subcategory} group.`;
    }

    return `Look for ${item.name}.`;
  };

  const resetFeedback = useCallback(() => {
    setSelectedItem(null);
    setFeedback({ type: null, message: '', showConfetti: false });
    setFeedbackItems({});
    setAttemptCount(0);
  }, []);

  const handleTimeUp = useCallback(() => {
    const messages = [
      "Time's up! Don't worry, you'll get it next time!",
      "No worries! Let's try another one!",
      "That's okay! Keep practicing!"
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];

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
  }, [onRoundComplete, resetFeedback, speak]);

  // Announce the prompt when round changes (prevent duplicates)
  useEffect(() => {
    if (lastAnnouncedRoundId.current !== currentRound.id) {
      const prompt = getPromptText(currentRound.targetItem);
      speak(prompt);
      lastAnnouncedRoundId.current = currentRound.id;
      setAttemptCount(0);
    }
  }, [currentRound.id, currentRound.targetItem, getPromptText, speak]);

  // Handle time up
  useEffect(() => {
    if (showTimer && timeRemaining === 0 && !selectedItem && !feedback.type) {
      handleTimeUp();
    }
  }, [feedback.type, handleTimeUp, selectedItem, showTimer, timeRemaining]);

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
    const nextAttemptCount = attemptCount + 1;
    const shouldShowTarget = nextAttemptCount >= 2;
    const message = [
      getRandomIncorrectMessage(currentRound.targetItem),
      getLearningHint(currentRound.targetItem),
      shouldShowTarget ? 'I highlighted it to help you spot it.' : ''
    ].filter(Boolean).join(' ');

    setAttemptCount(nextAttemptCount);
    setFeedback({ 
      type: 'incorrect', 
      message,
      showConfetti: false 
    });
    
    setFeedbackItems({
      [item.id]: 'incorrect',
      ...(shouldShowTarget ? { [currentRound.targetItem.id]: 'correct' as const } : {})
    });
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

  const handleCloseStickerReward = () => {
    setStickerReward(null);
  };

  const formatTime = (seconds: number): string => {
    return `${seconds}s`;
  };

  const shouldPulseTimer = !reducedMotion && timeRemaining <= 5 && timeRemaining > 0;

  return (
    <div className="game-board">
      <HabitatBackground habitat={(currentRound.targetItem.subcategory as Habitat) || 'farm'} />
      
      {feedback.showConfetti && !reducedMotion && (
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
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
        >
          <h2 id="target-hint">{getPromptText(currentRound.targetItem)} {currentRound.targetItem.emoji}</h2>
          <button 
            className="repeat-button"
            onClick={() => speak(getPromptText(currentRound.targetItem), true)}
            aria-label="Repeat the question"
          >
            🔊
          </button>
        </motion.div>

        {showTimer && (
          <motion.div 
            className={`timer ${timeRemaining <= 10 ? 'warning' : ''}`}
            animate={{ scale: shouldPulseTimer ? [1, 1.1, 1] : 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.5, repeat: shouldPulseTimer ? Infinity : 0 }}
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
            reducedMotion={reducedMotion}
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
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 20 }}
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
