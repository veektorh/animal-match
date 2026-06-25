import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaStar } from 'react-icons/fa6';
import './ProgressBar.css';

interface ProgressBarProps {
  currentRound: number;
  totalRounds: number;
  stars: number;
  maxStars: number;
}

type ProgressIcon = React.ComponentType<{
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

const asProgressIcon = (Icon: IconType): ProgressIcon => Icon as unknown as ProgressIcon;
const StarIcon = asProgressIcon(FaStar);

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentRound,
  totalRounds,
  stars,
  maxStars
}) => {
  const progressPercentage = (currentRound / totalRounds) * 100;

  return (
    <div className="progress-container">
      <div className="round-progress-info">
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
                delay: index * 0.08,
                type: 'spring',
                stiffness: 300,
                damping: 15
              }}
              aria-hidden="true"
            >
              <StarIcon />
            </motion.span>
          ))}
        </div>
      </div>

      <div
        className="progress-bar-container"
        role="progressbar"
        aria-valuenow={currentRound}
        aria-valuemin={0}
        aria-valuemax={totalRounds}
      >
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        <div className="progress-bar-text">
          {Math.round(progressPercentage)}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
