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

const shapePoints = {
  star: '80 31 92 62 125 62 98 82 108 116 80 96 52 116 62 82 35 62 68 62',
  triangle: '80 32 124 118 36 118',
  diamond: '80 28 128 80 80 132 32 80',
  pentagon: '80 28 128 66 110 126 50 126 32 66',
  hexagon: '52 38 108 38 136 80 108 122 52 122 24 80',
  cross: '65 34 95 34 95 65 126 65 126 95 95 95 95 126 65 126 65 95 34 95 34 65 65 65',
  trapezoid: '50 44 110 44 130 116 30 116',
  parallelogram: '58 42 130 42 102 118 30 118',
  octagon: '58 30 102 30 130 58 130 102 102 130 58 130 30 102 30 58',
  arrow: '80 32 132 80 104 80 104 122 56 122 56 80 28 80',
  kite: '80 26 118 82 80 134 42 82'
};

const renderShapeArtwork = (shapeId: string, accent: string, stroke: string) => {
  const shapeProps = {
    className: 'shape-main',
    fill: accent,
    stroke,
    strokeWidth: 5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };

  switch (shapeId) {
    case 'circle':
      return <circle cx="80" cy="80" r="45" {...shapeProps} />;
    case 'square':
      return <rect x="38" y="38" width="84" height="84" rx="10" {...shapeProps} />;
    case 'triangle':
      return <polygon points={shapePoints.triangle} {...shapeProps} />;
    case 'rectangle':
      return <rect x="28" y="50" width="104" height="60" rx="10" {...shapeProps} />;
    case 'star-shape':
      return <polygon points={shapePoints.star} {...shapeProps} />;
    case 'heart-shape':
      return (
        <path
          d="M80 126C48 98 32 82 32 59c0-17 12-29 29-29 9 0 17 4 22 11 5-7 13-11 22-11 17 0 29 12 29 29 0 23-16 39-54 67z"
          {...shapeProps}
        />
      );
    case 'oval':
      return <ellipse cx="80" cy="80" rx="52" ry="35" {...shapeProps} />;
    case 'diamond':
      return <polygon points={shapePoints.diamond} {...shapeProps} />;
    case 'pentagon':
      return <polygon points={shapePoints.pentagon} {...shapeProps} />;
    case 'hexagon':
      return <polygon points={shapePoints.hexagon} {...shapeProps} />;
    case 'crescent':
      return (
        <path
          d="M104 31C83 40 69 59 69 80s14 40 35 49c-8 4-17 6-27 6-31 0-56-25-56-55s25-55 56-55c10 0 19 2 27 6z"
          {...shapeProps}
        />
      );
    case 'cross':
      return <polygon points={shapePoints.cross} {...shapeProps} />;
    case 'trapezoid':
      return <polygon points={shapePoints.trapezoid} {...shapeProps} />;
    case 'parallelogram':
      return <polygon points={shapePoints.parallelogram} {...shapeProps} />;
    case 'octagon':
      return <polygon points={shapePoints.octagon} {...shapeProps} />;
    case 'semicircle':
      return <path d="M35 104A45 45 0 0 1 125 104L125 118H35z" {...shapeProps} />;
    case 'arrow':
      return <polygon points={shapePoints.arrow} {...shapeProps} />;
    case 'kite-shape':
      return <polygon points={shapePoints.kite} {...shapeProps} />;
    default:
      return <circle cx="80" cy="80" r="45" {...shapeProps} />;
  }
};

const renderVehicleArtwork = (
  vehicleId: string,
  accent: string,
  secondaryAccent: string,
  stroke: string
) => {
  const lineProps = {
    stroke,
    strokeWidth: 5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  };
  const wheel = (cx: number, cy: number, r = 11) => (
    <g className="vehicle-wheel">
      <circle cx={cx} cy={cy} r={r} fill="#263238" />
      <circle cx={cx} cy={cy} r={r * 0.45} fill="#cfd8dc" />
    </g>
  );

  switch (vehicleId) {
    case 'car':
    case 'taxi':
    case 'police-car':
    case 'ambulance': {
      const isTaxi = vehicleId === 'taxi';
      const isPolice = vehicleId === 'police-car';
      const isAmbulance = vehicleId === 'ambulance';

      return (
        <g className="vehicle-main">
          <path d="M35 92l12-28h63l15 28v24H35z" fill={accent} {...lineProps} />
          <path d="M55 64h43l10 24H45z" fill="#ffffff" opacity="0.78" stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
          <path d="M80 64v24" stroke={stroke} strokeWidth="4" strokeLinecap="round" opacity="0.48" />
          {isTaxi && <rect x="68" y="48" width="24" height="13" rx="5" fill={secondaryAccent} stroke={stroke} strokeWidth="4" />}
          {isPolice && (
            <>
              <rect x="66" y="49" width="28" height="11" rx="5" fill={secondaryAccent} stroke={stroke} strokeWidth="4" />
              <path d="M42 103h76" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
            </>
          )}
          {isAmbulance && (
            <>
              <path d="M47 103h70" stroke={secondaryAccent} strokeWidth="8" strokeLinecap="round" />
              <path d="M80 76v23M68 88h24" stroke={secondaryAccent} strokeWidth="7" strokeLinecap="round" />
            </>
          )}
          <circle cx="48" cy="101" r="5" fill="#fff8e1" />
          <circle cx="115" cy="101" r="5" fill="#fff8e1" />
          {wheel(55, 118)}
          {wheel(108, 118)}
        </g>
      );
    }
    case 'bus':
      return (
        <g className="vehicle-main">
          <rect x="31" y="54" width="98" height="60" rx="13" fill={accent} {...lineProps} />
          <rect x="42" y="65" width="19" height="18" rx="5" fill="#ffffff" opacity="0.78" />
          <rect x="69" y="65" width="19" height="18" rx="5" fill="#ffffff" opacity="0.78" />
          <rect x="96" y="65" width="19" height="18" rx="5" fill="#ffffff" opacity="0.78" />
          <path d="M39 94h82" stroke={secondaryAccent} strokeWidth="8" strokeLinecap="round" />
          {wheel(55, 116)}
          {wheel(107, 116)}
        </g>
      );
    case 'truck':
      return (
        <g className="vehicle-main">
          <rect x="28" y="65" width="68" height="48" rx="9" fill={accent} {...lineProps} />
          <path d="M96 80h28l10 15v18H96z" fill={secondaryAccent} {...lineProps} />
          <rect x="104" y="86" width="14" height="12" rx="3" fill="#ffffff" opacity="0.8" />
          {wheel(50, 116)}
          {wheel(110, 116)}
        </g>
      );
    case 'fire-truck':
      return (
        <g className="vehicle-main">
          <rect x="30" y="64" width="91" height="50" rx="9" fill={accent} {...lineProps} />
          <path d="M91 78h28l13 15v21H91z" fill={accent} {...lineProps} />
          <rect x="98" y="84" width="16" height="12" rx="3" fill="#ffffff" opacity="0.82" />
          <path d="M42 59h57M47 52h47M52 45h37" stroke={secondaryAccent} strokeWidth="5" strokeLinecap="round" />
          {wheel(52, 116)}
          {wheel(111, 116)}
        </g>
      );
    case 'tractor':
      return (
        <g className="vehicle-main">
          <circle cx="58" cy="108" r="25" fill="#263238" />
          <circle cx="58" cy="108" r="12" fill="#cfd8dc" />
          <circle cx="112" cy="116" r="14" fill="#263238" />
          <circle cx="112" cy="116" r="7" fill="#cfd8dc" />
          <path d="M54 72h38l13 28H42z" fill={accent} {...lineProps} />
          <rect x="74" y="45" width="28" height="32" rx="6" fill={secondaryAccent} {...lineProps} />
          <path d="M104 83h18v30" {...lineProps} fill="none" />
        </g>
      );
    case 'train':
      return (
        <g className="vehicle-main">
          <path d="M31 116h99" stroke={stroke} strokeWidth="6" strokeLinecap="round" opacity="0.5" />
          <rect x="34" y="58" width="62" height="47" rx="10" fill={accent} {...lineProps} />
          <rect x="92" y="70" width="33" height="35" rx="8" fill={secondaryAccent} {...lineProps} />
          <rect x="46" y="68" width="18" height="16" rx="4" fill="#ffffff" opacity="0.8" />
          <rect x="70" y="68" width="18" height="16" rx="4" fill="#ffffff" opacity="0.8" />
          <path d="M48 51h35" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
          {wheel(53, 109, 9)}
          {wheel(82, 109, 9)}
          {wheel(110, 109, 9)}
        </g>
      );
    case 'bicycle':
      return (
        <g className="vehicle-main">
          <circle cx="50" cy="111" r="24" fill="none" {...lineProps} />
          <circle cx="113" cy="111" r="24" fill="none" {...lineProps} />
          <path d="M50 111l24-42 21 42H50l33-28 30 28M74 69h-13M101 68h18" fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="83" cy="83" r="5" fill={secondaryAccent} stroke={stroke} strokeWidth="3" />
        </g>
      );
    case 'motorcycle':
      return (
        <g className="vehicle-main">
          <circle cx="50" cy="113" r="19" fill="none" {...lineProps} />
          <circle cx="112" cy="113" r="19" fill="none" {...lineProps} />
          <path d="M50 113l26-32h31l14 32M69 96h36" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M82 73h20M109 77l17-12" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
          <path d="M63 82h18" stroke={secondaryAccent} strokeWidth="7" strokeLinecap="round" />
        </g>
      );
    case 'scooter':
      return (
        <g className="vehicle-main">
          <path d="M55 116h43c18 0 26-8 26-20" fill="none" stroke={accent} strokeWidth="9" strokeLinecap="round" />
          <path d="M101 52v64M101 52h25" {...lineProps} fill="none" />
          <rect x="46" y="102" width="52" height="12" rx="6" fill={secondaryAccent} stroke={stroke} strokeWidth="4" />
          {wheel(55, 121, 9)}
          {wheel(119, 121, 9)}
        </g>
      );
    case 'boat':
      return (
        <g className="vehicle-main">
          <path d="M30 91h100l-15 30H48z" fill={accent} {...lineProps} />
          <rect x="58" y="67" width="43" height="24" rx="7" fill={secondaryAccent} {...lineProps} />
          <circle cx="70" cy="80" r="5" fill="#ffffff" opacity="0.84" />
          <circle cx="89" cy="80" r="5" fill="#ffffff" opacity="0.84" />
          <path d="M32 129c11 6 22 6 33 0 11 6 22 6 33 0 11 6 22 6 33 0" stroke="#42a5f5" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'sailboat':
      return (
        <g className="vehicle-main">
          <path d="M80 34v72" {...lineProps} fill="none" />
          <path d="M80 40l-36 61h36z" fill={secondaryAccent} {...lineProps} />
          <path d="M83 52l35 49H83z" fill={accent} {...lineProps} />
          <path d="M36 107h91l-14 22H51z" fill="#8d6e63" stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
          <path d="M34 134c10 5 20 5 30 0 10 5 20 5 30 0 10 5 20 5 30 0" stroke="#42a5f5" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'submarine':
      return (
        <g className="vehicle-main">
          <ellipse cx="78" cy="91" rx="53" ry="25" fill={accent} {...lineProps} />
          <path d="M84 66v-18h21v18" fill={secondaryAccent} {...lineProps} />
          <path d="M105 48h18" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
          <circle cx="60" cy="90" r="8" fill="#b2ebf2" stroke={stroke} strokeWidth="4" />
          <circle cx="86" cy="90" r="8" fill="#b2ebf2" stroke={stroke} strokeWidth="4" />
          <path d="M29 122c10 5 20 5 30 0 10 5 20 5 30 0 10 5 20 5 30 0" stroke="#42a5f5" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      );
    case 'airplane':
      return (
        <g className="vehicle-main">
          <path className="airplane-tail" d="M42 78L27 51h20l25 27z" fill={secondaryAccent} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
          <path className="airplane-tail" d="M43 99L27 121h20l25-22z" fill={secondaryAccent} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
          <path className="airplane-wing" d="M67 81L50 43h24l35 37z" fill={secondaryAccent} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
          <path className="airplane-wing" d="M76 98L55 134h25l40-36z" fill={secondaryAccent} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
          <path className="airplane-fuselage" d="M27 89c11-15 51-23 92-21 17 1 29 7 36 17-7 10-20 16-37 16H49c-13 0-22-5-22-12z" fill={accent} {...lineProps} />
          <path d="M122 72c11 2 20 6 26 13-6 6-15 10-27 12" fill="#ffffff" opacity="0.36" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
          <rect className="airplane-window" x="75" y="78" width="11" height="9" rx="3" fill="#ffffff" opacity="0.84" />
          <rect className="airplane-window" x="93" y="77" width="11" height="9" rx="3" fill="#ffffff" opacity="0.84" />
          <rect className="airplane-window" x="111" y="78" width="11" height="9" rx="3" fill="#ffffff" opacity="0.84" />
          <path d="M43 91h25" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
        </g>
      );
    case 'helicopter':
      return (
        <g className="vehicle-main">
          <path d="M38 87c0-17 14-30 31-30h23c15 0 28 11 31 26l23 4-23 10c-5 13-18 22-33 22H69c-17 0-31-14-31-32z" fill={accent} {...lineProps} />
          <rect x="62" y="70" width="31" height="21" rx="7" fill="#ffffff" opacity="0.78" />
          <path d="M79 57V40M42 40h74M60 32h38M76 119v13M59 132h50" {...lineProps} fill="none" />
          <circle cx="128" cy="88" r="6" fill={secondaryAccent} stroke={stroke} strokeWidth="4" />
        </g>
      );
    case 'rocket':
      return (
        <g className="vehicle-main">
          <path d="M80 25c25 21 29 61 15 87H65C51 86 55 46 80 25z" fill={accent} {...lineProps} />
          <circle cx="80" cy="65" r="13" fill="#b3e5fc" stroke={stroke} strokeWidth="5" />
          <path d="M65 104l-22 25 29-8M95 104l22 25-29-8" fill={secondaryAccent} stroke={stroke} strokeWidth="5" strokeLinejoin="round" />
          <path d="M70 120c3 9 7 16 10 22 3-6 7-13 10-22z" fill="#ffb300" stroke="#ef6c00" strokeWidth="4" />
        </g>
      );
    default:
      return (
        <g className="vehicle-main">
          <rect x="34" y="70" width="92" height="44" rx="12" fill={accent} {...lineProps} />
          {wheel(55, 116)}
          {wheel(108, 116)}
        </g>
      );
  }
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

  if (visual.kind === 'shape') {
    return (
      <div className="item-illustration shape-illustration" aria-label={`Illustration for ${item.name}`}>
        <svg className="shape-artwork-svg" viewBox="0 0 160 160" role="img" aria-hidden="true">
          <rect width="160" height="160" rx="34" fill={visual.background} />
          <circle cx="80" cy="80" r="58" fill="#ffffff" opacity="0.72" />
          <circle cx="55" cy="48" r="10" fill="#ffffff" opacity="0.45" />
          {renderShapeArtwork(item.id, visual.accent, visual.textColor || '#263238')}
        </svg>
      </div>
    );
  }

  if (visual.kind === 'vehicle') {
    return (
      <div className="item-illustration vehicle-illustration" aria-label={`Illustration for ${item.name}`}>
        <svg className="vehicle-artwork-svg" viewBox="0 0 160 160" role="img" aria-hidden="true">
          <rect width="160" height="160" rx="34" fill={visual.background} />
          <circle cx="80" cy="80" r="58" fill="#ffffff" opacity="0.74" />
          <path d="M28 126c14 8 28 8 42 0 14 8 28 8 42 0 7 4 14 6 21 6" stroke={visual.secondaryAccent || visual.accent} strokeWidth="6" strokeLinecap="round" opacity="0.42" fill="none" />
          {renderVehicleArtwork(item.id, visual.accent, visual.secondaryAccent || '#c5cae9', visual.textColor || '#263238')}
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
