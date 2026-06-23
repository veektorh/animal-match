import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('renders the learning game menu and opens mode selection', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /learning match/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /select animals category/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /select numbers category/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /select animals category/i }));

  expect(screen.getByRole('heading', { name: /choose game mode/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /select free play game mode/i })).toBeInTheDocument();
});

test('uses saved settings for default difficulty and timed mode limit', async () => {
  localStorage.setItem('animalMatchSettings', JSON.stringify({
    soundEnabled: true,
    musicEnabled: true,
    autoPlayPrompts: true,
    difficulty: 'medium',
    timeLimit: 30,
    animationSpeed: 'normal',
    highContrast: false,
    reducedMotion: false
  }));

  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /select animals category/i }));
  fireEvent.click(screen.getByRole('button', { name: /select timed challenge game mode/i }));

  await waitFor(() => {
    expect(screen.getByRole('radio', { name: /select medium difficulty/i })).toHaveAttribute('aria-checked', 'true');
  });

  fireEvent.click(screen.getByRole('button', { name: /start game/i }));

  expect(screen.getByText(/time per round/i)).toBeInTheDocument();
  expect(screen.getByText(/30s/i)).toBeInTheDocument();
});

test('shows story chapter framing before story play starts', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /select animals category/i }));
  fireEvent.click(screen.getByRole('button', { name: /select story adventure game mode/i }));
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));

  expect(screen.getByRole('heading', { name: /story adventure/i })).toBeInTheDocument();
  expect(screen.getByText(/habitat helper/i)).toBeInTheDocument();
  expect(screen.getByText(/listen closely and choose the animal/i)).toBeInTheDocument();
});

test('shows category progress and unlocked achievements in settings', async () => {
  localStorage.setItem('animalMatchProgress', JSON.stringify({
    totalGamesPlayed: 2,
    totalStars: 8,
    unlockedItems: ['cow', 'pig'],
    unlockedCategories: ['animals'],
    achievements: [{
      id: 'first-game',
      name: 'First Steps',
      description: 'Play your first game!',
      icon: '🌟',
      unlockedDate: '2026-06-23T00:00:00.000Z',
      requirement: { type: 'games_played', value: 1 }
    }],
    lastPlayedDate: '2026-06-23T00:00:00.000Z',
    perfectRounds: 5,
    categoryStats: {
      animals: {
        gamesPlayed: 2,
        roundsPlayed: 10,
        correctRounds: 8,
        bestScore: 5,
        lastPlayedDate: '2026-06-23T00:00:00.000Z'
      }
    }
  }));

  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /settings/i }));
  fireEvent.click(await screen.findByRole('tab', { name: /progress/i }));

  expect(screen.getByText(/learning progress by category/i)).toBeInTheDocument();
  expect(screen.getByText(/80% accuracy/i)).toBeInTheDocument();
  expect(screen.getByText(/first steps/i)).toBeInTheDocument();
});
