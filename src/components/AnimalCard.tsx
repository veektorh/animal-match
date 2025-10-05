import React from 'react';
import { motion } from 'framer-motion';
import { Animal } from '../types';
import './AnimalCard.css';

interface AnimalCardProps {
  animal: Animal;
  isTarget?: boolean;
  onClick: (animal: Animal) => void;
  disabled?: boolean;
  showFeedback?: 'correct' | 'incorrect' | null;
  index: number;
}

const AnimalCard: React.FC<AnimalCardProps> = ({
  animal,
  isTarget = false,
  onClick,
  disabled = false,
  showFeedback,
  index
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick(animal);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20 
      }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`animal-card ${showFeedback ? `feedback-${showFeedback}` : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`Select ${animal.name}`}
      aria-pressed={showFeedback === 'correct'}
      aria-describedby={isTarget ? 'target-hint' : undefined}
    >
      <div className="animal-emoji" aria-hidden="true">
        {animal.emoji}
      </div>
      <div className="animal-name">
        {animal.name}
      </div>
      
      {showFeedback === 'correct' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="feedback-icon correct"
          aria-hidden="true"
        >
          ✓
        </motion.div>
      )}
      
      {showFeedback === 'incorrect' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="feedback-icon incorrect"
          aria-hidden="true"
        >
          ✗
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnimalCard;