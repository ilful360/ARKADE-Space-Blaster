export interface Position {
  x: number;
  y: number;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  speed: number;
  isEnemy?: boolean;
}

export interface Enemy {
  id: number;
  x: number;
  y: number;
  type: EnemyType;
  health: number;
  maxHealth: number;
  points: number;
  speed: number;
  direction: number;
  animFrame: number;
  enterDelay: number;
}

export type EnemyType = 'grunt' | 'zigzag' | 'tank' | 'boss';

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: PowerUpType;
  speed: number;
}

export type PowerUpType = 'health' | 'rapid' | 'spread' | 'shield';

export interface ScorePopup {
  id: number;
  x: number;
  y: number;
  value: number;
  life: number;
}

export interface ScoreEntry {
  score: number;
  wave: number;
  date: string;
  duration: number; // seconds
}

export interface GameState {
  status: 'menu' | 'playing' | 'paused' | 'gameover' | 'scores';
  score: number;
  highScore: number;
  wave: number;
  lives: number;
  playerX: number;
  playerY: number;
  bullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  powerUps: PowerUp[];
  scorePopups: ScorePopup[];
  activePowerUps: { type: PowerUpType; timer: number }[];
  screenShake: boolean;
  waveAnnounce: boolean;
  combo: number;
  comboTimer: number;
  gameStartTime: number;
}
