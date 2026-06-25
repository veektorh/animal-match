import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaCheck, FaXmark } from 'react-icons/fa6';
import { Item } from '../types';
import { audioManager } from '../utils/AudioManager';
import { getLocalizedItemContent } from '../utils/itemContent';
import ItemIllustration from './ItemIllustration';
import './ItemCard.css';

interface ItemCardProps {
  item: Item;
  isTarget?: boolean;
  onClick: (item: Item) => void;
  disabled?: boolean;
  showFeedback?: 'correct' | 'incorrect' | null;
  index: number;
  reducedMotion?: boolean;
}

type CardIcon = React.ComponentType<{
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

const asCardIcon = (Icon: IconType): CardIcon => Icon as unknown as CardIcon;
const CheckIcon = asCardIcon(FaCheck);
const XmarkIcon = asCardIcon(FaXmark);

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isTarget = false,
  onClick,
  disabled = false,
  showFeedback,
  index,
  reducedMotion = false
}) => {
  const handleClick = () => {
    if (!disabled) {
      audioManager.playUISound('whoosh');
      audioManager.playUISound('click');
      onClick(item);
    }
  };
  const content = getLocalizedItemContent(item);
  const exampleText = item.category === 'alphabets' && content.example
    ? `${content.name} is for ${content.example}`
    : content.example;

  const cardVariants = {
    initial: {
      scale: 0.92,
      opacity: 0,
      y: 24
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.08,
        duration: reducedMotion ? 0 : 0.42,
        type: 'spring' as const,
        stiffness: 200,
        damping: 18
      }
    },
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.98
    },
    correct: {
      scale: [1, 1.04, 1],
      borderColor: '#4CAF50',
      boxShadow: '0 16px 30px rgba(76, 175, 80, 0.24)',
      transition: {
        duration: 0.45,
        times: [0, 0.5, 1]
      }
    },
    incorrect: {
      x: [-5, 5, -4, 4, 0],
      borderColor: '#d83b4c',
      boxShadow: '0 16px 30px rgba(216, 59, 76, 0.22)',
      transition: {
        duration: 0.45
      }
    }
  };
  const FeedbackIcon = showFeedback === 'correct' ? CheckIcon : XmarkIcon;

  return (
    <motion.div
      className={`item-card ${isTarget ? 'target' : ''} ${disabled ? 'disabled' : ''} ${showFeedback ? `feedback-${showFeedback}` : ''}`}
      variants={cardVariants}
      initial={reducedMotion ? false : 'initial'}
      animate={
        reducedMotion ? undefined :
          showFeedback === 'correct' ? 'correct' :
            showFeedback === 'incorrect' ? 'incorrect' : 'animate'
      }
      whileHover={!reducedMotion && !disabled && !showFeedback ? 'hover' : undefined}
      whileTap={!reducedMotion && !disabled && !showFeedback ? 'tap' : undefined}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${isTarget ? 'Target: ' : ''}${content.name}`}
      aria-disabled={disabled}
    >
      <ItemIllustration item={item} />
      <div className="item-name">
        {content.name}
      </div>
      {exampleText && (
        <div className="item-example">
          {exampleText}
        </div>
      )}

      {showFeedback && (
        <motion.div
          className={`feedback-icon ${showFeedback}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: reducedMotion ? 0 : 0.1, duration: reducedMotion ? 0 : 0.25 }}
        >
          <FeedbackIcon aria-hidden="true" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ItemCard;
