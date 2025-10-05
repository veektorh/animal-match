import React from 'react';
import { motion } from 'framer-motion';
import { Habitat } from '../types';
import './HabitatBackground.css';

interface HabitatBackgroundProps {
  habitat: Habitat;
  className?: string;
}

const HabitatBackground: React.FC<HabitatBackgroundProps> = ({ habitat, className = '' }) => {
  const getBackgroundElements = () => {
    switch (habitat) {
      case 'farm':
        return (
          <div className={`habitat-background farm-background ${className}`}>
            <div className="sky-gradient" />
            <motion.div 
              className="cloud cloud-1"
              animate={{ x: [0, 50, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ☁️
            </motion.div>
            <motion.div 
              className="cloud cloud-2"
              animate={{ x: [0, -30, 0] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              ☁️
            </motion.div>
            <div className="farm-ground" />
            <div className="farm-fence" />
            <motion.div 
              className="farm-windmill"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              🏠
            </motion.div>
            <div className="farm-plants">
              <span>🌾</span>
              <span>🌻</span>
              <span>🌾</span>
              <span>🌽</span>
              <span>🌾</span>
            </div>
          </div>
        );

      case 'forest':
        return (
          <div className={`habitat-background forest-background ${className}`}>
            <div className="sky-gradient forest-sky" />
            <motion.div 
              className="forest-leaves"
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              🍃🍂🍃
            </motion.div>
            <div className="forest-trees">
              <span className="tree">🌲</span>
              <span className="tree">🌳</span>
              <span className="tree">🌲</span>
              <span className="tree">🌳</span>
              <span className="tree">🌲</span>
            </div>
            <motion.div 
              className="forest-butterfly"
              animate={{ 
                x: [0, 20, -10, 15, 0],
                y: [0, -15, 10, -5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              🦋
            </motion.div>
            <div className="forest-ground" />
            <div className="forest-flowers">
              <span>🌸</span>
              <span>🌺</span>
              <span>🌼</span>
            </div>
          </div>
        );

      case 'ocean':
        return (
          <div className={`habitat-background ocean-background ${className}`}>
            <div className="ocean-surface" />
            <motion.div 
              className="ocean-waves"
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 0%"],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="ocean-fish fish-1"
              animate={{ 
                x: [0, 100, 0],
                y: [0, -20, 10, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              🐠
            </motion.div>
            <motion.div 
              className="ocean-fish fish-2"
              animate={{ 
                x: [100, 0, 100],
                y: [0, 15, -10, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              🐟
            </motion.div>
            <motion.div 
              className="ocean-bubbles"
              animate={{ 
                y: [50, -50],
                opacity: [0, 1, 1, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            >
              🫧 🫧 🫧
            </motion.div>
            <div className="ocean-coral">
              🪸 🌿 🪸
            </div>
          </div>
        );

      case 'jungle':
        return (
          <div className={`habitat-background jungle-background ${className}`}>
            <div className="jungle-canopy" />
            <div className="jungle-trees">
              <span>🌴</span>
              <span>🌿</span>
              <span>🌴</span>
              <span>🌿</span>
            </div>
            <motion.div 
              className="jungle-vines"
              animate={{ 
                rotate: [0, 2, -2, 0],
                y: [0, -5, 5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              🌿
            </motion.div>
            <motion.div 
              className="jungle-bird"
              animate={{ 
                x: [0, 30, -20, 0],
                y: [0, -10, 5, 0]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              🦜
            </motion.div>
            <div className="jungle-flowers">
              <span>🌺</span>
              <span>🌸</span>
              <span>🌺</span>
            </div>
            <div className="jungle-ground" />
          </div>
        );

      case 'arctic':
        return (
          <div className={`habitat-background arctic-background ${className}`}>
            <div className="arctic-sky" />
            <motion.div 
              className="arctic-snow"
              animate={{ 
                y: [0, 100],
                opacity: [1, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              ❄️ ❅ ❄️ ❅ ❄️
            </motion.div>
            <motion.div 
              className="arctic-aurora"
              animate={{ 
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              🌌
            </motion.div>
            <div className="arctic-ice">
              🧊 ❄️ 🧊
            </div>
            <div className="arctic-ground" />
          </div>
        );

      case 'desert':
        return (
          <div className={`habitat-background desert-background ${className}`}>
            <div className="desert-sky" />
            <motion.div 
              className="desert-sun"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              ☀️
            </motion.div>
            <motion.div 
              className="desert-sand"
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 0%"]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <div className="desert-cacti">
              <span>🌵</span>
              <span>🌵</span>
              <span>🌵</span>
            </div>
            <div className="desert-ground" />
          </div>
        );

      default:
        return (
          <div className={`habitat-background default-background ${className}`}>
            <div className="default-sky" />
            <motion.div 
              className="default-sparkles"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ✨ ⭐ ✨ 🌟 ✨
            </motion.div>
          </div>
        );
    }
  };

  return getBackgroundElements();
};

export default HabitatBackground;