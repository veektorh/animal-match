import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickerReward } from '../types';
import { stickerManager } from '../utils/StickerManager';
import './StickerRewardPopup.css';

interface StickerRewardPopupProps {
  reward: StickerReward | null;
  onClose: () => void;
}

const StickerRewardPopup: React.FC<StickerRewardPopupProps> = ({ reward, onClose }) => {
  if (!reward) return null;

  const { sticker, isNewSticker, rarityBonus } = reward;
  const rarityColor = stickerManager.getRarityColor(sticker.rarity);
  const rarityEmoji = stickerManager.getRarityEmoji(sticker.rarity);

  const handleClose = () => {
    // Mark this sticker as viewed
    stickerManager.markStickersAsViewed([sticker.id]);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="sticker-reward-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="sticker-reward-popup"
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticker-reward-header">
            <h3>
              {isNewSticker ? '🎉 New Sticker!' : '⭐ Sticker Upgraded!'}
            </h3>
            <button
              className="close-button"
              onClick={handleClose}
              aria-label="Close reward popup"
            >
              ✕
            </button>
          </div>

          {/* Sticker Display */}
          <motion.div 
            className="sticker-display"
            style={{ borderColor: rarityColor }}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="sticker-background" style={{ backgroundColor: `${rarityColor}20` }}>
              <motion.div
                className="sticker-emoji"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
              >
                {sticker.emoji}
              </motion.div>
              
              <motion.div
                className="rarity-indicator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span className="rarity-emoji">{rarityEmoji}</span>
                <span 
                  className="rarity-text"
                  style={{ color: rarityColor }}
                >
                  {sticker.rarity.toUpperCase()}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Sticker Info */}
          <motion.div
            className="sticker-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h4 className="sticker-name">{sticker.name}</h4>
            <p className="sticker-description">
              {isNewSticker 
                ? `You've collected a ${sticker.rarity} ${sticker.name.toLowerCase()}!`
                : `Your ${sticker.name.toLowerCase()} has been upgraded to ${sticker.rarity}!`
              }
            </p>
          </motion.div>

          {/* Bonus Points */}
          {rarityBonus > 0 && (
            <motion.div
              className="bonus-points"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
            >
              <span className="bonus-label">Rarity Bonus:</span>
              <span className="bonus-value">+{rarityBonus} points!</span>
            </motion.div>
          )}

          {/* Sparkle Effects */}
          <div className="sparkle-effects">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                className="sparkle"
                style={{
                  left: `${20 + (index * 10)}%`,
                  top: `${30 + (Math.sin(index) * 20)}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  delay: 0.5 + (index * 0.1),
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>

          {/* Action Button */}
          <motion.button
            className="collection-button"
            onClick={handleClose}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Collection 📚
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StickerRewardPopup;