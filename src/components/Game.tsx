import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconType } from 'react-icons';
import {
  FaAppleWhole,
  FaArrowLeft,
  FaBookOpen,
  FaBullseye,
  FaCarSide,
  FaChartSimple,
  FaCircleCheck,
  FaClock,
  FaDog,
  FaFont,
  FaHashtag,
  FaPalette,
  FaPause,
  FaPlay,
  FaRotateRight,
  FaShapes,
  FaStar,
  FaTrophy,
  FaXmark
} from 'react-icons/fa6';
import GameBoard from './GameBoard';
import ProgressBar from './ProgressBar';
import { useGame } from '../hooks/useGame';
import { GameMode, DifficultyLevel, Category, Item, GameSettings, RoundOutcome, GameSession } from '../types';
import { getCategoryDisplayName } from '../data/items';
import './Game.css';

interface GameProps {
  mode: GameMode;
  category: Category;
  difficulty: DifficultyLevel;
  onGameComplete?: (score: number, stars: number, totalTime: number, totalRounds: number, session: GameSession) => void;
  onBackToMenu?: () => void;
  unlockedItems?: string[];
  unlockedAnimals?: string[]; // Keep for backward compatibility
  settings?: GameSettings;
  practiceItemIds?: string[];
}

type GameIcon = React.ComponentType<{
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

interface StoryConfig {
  title: string;
  intro: string;
  mission: string;
  complete: string;
  BadgeIcon: GameIcon;
  accent: string;
}

const asGameIcon = (Icon: IconType): GameIcon => Icon as unknown as GameIcon;

const Icons = {
  apple: asGameIcon(FaAppleWhole),
  arrowLeft: asGameIcon(FaArrowLeft),
  bookOpen: asGameIcon(FaBookOpen),
  bullseye: asGameIcon(FaBullseye),
  car: asGameIcon(FaCarSide),
  chart: asGameIcon(FaChartSimple),
  check: asGameIcon(FaCircleCheck),
  clock: asGameIcon(FaClock),
  dog: asGameIcon(FaDog),
  font: asGameIcon(FaFont),
  hashtag: asGameIcon(FaHashtag),
  palette: asGameIcon(FaPalette),
  pause: asGameIcon(FaPause),
  play: asGameIcon(FaPlay),
  rotate: asGameIcon(FaRotateRight),
  shapes: asGameIcon(FaShapes),
  star: asGameIcon(FaStar),
  trophy: asGameIcon(FaTrophy),
  xmark: asGameIcon(FaXmark)
};

const BackIcon = Icons.arrowLeft;
const PlayIcon = Icons.play;
const PauseIcon = Icons.pause;
const RotateIcon = Icons.rotate;
const TrophyIcon = Icons.trophy;
const QuitIcon = Icons.xmark;

const STORY_CONFIGS: Record<Category, StoryConfig> = {
  animals: {
    title: 'Habitat Helper',
    intro: 'Visit friendly habitats and help each animal find its place.',
    mission: 'Listen closely and choose the animal the helper is looking for.',
    complete: 'You helped the habitats feel bright and busy again!',
    BadgeIcon: Icons.dog,
    accent: '#2e7d32'
  },
  numbers: {
    title: 'Counting Quest',
    intro: 'Follow the number trail and collect the missing counting stones.',
    mission: 'Match each spoken number before the trail fades.',
    complete: 'The number trail is complete from start to finish!',
    BadgeIcon: Icons.hashtag,
    accent: '#1565c0'
  },
  alphabets: {
    title: 'Letter Library',
    intro: 'Open the story shelves by finding each missing letter.',
    mission: 'Look for the letter named in the prompt.',
    complete: 'The letter shelves are back in order!',
    BadgeIcon: Icons.font,
    accent: '#6a1b9a'
  },
  colors: {
    title: 'Rainbow Rescue',
    intro: 'Bring color back to the rainbow one match at a time.',
    mission: 'Find the color that belongs in each rainbow beam.',
    complete: 'The rainbow is glowing with every color again!',
    BadgeIcon: Icons.palette,
    accent: '#c62828'
  },
  fruits: {
    title: 'Garden Picnic',
    intro: 'Help pack a cheerful picnic basket with tasty fruit matches.',
    mission: 'Choose the fruit named in the picnic clue.',
    complete: 'The picnic basket is full and ready to share!',
    BadgeIcon: Icons.apple,
    accent: '#ef6c00'
  },
  shapes: {
    title: 'Shape Studio',
    intro: 'Build a bright picture by finding each missing shape.',
    mission: 'Look for the shape named by the studio helper.',
    complete: 'The shape picture is complete and ready to display!',
    BadgeIcon: Icons.shapes,
    accent: '#7b1fa2'
  },
  vehicles: {
    title: 'Transport Trail',
    intro: 'Travel across roads, rails, water, and sky by finding each vehicle.',
    mission: 'Choose the vehicle named by the travel guide.',
    complete: 'The transport trail is ready for the next adventure!',
    BadgeIcon: Icons.car,
    accent: '#00838f'
  }
};

const categoryIcons: Record<Category, GameIcon> = {
  animals: Icons.dog,
  numbers: Icons.hashtag,
  alphabets: Icons.font,
  colors: Icons.palette,
  fruits: Icons.apple,
  shapes: Icons.shapes,
  vehicles: Icons.car
};

const getDifficultyLabel = (difficulty: DifficultyLevel) => (
  difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
);

const Game: React.FC<GameProps> = ({
  mode,
  category,
  difficulty,
  onGameComplete,
  onBackToMenu,
  unlockedItems = [],
  unlockedAnimals = [], // Keep for backward compatibility
  settings,
  practiceItemIds = []
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const timeLimit = settings?.timeLimit || 15;
  const reducedMotion = settings?.reducedMotion || false;
  const storyConfig = mode === 'story' ? STORY_CONFIGS[category] : null;
  const CategoryIcon = categoryIcons[category];
  const StoryBadgeIcon = storyConfig?.BadgeIcon;

  const getGameConfig = () => {
    switch (mode) {
      case 'timed':
        return { roundCount: 10, timeLimit };
      case 'story':
        return { roundCount: 8, timeLimit: undefined };
      case 'practice':
        return { roundCount: 6, timeLimit: undefined };
      case 'free-play':
      default:
        return { roundCount: 5, timeLimit: undefined };
    }
  };

  const config = getGameConfig();

  const {
    gameSession,
    currentRound,
    timeRemaining,
    isGameActive,
    isRoundActive,
    startGame,
    nextRound,
    pauseGame,
    resumeGame,
    resetGame,
    currentRoundNumber,
    totalRounds,
    hasTimeLimit
  } = useGame({
    mode,
    category,
    difficulty,
    roundCount: config.roundCount,
    timeLimit: config.timeLimit,
    unlockedItems,
    unlockedAnimals, // Keep for backward compatibility
    practiceItemIds
  });

  const handleStartGame = () => {
    setGameStarted(true);
    startGame();
  };

  const handleItemSelect = useCallback((item: Item) => {
    console.log('Item selected:', item.name);
  }, []);

  const handleRoundComplete = useCallback((outcome: RoundOutcome) => {
    const completedSession = nextRound(outcome);

    if (completedSession) {
      const totalTime = completedSession.endTime
        ? (completedSession.endTime - completedSession.startTime) / 1000
        : 0;

      setShowResults(true);

      if (onGameComplete) {
        onGameComplete(completedSession.score, completedSession.stars, totalTime, completedSession.rounds.length, completedSession);
      }
    }
  }, [nextRound, onGameComplete]);

  const motionTransition = { duration: reducedMotion ? 0 : 0.3 };
  const showPauseOverlay = !isRoundActive && isGameActive && (!hasTimeLimit || timeRemaining > 0);

  const handlePlayAgain = () => {
    setShowResults(false);
    setGameStarted(false);
    resetGame();
  };

  const handleBackToMenu = () => {
    resetGame();
    setGameStarted(false);
    setShowResults(false);
    if (onBackToMenu) {
      onBackToMenu();
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'timed':
        return 'Timed Challenge';
      case 'story':
        return 'Story Adventure';
      case 'practice':
        return 'Practice Weak Spots';
      case 'free-play':
      default:
        return 'Free Play';
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'timed':
        return 'Find items quickly before time runs out!';
      case 'story':
        return storyConfig?.intro || 'Discover items in their learning adventure!';
      case 'practice':
        return 'Review items that needed extra tries before.';
      case 'free-play':
      default:
        return 'Take your time and have fun learning!';
    }
  };

  const getModeIcon = (): GameIcon => {
    switch (mode) {
      case 'timed':
        return Icons.clock;
      case 'story':
        return Icons.bookOpen;
      case 'practice':
        return Icons.chart;
      case 'free-play':
      default:
        return Icons.play;
    }
  };

  const ModeIcon = getModeIcon();
  const difficultyLabel = getDifficultyLabel(difficulty);
  const categoryLabel = getCategoryDisplayName(category);

  if (!gameStarted) {
    return (
      <div className="game-container">
        <motion.section
          className="game-start-screen"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.45 }}
          aria-labelledby="game-start-heading"
        >
          <div className="game-start-topline">
            <button className="game-back-link" onClick={handleBackToMenu}>
              <BackIcon aria-hidden="true" />
              Back to Menu
            </button>
            <span className="game-category-pill">
              <CategoryIcon aria-hidden="true" />
              {categoryLabel}
            </span>
          </div>

          <div className="game-start-layout">
            <div className="game-start-copy">
              <span className="game-eyebrow">Practice category</span>
              <div className="game-mode-mark">
                <ModeIcon aria-hidden="true" />
              </div>
              <h1 id="game-start-heading">{getModeTitle()}</h1>
              <p className="mode-description">{getModeDescription()}</p>

              {storyConfig && StoryBadgeIcon && (
                <div
                  className="story-intro"
                  style={{ borderColor: storyConfig.accent }}
                  aria-label={`${storyConfig.title} story chapter`}
                >
                  <span className="story-badge" style={{ color: storyConfig.accent }} aria-hidden="true">
                    <StoryBadgeIcon />
                  </span>
                  <div>
                    <h2>{storyConfig.title}</h2>
                    <p>{storyConfig.mission}</p>
                  </div>
                </div>
              )}
            </div>

            <aside className="game-start-panel" aria-label="Session setup">
              <h2>Session Setup</h2>
              <div className="game-info">
                <div className="info-item">
                  <span className="info-label">Difficulty</span>
                  <span className="info-value">{difficultyLabel}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Rounds</span>
                  <span className="info-value">{config.roundCount}</span>
                </div>
                {config.timeLimit && (
                  <div className="info-item">
                    <span className="info-label">Time per round</span>
                    <span className="info-value">{config.timeLimit}s</span>
                  </div>
                )}
                {mode === 'practice' && (
                  <div className="info-item">
                    <span className="info-label">Practice targets</span>
                    <span className="info-value">{practiceItemIds.length || 'New review'}</span>
                  </div>
                )}
              </div>

              <motion.button
                className="game-primary-button"
                onClick={handleStartGame}
                whileHover={reducedMotion ? undefined : { y: -2 }}
                whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              >
                <PlayIcon aria-hidden="true" />
                Start Game
              </motion.button>
            </aside>
          </div>
        </motion.section>
      </div>
    );
  }

  if (showResults && gameSession) {
    const accuracy = gameSession.rounds.length > 0
      ? (gameSession.score / gameSession.rounds.length) * 100
      : 0;

    const totalTime = gameSession.endTime
      ? Math.round((gameSession.endTime - gameSession.startTime) / 1000)
      : 0;
    const reviewItems = Array.from(new Set(
      (gameSession.roundResults || [])
        .filter(result => !result.correct || result.attempts > 1)
        .map(result => result.targetItemName)
    )).slice(0, 4);
    const resultCards = [
      { label: 'Score', value: `${gameSession.score}/${gameSession.rounds.length}`, Icon: Icons.bullseye },
      { label: 'Stars', value: gameSession.stars, Icon: Icons.star },
      { label: 'Accuracy', value: `${Math.round(accuracy)}%`, Icon: Icons.chart },
      ...(mode === 'timed' ? [{ label: 'Time', value: `${totalTime}s`, Icon: Icons.clock }] : [])
    ];

    return (
      <div className="game-container">
        <motion.section
          className="game-results"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.45 }}
          aria-labelledby="game-results-heading"
        >
          <span className="results-mark" aria-hidden="true">
            <TrophyIcon />
          </span>
          <h1 id="game-results-heading">Great job!</h1>
          <p className="results-subtitle">
            {categoryLabel} practice complete with {gameSession.stars} star{gameSession.stars === 1 ? '' : 's'} earned.
          </p>

          {storyConfig && (
            <p className="story-complete-message">
              {storyConfig.complete}
            </p>
          )}

          <div className="results-grid">
            {resultCards.map(({ label, value, Icon }) => (
              <div className="result-card" key={label}>
                <span className="result-icon" aria-hidden="true">
                  <Icon />
                </span>
                <span className="result-label">{label}</span>
                <strong className="result-value">{value}</strong>
              </div>
            ))}
          </div>

          <div className="learning-summary">
            <h2>Learning Notes</h2>
            {reviewItems.length > 0 ? (
              <>
                <p>Good practice targets for next time:</p>
                <div className="review-item-list">
                  {reviewItems.map(itemName => (
                    <span key={itemName}>{itemName}</span>
                  ))}
                </div>
              </>
            ) : (
              <p>Clean round. This category is getting stronger.</p>
            )}
          </div>

          <div className="result-buttons">
            <motion.button
              className="game-primary-button"
              onClick={handlePlayAgain}
              whileHover={reducedMotion ? undefined : { y: -2 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            >
              <RotateIcon aria-hidden="true" />
              Play Again
            </motion.button>

            <button className="game-secondary-button" onClick={handleBackToMenu}>
              <BackIcon aria-hidden="true" />
              Back to Menu
            </button>
          </div>
        </motion.section>
      </div>
    );
  }

  if (!currentRound) {
    return (
      <div className="game-container">
        <div className="loading">Loading next round...</div>
      </div>
    );
  }

  return (
    <div className="game-container game-play-container">
      <div className="game-shell">
        <div className="game-header">
          {storyConfig && StoryBadgeIcon && (
            <div className="story-banner" style={{ borderColor: storyConfig.accent }}>
              <span className="story-banner-badge" style={{ color: storyConfig.accent }} aria-hidden="true">
                <StoryBadgeIcon />
              </span>
              <div>
                <strong>{storyConfig.title}</strong>
                <span>{categoryLabel} chapter - {storyConfig.mission}</span>
              </div>
            </div>
          )}

          <div className="game-controls">
            <button
              className="game-icon-control"
              onClick={isRoundActive ? pauseGame : resumeGame}
              aria-label={isRoundActive ? 'Pause game' : 'Resume game'}
            >
              {isRoundActive ? <PauseIcon aria-hidden="true" /> : <PlayIcon aria-hidden="true" />}
            </button>

            <div className="play-session-title">
              <span>{categoryLabel} practice</span>
              <strong>{getModeTitle()} - {difficultyLabel}</strong>
            </div>

            <button className="game-quit-button" onClick={handleBackToMenu}>
              <QuitIcon aria-hidden="true" />
              Quit
            </button>
          </div>

          <ProgressBar
            currentRound={currentRoundNumber}
            totalRounds={totalRounds}
            stars={gameSession?.stars || 0}
            maxStars={totalRounds}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentRound.id}
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -36 }}
            transition={motionTransition}
          >
            <GameBoard
              currentRound={currentRound}
              onItemSelect={handleItemSelect}
              onRoundComplete={handleRoundComplete}
              showTimer={hasTimeLimit}
              timeRemaining={timeRemaining}
              autoPlayPrompts={settings?.autoPlayPrompts ?? true}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {showPauseOverlay && (
        <motion.div
          className="pause-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="pause-content">
            <span className="pause-mark" aria-hidden="true">
              <PauseIcon />
            </span>
            <h2>Game Paused</h2>
            <button className="resume-button" onClick={resumeGame}>
              <PlayIcon aria-hidden="true" />
              Resume
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Game;
