import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Item } from '../types';
import { audioManager } from '../utils/AudioManager';
import './ItemCard.css';

interface ItemCardProps {
  item: Item;
  isTarget?: boolean;
  onClick: (item: Item) => void;
  disabled?: boolean;
  showFeedback?: 'correct' | 'incorrect' | null;
  index: number;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isTarget = false,
  onClick,
  disabled = false,
  showFeedback,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (!disabled) {
      // Play whoosh and click sounds only
      audioManager.playUISound('whoosh');
      audioManager.playUISound('click');
      // Note: Item sound is handled by GameBoard for proper feedback timing
      onClick(item);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getFeedbackColor = () => {
    switch (showFeedback) {
      case 'correct':
        return '#4CAF50'; // Green
      case 'incorrect':
        return '#F44336'; // Red
      default:
        return 'transparent';
    }
  };

  const cardVariants = {
    initial: { 
      scale: 0.8,
      opacity: 0,
      y: 50
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        type: "spring" as const,
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    },
    correct: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      borderColor: '#4CAF50',
      boxShadow: '0 0 20px rgba(76, 175, 80, 0.6)',
      transition: {
        duration: 0.6,
        times: [0, 0.3, 0.7, 1]
      }
    },
    incorrect: {
      x: [-5, 5, -5, 5, 0],
      borderColor: '#F44336',
      boxShadow: '0 0 20px rgba(244, 67, 54, 0.6)',
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className={`item-card ${isTarget ? 'target' : ''} ${disabled ? 'disabled' : ''}`}
      variants={cardVariants}
      initial="initial"
      animate={
        showFeedback === 'correct' ? 'correct' :
        showFeedback === 'incorrect' ? 'incorrect' : 'animate'
      }
      whileHover={!disabled && !showFeedback ? "hover" : undefined}
      whileTap={!disabled && !showFeedback ? "tap" : undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        borderColor: getFeedbackColor()
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`${isTarget ? 'Target: ' : ''}${item.name}`}
      aria-disabled={disabled}
    >
      <div className="item-emoji">
        {item.emoji}
      </div>
      <div className="item-name">
        {item.name}
      </div>
      
      {showFeedback && (
        <motion.div
          className={`feedback-icon ${showFeedback}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {showFeedback === 'correct' ? '✓' : '✗'}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ItemCard;