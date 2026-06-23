import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Category, GameSettings, PlayerProgress } from '../types';
import { getCategoryDisplayName, getCategoryEmoji } from '../data/items';
import './Settings.css';

interface SettingsProps {
  settings: GameSettings;
  playerProgress: PlayerProgress;
  onUpdateSettings: (settings: GameSettings) => void;
  onResetProgress: () => void;
  onBackToMenu: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  settings,
  playerProgress,
  onUpdateSettings,
  onResetProgress,
  onBackToMenu
}) => {
  const [currentSettings, setCurrentSettings] = useState<GameSettings>(settings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'gameplay' | 'accessibility' | 'progress'>('gameplay');

  const handleSettingChange = (key: keyof GameSettings, value: any) => {
    const newSettings = { ...currentSettings, [key]: value };
    setCurrentSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const handleResetProgress = () => {
    onResetProgress();
    setShowResetConfirm(false);
  };

  const categories: Category[] = ['animals', 'numbers', 'alphabets', 'colors', 'fruits'];
  const categoryProgressRows = categories.map((category) => {
    const stats = playerProgress.categoryStats?.[category];
    const roundsPlayed = stats?.roundsPlayed || 0;
    const correctRounds = stats?.correctRounds || 0;
    const accuracy = roundsPlayed > 0 ? Math.round((correctRounds / roundsPlayed) * 100) : 0;

    return {
      category,
      label: getCategoryDisplayName(category),
      emoji: getCategoryEmoji(category),
      gamesPlayed: stats?.gamesPlayed || 0,
      bestScore: stats?.bestScore || 0,
      roundsPlayed,
      accuracy
    };
  });

  const tabs = [
    { id: 'gameplay' as const, title: 'Gameplay', icon: '🎮' },
    { id: 'accessibility' as const, title: 'Accessibility', icon: '♿' },
    { id: 'progress' as const, title: 'Progress', icon: '📊' }
  ];

  return (
    <div className="settings-container">
      <motion.div
        className="settings-panel"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="settings-header">
          <button 
            className="back-button"
            onClick={onBackToMenu}
            aria-label="Back to main menu"
          >
            ← Back
          </button>
          <h1>⚙️ Settings</h1>
          <div></div> {/* Spacer */}
        </div>

        <div className="settings-tabs" role="tablist" aria-label="Settings sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              aria-controls={`settings-panel-${tab.id}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-title">{tab.title}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'gameplay' && (
            <motion.div
              key="gameplay"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="settings-section"
              id="settings-panel-gameplay"
              role="tabpanel"
            >
              <h2>Gameplay Settings</h2>
              
              <div className="setting-group">
                <div className="setting-item">
                  <label htmlFor="sound-toggle">
                    <span className="setting-icon">🔊</span>
                    <span className="setting-label">Sound Effects</span>
                  </label>
                  <button
                    id="sound-toggle"
                    className={`toggle-button ${currentSettings.soundEnabled ? 'active' : ''}`}
                    onClick={() => handleSettingChange('soundEnabled', !currentSettings.soundEnabled)}
                    aria-pressed={currentSettings.soundEnabled}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="setting-item">
                  <label htmlFor="music-toggle">
                    <span className="setting-icon">🎵</span>
                    <span className="setting-label">Background Music</span>
                  </label>
                  <button
                    id="music-toggle"
                    className={`toggle-button ${currentSettings.musicEnabled ? 'active' : ''}`}
                    onClick={() => handleSettingChange('musicEnabled', !currentSettings.musicEnabled)}
                    aria-pressed={currentSettings.musicEnabled}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="setting-item">
                  <label htmlFor="auto-play-toggle">
                    <span className="setting-icon">🗣️</span>
                    <span className="setting-label">Auto-Play Voice Prompts</span>
                  </label>
                  <button
                    id="auto-play-toggle"
                    className={`toggle-button ${currentSettings.autoPlayPrompts ? 'active' : ''}`}
                    onClick={() => handleSettingChange('autoPlayPrompts', !currentSettings.autoPlayPrompts)}
                    aria-pressed={currentSettings.autoPlayPrompts}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="setting-item">
                  <label htmlFor="difficulty-select">
                    <span className="setting-icon">🎯</span>
                    <span className="setting-label">Default Difficulty</span>
                  </label>
                  <select
                    id="difficulty-select"
                    value={currentSettings.difficulty}
                    onChange={(e) => handleSettingChange('difficulty', e.target.value)}
                    className="setting-select"
                  >
                    <option value="easy">Easy (3 choices)</option>
                    <option value="medium">Medium (4 choices)</option>
                    <option value="hard">Hard (6 choices)</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label htmlFor="time-limit-select">
                    <span className="setting-icon">⏰</span>
                    <span className="setting-label">Time Limit (Timed Mode)</span>
                  </label>
                  <select
                    id="time-limit-select"
                    value={currentSettings.timeLimit}
                    onChange={(e) => handleSettingChange('timeLimit', parseInt(e.target.value))}
                    className="setting-select"
                  >
                    <option value="10">10 seconds</option>
                    <option value="15">15 seconds</option>
                    <option value="20">20 seconds</option>
                    <option value="30">30 seconds</option>
                  </select>
                </div>

                <div className="setting-item">
                  <label htmlFor="animation-speed-select">
                    <span className="setting-icon">⚡</span>
                    <span className="setting-label">Animation Speed</span>
                  </label>
                  <select
                    id="animation-speed-select"
                    value={currentSettings.animationSpeed}
                    onChange={(e) => handleSettingChange('animationSpeed', e.target.value)}
                    className="setting-select"
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'accessibility' && (
            <motion.div
              key="accessibility"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="settings-section"
              id="settings-panel-accessibility"
              role="tabpanel"
            >
              <h2>Accessibility Settings</h2>
              
              <div className="setting-group">
                <div className="setting-item">
                  <label htmlFor="high-contrast-toggle">
                    <span className="setting-icon">🎨</span>
                    <span className="setting-label">High Contrast Mode</span>
                    <span className="setting-description">Improves visibility for low vision users</span>
                  </label>
                  <button
                    id="high-contrast-toggle"
                    className={`toggle-button ${currentSettings.highContrast ? 'active' : ''}`}
                    onClick={() => handleSettingChange('highContrast', !currentSettings.highContrast)}
                    aria-pressed={currentSettings.highContrast}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>

                <div className="setting-item">
                  <label htmlFor="reduced-motion-toggle">
                    <span className="setting-icon">🎭</span>
                    <span className="setting-label">Reduced Motion</span>
                    <span className="setting-description">Reduces animations for motion sensitivity</span>
                  </label>
                  <button
                    id="reduced-motion-toggle"
                    className={`toggle-button ${currentSettings.reducedMotion ? 'active' : ''}`}
                    onClick={() => handleSettingChange('reducedMotion', !currentSettings.reducedMotion)}
                    aria-pressed={currentSettings.reducedMotion}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>
              </div>

              <div className="accessibility-info">
                <h3>Accessibility Features</h3>
                <ul>
                  <li>✓ Full keyboard navigation support</li>
                  <li>✓ Screen reader compatibility with ARIA labels</li>
                  <li>✓ Text-to-speech for learning prompts</li>
                  <li>✓ High contrast theme option</li>
                  <li>✓ Reduced motion mode</li>
                  <li>✓ Focus indicators for all interactive elements</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="settings-section"
              id="settings-panel-progress"
              role="tabpanel"
            >
              <h2>Progress & Statistics</h2>
              
              <div className="progress-stats">
                <div className="stat-card">
                  <div className="stat-icon">🎮</div>
                  <div className="stat-value">{playerProgress.totalGamesPlayed}</div>
                  <div className="stat-label">Games Played</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-value">{playerProgress.totalStars}</div>
                  <div className="stat-label">Stars Earned</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🐾</div>
                  <div className="stat-value">{playerProgress.unlockedItems?.length || (playerProgress.unlockedAnimals || []).length}</div>
                  <div className="stat-label">Items Unlocked</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-value">{playerProgress.achievements.length}</div>
                  <div className="stat-label">Achievements</div>
                </div>
              </div>

              <div className="teacher-progress">
                <h3>Learning Progress by Category</h3>
                <div className="category-progress-list">
                  {categoryProgressRows.map((row) => (
                    <div className="category-progress-row" key={row.category}>
                      <div className="category-progress-name">
                        <span aria-hidden="true">{row.emoji}</span>
                        <strong>{row.label}</strong>
                      </div>
                      <div className="category-progress-metrics">
                        <span>{row.gamesPlayed} games</span>
                        <span>{row.accuracy}% accuracy</span>
                        <span>Best score {row.bestScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="achievement-list-section">
                <h3>Achievements</h3>
                {playerProgress.achievements.length > 0 ? (
                  <div className="achievement-list">
                    {playerProgress.achievements.map((achievement) => (
                      <div className="achievement-card" key={achievement.id}>
                        <span className="achievement-icon" aria-hidden="true">{achievement.icon}</span>
                        <div>
                          <strong>{achievement.name}</strong>
                          <span>{achievement.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-achievements">Achievements will appear here as games are completed.</p>
                )}
              </div>

              <div className="progress-info">
                <h3>Unlocking New Content</h3>
                <div className="unlock-requirements">
                  <div className="unlock-item">
                    <span className="unlock-icon">🌲</span>
                    <span className="unlock-text">Forest Animals</span>
                    <span className="unlock-requirement">10 stars required</span>
                  </div>
                  <div className="unlock-item">
                    <span className="unlock-icon">🌊</span>
                    <span className="unlock-text">Ocean Animals</span>
                    <span className="unlock-requirement">25 stars required</span>
                  </div>
                  <div className="unlock-item">
                    <span className="unlock-icon">🌿</span>
                    <span className="unlock-text">Jungle Animals</span>
                    <span className="unlock-requirement">50 stars required</span>
                  </div>
                </div>
              </div>

              <div className="reset-section">
                <h3>Reset Progress</h3>
                <p>⚠️ This will permanently delete all progress, including stars, achievements, and unlocked items.</p>
                
                {!showResetConfirm ? (
                  <button 
                    className="reset-button"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    Reset All Progress
                  </button>
                ) : (
                  <div className="reset-confirm">
                    <p><strong>Are you sure?</strong> This action cannot be undone.</p>
                    <div className="reset-buttons">
                      <button 
                        className="confirm-reset-button"
                        onClick={handleResetProgress}
                      >
                        Yes, Reset Everything
                      </button>
                      <button 
                        className="cancel-reset-button"
                        onClick={() => setShowResetConfirm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
