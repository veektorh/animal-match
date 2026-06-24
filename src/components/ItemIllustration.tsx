import React from 'react';
import { Item } from '../types';
import { getItemVisual } from '../utils/itemContent';
import './ItemIllustration.css';

interface ItemIllustrationProps {
  item: Item;
}

const numberTokenPositions = [
  { cx: 36, cy: 38 },
  { cx: 58, cy: 38 },
  { cx: 80, cy: 38 },
  { cx: 102, cy: 38 },
  { cx: 124, cy: 38 },
  { cx: 36, cy: 66 },
  { cx: 58, cy: 66 },
  { cx: 80, cy: 66 },
  { cx: 102, cy: 66 },
  { cx: 124, cy: 66 }
];

const numberBadgePosition = {
  x: 34,
  y: 96,
  width: 92,
  height: 54,
  centerX: 80,
  centerY: 124
};

const numberTokenRadius = {
  filled: 8,
  empty: 6
};

const numberTokenHighlightRadius = 2.5;

const numberTokenHighlightOffset = {
  x: -2.5,
  y: -3
};

const numberTokenHighlightOpacity = 0.72;

const numberTokenEmptyOpacity = 0.58;

const numberTokenHighlightFill = '#ffffff';

const numberTokenEmptyFill = '#d7ecff';

const numberFrame = {
  x: 18,
  y: 18,
  width: 124,
  height: 66,
  radius: 18
};

const ItemIllustration: React.FC<ItemIllustrationProps> = ({ item }) => {
  const visual = getItemVisual(item);
  const label = visual.label || item.name.charAt(0).toUpperCase();
  const letterExampleGlyphs: Record<string, string> = {
    a: '🍎',
    b: '🍌',
    c: '🐱',
    d: '🐶',
    e: '🥚',
    f: '🐟',
    g: '🍇',
    h: '🐴',
    i: '🧊',
    j: '🧃',
    k: '🪁',
    l: '🍋',
    m: '🥭',
    n: '🪺',
    o: '🍊',
    p: '🐷',
    q: '👑',
    r: '🐰',
    s: '🐑',
    t: '🐢',
    u: '☂️',
    v: '🎻',
    w: '🐳',
    x: '🩻',
    y: '🟡',
    z: '🦓'
  };

  if (item.imageUrl) {
    return (
      <div className="item-illustration image-illustration" aria-label={`Illustration for ${item.name}`}>
        <img src={item.imageUrl} alt="" />
      </div>
    );
  }

  if (visual.kind === 'number') {
    const dotCount = Math.max(1, Math.min(10, visual.value || 1));

    return (
      <div className="item-illustration number-illustration" aria-label={`Illustration for ${item.name}`}>
        <svg viewBox="0 0 160 160" role="img" aria-hidden="true">
          <rect width="160" height="160" rx="34" fill={visual.background} />
          <rect
            className="number-frame"
            x={numberFrame.x}
            y={numberFrame.y}
            width={numberFrame.width}
            height={numberFrame.height}
            rx={numberFrame.radius}
            fill="#ffffff"
            stroke={visual.accent}
            strokeWidth="5"
          />
          {numberTokenPositions.map((position, index) => {
            const isFilled = index < dotCount;
            const tokenFill = isFilled ? visual.accent : numberTokenEmptyFill;

            return (
              <g key={index} className={isFilled ? 'number-token-filled' : 'number-token-empty'}>
                <circle
                  cx={position.cx}
                  cy={position.cy}
                  r={isFilled ? numberTokenRadius.filled : numberTokenRadius.empty}
                  fill={tokenFill}
                  opacity={isFilled ? 1 : numberTokenEmptyOpacity}
                />
                {isFilled && (
                  <circle
                    cx={position.cx + numberTokenHighlightOffset.x}
                    cy={position.cy + numberTokenHighlightOffset.y}
                    r={numberTokenHighlightRadius}
                    fill={numberTokenHighlightFill}
                    opacity={numberTokenHighlightOpacity}
                  />
                )}
              </g>
            );
          })}
          <rect
            x={numberBadgePosition.x}
            y={numberBadgePosition.y}
            width={numberBadgePosition.width}
            height={numberBadgePosition.height}
            rx="24"
            fill="#ffffff"
            stroke={visual.accent}
            strokeWidth="5"
          />
          <text
            x={numberBadgePosition.centerX}
            y={numberBadgePosition.centerY}
            dominantBaseline="central"
            textAnchor="middle"
            className="number-label"
            fill={visual.textColor || visual.accent}
          >
            {label}
          </text>
        </svg>
      </div>
    );
  }

  if (visual.kind === 'letter') {
    const lowerLabel = label.toLowerCase();

    return (
      <div className="item-illustration letter-illustration" aria-label={`Illustration for ${item.name}`}>
        <svg viewBox="0 0 120 120" role="img" aria-hidden="true">
          <rect width="120" height="120" rx="26" fill={visual.background} />
          <path d="M21 30h78M21 56h78M21 82h78" stroke={visual.secondaryAccent || '#ffe082'} strokeWidth="8" strokeLinecap="round" />
          <circle cx="51" cy="56" r="36" fill="#ffffff" stroke={visual.accent} strokeWidth="4" />
          <text x="51" y="73" textAnchor="middle" className="letter-label" fill={visual.textColor || '#333333'}>
            {label}
          </text>
          <circle cx="86" cy="83" r="22" fill="#ffffff" stroke={visual.accent} strokeWidth="4" />
          <text x="86" y="94" textAnchor="middle" className="letter-lower-label" fill={visual.textColor || '#333333'}>
            {lowerLabel}
          </text>
          <text x="86" y="43" textAnchor="middle" className="letter-example-glyph">
            {letterExampleGlyphs[item.id] || label}
          </text>
        </svg>
      </div>
    );
  }

  if (visual.kind === 'color') {
    return (
      <div className="item-illustration" aria-label={`Illustration for ${item.name}`}>
        <svg viewBox="0 0 120 120" role="img" aria-hidden="true">
          <rect width="120" height="120" rx="26" fill={visual.background} />
          <path d="M30 34h60v38c0 13-10 24-24 24H54c-14 0-24-11-24-24V34z" fill={visual.accent} stroke="#263238" strokeWidth="3" />
          <path d="M38 34c5 8 11 8 16 0s11-8 16 0 11 8 16 0" fill="none" stroke={visual.secondaryAccent || '#ffffff'} strokeWidth="5" strokeLinecap="round" />
          <rect x="78" y="24" width="11" height="52" rx="5" transform="rotate(36 83.5 50)" fill="#795548" />
          <circle cx="91" cy="83" r="10" fill={visual.accent} stroke="#263238" strokeWidth="3" />
        </svg>
      </div>
    );
  }

  if (visual.kind === 'fruit') {
    return (
      <div
        className={`item-illustration emoji-illustration ${visual.kind}-illustration pattern-${visual.pattern || 'none'}`}
        aria-label={`Illustration for ${item.name}`}
        style={{
          backgroundColor: visual.background,
          borderColor: visual.secondaryAccent || visual.accent
        }}
      >
        <span
          className="illustration-glyph"
          aria-hidden="true"
          style={{ backgroundColor: `${visual.accent}22` }}
        >
          {item.emoji}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`item-illustration emoji-illustration ${visual.kind}-illustration pattern-${visual.pattern || 'none'}`}
      aria-label={`Illustration for ${item.name}`}
      style={{
        backgroundColor: visual.background,
        borderColor: visual.secondaryAccent || visual.accent
      }}
    >
      <span
        className="illustration-glyph"
        aria-hidden="true"
        style={{ backgroundColor: `${visual.accent}22` }}
      >
        {item.emoji}
      </span>
    </div>
  );
};

export default ItemIllustration;
