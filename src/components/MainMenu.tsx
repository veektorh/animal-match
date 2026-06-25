import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import {
  FaAppleWhole,
  FaArrowLeft,
  FaBookOpen,
  FaCarSide,
  FaChartSimple,
  FaChevronRight,
  FaDog,
  FaFont,
  FaGamepad,
  FaGear,
  FaGraduationCap,
  FaHashtag,
  FaImages,
  FaPalette,
  FaRocket,
  FaShapes,
  FaStar,
  FaTrophy
} from 'react-icons/fa6';
import { Category, DifficultyLevel, GameMode } from '../types';
import { LearningLabId } from '../data/learningLabs';
import { stickerManager } from '../utils/StickerManager';
import './MainMenu.css';

interface MainMenuProps {
  onStartGame: (mode: GameMode, difficulty: DifficultyLevel, category: Category) => void;
  onShowSettings?: () => void;
  onShowStickerCollection?: () => void;
  onShowLearningLabs?: (initialLab?: LearningLabId) => void;
  playerProgress?: {
    totalGamesPlayed: number;
    totalStars: number;
    unlockedAnimals?: string[];
    unlockedItems?: string[];
  };
  defaultDifficulty?: DifficultyLevel;
  weakPracticeItemsByCategory?: { [key in Category]?: string[] };
}

interface CategoryOption {
  id: Category;
  title: string;
  description: string;
  Icon: MenuIcon;
  color: string;
  skill: string;
}

interface ModeOption {
  id: GameMode;
  title: string;
  description: string;
  Icon: MenuIcon;
  color: string;
}

interface DifficultyOption {
  id: DifficultyLevel;
  title: string;
  description: string;
  Icon: MenuIcon;
}

interface TodayPlanStep {
  id: string;
  label: string;
  title: string;
  detail: string;
  Icon: MenuIcon;
  actionLabel: string;
  onStart: () => void;
}

type MenuIcon = React.ComponentType<{
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

const asMenuIcon = (Icon: IconType): MenuIcon => Icon as unknown as MenuIcon;

const Icons = {
  apple: asMenuIcon(FaAppleWhole),
  arrowLeft: asMenuIcon(FaArrowLeft),
  bookOpen: asMenuIcon(FaBookOpen),
  car: asMenuIcon(FaCarSide),
  chart: asMenuIcon(FaChartSimple),
  chevronRight: asMenuIcon(FaChevronRight),
  dog: asMenuIcon(FaDog),
  font: asMenuIcon(FaFont),
  gamepad: asMenuIcon(FaGamepad),
  gear: asMenuIcon(FaGear),
  graduationCap: asMenuIcon(FaGraduationCap),
  hashtag: asMenuIcon(FaHashtag),
  images: asMenuIcon(FaImages),
  palette: asMenuIcon(FaPalette),
  rocket: asMenuIcon(FaRocket),
  shapes: asMenuIcon(FaShapes),
  star: asMenuIcon(FaStar),
  trophy: asMenuIcon(FaTrophy)
};

const BrandIcon = Icons.graduationCap;
const StickerIcon = Icons.images;
const SettingsIcon = Icons.gear;
const ProgressGameIcon = Icons.gamepad;
const ProgressStarIcon = Icons.star;
const ProgressTrophyIcon = Icons.trophy;
const ChevronRightIcon = Icons.chevronRight;
const ArrowLeftIcon = Icons.arrowLeft;

const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onShowSettings,
  onShowStickerCollection,
  onShowLearningLabs,
  playerProgress,
  defaultDifficulty = 'easy',
  weakPracticeItemsByCategory = {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(defaultDifficulty);
  const [newStickersCount, setNewStickersCount] = useState(0);

  useEffect(() => {
    setNewStickersCount(stickerManager.getNewStickersCount());
  }, []);

  useEffect(() => {
    setSelectedDifficulty(defaultDifficulty);
  }, [defaultDifficulty]);

  const categories: CategoryOption[] = [
    {
      id: 'animals',
      title: 'Animals',
      description: 'Recognize animals, names, and habitats',
      Icon: Icons.dog,
      color: '#2e7d32',
      skill: 'Vocabulary'
    },
    {
      id: 'numbers',
      title: 'Numbers',
      description: 'Practice counting and number recognition',
      Icon: Icons.hashtag,
      color: '#1565c0',
      skill: 'Early math'
    },
    {
      id: 'alphabets',
      title: 'Letters',
      description: 'Build alphabet recognition and first sounds',
      Icon: Icons.font,
      color: '#ef6c00',
      skill: 'Phonics'
    },
    {
      id: 'colors',
      title: 'Colors',
      description: 'Identify colors through visual matching',
      Icon: Icons.palette,
      color: '#8e24aa',
      skill: 'Visual sorting'
    },
    {
      id: 'fruits',
      title: 'Fruits',
      description: 'Discover fruit names and everyday foods',
      Icon: Icons.apple,
      color: '#c62828',
      skill: 'Word meaning'
    },
    {
      id: 'shapes',
      title: 'Shapes',
      description: 'Match circles, triangles, stars, and more',
      Icon: Icons.shapes,
      color: '#00838f',
      skill: 'Geometry'
    },
    {
      id: 'vehicles',
      title: 'Vehicles',
      description: 'Recognize cars, buses, boats, planes, and more',
      Icon: Icons.car,
      color: '#3949ab',
      skill: 'Real-world words'
    }
  ];

  const getWeakPracticeCount = (category: Category | null) => {
    if (!category) return 0;
    return weakPracticeItemsByCategory[category]?.length || 0;
  };

  const baseGameModes: ModeOption[] = [
    {
      id: 'free-play',
      title: 'Free Play',
      description: 'Take your time and learn at your own pace',
      Icon: Icons.gamepad,
      color: '#2e7d32'
    },
    {
      id: 'timed',
      title: 'Timed Challenge',
      description: 'Race against the clock to match quickly',
      Icon: Icons.rocket,
      color: '#ef6c00'
    },
    {
      id: 'story',
      title: 'Story Adventure',
      description: 'Explore guided matching rounds with story framing',
      Icon: Icons.bookOpen,
      color: '#8e24aa'
    }
  ];

  const gameModes: ModeOption[] = selectedCategory && getWeakPracticeCount(selectedCategory) > 0
    ? [
      ...baseGameModes,
      {
        id: 'practice',
        title: 'Practice Weak Spots',
        description: 'Review items that needed extra tries',
        Icon: Icons.chart,
        color: '#00897b'
      }
    ]
    : baseGameModes;

  const difficulties: DifficultyOption[] = [
    {
      id: 'easy',
      title: 'Easy',
      description: '3 options, simple choices',
      Icon: Icons.star
    },
    {
      id: 'medium',
      title: 'Medium',
      description: '4 options, more variety',
      Icon: Icons.chart
    },
    {
      id: 'hard',
      title: 'Hard',
      description: '6 options, challenging choices',
      Icon: Icons.trophy
    }
  ];

  const selectedCategoryOption = categories.find(category => category.id === selectedCategory);
  const selectedModeOption = gameModes.find(mode => mode.id === selectedMode);
  const weakPracticeCategory = categories
    .map(category => ({
      ...category,
      weakPracticeCount: getWeakPracticeCount(category.id)
    }))
    .find(category => category.weakPracticeCount > 0);

  const todayPlanSteps: TodayPlanStep[] = [
    {
      id: 'math',
      label: '1',
      title: 'Math warm-up',
      detail: 'Tap to Count',
      Icon: Icons.hashtag,
      actionLabel: 'Open math',
      onStart: () => onShowLearningLabs?.('tap-to-count')
    },
    {
      id: 'reading',
      label: '2',
      title: 'Reading practice',
      detail: 'Fix the Word',
      Icon: Icons.font,
      actionLabel: 'Open reading',
      onStart: () => onShowLearningLabs?.('fix-the-word')
    },
    {
      id: 'thinking',
      label: '3',
      title: 'Pattern thinking',
      detail: 'Sequence Builder',
      Icon: Icons.chart,
      actionLabel: 'Open patterns',
      onStart: () => onShowLearningLabs?.('sequence-builder')
    },
    weakPracticeCategory
      ? {
        id: 'review',
        label: '4',
        title: 'Review weak spots',
        detail: `${weakPracticeCategory.weakPracticeCount} ${weakPracticeCategory.title.toLowerCase()} item${weakPracticeCategory.weakPracticeCount === 1 ? '' : 's'}`,
        Icon: Icons.trophy,
        actionLabel: 'Start review',
        onStart: () => onStartGame('practice', defaultDifficulty, weakPracticeCategory.id)
      }
      : {
        id: 'review',
        label: '4',
        title: 'Recognition review',
        detail: 'Animals free play',
        Icon: Icons.dog,
        actionLabel: 'Start review',
        onStart: () => onStartGame('free-play', defaultDifficulty, 'animals')
      }
  ];

  const startTodayPlan = () => {
    todayPlanSteps[0].onStart();
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  const handleStartGame = () => {
    if (selectedMode && selectedCategory) {
      onStartGame(selectedMode, selectedDifficulty, selectedCategory);
    }
  };

  const handleBack = () => {
    if (selectedMode) {
      setSelectedMode(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  return (
    <div className="main-menu">
      <div className="menu-shell">
        <motion.header
          className="menu-header"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="brand-lockup" aria-label="Learning Match">
            <span className="brand-mark">
              <BrandIcon aria-hidden="true" />
            </span>
            <div>
              <h1 className="game-title">Learning Match</h1>
              <p className="game-subtitle">Focused early learning through short, visual practice.</p>
            </div>
          </div>

          <motion.div
            className="menu-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.12 }}
          >
            {onShowStickerCollection && (
              <motion.button
                className="action-button sticker-button"
                onClick={onShowStickerCollection}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <StickerIcon aria-hidden="true" />
                Sticker Collection
                {newStickersCount > 0 && (
                  <span className="notification-badge">{newStickersCount}</span>
                )}
              </motion.button>
            )}
            {onShowSettings && (
              <motion.button
                className="action-button settings-button"
                onClick={onShowSettings}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <SettingsIcon aria-hidden="true" />
                Settings
              </motion.button>
            )}
          </motion.div>
        </motion.header>

        {!selectedCategory ? (
          <>
            <section className="home-dashboard" aria-label="Learning dashboard">
              {onShowLearningLabs && (
                <motion.article
                  className="learning-labs-spotlight"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  aria-labelledby="learning-labs-heading"
                >
                  <div className="spotlight-copy">
                    <span className="spotlight-eyebrow">Guided learning path</span>
                    <h2 id="learning-labs-heading">Learning Labs</h2>
                    <p>Eleven focused activities for counting, reading, phonics, rhyming, and pattern thinking.</p>
                    <div className="spotlight-skills" aria-label="Learning lab skills">
                      <span>Math studio</span>
                      <span>Reading room</span>
                      <span>Thinking lab</span>
                      <span>5 minute practice</span>
                    </div>
                  </div>
                  <div className="spotlight-action-panel">
                    <div className="spotlight-metric">
                      <strong>11</strong>
                      <span>skill labs</span>
                    </div>
                    <motion.button
                      className="spotlight-button"
                      onClick={() => onShowLearningLabs()}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Learning Labs
                      <ChevronRightIcon aria-hidden="true" />
                    </motion.button>
                  </div>
                </motion.article>
              )}

              {playerProgress && (
                <div className="dashboard-side-panel">
                  <motion.aside
                    className="today-plan-card"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.16 }}
                    aria-labelledby="today-plan-heading"
                  >
                    <div className="summary-heading">
                      <span>Daily guide</span>
                      <strong>5 min</strong>
                    </div>
                    <h2 id="today-plan-heading">Today's Plan</h2>
                    <p>Start with a balanced mix of counting, reading, patterns, and review.</p>
                    <ol className="today-plan-steps">
                      {todayPlanSteps.map(step => {
                        const StepIcon = step.Icon;

                        return (
                          <li key={step.id}>
                            <span className="plan-step-number">{step.label}</span>
                            <span className="plan-step-icon">
                              <StepIcon aria-hidden="true" />
                            </span>
                            <span className="plan-step-copy">
                              <strong>{step.title}</strong>
                              <span>{step.detail}</span>
                            </span>
                            <button onClick={step.onStart} aria-label={step.actionLabel}>
                              <ChevronRightIcon aria-hidden="true" />
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                    <motion.button
                      className="today-plan-button"
                      onClick={startTodayPlan}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Today's Plan
                      <ChevronRightIcon aria-hidden="true" />
                    </motion.button>
                  </motion.aside>

                  <motion.aside
                    className="progress-summary"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.22 }}
                    aria-label="Learning progress summary"
                  >
                    <div className="summary-heading">
                      <span>Progress</span>
                      <strong>Today</strong>
                    </div>
                    <div className="progress-item">
                      <ProgressGameIcon className="progress-icon" aria-hidden="true" />
                      <span className="progress-value">{playerProgress.totalGamesPlayed}</span>
                      <span className="progress-label">Games Played</span>
                    </div>
                    <div className="progress-item">
                      <ProgressStarIcon className="progress-icon" aria-hidden="true" />
                      <span className="progress-value">{playerProgress.totalStars}</span>
                      <span className="progress-label">Stars Earned</span>
                    </div>
                    <div className="progress-item">
                      <ProgressTrophyIcon className="progress-icon" aria-hidden="true" />
                      <span className="progress-value">{(playerProgress.unlockedItems?.length || playerProgress.unlockedAnimals?.length || 0)}</span>
                      <span className="progress-label">Items Unlocked</span>
                    </div>
                  </motion.aside>
                </div>
              )}
            </section>

            <motion.section
              className="category-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              aria-labelledby="matching-games-heading"
            >
              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">Matching games</span>
                  <h2 id="matching-games-heading">Choose a practice category</h2>
                </div>
                <p>Use quick matching rounds to reinforce recognition and vocabulary.</p>
              </div>
              <div className="categories-grid">
                {categories.map((category, index) => {
                  const weakPracticeCount = getWeakPracticeCount(category.id);
                  const CategoryIcon = category.Icon;

                  return (
                    <motion.div
                      key={category.id}
                      className="category-card"
                      style={{ borderColor: category.color }}
                      onClick={() => handleCategorySelect(category.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.25 + index * 0.04 }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleCategorySelect(category.id);
                        }
                      }}
                      aria-label={`Select ${category.title} category`}
                    >
                      <div className="category-card-top">
                        <span className="category-icon" style={{ color: category.color, backgroundColor: `${category.color}16` }}>
                          <CategoryIcon aria-hidden="true" />
                        </span>
                        <span className="category-skill">{category.skill}</span>
                      </div>
                      <h3>{category.title}</h3>
                      <p>{category.description}</p>
                      <span className="category-card-action">
                        Practice
                        <ChevronRightIcon aria-hidden="true" />
                      </span>
                      {weakPracticeCount > 0 && (
                        <span className="practice-badge">{weakPracticeCount} practice items</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </>
        ) : !selectedMode ? (
          <motion.div
            className="mode-selection"
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="selection-header">
              <button className="back-button" onClick={handleBack} aria-label="Go back">
                <ArrowLeftIcon aria-hidden="true" />
                Back
              </button>
              <h2>Choose Game Mode</h2>
              <div></div>
            </div>

            <div className="selected-category-info">
              <span className="category-icon" style={{ color: selectedCategoryOption?.color }}>
                {selectedCategoryOption && <selectedCategoryOption.Icon aria-hidden="true" />}
              </span>
              <span className="category-title">{selectedCategoryOption?.title}</span>
            </div>

            <div className="modes-grid">
              {gameModes.map((mode, index) => {
                const ModeIcon = mode.Icon;

                return (
                  <motion.div
                    key={mode.id}
                    className="mode-card"
                    style={{ borderColor: mode.color }}
                    onClick={() => handleModeSelect(mode.id)}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.12 + index * 0.06 }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleModeSelect(mode.id);
                      }
                    }}
                    aria-label={`Select ${mode.title} game mode`}
                  >
                    <div className="mode-icon" style={{ color: mode.color, backgroundColor: `${mode.color}16` }}>
                      <ModeIcon aria-hidden="true" />
                    </div>
                    <h3>{mode.title}</h3>
                    <p>{mode.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="difficulty-selection"
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="selection-header">
              <button className="back-button" onClick={handleBack} aria-label="Go back">
                <ArrowLeftIcon aria-hidden="true" />
                Back
              </button>
              <h2>Choose Difficulty</h2>
              <div></div>
            </div>

            <div className="selected-mode-info">
              <span className="mode-icon">
                {selectedModeOption && <selectedModeOption.Icon aria-hidden="true" />}
              </span>
              <span className="mode-title">{selectedModeOption?.title}</span>
            </div>

            <div className="difficulties-grid">
              {difficulties.map((difficulty, index) => {
                const DifficultyIcon = difficulty.Icon;

                return (
                  <motion.div
                    key={difficulty.id}
                    className={`difficulty-card ${selectedDifficulty === difficulty.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    role="radio"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedDifficulty(difficulty.id);
                      }
                    }}
                    aria-checked={selectedDifficulty === difficulty.id}
                    aria-label={`Select ${difficulty.title} difficulty`}
                  >
                    <div className="difficulty-icon">
                      <DifficultyIcon aria-hidden="true" />
                    </div>
                    <h3>{difficulty.title}</h3>
                    <p>{difficulty.description}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.button
              className="start-game-button"
              onClick={handleStartGame}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.28 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Game
              <ChevronRightIcon aria-hidden="true" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MainMenu;
