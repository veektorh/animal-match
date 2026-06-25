export type LearningLabDomainId = 'math' | 'reading' | 'logic';

export type LearningLabId =
  | 'counting-stories'
  | 'tap-to-count'
  | 'more-or-less'
  | 'visual-addition'
  | 'word-builder'
  | 'fix-the-word'
  | 'read-words'
  | 'beginning-sounds'
  | 'word-families'
  | 'rhyme-match'
  | 'sequence-builder';

export interface LearningLabDomain {
  id: LearningLabDomainId;
  title: string;
  summary: string;
  accent: string;
}

export interface LearningLabDefinition {
  id: LearningLabId;
  domainId: LearningLabDomainId;
  title: string;
  shortLabel: string;
  description: string;
  skill: string;
  ageBand: string;
  accent: string;
}

export interface ObjectGroup {
  itemId: string;
  count: number;
  noun: string;
}

export interface CountingRound extends ObjectGroup {
  prompt: string;
  options: number[];
}

export interface WordRound {
  itemId: string;
  word: string;
}

export interface BeginningSoundRound {
  letter: string;
  answerId: string;
  optionIds: string[];
}

export interface RhymeRound {
  word: string;
  answer: string;
  options: string[];
}

export interface FixWordRound extends WordRound {
  missingIndex: number;
  options: string[];
}

export interface TapToCountRound extends ObjectGroup {
  prompt: string;
}

export interface CompareRound {
  prompt: string;
  mode: 'more' | 'less';
  left: ObjectGroup;
  right: ObjectGroup;
}

export interface AdditionRound {
  prompt: string;
  itemId: string;
  noun: string;
  leftCount: number;
  rightCount: number;
  options: number[];
}

export interface ReadWordRound extends WordRound {
  sentence: string;
}

export interface WordFamilyChoice {
  word: string;
  matches: boolean;
}

export interface WordFamilyRound {
  pattern: string;
  prompt: string;
  words: WordFamilyChoice[];
}

export interface SequenceRound {
  prompt: string;
  sequence: string[];
  blankIndex: number;
  answer: string;
  options: string[];
}

export const learningLabDomains: LearningLabDomain[] = [
  {
    id: 'math',
    title: 'Math Studio',
    summary: 'Hands-on counting, comparing, adding, and number order.',
    accent: '#1565c0'
  },
  {
    id: 'reading',
    title: 'Reading Room',
    summary: 'Letters, simple words, missing sounds, and early decoding.',
    accent: '#8e24aa'
  },
  {
    id: 'logic',
    title: 'Thinking Lab',
    summary: 'Patterns, rhymes, and sequence choices for flexible thinking.',
    accent: '#00897b'
  }
];

export const learningLabs: LearningLabDefinition[] = [
  {
    id: 'counting-stories',
    domainId: 'math',
    title: 'Counting Stories',
    shortLabel: '123',
    description: 'Count object groups inside tiny story problems.',
    skill: 'Counting with meaning',
    ageBand: 'Early math',
    accent: '#2e7d32'
  },
  {
    id: 'tap-to-count',
    domainId: 'math',
    title: 'Tap to Count',
    shortLabel: 'Tap',
    description: 'Touch each object once and hear the count grow.',
    skill: 'One-to-one counting',
    ageBand: 'Early math',
    accent: '#1976d2'
  },
  {
    id: 'more-or-less',
    domainId: 'math',
    title: 'More or Less',
    shortLabel: '< >',
    description: 'Compare two groups and choose the one that fits.',
    skill: 'Quantity comparison',
    ageBand: 'Early math',
    accent: '#00838f'
  },
  {
    id: 'visual-addition',
    domainId: 'math',
    title: 'Visual Addition',
    shortLabel: '+',
    description: 'Join two small groups and choose the total.',
    skill: 'Joining numbers',
    ageBand: 'Early math',
    accent: '#ef6c00'
  },
  {
    id: 'word-builder',
    domainId: 'reading',
    title: 'Word Builder',
    shortLabel: 'ABC',
    description: 'Build short words from picture clues.',
    skill: 'Letter order',
    ageBand: 'Early reading',
    accent: '#1565c0'
  },
  {
    id: 'fix-the-word',
    domainId: 'reading',
    title: 'Fix the Word',
    shortLabel: 'C_T',
    description: 'Use the picture clue to fill the missing letter.',
    skill: 'Vowel and sound recall',
    ageBand: 'Early reading',
    accent: '#c2185b'
  },
  {
    id: 'read-words',
    domainId: 'reading',
    title: 'Read Words',
    shortLabel: 'Read',
    description: 'Tap sounds from left to right and blend the word.',
    skill: 'Decoding practice',
    ageBand: 'Early reading',
    accent: '#5e35b1'
  },
  {
    id: 'beginning-sounds',
    domainId: 'reading',
    title: 'Beginning Sounds',
    shortLabel: 'Aa',
    description: 'Match pictures to their first letter sound.',
    skill: 'First sounds',
    ageBand: 'Early phonics',
    accent: '#ef6c00'
  },
  {
    id: 'word-families',
    domainId: 'reading',
    title: 'Word Families',
    shortLabel: '-at',
    description: 'Find words that share the same ending pattern.',
    skill: 'Word patterns',
    ageBand: 'Early reading',
    accent: '#00695c'
  },
  {
    id: 'rhyme-match',
    domainId: 'logic',
    title: 'Rhyme Match',
    shortLabel: 'Rh',
    description: 'Find words that share the same ending sound.',
    skill: 'Auditory matching',
    ageBand: 'Language play',
    accent: '#7b1fa2'
  },
  {
    id: 'sequence-builder',
    domainId: 'logic',
    title: 'Sequence Builder',
    shortLabel: '1-2',
    description: 'Complete simple number, letter, and color patterns.',
    skill: 'Pattern reasoning',
    ageBand: 'Logic practice',
    accent: '#3949ab'
  }
];

export const countingRounds: CountingRound[] = [
  { itemId: 'apple', count: 3, noun: 'apples', prompt: 'Mia put apples in a basket. How many apples are there?', options: [2, 3, 4] },
  { itemId: 'bus', count: 4, noun: 'buses', prompt: 'Four buses waited at the stop. How many buses do you see?', options: [3, 4, 5] },
  { itemId: 'pig', count: 2, noun: 'pigs', prompt: 'Two pigs walked to the farm gate. How many pigs are there?', options: [1, 2, 3] }
];

export const tapToCountRounds: TapToCountRound[] = [
  { itemId: 'apple', count: 3, noun: 'apples', prompt: 'Tap each apple and count to three.' },
  { itemId: 'duck', count: 4, noun: 'ducks', prompt: 'Tap each duck. Count every duck one time.' },
  { itemId: 'car', count: 5, noun: 'cars', prompt: 'Tap all five cars in the parking row.' }
];

export const compareRounds: CompareRound[] = [
  {
    prompt: 'Which side has more apples?',
    mode: 'more',
    left: { itemId: 'apple', count: 2, noun: 'apples' },
    right: { itemId: 'apple', count: 4, noun: 'apples' }
  },
  {
    prompt: 'Which side has less buses?',
    mode: 'less',
    left: { itemId: 'bus', count: 3, noun: 'buses' },
    right: { itemId: 'bus', count: 1, noun: 'bus' }
  },
  {
    prompt: 'Which side has more rabbits?',
    mode: 'more',
    left: { itemId: 'rabbit', count: 5, noun: 'rabbits' },
    right: { itemId: 'rabbit', count: 3, noun: 'rabbits' }
  }
];

export const additionRounds: AdditionRound[] = [
  { itemId: 'apple', noun: 'apples', leftCount: 2, rightCount: 1, prompt: 'Two apples plus one apple makes how many?', options: [2, 3, 4] },
  { itemId: 'car', noun: 'cars', leftCount: 1, rightCount: 3, prompt: 'One car plus three cars makes how many?', options: [3, 4, 5] },
  { itemId: 'duck', noun: 'ducks', leftCount: 2, rightCount: 2, prompt: 'Two ducks plus two ducks makes how many?', options: [3, 4, 5] }
];

export const wordRounds: WordRound[] = [
  { itemId: 'bus', word: 'BUS' },
  { itemId: 'cat', word: 'CAT' },
  { itemId: 'pig', word: 'PIG' },
  { itemId: 'dog', word: 'DOG' }
];

export const fixWordRounds: FixWordRound[] = [
  { itemId: 'cat', word: 'CAT', missingIndex: 1, options: ['A', 'O', 'U'] },
  { itemId: 'bus', word: 'BUS', missingIndex: 1, options: ['U', 'I', 'E'] },
  { itemId: 'pig', word: 'PIG', missingIndex: 1, options: ['I', 'A', 'O'] },
  { itemId: 'dog', word: 'DOG', missingIndex: 1, options: ['O', 'E', 'A'] }
];

export const readWordRounds: ReadWordRound[] = [
  { itemId: 'cat', word: 'CAT', sentence: 'Cat can nap.' },
  { itemId: 'dog', word: 'DOG', sentence: 'Dog can dig.' },
  { itemId: 'bus', word: 'BUS', sentence: 'Bus can go.' },
  { itemId: 'pig', word: 'PIG', sentence: 'Pig can sit.' }
];

export const beginningSoundRounds: BeginningSoundRound[] = [
  { letter: 'B', answerId: 'bus', optionIds: ['bus', 'cat', 'pig'] },
  { letter: 'C', answerId: 'cat', optionIds: ['dog', 'cat', 'apple'] },
  { letter: 'P', answerId: 'pig', optionIds: ['car', 'pig', 'duck'] }
];

export const wordFamilyRounds: WordFamilyRound[] = [
  {
    pattern: '-at',
    prompt: 'Tap every word that ends with at.',
    words: [
      { word: 'cat', matches: true },
      { word: 'hat', matches: true },
      { word: 'bat', matches: true },
      { word: 'bus', matches: false },
      { word: 'pig', matches: false },
      { word: 'sun', matches: false }
    ]
  },
  {
    pattern: '-ig',
    prompt: 'Tap every word that ends with ig.',
    words: [
      { word: 'pig', matches: true },
      { word: 'wig', matches: true },
      { word: 'dig', matches: true },
      { word: 'cat', matches: false },
      { word: 'fan', matches: false },
      { word: 'bus', matches: false }
    ]
  },
  {
    pattern: '-op',
    prompt: 'Tap every word that ends with op.',
    words: [
      { word: 'hop', matches: true },
      { word: 'top', matches: true },
      { word: 'pop', matches: true },
      { word: 'car', matches: false },
      { word: 'dog', matches: false },
      { word: 'fish', matches: false }
    ]
  }
];

export const rhymeRounds: RhymeRound[] = [
  { word: 'cat', answer: 'hat', options: ['hat', 'bus', 'dog'] },
  { word: 'pig', answer: 'wig', options: ['sun', 'wig', 'car'] },
  { word: 'bus', answer: 'plus', options: ['fish', 'plus', 'tree'] },
  { word: 'car', answer: 'star', options: ['star', 'moon', 'book'] }
];

export const sequenceRounds: SequenceRound[] = [
  { prompt: 'What comes after 1, 2?', sequence: ['1', '2', '', '4'], blankIndex: 2, answer: '3', options: ['3', '5', '1'] },
  { prompt: 'What letter is missing?', sequence: ['A', 'B', '', 'D'], blankIndex: 2, answer: 'C', options: ['C', 'E', 'G'] },
  { prompt: 'Complete the color pattern.', sequence: ['red', 'blue', 'red', ''], blankIndex: 3, answer: 'blue', options: ['blue', 'green', 'yellow'] }
];
