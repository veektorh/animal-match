// Audio Manager for Animal Sounds and Sound Effects
export class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private masterVolume: number = 0.7;
  
  // Cache for loaded sounds
  private soundCache: Map<string, HTMLAudioElement> = new Map();
  
  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }
  
  private constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined') {
      document.addEventListener('click', this.initializeAudioContext, { once: true });
      document.addEventListener('touchstart', this.initializeAudioContext, { once: true });
    }
  }
  
  private initializeAudioContext = () => {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };
  
  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }
  
  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
  
  // Play animal sound with synthetic audio if no file available
  async playAnimalSound(animalId: string): Promise<void> {
    if (!this.soundEnabled) return;
    
    try {
      // Try to load and play actual sound file first
      const soundPath = `/assets/sounds/animals/${animalId}.mp3`;
      await this.playSound(soundPath, 0.8);
    } catch (error) {
      // Fallback: Generate synthetic animal sound
      this.generateSyntheticAnimalSound(animalId);
    }
  }
  
  // Play UI sound effects
  async playUISound(soundType: 'correct' | 'incorrect' | 'click' | 'whoosh' | 'celebration'): Promise<void> {
    if (!this.soundEnabled) return;
    
    try {
      const soundPath = `/assets/sounds/ui/${soundType}.mp3`;
      await this.playSound(soundPath, 0.6);
    } catch (error) {
      // Fallback: Generate synthetic UI sound
      this.generateSyntheticUISound(soundType);
    }
  }
  
  private async playSound(soundPath: string, volume: number = 0.7): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check cache first
      let audio = this.soundCache.get(soundPath);
      
      if (!audio) {
        audio = new Audio(soundPath);
        audio.volume = volume * this.masterVolume;
        this.soundCache.set(soundPath, audio);
        
        audio.addEventListener('canplaythrough', () => {
          audio!.play().then(resolve).catch(reject);
        }, { once: true });
        
        audio.addEventListener('error', reject, { once: true });
      } else {
        audio.currentTime = 0;
        audio.volume = volume * this.masterVolume;
        audio.play().then(resolve).catch(reject);
      }
    });
  }
  
  // Generate synthetic sounds using Web Audio API
  private generateSyntheticAnimalSound(animalId: string) {
    if (!this.audioContext) return;
    
    const animalSounds: Record<string, () => void> = {
      cow: () => this.generateLowRumble(200, 0.3),
      pig: () => this.generateSnort(),
      chicken: () => this.generateChirp(800, 0.2),
      horse: () => this.generateNeigh(),
      sheep: () => this.generateBaa(),
      duck: () => this.generateQuack(),
      cat: () => this.generateMeow(),
      dog: () => this.generateBark(),
      rabbit: () => this.generateSqueak(600, 0.15),
      frog: () => this.generateRibbit(),
      lion: () => this.generateRoar(),
      elephant: () => this.generateTrumpet(),
      bird: () => this.generateTweet(),
      fish: () => this.generateBubble(),
      default: () => this.generateGenericAnimalSound()
    };
    
    const soundGenerator = animalSounds[animalId] || animalSounds.default;
    soundGenerator();
  }
  
  private generateSyntheticUISound(soundType: string) {
    if (!this.audioContext) return;
    
    switch (soundType) {
      case 'correct':
        this.generateSuccessChime();
        break;
      case 'incorrect':
        this.generateErrorBuzz();
        break;
      case 'click':
        this.generateClick();
        break;
      case 'whoosh':
        this.generateWhoosh();
        break;
      case 'celebration':
        this.generateCelebration();
        break;
    }
  }
  
  // Synthetic sound generators
  private generateLowRumble(frequency: number, duration: number) {
    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext!.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.7, this.audioContext!.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3 * this.masterVolume, this.audioContext!.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + duration);
    
    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + duration);
  }
  
  private generateChirp(frequency: number, duration: number) {
    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext!.currentTime);
    oscillator.frequency.linearRampToValueAtTime(frequency * 1.5, this.audioContext!.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2 * this.masterVolume, this.audioContext!.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + duration);
    
    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + duration);
  }
  
  private generateSuccessChime() {
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.generateChirp(freq, 0.3);
      }, index * 100);
    });
  }
  
  private generateErrorBuzz() {
    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);
    
    oscillator.frequency.setValueAtTime(150, this.audioContext!.currentTime);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3 * this.masterVolume, this.audioContext!.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 0.5);
    
    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + 0.5);
  }
  
  private generateClick() {
    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);
    
    oscillator.frequency.setValueAtTime(800, this.audioContext!.currentTime);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1 * this.masterVolume, this.audioContext!.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.1);
    
    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + 0.1);
  }
  
  private generateSnort() {
    // Multiple short bursts for snorting sound
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.generateLowRumble(150 + Math.random() * 100, 0.1);
      }, i * 120);
    }
  }
  
  private generateNeigh() {
    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);
    
    // Start high and sweep down like a horse neigh
    oscillator.frequency.setValueAtTime(800, this.audioContext!.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext!.currentTime + 0.8);
    
    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3 * this.masterVolume, this.audioContext!.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 0.8);
    
    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + 0.8);
  }
  
  private generateBaa() {
    // Two-tone "baa" sound
    this.generateLowRumble(250, 0.3);
    setTimeout(() => {
      this.generateLowRumble(180, 0.4);
    }, 200);
  }
  
  private generateQuack() {
    this.generateLowRumble(400, 0.2);
  }
  
  private generateMeow() {
    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);
    
    oscillator.frequency.setValueAtTime(400, this.audioContext!.currentTime);
    oscillator.frequency.linearRampToValueAtTime(200, this.audioContext!.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25 * this.masterVolume, this.audioContext!.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 0.5);
    
    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + 0.5);
  }
  
  private generateBark() {
    // Sharp, quick bark
    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);
    
    oscillator.frequency.setValueAtTime(300, this.audioContext!.currentTime);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.4 * this.masterVolume, this.audioContext!.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.2);
    
    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + 0.2);
  }
  
  private generateSqueak(frequency: number, duration: number) {
    this.generateChirp(frequency, duration);
  }
  
  private generateRibbit() {
    // Classic frog ribbit - low to high and back
    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);
    
    oscillator.frequency.setValueAtTime(200, this.audioContext!.currentTime);
    oscillator.frequency.linearRampToValueAtTime(400, this.audioContext!.currentTime + 0.1);
    oscillator.frequency.linearRampToValueAtTime(200, this.audioContext!.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3 * this.masterVolume, this.audioContext!.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 0.3);
    
    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + 0.3);
  }
  
  private generateRoar() {
    // Deep, rumbling roar
    this.generateLowRumble(100, 1.0);
    setTimeout(() => {
      this.generateLowRumble(150, 0.8);
    }, 300);
  }
  
  private generateTrumpet() {
    // Elephant trumpet sound - starts low, goes high
    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);
    
    oscillator.frequency.setValueAtTime(200, this.audioContext!.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext!.currentTime + 1.2);
    
    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4 * this.masterVolume, this.audioContext!.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 1.2);
    
    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + 1.2);
  }
  
  private generateTweet() {
    // Quick bird tweet
    this.generateChirp(1000, 0.15);
    setTimeout(() => {
      this.generateChirp(1200, 0.1);
    }, 100);
  }
  
  private generateBubble() {
    // Bubble sound effect
    this.generateChirp(800 + Math.random() * 400, 0.1);
  }
  
  private generateGenericAnimalSound() {
    // Generic pleasant animal sound
    this.generateChirp(400 + Math.random() * 200, 0.3);
  }
  
  private generateWhoosh() {
    // Whoosh sound for UI transitions
    const oscillator = this.audioContext!.createOscillator();
    const gainNode = this.audioContext!.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext!.destination);
    
    oscillator.frequency.setValueAtTime(1000, this.audioContext!.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext!.currentTime + 0.3);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2 * this.masterVolume, this.audioContext!.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.3);
    
    oscillator.start(this.audioContext!.currentTime);
    oscillator.stop(this.audioContext!.currentTime + 0.3);
  }
  
  private generateCelebration() {
    // Multiple ascending tones for celebration
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.generateChirp(freq, 0.4);
      }, index * 80);
    });
  }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();