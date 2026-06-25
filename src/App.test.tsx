import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import ItemCard from './components/ItemCard';
import ItemIllustration from './components/ItemIllustration';
import { ALPHABETS, ANIMALS, NUMBERS, SHAPES, VEHICLES } from './data/items';

beforeEach(() => {
  localStorage.clear();
});

test('renders the learning game menu and opens mode selection', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /learning match/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /select animals category/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /select numbers category/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /select shapes category/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /select vehicles category/i })).toBeInTheDocument();

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

test('shows illustrated learning cards with examples during play', async () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /select numbers category/i }));
  fireEvent.click(screen.getByRole('button', { name: /select free play game mode/i }));
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));

  const illustrations = await screen.findAllByLabelText(/illustration for/i);

  expect(illustrations.length).toBeGreaterThan(0);
  expect(screen.getAllByText(/dots?/i).length).toBeGreaterThan(0);
});

test('opens learning labs from the main menu', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));

  expect(screen.getByRole('heading', { name: /learning labs/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /open counting stories/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /open tap to count/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /open more or less/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /open visual addition/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /open word builder/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /open fix the word/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /open read words/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /open beginning sounds/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /open word families/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /open rhyme match/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /open sequence builder/i })).toBeInTheDocument();
});

test('counting stories checks a counted group answer', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));
  fireEvent.click(screen.getByRole('button', { name: /open counting stories/i }));
  fireEvent.click(screen.getByRole('button', { name: /choose 3/i }));

  expect(screen.getByText(/yes\. 3 apples/i)).toBeInTheDocument();
});

test('tap to count completes one-to-one counting', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));
  fireEvent.click(screen.getByRole('button', { name: /open tap to count/i }));
  fireEvent.click(screen.getByRole('button', { name: /tap apples 1/i }));
  fireEvent.click(screen.getByRole('button', { name: /tap apples 2/i }));
  fireEvent.click(screen.getByRole('button', { name: /tap apples 3/i }));

  expect(screen.getByText(/you counted 3 apples/i)).toBeInTheDocument();
});

test('more or less checks quantity comparison', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));
  fireEvent.click(screen.getByRole('button', { name: /open more or less/i }));
  fireEvent.click(screen.getByRole('button', { name: /choose right group/i }));

  expect(screen.getByText(/that side has more apples/i)).toBeInTheDocument();
});

test('visual addition joins two small groups', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));
  fireEvent.click(screen.getByRole('button', { name: /open visual addition/i }));
  fireEvent.click(screen.getByRole('button', { name: /choose total 3/i }));

  expect(screen.getByText(/2 plus 1 makes 3/i)).toBeInTheDocument();
});

test('word builder forms a short picture word', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));
  fireEvent.click(screen.getByRole('button', { name: /open word builder/i }));
  fireEvent.click(screen.getByRole('button', { name: /letter b/i }));
  fireEvent.click(screen.getByRole('button', { name: /letter u/i }));
  fireEvent.click(screen.getByRole('button', { name: /letter s/i }));

  expect(screen.getByText(/you built bus/i)).toBeInTheDocument();
});

test('fix the word fills a missing picture-word letter', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));
  fireEvent.click(screen.getByRole('button', { name: /open fix the word/i }));
  fireEvent.click(screen.getByRole('button', { name: /choose missing letter a/i }));

  expect(screen.getByText(/cat needs a/i)).toBeInTheDocument();
});

test('read words blends letters from left to right', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));
  fireEvent.click(screen.getByRole('button', { name: /open read words/i }));
  fireEvent.click(screen.getByRole('button', { name: /read letter c/i }));
  fireEvent.click(screen.getByRole('button', { name: /read letter a/i }));
  fireEvent.click(screen.getByRole('button', { name: /read letter t/i }));

  expect(screen.getByText(/you read cat/i)).toBeInTheDocument();
});

test('beginning sounds checks first-letter picture choices', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));
  fireEvent.click(screen.getByRole('button', { name: /open beginning sounds/i }));
  fireEvent.click(screen.getByRole('button', { name: /choose bus for b/i }));

  expect(screen.getByText(/bus starts with b/i)).toBeInTheDocument();
});

test('word families completes a shared ending pattern', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));
  fireEvent.click(screen.getByRole('button', { name: /open word families/i }));
  fireEvent.click(screen.getByRole('button', { name: /choose word cat/i }));
  fireEvent.click(screen.getByRole('button', { name: /choose word hat/i }));
  fireEvent.click(screen.getByRole('button', { name: /choose word bat/i }));

  expect(screen.getByText(/-at words go together/i)).toBeInTheDocument();
});

test('rhyme match checks ending sound choices', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));
  fireEvent.click(screen.getByRole('button', { name: /open rhyme match/i }));
  fireEvent.click(screen.getByRole('button', { name: /choose hat/i }));

  expect(screen.getByText(/cat and hat rhyme/i)).toBeInTheDocument();
});

test('sequence builder fills the missing pattern item', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /start learning labs/i }));
  fireEvent.click(screen.getByRole('button', { name: /open sequence builder/i }));
  fireEvent.click(screen.getByRole('button', { name: /choose sequence 3/i }));

  expect(screen.getByText(/3 completes the pattern/i)).toBeInTheDocument();
});

test('starter animal illustrations use raster artwork assets instead of emoji glyphs', () => {
  const pig = ANIMALS.find(animal => animal.id === 'pig');
  if (!pig) {
    throw new Error('Expected pig content to exist');
  }

  const { container } = render(<ItemIllustration item={pig} />);
  const image = container.querySelector('.image-illustration img');

  expect(screen.getByLabelText(/illustration for pig/i)).toBeInTheDocument();
  expect(pig.imageUrl).toBe('/assets/animals/pig.png');
  expect(container.querySelector('.image-illustration')).toBeInTheDocument();
  expect(image).toHaveAttribute('src', '/assets/animals/pig.png');
  expect(container.querySelector('.illustration-glyph')).toBeNull();
  expect(container).not.toHaveTextContent(pig.emoji);
  expect(container.querySelector('.illustration-detail')).toBeNull();
});

test('easy animal pool is fully covered by raster artwork assets', () => {
  const missingRasterAssets = ANIMALS
    .filter(animal => animal.difficulty === 'easy')
    .filter(animal => !animal.imageUrl)
    .map(animal => animal.name);

  expect(missingRasterAssets).toEqual([]);
});

test('number cards show a large ten-frame with countable tokens', () => {
  const numberTwo = NUMBERS.find(number => number.id === 'two');
  if (!numberTwo) {
    throw new Error('Expected number two content to exist');
  }

  const { container } = render(<ItemIllustration item={numberTwo} />);

  expect(container.querySelector('.number-illustration')).toBeInTheDocument();
  expect(container.querySelector('.number-frame')).toBeInTheDocument();
  expect(container.querySelectorAll('.number-token-filled')).toHaveLength(2);
  expect(container.querySelectorAll('.number-token-empty')).toHaveLength(8);
  expect(container.querySelector('.number-label')).toHaveTextContent('2');
  expect(container.querySelector('.number-label')).toHaveAttribute('fill', '#0d47a1');
});

test('shape cards show large geometric artwork instead of emoji glyphs', () => {
  const circle = SHAPES.find(shape => shape.id === 'circle');
  if (!circle) {
    throw new Error('Expected circle content to exist');
  }

  const { container } = render(<ItemIllustration item={circle} />);

  expect(screen.getByLabelText(/illustration for circle/i)).toBeInTheDocument();
  expect(container.querySelector('.shape-illustration')).toBeInTheDocument();
  expect(container.querySelector('.shape-main')).toBeInTheDocument();
  expect(container.querySelector('.illustration-glyph')).toBeNull();
  expect(container).not.toHaveTextContent(circle.emoji);
});

test('vehicle cards show large transport artwork instead of emoji glyphs', () => {
  const car = VEHICLES.find(vehicle => vehicle.id === 'car');
  if (!car) {
    throw new Error('Expected car content to exist');
  }

  const { container } = render(<ItemIllustration item={car} />);

  expect(screen.getByLabelText(/illustration for car/i)).toBeInTheDocument();
  expect(container.querySelector('.vehicle-illustration')).toBeInTheDocument();
  expect(container.querySelector('.vehicle-main')).toBeInTheDocument();
  expect(container.querySelector('.vehicle-wheel')).toBeInTheDocument();
  expect(container.querySelector('.illustration-glyph')).toBeNull();
  expect(container).not.toHaveTextContent(car.emoji);
});

test('airplane artwork uses passenger plane details', () => {
  const airplane = VEHICLES.find(vehicle => vehicle.id === 'airplane');
  if (!airplane) {
    throw new Error('Expected airplane content to exist');
  }

  const { container } = render(<ItemIllustration item={airplane} />);

  expect(screen.getByLabelText(/illustration for airplane/i)).toBeInTheDocument();
  expect(container.querySelector('.airplane-fuselage')).toBeInTheDocument();
  expect(container.querySelectorAll('.airplane-wing')).toHaveLength(2);
  expect(container.querySelectorAll('.airplane-tail')).toHaveLength(2);
  expect(container.querySelectorAll('.airplane-window')).toHaveLength(3);
});

test('letter cards show uppercase, lowercase, and an example phrase', () => {
  const letterB = ALPHABETS.find(letter => letter.id === 'b');
  if (!letterB) {
    throw new Error('Expected letter B content to exist');
  }

  const { container } = render(
    <ItemCard item={letterB} index={0} onClick={() => undefined} />
  );

  expect(container.querySelector('.letter-label')).toHaveTextContent('B');
  expect(container.querySelector('.letter-lower-label')).toHaveTextContent('b');
  expect(screen.getByText(/b is for banana/i)).toBeInTheDocument();
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
    },
    difficultyStats: {
      easy: {
        gamesPlayed: 2,
        roundsPlayed: 10,
        correctRounds: 8,
        bestScore: 5,
        lastPlayedDate: '2026-06-23T00:00:00.000Z'
      }
    },
    modeStats: {
      'free-play': {
        gamesPlayed: 2,
        roundsPlayed: 10,
        correctRounds: 8,
        bestScore: 5,
        lastPlayedDate: '2026-06-23T00:00:00.000Z'
      }
    },
    itemStats: {
      cow: {
        itemId: 'cow',
        itemName: 'Cow',
        category: 'animals',
        difficulty: 'easy',
        roundsPlayed: 2,
        correctRounds: 1,
        missedRounds: 1,
        attempts: 3,
        extraAttempts: 1,
        lastPlayedDate: '2026-06-23T00:00:00.000Z'
      }
    }
  }));

  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /settings/i }));
  fireEvent.click(await screen.findByRole('tab', { name: /progress/i }));

  expect(screen.getByText(/learning progress by category/i)).toBeInTheDocument();
  expect(screen.getAllByText(/80% accuracy/i)).toHaveLength(3);
  expect(screen.getByText(/progress by difficulty/i)).toBeInTheDocument();
  expect(screen.getByText(/progress by game mode/i)).toBeInTheDocument();
  expect(screen.getByText(/weak spots to practice/i)).toBeInTheDocument();
  expect(screen.getByText(/cow/i)).toBeInTheDocument();
  expect(screen.getByText(/first steps/i)).toBeInTheDocument();
});

test('offers weak spot practice when saved item progress needs review', async () => {
  localStorage.setItem('animalMatchProgress', JSON.stringify({
    totalGamesPlayed: 1,
    totalStars: 4,
    unlockedItems: ['cow', 'pig', 'chicken', 'horse'],
    unlockedCategories: ['animals'],
    achievements: [],
    lastPlayedDate: '2026-06-23T00:00:00.000Z',
    itemStats: {
      cow: {
        itemId: 'cow',
        itemName: 'Cow',
        category: 'animals',
        difficulty: 'easy',
        roundsPlayed: 2,
        correctRounds: 1,
        missedRounds: 1,
        attempts: 3,
        extraAttempts: 1,
        lastPlayedDate: '2026-06-23T00:00:00.000Z'
      }
    }
  }));

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText(/1 practice items/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole('button', { name: /select animals category/i }));

  expect(screen.getByRole('button', { name: /select practice weak spots game mode/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /select practice weak spots game mode/i }));
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));

  expect(screen.getByRole('heading', { name: /practice weak spots/i })).toBeInTheDocument();
  expect(screen.getByText(/practice targets/i)).toBeInTheDocument();
});
