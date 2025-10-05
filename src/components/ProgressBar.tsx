import React from 'react';
import { motion } from 'framer-motion';
import './ProgressBar.css';

interface ProgressBarProps {
  currentRound: number;
  totalRounds: number;
  stars: number;
  maxStars: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentRound,
  totalRounds,
  stars,
  maxStars
}) => {
  const progressPercentage = (currentRound / totalRounds) * 100;

  return (
    <div className="progress-container">
      <div className="progress-info">
        <div className="round-counter">
          Round {currentRound} of {totalRounds}
        </div>
        <div className="stars-counter" aria-label={`Stars earned: ${stars} out of ${maxStars}`}>
          {Array.from({ length: maxStars }, (_, index) => (
            <motion.span
              key={index}
              className={`star ${index < stars ? 'earned' : 'empty'}`}
              initial={index < stars ? { scale: 0 } : false}
              animate={index < stars ? { scale: 1 } : false}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 15 
              }}
              aria-hidden="true"
            >
              ⭐
            </motion.span>
          ))}
        </div>
      </div>
      
      <div className="progress-bar-container" role="progressbar" aria-valuenow={currentRound} aria-valuemin={0} aria-valuemax={totalRounds}>
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <div className="progress-bar-text">
          {Math.round(progressPercentage)}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;