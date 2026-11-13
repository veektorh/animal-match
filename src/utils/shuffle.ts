// Unbiased Fisher-Yates shuffle (sorting with a random comparator favours some orders).
export const shuffle = <T,>(items: readonly T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Shuffle, but never return the original order when another order exists,
// so a child cannot answer by always tapping the same position.
export const shuffleAway = <T,>(items: readonly T[]): T[] => {
  if (new Set(items).size < 2) return [...items];
  let result = shuffle(items);
  while (result.every((item, index) => item === items[index])) {
    result = shuffle(items);
  }
  return result;
};
