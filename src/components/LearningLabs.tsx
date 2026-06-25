import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Item } from '../types';
import { ITEMS } from '../data/items';
import {
  AdditionRound,
  CompareRound,
  LearningLabId,
  ObjectGroup,
  additionRounds,
  beginningSoundRounds,
  compareRounds,
  countingRounds,
  fixWordRounds,
  learningLabDomains,
  learningLabs,
  readWordRounds,
  rhymeRounds,
  sequenceRounds,
  tapToCountRounds,
  wordFamilyRounds,
  wordRounds
} from '../data/learningLabs';
import ItemIllustration from './ItemIllustration';
import { speakText } from '../utils/speech';
import './LearningLabs.css';

interface LearningLabsProps {
  onBackToMenu: () => void;
}

const getItem = (itemId: string): Item => {
  const item = ITEMS.find(candidate => candidate.id === itemId);

  if (!item) {
    throw new Error(`Missing learning lab item: ${itemId}`);
  }

  return item;
};

const getNextIndex = (index: number, total: number) => (
  (index + 1) % total
);

const getCompareAnswer = (round: CompareRound): 'left' | 'right' => {
  const leftWins = round.mode === 'more'
    ? round.left.count > round.right.count
    : round.left.count < round.right.count;

  return leftWins ? 'left' : 'right';
};

const getAdditionTotal = (round: AdditionRound): number => (
  round.leftCount + round.rightCount
);

const singularizeNoun = (noun: string): string => {
  if (noun.endsWith('ies')) return `${noun.slice(0, -3)}y`;
  if (noun.endsWith('ses')) return noun.slice(0, -2);
  if (noun.endsWith('s')) return noun.slice(0, -1);
  return noun;
};

const scrollToTop = () => {
  if (typeof window === 'undefined') return;

  const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent.toLowerCase();
  if (userAgent.includes('jsdom')) return;

  const resetScroll = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  resetScroll();
  window.requestAnimationFrame(resetScroll);
  window.setTimeout(resetScroll, 80);
};

const LearningLabs: React.FC<LearningLabsProps> = ({ onBackToMenu }) => {
  const [activeLab, setActiveLab] = useState<LearningLabId | null>(null);
  const [countingIndex, setCountingIndex] = useState(0);
  const [tapToCountIndex, setTapToCountIndex] = useState(0);
  const [tappedObjects, setTappedObjects] = useState<number[]>([]);
  const [compareIndex, setCompareIndex] = useState(0);
  const [additionIndex, setAdditionIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [builtLetters, setBuiltLetters] = useState<string[]>([]);
  const [fixWordIndex, setFixWordIndex] = useState(0);
  const [readWordIndex, setReadWordIndex] = useState(0);
  const [readLetters, setReadLetters] = useState<string[]>([]);
  const [beginningIndex, setBeginningIndex] = useState(0);
  const [wordFamilyIndex, setWordFamilyIndex] = useState(0);
  const [selectedFamilyWords, setSelectedFamilyWords] = useState<string[]>([]);
  const [rhymeIndex, setRhymeIndex] = useState(0);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    scrollToTop();
  }, []);

  const activeLabDefinition = useMemo(
    () => learningLabs.find(lab => lab.id === activeLab) || null,
    [activeLab]
  );

  const resetActivityState = () => {
    setFeedback('');
    setBuiltLetters([]);
    setReadLetters([]);
    setTappedObjects([]);
    setSelectedFamilyWords([]);
  };

  const advanceRound = (
    updateIndex: React.Dispatch<React.SetStateAction<number>>,
    total: number,
    delay = 1000
  ) => {
    window.setTimeout(() => {
      updateIndex(index => getNextIndex(index, total));
      resetActivityState();
    }, delay);
  };

  const selectLab = (labId: LearningLabId) => {
    setActiveLab(labId);
    resetActivityState();
    const lab = learningLabs.find(candidate => candidate.id === labId);
    if (lab) speakText(lab.title, { interrupt: true, rate: 0.88 });
  };

  const goBack = () => {
    if (activeLab) {
      setActiveLab(null);
      resetActivityState();
      return;
    }

    onBackToMenu();
  };

  const renderObjectGroup = (group: ObjectGroup, label: string) => {
    const item = getItem(group.itemId);

    return (
      <div className="object-group" aria-label={label}>
        {Array.from({ length: group.count }).map((_, index) => (
          <span className="object-token" key={`${group.itemId}-${index}`}>
            <ItemIllustration item={item} />
          </span>
        ))}
      </div>
    );
  };

  const renderPrompt = (kicker: string, prompt: string) => (
    <div className="lab-prompt-row">
      <div>
        <span className="lab-kicker">{kicker}</span>
        <h2>{prompt}</h2>
      </div>
      <button className="lab-speak-button" onClick={() => speakText(prompt)}>
        Listen
      </button>
    </div>
  );

  const handleCountingAnswer = (answer: number) => {
    const round = countingRounds[countingIndex];
    const isCorrect = answer === round.count;
    const message = isCorrect
      ? `Yes. ${round.count} ${round.noun}.`
      : `Good try. Count each ${singularizeNoun(round.noun)} one by one.`;

    setFeedback(message);
    speakText(message, { interrupt: true, rate: 0.86 });

    if (isCorrect) {
      advanceRound(setCountingIndex, countingRounds.length, 900);
    }
  };

  const handleTapObject = (objectIndex: number) => {
    const round = tapToCountRounds[tapToCountIndex];
    if (tappedObjects.includes(objectIndex)) return;

    const nextTappedObjects = [...tappedObjects, objectIndex];
    setTappedObjects(nextTappedObjects);

    if (nextTappedObjects.length === round.count) {
      const message = `You counted ${round.count} ${round.noun}.`;
      setFeedback(message);
      speakText(message, { interrupt: true, rate: 0.86 });
      advanceRound(setTapToCountIndex, tapToCountRounds.length, 1000);
      return;
    }

    speakText(`${nextTappedObjects.length}`, { interrupt: true, rate: 0.78 });
  };

  const handleCompareAnswer = (side: 'left' | 'right') => {
    const round = compareRounds[compareIndex];
    const isCorrect = side === getCompareAnswer(round);
    const winningGroup = round[side];
    const message = isCorrect
      ? `Correct. That side has ${round.mode} ${winningGroup.noun}.`
      : `Good try. Look for the group with ${round.mode} items.`;

    setFeedback(message);
    speakText(message, { interrupt: true, rate: 0.86 });

    if (isCorrect) {
      advanceRound(setCompareIndex, compareRounds.length, 1000);
    }
  };

  const handleAdditionAnswer = (answer: number) => {
    const round = additionRounds[additionIndex];
    const total = getAdditionTotal(round);
    const isCorrect = answer === total;
    const message = isCorrect
      ? `Yes. ${round.leftCount} plus ${round.rightCount} makes ${total}.`
      : `Good try. Count both groups together.`;

    setFeedback(message);
    speakText(message, { interrupt: true, rate: 0.86 });

    if (isCorrect) {
      advanceRound(setAdditionIndex, additionRounds.length, 1000);
    }
  };

  const handleLetterSelect = (letter: string) => {
    const round = wordRounds[wordIndex];
    const nextLetters = [...builtLetters, letter];
    setBuiltLetters(nextLetters);

    if (nextLetters.length !== round.word.length) return;

    const builtWord = nextLetters.join('');
    const isCorrect = builtWord === round.word;
    const message = isCorrect
      ? `You built ${round.word}.`
      : `That spells ${builtWord}. Try ${round.word} again.`;

    setFeedback(message);
    speakText(message, { interrupt: true, rate: 0.84 });

    window.setTimeout(() => {
      if (isCorrect) {
        setWordIndex(index => getNextIndex(index, wordRounds.length));
      }
      resetActivityState();
    }, 1100);
  };

  const handleFixWordAnswer = (letter: string) => {
    const round = fixWordRounds[fixWordIndex];
    const correctLetter = round.word[round.missingIndex];
    const isCorrect = letter === correctLetter;
    const message = isCorrect
      ? `Yes. ${round.word} needs ${correctLetter}.`
      : `Good try. Listen for the missing sound in ${round.word}.`;

    setFeedback(message);
    speakText(message, { interrupt: true, rate: 0.86 });

    if (isCorrect) {
      advanceRound(setFixWordIndex, fixWordRounds.length, 1000);
    }
  };

  const handleReadLetter = (letter: string) => {
    const round = readWordRounds[readWordIndex];
    const expectedLetter = round.word[readLetters.length];

    if (letter !== expectedLetter) {
      const message = `Start with ${expectedLetter}.`;
      setFeedback(message);
      speakText(message, { interrupt: true, rate: 0.82 });
      return;
    }

    const nextLetters = [...readLetters, letter];
    setReadLetters(nextLetters);
    speakText(letter, { interrupt: true, rate: 0.72 });

    if (nextLetters.length === round.word.length) {
      const message = `You read ${round.word}. ${round.sentence}`;
      setFeedback(message);
      window.setTimeout(() => {
        speakText(message, { interrupt: true, rate: 0.82 });
      }, 220);
      advanceRound(setReadWordIndex, readWordRounds.length, 1400);
    }
  };

  const handleBeginningSoundAnswer = (item: Item) => {
    const round = beginningSoundRounds[beginningIndex];
    const isCorrect = item.id === round.answerId;
    const message = isCorrect
      ? `${item.name} starts with ${round.letter}.`
      : `${item.name} starts with ${item.name.charAt(0).toUpperCase()}. Listen for ${round.letter}.`;

    setFeedback(message);
    speakText(message, { interrupt: true, rate: 0.86 });

    if (isCorrect) {
      advanceRound(setBeginningIndex, beginningSoundRounds.length, 1000);
    }
  };

  const handleWordFamilyChoice = (word: string, matches: boolean) => {
    const round = wordFamilyRounds[wordFamilyIndex];

    if (!matches) {
      const message = `${word} does not end with ${round.pattern.replace('-', '')}.`;
      setFeedback(message);
      speakText(message, { interrupt: true, rate: 0.86 });
      return;
    }

    if (selectedFamilyWords.includes(word)) return;

    const nextSelectedWords = [...selectedFamilyWords, word];
    const matchingWords = round.words
      .filter(choice => choice.matches)
      .map(choice => choice.word);

    setSelectedFamilyWords(nextSelectedWords);

    if (matchingWords.every(match => nextSelectedWords.includes(match))) {
      const message = `Great work. ${round.pattern} words go together.`;
      setFeedback(message);
      speakText(message, { interrupt: true, rate: 0.86 });
      advanceRound(setWordFamilyIndex, wordFamilyRounds.length, 1100);
      return;
    }

    const message = `${word} belongs with ${round.pattern}.`;
    setFeedback(message);
    speakText(message, { interrupt: true, rate: 0.86 });
  };

  const handleRhymeAnswer = (answer: string) => {
    const round = rhymeRounds[rhymeIndex];
    const isCorrect = answer === round.answer;
    const message = isCorrect
      ? `${round.word} and ${answer} rhyme.`
      : `${answer} does not rhyme with ${round.word}. Try another ending sound.`;

    setFeedback(message);
    speakText(message, { interrupt: true, rate: 0.86 });

    if (isCorrect) {
      advanceRound(setRhymeIndex, rhymeRounds.length, 1000);
    }
  };

  const handleSequenceAnswer = (answer: string) => {
    const round = sequenceRounds[sequenceIndex];
    const isCorrect = answer === round.answer;
    const message = isCorrect
      ? `${answer} completes the pattern.`
      : `Good try. Look at what comes before and after the empty spot.`;

    setFeedback(message);
    speakText(message, { interrupt: true, rate: 0.86 });

    if (isCorrect) {
      advanceRound(setSequenceIndex, sequenceRounds.length, 1000);
    }
  };

  const renderCountingStories = () => {
    const round = countingRounds[countingIndex];

    return (
      <div className="lab-play-surface">
        {renderPrompt('Counting Story', round.prompt)}
        <div className="counting-story-board">
          {renderObjectGroup(round, `${round.count} ${round.noun}`)}
        </div>
        <div className="lab-option-row">
          {round.options.map(option => (
            <button
              key={option}
              className="number-choice"
              onClick={() => handleCountingAnswer(option)}
              aria-label={`Choose ${option}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderTapToCount = () => {
    const round = tapToCountRounds[tapToCountIndex];
    const item = getItem(round.itemId);

    return (
      <div className="lab-play-surface">
        {renderPrompt('Tap to Count', round.prompt)}
        <div className="tap-count-meter" aria-live="polite">
          <span>{tappedObjects.length}</span>
          <strong>of {round.count}</strong>
        </div>
        <div className="tap-count-board" aria-label={`Tap ${round.count} ${round.noun}`}>
          {Array.from({ length: round.count }).map((_, index) => {
            const isTapped = tappedObjects.includes(index);

            return (
              <button
                key={`${round.itemId}-${index}`}
                className={`tap-count-object ${isTapped ? 'tapped' : ''}`}
                onClick={() => handleTapObject(index)}
                aria-label={`Tap ${round.noun} ${index + 1}`}
              >
                <ItemIllustration item={item} />
                {isTapped && <span>{tappedObjects.indexOf(index) + 1}</span>}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMoreOrLess = () => {
    const round = compareRounds[compareIndex];

    return (
      <div className="lab-play-surface">
        {renderPrompt('More or Less', round.prompt)}
        <div className="compare-board">
          {(['left', 'right'] as const).map(side => (
            <button
              key={side}
              className="compare-choice"
              onClick={() => handleCompareAnswer(side)}
              aria-label={`Choose ${side} group`}
            >
              {renderObjectGroup(round[side], `${round[side].count} ${round[side].noun}`)}
              <strong>{side === 'left' ? 'Left' : 'Right'}</strong>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderVisualAddition = () => {
    const round = additionRounds[additionIndex];
    const leftGroup: ObjectGroup = { itemId: round.itemId, count: round.leftCount, noun: round.noun };
    const rightGroup: ObjectGroup = { itemId: round.itemId, count: round.rightCount, noun: round.noun };

    return (
      <div className="lab-play-surface">
        {renderPrompt('Visual Addition', round.prompt)}
        <div className="addition-board">
          {renderObjectGroup(leftGroup, `${round.leftCount} ${round.noun}`)}
          <span className="operator-token">+</span>
          {renderObjectGroup(rightGroup, `${round.rightCount} ${round.noun}`)}
          <span className="operator-token">=</span>
          <span className="answer-blank">?</span>
        </div>
        <div className="lab-option-row">
          {round.options.map(option => (
            <button
              key={option}
              className="number-choice addition-choice"
              onClick={() => handleAdditionAnswer(option)}
              aria-label={`Choose total ${option}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderWordBuilder = () => {
    const round = wordRounds[wordIndex];
    const item = getItem(round.itemId);
    const letterBank = round.word.split('');

    return (
      <div className="lab-play-surface">
        {renderPrompt('Word Builder', `Build the word for ${item.name}.`)}
        <div className="word-builder-stage">
          <ItemIllustration item={item} />
          <div className="word-slots" aria-label={`Word slots for ${round.word}`}>
            {round.word.split('').map((_, index) => (
              <span key={index} className="word-slot">
                {builtLetters[index] || ''}
              </span>
            ))}
          </div>
        </div>
        <div className="letter-bank">
          {letterBank.map((letter, index) => (
            <button
              key={`${letter}-${index}`}
              onClick={() => handleLetterSelect(letter)}
              disabled={builtLetters.length >= round.word.length}
              aria-label={`Letter ${letter}`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderFixTheWord = () => {
    const round = fixWordRounds[fixWordIndex];
    const item = getItem(round.itemId);
    const visibleWord = round.word
      .split('')
      .map((letter, index) => index === round.missingIndex ? '_' : letter);

    return (
      <div className="lab-play-surface">
        {renderPrompt('Fix the Word', `Which letter completes ${item.name}?`)}
        <div className="fix-word-stage">
          <ItemIllustration item={item} />
          <div className="partial-word" aria-label={`Missing letter word ${round.word}`}>
            {visibleWord.map((letter, index) => (
              <span key={index} className={letter === '_' ? 'missing-letter' : ''}>
                {letter}
              </span>
            ))}
          </div>
        </div>
        <div className="letter-bank">
          {round.options.map(letter => (
            <button
              key={letter}
              onClick={() => handleFixWordAnswer(letter)}
              aria-label={`Choose missing letter ${letter}`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderReadWords = () => {
    const round = readWordRounds[readWordIndex];
    const item = getItem(round.itemId);

    return (
      <div className="lab-play-surface">
        {renderPrompt('Read Words', `Tap the sounds to read ${item.name}.`)}
        <div className="read-word-stage">
          <ItemIllustration item={item} />
          <div className="read-word-display" aria-label={`Read word ${round.word}`}>
            {round.word.split('').map((letter, index) => (
              <span key={index} className={readLetters[index] ? 'read' : ''}>
                {readLetters[index] || letter}
              </span>
            ))}
          </div>
          <p>{round.sentence}</p>
        </div>
        <div className="letter-bank sound-letter-row">
          {round.word.split('').map((letter, index) => (
            <button
              key={`${letter}-${index}`}
              onClick={() => handleReadLetter(letter)}
              disabled={Boolean(readLetters[index])}
              aria-label={`Read letter ${letter}`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderBeginningSounds = () => {
    const round = beginningSoundRounds[beginningIndex];
    const options = round.optionIds.map(getItem);

    return (
      <div className="lab-play-surface">
        {renderPrompt('Beginning Sounds', `Which picture starts with ${round.letter}?`)}
        <div className="sound-options-grid">
          {options.map(item => (
            <button
              className="picture-choice"
              key={item.id}
              onClick={() => handleBeginningSoundAnswer(item)}
              aria-label={`Choose ${item.name} for ${round.letter}`}
            >
              <ItemIllustration item={item} />
              <strong>{item.name}</strong>
              <span>{item.name.charAt(0).toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderWordFamilies = () => {
    const round = wordFamilyRounds[wordFamilyIndex];

    return (
      <div className="lab-play-surface">
        {renderPrompt('Word Families', round.prompt)}
        <div className="family-pattern-card">
          <span>{round.pattern}</span>
          <strong>same ending</strong>
        </div>
        <div className="word-family-grid">
          {round.words.map(choice => {
            const isSelected = selectedFamilyWords.includes(choice.word);

            return (
              <button
                key={choice.word}
                className={`word-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => handleWordFamilyChoice(choice.word, choice.matches)}
                aria-label={`Choose word ${choice.word}`}
              >
                {choice.word}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRhymeMatch = () => {
    const round = rhymeRounds[rhymeIndex];

    return (
      <div className="lab-play-surface">
        {renderPrompt('Rhyme Match', `Which word rhymes with ${round.word}?`)}
        <div className="rhyme-target">{round.word}</div>
        <div className="rhyme-options-grid">
          {round.options.map(option => (
            <button
              key={option}
              className="rhyme-choice"
              onClick={() => handleRhymeAnswer(option)}
              aria-label={`Choose ${option}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderSequenceBuilder = () => {
    const round = sequenceRounds[sequenceIndex];

    return (
      <div className="lab-play-surface">
        {renderPrompt('Sequence Builder', round.prompt)}
        <div className="sequence-row" aria-label="Sequence pattern">
          {round.sequence.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className={`sequence-token ${index === round.blankIndex ? 'sequence-blank' : ''}`}
            >
              {index === round.blankIndex ? '?' : value}
            </span>
          ))}
        </div>
        <div className="sequence-options">
          {round.options.map(option => (
            <button
              key={option}
              className="sequence-choice"
              onClick={() => handleSequenceAnswer(option)}
              aria-label={`Choose sequence ${option}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderActiveLab = () => {
    switch (activeLab) {
      case 'counting-stories':
        return renderCountingStories();
      case 'tap-to-count':
        return renderTapToCount();
      case 'more-or-less':
        return renderMoreOrLess();
      case 'visual-addition':
        return renderVisualAddition();
      case 'word-builder':
        return renderWordBuilder();
      case 'fix-the-word':
        return renderFixTheWord();
      case 'read-words':
        return renderReadWords();
      case 'beginning-sounds':
        return renderBeginningSounds();
      case 'word-families':
        return renderWordFamilies();
      case 'rhyme-match':
        return renderRhymeMatch();
      case 'sequence-builder':
        return renderSequenceBuilder();
      default:
        return null;
    }
  };

  return (
    <div className="learning-labs">
      <div className="learning-labs-inner">
        <div className="labs-topbar">
          <button className="lab-back-button" onClick={goBack}>
            Back
          </button>
          <div>
            <span className="labs-eyebrow">Structured practice</span>
            <h1>Learning Labs</h1>
            <p>Focused math, reading, and thinking activities for short daily practice.</p>
          </div>
        </div>

        {!activeLab ? (
          <div className="labs-dashboard">
            <section className="labs-hero-panel" aria-labelledby="labs-hero-heading">
              <div>
                <span className="labs-eyebrow">Learning path</span>
                <h2 id="labs-hero-heading">Choose a skill studio</h2>
                <p>
                  Activities are grouped by skill so the game can keep growing without feeling
                  scattered.
                </p>
              </div>
              <div className="labs-stats-row" aria-label="Learning lab summary">
                <span><strong>{learningLabs.length}</strong> activities</span>
                <span><strong>3</strong> skill areas</span>
                <span><strong>5 min</strong> sessions</span>
              </div>
            </section>

            {learningLabDomains.map(domain => {
              const domainLabs = learningLabs.filter(lab => lab.domainId === domain.id);

              return (
                <section className="lab-section" key={domain.id} aria-labelledby={`${domain.id}-heading`}>
                  <div className="lab-section-header">
                    <div>
                      <span className="domain-dot" style={{ backgroundColor: domain.accent }} />
                      <h2 id={`${domain.id}-heading`}>{domain.title}</h2>
                      <p>{domain.summary}</p>
                    </div>
                    <span>{domainLabs.length} labs</span>
                  </div>
                  <div className="lab-card-grid">
                    {domainLabs.map((lab, index) => (
                      <motion.button
                        key={lab.id}
                        className="lab-card"
                        style={{ borderColor: lab.accent }}
                        onClick={() => selectLab(lab.id)}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, delay: index * 0.03 }}
                        aria-label={`Open ${lab.title}`}
                      >
                        <span className="lab-card-icon" style={{ backgroundColor: `${lab.accent}18`, color: lab.accent }}>
                          {lab.shortLabel}
                        </span>
                        <strong>{lab.title}</strong>
                        <span>{lab.description}</span>
                        <small>{lab.skill}</small>
                      </motion.button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <motion.div
            className="active-lab-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="active-lab-header">
              <span
                className="lab-card-icon compact"
                style={{
                  backgroundColor: `${activeLabDefinition?.accent || '#1565c0'}18`,
                  color: activeLabDefinition?.accent || '#1565c0'
                }}
              >
                {activeLabDefinition?.shortLabel}
              </span>
              <div>
                <span className="lab-kicker">{activeLabDefinition?.ageBand}</span>
                <h2>{activeLabDefinition?.title}</h2>
                <p>{activeLabDefinition?.description}</p>
              </div>
            </div>

            {renderActiveLab()}

            {feedback && (
              <div className="lab-feedback" role="status" aria-live="polite">
                {feedback}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LearningLabs;
