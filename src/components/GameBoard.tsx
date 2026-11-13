import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { IconType } from 'react-icons';
import { FaClock, FaVolumeHigh } from 'react-icons/fa6';
import ItemCard from './ItemCard';
import { Item, GameRound, FeedbackState, StickerReward, RoundOutcome } from '../types';
import { audioManager } from '../utils/AudioManager';
import { getItemHint, getItemPrompt } from '../utils/itemContent';
import { speakText } from '../utils/speech';
import { stickerManager } from '../utils/StickerManager';
import './GameBoard.css';

interface GameBoardProps {
  currentRound: GameRound;
  onItemSelect: (item: Item) => void;
  onRoundComplete: (outcome: RoundOutcome) => void;
  showTimer?: boolean;
  timeRemaining?: number;
  autoPlayPrompts?: boolean;
  reducedMotion?: boolean;
  onStickerEarned?: (reward: StickerReward) => void;
}

type BoardIcon = React.ComponentType<{
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

const asBoardIcon = (Icon: IconType): BoardIcon => Icon as unknown as BoardIcon;
const ClockIcon = asBoardIcon(FaClock);
const VolumeIcon = asBoardIcon(FaVolumeHigh);

const GameBoard: React.FC<GameBoardProps> = ({
  currentRound,
  onItemSelect,
  onRoundComplete,
  showTimer = false,
  timeRemaining = 0,
  autoPlayPrompts = true,
  reducedMotion = false,
  onStickerEarned
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: null, message: '', showConfetti: false });
  const [feedbackItems, setFeedbackItems] = useState<{ [key: string]: 'correct' | 'incorrect' | null }>({});
  const [attemptCount, setAttemptCount] = useState(0);
  const [learningNote, setLearningNote] = useState('');
  const lastAnnouncedRoundId = useRef<string | null>(null);
  // Once a round is won or timed out, no more taps count and it completes exactly once.
  const roundLockedRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timeoutsRef.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

  const speak = useCallback((text: string, force = false) => {
    if (!force && !autoPlayPrompts) return;

    speakText(text, {
      interrupt: true,
      pitch: 1.07,
      rate: 0.84,
      volume: 0.92
    });
  }, [autoPlayPrompts]);

  const getRandomCorrectMessage = (itemName: string) => {
    if (attemptCount > 0) {
      return `Nice recovery! You found the ${itemName} after using the clue.`;
    }

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

    if (correctItem.category === 'numbers') {
      itemDescription = `number ${correctItem.name}`;
    } else if (correctItem.category === 'alphabets') {
      itemDescription = `letter ${correctItem.name}`;
    } else if (correctItem.category === 'colors') {
      itemDescription = `color ${correctItem.name}`;
    } else if (correctItem.category === 'fruits') {
      itemDescription = `fruit ${correctItem.name}`;
    } else if (correctItem.category === 'shapes') {
      itemDescription = `shape ${correctItem.name}`;
    } else if (correctItem.category === 'vehicles') {
      itemDescription = `vehicle ${correctItem.name}`;
    }

    const messages = [
      `Not quite! Look for the ${itemDescription}.`,
      `Try again! Find the ${itemDescription}.`,
      `Good try! Can you spot the ${itemDescription}?`,
      `Keep looking for the ${itemDescription}!`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const resetFeedback = useCallback(() => {
    setSelectedItem(null);
    setFeedback({ type: null, message: '', showConfetti: false });
    setFeedbackItems({});
    setAttemptCount(0);
    setLearningNote('');
  }, []);

  const handleTimeUp = useCallback(() => {
    if (roundLockedRef.current) return;
    roundLockedRef.current = true;
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
    setLearningNote(`${getItemHint(currentRound.targetItem)} We will practice it again soon.`);
    speak(message);

    later(() => {
      onRoundComplete({
        correct: false,
        attempts: Math.max(1, attemptCount),
        timedOut: true
      });
      resetFeedback();
    }, 2000);
  }, [attemptCount, currentRound.targetItem, later, onRoundComplete, resetFeedback, speak]);

  useEffect(() => {
    if (lastAnnouncedRoundId.current !== currentRound.id) {
      const prompt = getItemPrompt(currentRound.targetItem);
      speak(prompt);
      lastAnnouncedRoundId.current = currentRound.id;
      roundLockedRef.current = false;
      setAttemptCount(0);
      setLearningNote('');
    }
  }, [currentRound.id, currentRound.targetItem, speak]);

  useEffect(() => {
    if (showTimer && timeRemaining === 0 && !selectedItem && !feedback.type) {
      handleTimeUp();
    }
  }, [feedback.type, handleTimeUp, selectedItem, showTimer, timeRemaining]);

  const handleItemClick = (item: Item) => {
    if (selectedItem || roundLockedRef.current) return;

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
    roundLockedRef.current = true;
    const totalAttempts = attemptCount + 1;
    const message = getRandomCorrectMessage(item.name);
    setFeedback({
      type: 'correct',
      message,
      showConfetti: true
    });
    setLearningNote(totalAttempts > 1 ? `You used the clue: ${getItemHint(item)}` : '');

    setFeedbackItems({ [item.id]: 'correct' });
    speak(message);

    audioManager.playUISound('celebration');

    const reward = stickerManager.addSticker(item);

    later(() => {
      onRoundComplete({
        correct: true,
        attempts: totalAttempts,
        selectedItemId: item.id
      });
      resetFeedback();

      // The parent collects stickers and shows them at the end of the game,
      // so play is not interrupted after every correct answer.
      if (reward.isNewSticker || reward.isUpgrade) {
        onStickerEarned?.(reward);
      }
    }, 2000);
  };

  const handleIncorrectAnswer = (item: Item) => {
    const nextAttemptCount = attemptCount + 1;
    const shouldShowTarget = nextAttemptCount >= 2;
    const learningHint = getItemHint(currentRound.targetItem);
    const message = [
      getRandomIncorrectMessage(currentRound.targetItem),
      learningHint,
      shouldShowTarget ? 'I highlighted it to help you spot it.' : ''
    ].filter(Boolean).join(' ');

    setAttemptCount(nextAttemptCount);
    setLearningNote(shouldShowTarget ? `${learningHint} Try the highlighted answer.` : learningHint);
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

    audioManager.playUISound('incorrect');

    later(() => {
      setSelectedItem(null);
      // Keep pointing at the right answer once the clue says it is highlighted.
      setFeedbackItems(shouldShowTarget ? { [currentRound.targetItem.id]: 'correct' } : {});
      setFeedback({ type: null, message: '', showConfetti: false });
    }, 1500);
  };

  const formatTime = (seconds: number): string => `${seconds}s`;

  const shouldPulseTimer = !reducedMotion && timeRemaining <= 5 && timeRemaining > 0;

  return (
    <div className="game-board">
      {feedback.showConfetti && !reducedMotion && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <section className="round-panel" aria-label="Current question">
        <div className="game-board-header">
          <motion.div
            className="prompt"
            key={currentRound.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.4 }}
          >
            <span className="prompt-eyebrow">Listen and choose</span>
            <h2 id="target-hint">{getItemPrompt(currentRound.targetItem)}</h2>
          </motion.div>

          <div className="round-tools">
            <button
              className="repeat-button"
              onClick={() => speak(getItemPrompt(currentRound.targetItem), true)}
              aria-label="Repeat the question"
            >
              <VolumeIcon aria-hidden="true" />
            </button>

            {showTimer && (
              <motion.div
                className={`timer ${timeRemaining <= 5 ? 'warning' : ''}`}
                animate={{ scale: shouldPulseTimer ? [1, 1.08, 1] : 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.5, repeat: shouldPulseTimer ? Infinity : 0 }}
              >
                <ClockIcon aria-hidden="true" />
                {formatTime(timeRemaining)}
              </motion.div>
            )}
          </div>
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

        {/* Below the cards so showing a clue never moves them under a child's finger. */}
        {learningNote && (
          <div className="learning-note" aria-live="polite">
            <strong>Learning clue</strong>
            <span>{learningNote}</span>
          </div>
        )}
      </section>

      <AnimatePresence>
        {feedback.type && (
          <motion.div
            id="feedback-message"
            className={`feedback-message ${feedback.type}`}
            style={{ x: '-50%', y: '-50%' }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20 }}
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
