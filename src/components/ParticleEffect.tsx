import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ParticleEffect.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  delay: number;
}

interface ParticleEffectProps {
  isActive: boolean;
  animalType: 'farm' | 'forest' | 'ocean' | 'jungle' | 'arctic' | 'desert' | 'wild';
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ isActive, animalType }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const getParticlesForType = (type: string): string[] => {
    const particleTypes: Record<string, string[]> = {
      farm: ['🌾', '🌻', '🍀', '⭐', '✨'],
      forest: ['🍃', '🌿', '🦋', '🌸', '✨'],
      ocean: ['💧', '🐠', '🫧', '🌊', '⭐'],
      jungle: ['🌺', '🦜', '🍃', '🌴', '✨'],
      arctic: ['❄️', '⭐', '💎', '🌟', '❅'],
      desert: ['🌵', '☀️', '⭐', '🦂', '✨'],
      wild: ['⭐', '✨', '🌟', '💫', '🎀']
    };
    
    return particleTypes[type] || particleTypes.wild;
  };

  useEffect(() => {
    if (isActive) {
      const availableEmojis = getParticlesForType(animalType);
      const newParticles: Particle[] = [];
      
      // Generate 8-12 particles
      const particleCount = 8 + Math.floor(Math.random() * 5);
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100 - 50, // -50% to +50%
          y: Math.random() * 100 - 50, // -50% to +50%
          emoji: availableEmojis[Math.floor(Math.random() * availableEmojis.length)],
          delay: Math.random() * 0.5
        });
      }
      
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isActive, animalType]);

  return (
    <div className="particle-container">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            initial={{
              opacity: 0,
              scale: 0,
              x: 0,
              y: 0
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1.2, 0],
              x: particle.x,
              y: particle.y,
              rotate: [0, 180, 360]
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 1.5,
              delay: particle.delay,
              ease: "easeOut"
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ParticleEffect;