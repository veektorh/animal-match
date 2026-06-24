interface SpeechOptions {
  interrupt?: boolean;
  pitch?: number;
  rate?: number;
  volume?: number;
}

const DEFAULT_SPEECH = {
  pitch: 1.06,
  rate: 0.86,
  volume: 0.9
};

const preferredVoiceNames = [
  'microsoft jenny',
  'microsoft aria',
  'jenny',
  'aria',
  'google us english',
  'google uk english female',
  'samantha',
  'zira',
  'karen',
  'tessa',
  'susan'
];

const getSpeechSynthesis = (): SpeechSynthesis | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  return window.speechSynthesis;
};

const scoreVoice = (voice: SpeechSynthesisVoice): number => {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  let score = 0;

  if (lang.startsWith('en-us')) score += 24;
  else if (lang.startsWith('en-gb')) score += 20;
  else if (lang.startsWith('en')) score += 16;
  else score -= 40;

  const preferredIndex = preferredVoiceNames.findIndex(preferredName => name.includes(preferredName));
  if (preferredIndex >= 0) {
    score += 60 - preferredIndex * 3;
  }

  if (name.includes('natural') || name.includes('neural')) score += 18;
  if (name.includes('online') || name.includes('premium')) score += 8;
  if (name.includes('female')) score += 5;
  if (voice.default) score += 4;
  if (name.includes('david') || name.includes('mark')) score -= 10;

  return score;
};

export const getPreferredSpeechVoice = (): SpeechSynthesisVoice | null => {
  const synthesis = getSpeechSynthesis();
  const voices = synthesis?.getVoices() || [];
  const englishVoices = voices.filter(voice => voice.lang.toLowerCase().startsWith('en'));

  if (englishVoices.length === 0) {
    return voices[0] || null;
  }

  return [...englishVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
};

export const warmUpSpeechVoices = (): void => {
  const synthesis = getSpeechSynthesis();
  if (!synthesis) return;

  synthesis.getVoices();
};

export const speakText = (text: string, options: SpeechOptions = {}): boolean => {
  const synthesis = getSpeechSynthesis();
  if (!synthesis || typeof SpeechSynthesisUtterance === 'undefined') {
    return false;
  }

  if (options.interrupt ?? true) {
    synthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getPreferredSpeechVoice();

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = 'en-US';
  }

  utterance.rate = options.rate ?? DEFAULT_SPEECH.rate;
  utterance.pitch = options.pitch ?? DEFAULT_SPEECH.pitch;
  utterance.volume = options.volume ?? DEFAULT_SPEECH.volume;

  synthesis.speak(utterance);
  return true;
};
