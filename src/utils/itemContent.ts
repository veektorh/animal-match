import { Category, Item, ItemVisual, LocaleCode, LocalizedItemContent } from '../types';

const numberValues: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
};

const letterExamples: Record<string, string> = {
  a: 'Apple',
  b: 'Banana',
  c: 'Cat',
  d: 'Dog',
  e: 'Egg',
  f: 'Fish',
  g: 'Grape',
  h: 'Horse',
  i: 'Igloo',
  j: 'Juice',
  k: 'Kite',
  l: 'Lemon',
  m: 'Mango',
  n: 'Nest',
  o: 'Orange',
  p: 'Pig',
  q: 'Queen',
  r: 'Rabbit',
  s: 'Sheep',
  t: 'Turtle',
  u: 'Umbrella',
  v: 'Violin',
  w: 'Whale',
  x: 'X-ray',
  y: 'Yellow',
  z: 'Zebra'
};

const colorPalette: Record<string, { accent: string; textColor: string; example: string }> = {
  red: { accent: '#e53935', textColor: '#ffffff', example: 'a ripe apple' },
  blue: { accent: '#1e88e5', textColor: '#ffffff', example: 'the daytime sky' },
  yellow: { accent: '#fdd835', textColor: '#3b3000', example: 'sunshine' },
  green: { accent: '#43a047', textColor: '#ffffff', example: 'fresh grass' },
  orange: { accent: '#fb8c00', textColor: '#ffffff', example: 'an orange fruit' },
  purple: { accent: '#8e24aa', textColor: '#ffffff', example: 'grapes' },
  pink: { accent: '#ec407a', textColor: '#ffffff', example: 'a flower petal' },
  white: { accent: '#ffffff', textColor: '#263238', example: 'milk' },
  black: { accent: '#263238', textColor: '#ffffff', example: 'night' },
  brown: { accent: '#795548', textColor: '#ffffff', example: 'tree bark' }
};

const fruitPalette: Record<string, { accent: string; secondaryAccent: string; example: string }> = {
  apple: { accent: '#e53935', secondaryAccent: '#7cb342', example: 'round and crunchy' },
  banana: { accent: '#fdd835', secondaryAccent: '#6d4c41', example: 'long and yellow' },
  'orange-fruit': { accent: '#fb8c00', secondaryAccent: '#43a047', example: 'round citrus fruit' },
  strawberry: { accent: '#e53935', secondaryAccent: '#43a047', example: 'red with tiny seeds' },
  grape: { accent: '#7b1fa2', secondaryAccent: '#66bb6a', example: 'small fruits in a bunch' },
  watermelon: { accent: '#ef5350', secondaryAccent: '#2e7d32', example: 'green outside and red inside' },
  pineapple: { accent: '#fbc02d', secondaryAccent: '#2e7d32', example: 'spiky tropical fruit' },
  lemon: { accent: '#fdd835', secondaryAccent: '#43a047', example: 'sour yellow citrus' },
  pear: { accent: '#9ccc65', secondaryAccent: '#6d4c41', example: 'green and soft' },
  blueberry: { accent: '#3949ab', secondaryAccent: '#7e57c2', example: 'small blue berry' },
  avocado: { accent: '#7cb342', secondaryAccent: '#5d4037', example: 'green fruit with a pit' },
  mango: { accent: '#ffb300', secondaryAccent: '#43a047', example: 'sweet tropical fruit' },
  peach: { accent: '#ffab91', secondaryAccent: '#43a047', example: 'soft pink-orange fruit' },
  cucumber: { accent: '#43a047', secondaryAccent: '#a5d6a7', example: 'long green fruit' },
  carrot: { accent: '#f57c00', secondaryAccent: '#43a047', example: 'orange root vegetable' }
};

const habitatPalette: Record<string, { background: string; accent: string; secondaryAccent: string }> = {
  farm: { background: '#eef7e4', accent: '#8bc34a', secondaryAccent: '#558b2f' },
  wild: { background: '#e0f7fa', accent: '#26a69a', secondaryAccent: '#00796b' },
  ocean: { background: '#e3f2fd', accent: '#42a5f5', secondaryAccent: '#1565c0' },
  forest: { background: '#e8f5e9', accent: '#66bb6a', secondaryAccent: '#2e7d32' },
  jungle: { background: '#f1f8e9', accent: '#9ccc65', secondaryAccent: '#33691e' },
  arctic: { background: '#e0f7fa', accent: '#80deea', secondaryAccent: '#00838f' },
  desert: { background: '#fff3e0', accent: '#ffb74d', secondaryAccent: '#ef6c00' }
};

const categoryBackgrounds: Record<Category, string> = {
  animals: '#eef7e4',
  numbers: '#e3f2fd',
  alphabets: '#fff8e1',
  colors: '#f3e5f5',
  fruits: '#fff3e0'
};

const patternOptions: ItemVisual['pattern'][] = ['spots', 'stripes', 'dots'];

const getStablePattern = (id: string): ItemVisual['pattern'] => {
  const codeTotal = id.split('').reduce((total, character) => total + character.charCodeAt(0), 0);
  return patternOptions[codeTotal % patternOptions.length];
};

const getItemArticle = (name: string): string => (
  /^[aeiou]/i.test(name) ? 'an' : 'a'
);

export const getLocalizedItemContent = (
  item: Item,
  locale: LocaleCode = 'en'
): Required<LocalizedItemContent> => {
  const savedContent = item.content?.[locale] || {};
  const generatedContent = getGeneratedItemContent(item);

  return {
    name: savedContent.name || generatedContent.name || item.name,
    prompt: savedContent.prompt || generatedContent.prompt || `Can you find ${item.name}?`,
    hint: savedContent.hint || generatedContent.hint || `Look for ${item.name}.`,
    example: savedContent.example || generatedContent.example || '',
    soundText: savedContent.soundText || generatedContent.soundText || item.name
  };
};

export const getItemPrompt = (item: Item, locale: LocaleCode = 'en'): string => (
  getLocalizedItemContent(item, locale).prompt
);

export const getItemHint = (item: Item, locale: LocaleCode = 'en'): string => (
  getLocalizedItemContent(item, locale).hint
);

export const getItemExample = (item: Item, locale: LocaleCode = 'en'): string => (
  getLocalizedItemContent(item, locale).example
);

export const getItemVisual = (item: Item): ItemVisual => {
  if (item.visual) {
    return item.visual;
  }

  if (item.category === 'numbers') {
    const value = numberValues[item.id] || parseInt(item.name, 10) || 1;

    return {
      kind: 'number',
      background: '#e3f2fd',
      accent: '#1e88e5',
      secondaryAccent: '#90caf9',
      textColor: '#0d47a1',
      label: String(value),
      value,
      pattern: 'dots'
    };
  }

  if (item.category === 'alphabets') {
    const letter = item.name.toUpperCase();

    return {
      kind: 'letter',
      background: '#fff8e1',
      accent: '#fb8c00',
      secondaryAccent: '#ffe082',
      textColor: '#4e342e',
      label: letter,
      detail: letterExamples[item.id] || '',
      pattern: 'stripes'
    };
  }

  if (item.category === 'colors') {
    const palette = colorPalette[item.id] || { accent: '#78909c', textColor: '#ffffff', example: item.name };

    return {
      kind: 'color',
      background: '#f5f5f5',
      accent: palette.accent,
      secondaryAccent: '#ffffff',
      textColor: palette.textColor,
      label: item.name,
      detail: palette.example,
      pattern: 'none'
    };
  }

  if (item.category === 'fruits') {
    const palette = fruitPalette[item.id] || {
      accent: '#ff7043',
      secondaryAccent: '#43a047',
      example: `${getItemArticle(item.name)} ${item.name.toLowerCase()}`
    };

    return {
      kind: 'fruit',
      background: categoryBackgrounds.fruits,
      accent: palette.accent,
      secondaryAccent: palette.secondaryAccent,
      textColor: '#3e2723',
      label: item.name.charAt(0).toUpperCase(),
      detail: palette.example,
      pattern: 'spots'
    };
  }

  const habitat = item.subcategory || 'wild';
  const palette = habitatPalette[habitat] || habitatPalette.wild;

  return {
    kind: 'animal',
    background: palette.background,
    accent: palette.accent,
    secondaryAccent: palette.secondaryAccent,
    textColor: '#1b1b1b',
    label: item.name.charAt(0).toUpperCase(),
    detail: habitat,
    pattern: getStablePattern(item.id)
  };
};

const getGeneratedItemContent = (item: Item): Required<LocalizedItemContent> => {
  if (item.category === 'numbers') {
    const value = numberValues[item.id] || parseInt(item.name, 10) || 1;
    const plural = value === 1 ? 'dot' : 'dots';

    return {
      name: item.name,
      prompt: `Can you find the number ${item.name}?`,
      hint: `${item.name} means ${value}. Count ${value} ${plural} on the card.`,
      example: `${value} ${plural}`,
      soundText: item.name
    };
  }

  if (item.category === 'alphabets') {
    const example = letterExamples[item.id] || item.name;

    return {
      name: item.name,
      prompt: `Can you find the letter ${item.name}?`,
      hint: `${item.name} starts ${example}. Look for the big letter ${item.name}.`,
      example,
      soundText: item.name
    };
  }

  if (item.category === 'colors') {
    const palette = colorPalette[item.id];
    const example = palette?.example || item.name.toLowerCase();

    return {
      name: item.name,
      prompt: `Can you find the color ${item.name}?`,
      hint: `${item.name} is the color shown on the paint card, like ${example}.`,
      example,
      soundText: item.name
    };
  }

  if (item.category === 'fruits') {
    const fruit = fruitPalette[item.id];
    const example = fruit?.example || `${getItemArticle(item.name)} ${item.name.toLowerCase()}`;

    return {
      name: item.name,
      prompt: `Can you find the fruit ${item.name}?`,
      hint: `${item.name} is ${example}. Look for its fruit picture.`,
      example,
      soundText: item.name
    };
  }

  const habitat = item.subcategory || 'animal';

  return {
    name: item.name,
    prompt: `Can you find the ${item.name}?`,
    hint: `${item.name} belongs with the ${habitat} group. Look for its animal portrait.`,
    example: habitat,
    soundText: item.name
  };
};
