import { useState, useCallback, useRef, useEffect } from 'react';

const STARS_BG = `${import.meta.env.BASE_URL}images/stars-bg.jpg`;
import { useGameLoop } from './hooks/useGameLoop';
import { useInput } from './hooks/useInput';
import type { GameState, Bullet, Enemy, Particle, PowerUp, ScorePopup, PowerUpType } from './types';
import { saveScore, getHighScore } from './utils/scoreHistory';
import * as sfx from './utils/soundEngine';
import StarField from './components/StarField';
import Player from './components/Player';
import EnemySprite from './components/EnemySprite';
import HUD from './components/HUD';
import MenuScreen from './components/MenuScreen';
import GameOverScreen from './components/GameOverScreen';
import PauseScreen from './components/PauseScreen';
import ScoreBoard from './components/ScoreBoard';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 320;
const BULLET_SPEED = 500;
const SHOOT_COOLDOWN = 0.18;
const RAPID_COOLDOWN = 0.08;
const COMBO_TIMEOUT = 2;

let nextId = 1;
const getId = () => nextId++;

// ── Sound event queue (avoids side-effects inside setState) ──
type SoundEvent =
  | 'shoot'
  | 'shootSpread'
  | 'hit'
  | 'explodeSmall'
  | 'explodeMedium'
  | 'explodeBoss'
  | 'playerHit'
  | 'gameOver'
  | 'powerUp'
  | 'shieldBlock'
  | 'waveClear'
  | 'bossWarning'
  | 'combo'
  | 'enemyShoot';

let pendingSounds: SoundEvent[] = [];

function queueSound(sound: SoundEvent) {
  pendingSounds.push(sound);
}

function flushSounds() {
  const sounds = pendingSounds;
  pendingSounds = [];
  // Deduplicate to avoid overlapping identical sounds in one frame
  const seen = new Set<SoundEvent>();
  for (const s of sounds) {
    if (seen.has(s)) continue;
    seen.add(s);
    switch (s) {
      case 'shoot': sfx.playShoot(); break;
      case 'shootSpread': sfx.playShootSpread(); break;
      case 'hit': sfx.playHit(); break;
      case 'explodeSmall': sfx.playExplosionSmall(); break;
      case 'explodeMedium': sfx.playExplosionMedium(); break;
      case 'explodeBoss': sfx.playExplosionBoss(); break;
      case 'playerHit': sfx.playPlayerHit(); break;
      case 'gameOver': sfx.playGameOver(); break;
      case 'powerUp': sfx.playPowerUp(); break;
      case 'shieldBlock': sfx.playShieldBlock(); break;
      case 'waveClear': sfx.playWaveClear(); break;
      case 'bossWarning': sfx.playBossWarning(); break;
      case 'combo': sfx.playCombo(); break;
      case 'enemyShoot': sfx.playEnemyShoot(); break;
    }
  }
}

const INITIAL_STATE: GameState = {
  status: 'menu',
  score: 0,
  highScore: getHighScore(),
  wave: 0,
  lives: 3,
  playerX: GAME_WIDTH / 2,
  playerY: GAME_HEIGHT - 60,
  bullets: [],
  enemies: [],
  particles: [],
  powerUps: [],
  scorePopups: [],
  activePowerUps: [],
  screenShake: false,
  waveAnnounce: false,
  combo: 0,
  comboTimer: 0,
  gameStartTime: 0,
};

function createExplosion(x: number, y: number, color: string, count: number = 12): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 200 + 50;
    return {
      id: getId(),
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: Math.random() * 0.5 + 0.3,
      maxLife: 0.8,
      color,
      size: Math.random() * 4 + 2,
    };
  });
}

function spawnWave(wave: number): Enemy[] {
  const enemies: Enemy[] = [];
  const gruntCount = Math.min(4 + wave * 2, 20);
  const zigzagCount = wave >= 2 ? Math.min(wave, 6) : 0;
  const tankCount = wave >= 3 ? Math.min(Math.floor(wave / 2), 4) : 0;
  const hasBoss = wave % 5 === 0 && wave > 0;

  let delay = 0;

  for (let i = 0; i < gruntCount; i++) {
    enemies.push({
      id: getId(),
      x: 60 + (i % 10) * 70,
      y: 50 + Math.floor(i / 10) * 50,
      type: 'grunt',
      health: 1,
      maxHealth: 1,
      points: 100,
      speed: 40 + wave * 5,
      direction: 1,
      animFrame: 0,
      enterDelay: delay++,
    });
  }

  for (let i = 0; i < zigzagCount; i++) {
    enemies.push({
      id: getId(),
      x: 100 + i * 120,
      y: 80 + Math.floor(i / 4) * 60,
      type: 'zigzag',
      health: 2,
      maxHealth: 2,
      points: 250,
      speed: 80 + wave * 8,
      direction: i % 2 === 0 ? 1 : -1,
      animFrame: Math.random() * Math.PI * 2,
      enterDelay: delay++,
    });
  }

  for (let i = 0; i < tankCount; i++) {
    enemies.push({
      id: getId(),
      x: 150 + i * 160,
      y: 60,
      type: 'tank',
      health: 4 + Math.floor(wave / 3),
      maxHealth: 4 + Math.floor(wave / 3),
      points: 500,
      speed: 25 + wave * 3,
      direction: 1,
      animFrame: 0,
      enterDelay: delay++,
    });
  }

  if (hasBoss) {
    enemies.push({
      id: getId(),
      x: GAME_WIDTH / 2,
      y: 70,
      type: 'boss',
      health: 20 + wave * 3,
      maxHealth: 20 + wave * 3,
      points: 2000 + wave * 500,
      speed: 50 + wave * 2,
      direction: 1,
      animFrame: 0,
      enterDelay: delay++,
    });
  }

  return enemies;
}

export default function Game() {
  const [state, setState] = useState<GameState>({ ...INITIAL_STATE });
  const [muted, setMuted] = useState(sfx.isMuted());
  const input = useInput();
  const shootTimer = useRef(0);
  const waveTimer = useRef(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const invincibleTimer = useRef(0);
  const enemyShootTimer = useRef(0);
  const scoreSavedRef = useRef(false);

  const handleToggleMute = useCallback(() => {
    const nowMuted = sfx.toggleMute();
    setMuted(nowMuted);
    if (!nowMuted) sfx.playClick();
  }, []);

  // Handle pause key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        const s = stateRef.current;
        if (s.status === 'playing') {
          sfx.playPause();
          setState((prev) => ({ ...prev, status: 'paused' }));
        } else if (s.status === 'paused') {
          sfx.playResume();
          setState((prev) => ({ ...prev, status: 'playing' }));
        }
      }
      if (e.key === ' ') {
        const s = stateRef.current;
        if (s.status === 'menu') {
          startGame();
        } else if (s.status === 'gameover') {
          startGame();
        }
      }
      // Mute toggle: M key
      if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleToggleMute]);

  const startGame = useCallback(() => {
    nextId = 1;
    scoreSavedRef.current = false;
    const newEnemies = spawnWave(1);
    sfx.playGameStart();
    setState({
      ...INITIAL_STATE,
      status: 'playing',
      wave: 1,
      enemies: newEnemies,
      waveAnnounce: true,
      highScore: getHighScore(),
      gameStartTime: Date.now(),
    });
    shootTimer.current = 0;
    waveTimer.current = 0;
    invincibleTimer.current = 2;
    enemyShootTimer.current = 0;
    setTimeout(() => {
      setState((prev) => ({ ...prev, waveAnnounce: false }));
    }, 2000);
  }, []);

  const handleGameOver = useCallback((finalState: GameState) => {
    if (scoreSavedRef.current) return;
    scoreSavedRef.current = true;

    const duration = (Date.now() - finalState.gameStartTime) / 1000;
    const isNewHigh = finalState.score >= finalState.highScore && finalState.score > 0;

    saveScore({
      score: finalState.score,
      wave: finalState.wave,
      date: new Date().toISOString(),
      duration,
    });

    // Play game over sounds
    sfx.playGameOver();
    if (isNewHigh) {
      setTimeout(() => sfx.playNewHighScore(), 1400);
    }
  }, []);

  // Save score when game ends
  useEffect(() => {
    if (state.status === 'gameover' && !scoreSavedRef.current) {
      handleGameOver(state);
    }
  }, [state.status, handleGameOver, state]);

  const goToMenu = useCallback(() => {
    sfx.playClick();
    setState({ ...INITIAL_STATE, highScore: getHighScore() });
  }, []);

  const showScores = useCallback(() => {
    sfx.playClick();
    setState((prev) => ({ ...prev, status: 'scores' }));
  }, []);

  const gameLoop = useCallback((dt: number) => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev;

      const next = { ...prev };
      const inp = input.current;

      // Update player position
      let px = next.playerX;
      let py = next.playerY;
      if (inp.left) px -= PLAYER_SPEED * dt;
      if (inp.right) px += PLAYER_SPEED * dt;
      if (inp.up) py -= PLAYER_SPEED * dt;
      if (inp.down) py += PLAYER_SPEED * dt;
      px = Math.max(25, Math.min(GAME_WIDTH - 25, px));
      py = Math.max(GAME_HEIGHT * 0.4, Math.min(GAME_HEIGHT - 30, py));
      next.playerX = px;
      next.playerY = py;

      // Shooting
      shootTimer.current -= dt;
      const hasRapid = next.activePowerUps.some((p) => p.type === 'rapid');
      const hasSpread = next.activePowerUps.some((p) => p.type === 'spread');
      const cooldown = hasRapid ? RAPID_COOLDOWN : SHOOT_COOLDOWN;

      if (inp.shoot && shootTimer.current <= 0) {
        shootTimer.current = cooldown;
        const newBullets: Bullet[] = [
          { id: getId(), x: px, y: py - 25, speed: BULLET_SPEED, isEnemy: false },
        ];
        if (hasSpread) {
          newBullets.push(
            { id: getId(), x: px - 12, y: py - 20, speed: BULLET_SPEED * 0.95, isEnemy: false },
            { id: getId(), x: px + 12, y: py - 20, speed: BULLET_SPEED * 0.95, isEnemy: false },
          );
          queueSound('shootSpread');
        } else {
          queueSound('shoot');
        }
        next.bullets = [...next.bullets, ...newBullets];
      }

      // Update bullets
      next.bullets = next.bullets
        .map((b) => ({
          ...b,
          y: b.isEnemy ? b.y + b.speed * dt : b.y - b.speed * dt,
        }))
        .filter((b) => b.y > -10 && b.y < GAME_HEIGHT + 10);

      // Update enemies
      next.enemies = next.enemies.map((e) => {
        const newE = { ...e };
        newE.animFrame += dt;

        switch (e.type) {
          case 'grunt':
            newE.x += e.speed * e.direction * dt;
            if (newE.x <= 20 || newE.x >= GAME_WIDTH - 20) {
              newE.direction *= -1;
              newE.y += 8;
            }
            break;
          case 'zigzag':
            newE.x += Math.sin(newE.animFrame * 3) * e.speed * dt;
            newE.y += e.speed * 0.3 * dt;
            break;
          case 'tank':
            newE.x += e.speed * e.direction * dt;
            if (newE.x <= 40 || newE.x >= GAME_WIDTH - 40) {
              newE.direction *= -1;
            }
            newE.y += Math.sin(newE.animFrame * 2) * 15 * dt;
            break;
          case 'boss':
            newE.x += e.speed * e.direction * dt;
            if (newE.x <= 60 || newE.x >= GAME_WIDTH - 60) {
              newE.direction *= -1;
            }
            newE.y = 70 + Math.sin(newE.animFrame * 1.5) * 20;
            break;
        }
        return newE;
      });

      // Enemy shooting
      enemyShootTimer.current -= dt;
      if (enemyShootTimer.current <= 0) {
        enemyShootTimer.current = Math.max(0.5, 2 - next.wave * 0.1);
        const shooters = next.enemies.filter(
          (e) => (e.type === 'tank' || e.type === 'boss' || (e.type === 'zigzag' && Math.random() < 0.3))
        );
        if (shooters.length > 0) {
          const shooter = shooters[Math.floor(Math.random() * shooters.length)];
          next.bullets.push({
            id: getId(),
            x: shooter.x,
            y: shooter.y + 20,
            speed: 200 + next.wave * 10,
            isEnemy: true,
          });
          if (shooter.type === 'boss') {
            next.bullets.push(
              { id: getId(), x: shooter.x - 20, y: shooter.y + 20, speed: 180 + next.wave * 8, isEnemy: true },
              { id: getId(), x: shooter.x + 20, y: shooter.y + 20, speed: 180 + next.wave * 8, isEnemy: true },
            );
          }
          queueSound('enemyShoot');
        }
      }

      // Collision: player bullets vs enemies
      const newParticles: Particle[] = [];
      const newPopups: ScorePopup[] = [];
      const newPowerUps: PowerUp[] = [];
      const hitBullets = new Set<number>();
      const killedEnemies = new Set<number>();

      for (const bullet of next.bullets) {
        if (bullet.isEnemy) continue;
        for (const enemy of next.enemies) {
          if (killedEnemies.has(enemy.id)) continue;
          const dx = bullet.x - enemy.x;
          const dy = bullet.y - enemy.y;
          const hitRadius = enemy.type === 'boss' ? 30 : enemy.type === 'tank' ? 20 : 16;
          if (Math.abs(dx) < hitRadius && Math.abs(dy) < hitRadius) {
            hitBullets.add(bullet.id);
            enemy.health -= 1;
            // Hit particles
            newParticles.push(...createExplosion(bullet.x, bullet.y, '#fff', 3));

            if (enemy.health <= 0) {
              killedEnemies.add(enemy.id);
              const colors = { grunt: '#39ff14', zigzag: '#ffe600', tank: '#ff2d95', boss: '#b026ff' };
              newParticles.push(...createExplosion(enemy.x, enemy.y, colors[enemy.type], enemy.type === 'boss' ? 30 : 15));

              // Sound based on enemy type
              if (enemy.type === 'boss') {
                queueSound('explodeBoss');
              } else if (enemy.type === 'tank' || enemy.type === 'zigzag') {
                queueSound('explodeMedium');
              } else {
                queueSound('explodeSmall');
              }

              // Combo
              next.comboTimer = COMBO_TIMEOUT;
              next.combo += 1;
              const points = enemy.points * Math.max(1, next.combo);
              next.score += points;

              if (next.combo > 1 && next.combo % 3 === 0) {
                queueSound('combo');
              }

              newPopups.push({
                id: getId(),
                x: enemy.x,
                y: enemy.y,
                value: points,
                life: 0.8,
              });

              // Power-up drop chance
              if (Math.random() < 0.15 || enemy.type === 'boss') {
                const types: PowerUpType[] = ['health', 'rapid', 'spread', 'shield'];
                newPowerUps.push({
                  id: getId(),
                  x: enemy.x,
                  y: enemy.y,
                  type: types[Math.floor(Math.random() * types.length)],
                  speed: 80,
                });
              }
            } else {
              queueSound('hit');
            }
            break;
          }
        }
      }

      next.bullets = next.bullets.filter((b) => !hitBullets.has(b.id));
      next.enemies = next.enemies.filter((e) => !killedEnemies.has(e.id)).map((e) => ({ ...e }));

      // Collision: enemy bullets vs player
      invincibleTimer.current -= dt;
      const hasShield = next.activePowerUps.some((p) => p.type === 'shield');

      for (const bullet of next.bullets) {
        if (!bullet.isEnemy) continue;
        const dx = bullet.x - next.playerX;
        const dy = bullet.y - next.playerY;
        if (Math.abs(dx) < 18 && Math.abs(dy) < 22) {
          hitBullets.add(bullet.id);
          if (invincibleTimer.current <= 0 && !hasShield) {
            next.lives -= 1;
            invincibleTimer.current = 2;
            next.screenShake = true;
            newParticles.push(...createExplosion(next.playerX, next.playerY, '#ff2d95', 20));
            queueSound('playerHit');
            setTimeout(() => setState((p) => ({ ...p, screenShake: false })), 200);
            if (next.lives <= 0) {
              const hs = Math.max(next.score, next.highScore);
              queueSound('gameOver');
              return { ...next, status: 'gameover' as const, highScore: hs, particles: [...next.particles, ...newParticles] };
            }
          } else if (hasShield) {
            newParticles.push(...createExplosion(bullet.x, bullet.y, '#00f0ff', 6));
            queueSound('shieldBlock');
          }
        }
      }
      next.bullets = next.bullets.filter((b) => !hitBullets.has(b.id));

      // Collision: enemies vs player
      for (const enemy of next.enemies) {
        const dx = enemy.x - next.playerX;
        const dy = enemy.y - next.playerY;
        const hitRadius = enemy.type === 'boss' ? 35 : 22;
        if (Math.abs(dx) < hitRadius && Math.abs(dy) < hitRadius && invincibleTimer.current <= 0 && !hasShield) {
          next.lives -= 1;
          invincibleTimer.current = 2;
          next.screenShake = true;
          newParticles.push(...createExplosion(next.playerX, next.playerY, '#ff2d95', 20));
          queueSound('playerHit');
          setTimeout(() => setState((p) => ({ ...p, screenShake: false })), 200);
          if (next.lives <= 0) {
            const hs = Math.max(next.score, next.highScore);
            queueSound('gameOver');
            return { ...next, status: 'gameover' as const, highScore: hs, particles: [...next.particles, ...newParticles] };
          }
        }
      }

      // Power-up collection
      next.powerUps = [...next.powerUps, ...newPowerUps].map((p) => ({
        ...p,
        y: p.y + p.speed * dt,
      })).filter((p) => p.y < GAME_HEIGHT + 20);

      const collectedPowerUps = new Set<number>();
      for (const pu of next.powerUps) {
        const dx = pu.x - next.playerX;
        const dy = pu.y - next.playerY;
        if (Math.abs(dx) < 25 && Math.abs(dy) < 25) {
          collectedPowerUps.add(pu.id);
          if (pu.type === 'health') {
            next.lives = Math.min(next.lives + 1, 5);
          } else {
            const existing = next.activePowerUps.find((ap) => ap.type === pu.type);
            if (existing) {
              existing.timer += 8;
            } else {
              next.activePowerUps = [...next.activePowerUps, { type: pu.type, timer: 8 }];
            }
          }
          newParticles.push(...createExplosion(pu.x, pu.y, '#fff', 8));
          newPopups.push({ id: getId(), x: pu.x, y: pu.y, value: 0, life: 0.8 });
          queueSound('powerUp');
        }
      }
      next.powerUps = next.powerUps.filter((p) => !collectedPowerUps.has(p.id));

      // Update active power-ups
      next.activePowerUps = next.activePowerUps
        .map((p) => ({ ...p, timer: p.timer - dt }))
        .filter((p) => p.timer > 0);

      // Update combo
      next.comboTimer -= dt;
      if (next.comboTimer <= 0) {
        next.combo = 0;
      }

      // Update particles
      next.particles = [...next.particles, ...newParticles]
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          life: p.life - dt,
          size: p.size * 0.98,
        }))
        .filter((p) => p.life > 0);

      // Update score popups
      next.scorePopups = [...next.scorePopups, ...newPopups]
        .map((p) => ({ ...p, life: p.life - dt, y: p.y - 40 * dt }))
        .filter((p) => p.life > 0);

      // Check wave clear
      if (next.enemies.length === 0) {
        waveTimer.current += dt;
        if (waveTimer.current > 1.5) {
          waveTimer.current = 0;
          next.wave += 1;
          next.enemies = spawnWave(next.wave);
          next.waveAnnounce = true;
          next.score += 500 * next.wave;

          if (next.wave % 5 === 0) {
            queueSound('bossWarning');
          } else {
            queueSound('waveClear');
          }

          setTimeout(() => setState((p) => ({ ...p, waveAnnounce: false })), 2000);
        }
      }

      // Remove enemies that fall below screen
      next.enemies = next.enemies.filter((e) => e.y < GAME_HEIGHT + 30);

      return next;
    });

    // Flush sound queue after state update
    flushSounds();
  }, [input]);

  useGameLoop(gameLoop, state.status === 'playing');

  const isInvincible = invincibleTimer.current > 0 && state.status === 'playing';
  const gameDuration = state.gameStartTime > 0 ? (Date.now() - state.gameStartTime) / 1000 : 0;

  return (
    <div
      ref={gameRef}
      className={`scanlines crt-glow ${state.screenShake ? 'screen-shake' : ''}`}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050510',
        overflow: 'hidden',
      }}
    >
      <StarField />

      <div
        className="grid-overlay"
        style={{
          position: 'relative',
          width: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
          background: 'linear-gradient(180deg, rgba(5,5,16,0.95), rgba(10,10,26,0.9))',
          border: '1px solid rgba(0, 240, 255, 0.15)',
          borderRadius: '4px',
          overflow: 'hidden',
          // Keep game coordinates fixed while fitting the 800x600 playfield to small screens.
          transform: 'scale(min(1, calc(100vw / 800), calc(100vh / 600)))',
          transformOrigin: 'center center',
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.08), inset 0 0 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${STARS_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
            zIndex: 0,
          }}
        />

        {/* Mute button */}
        <button
          onClick={handleToggleMute}
          title={muted ? 'Unmute (M)' : 'Mute (M)'}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 55,
            background: 'rgba(0,0,0,0.5)',
            border: `1px solid ${muted ? 'rgba(255,255,255,0.15)' : 'rgba(0,240,255,0.3)'}`,
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '14px',
            cursor: 'pointer',
            color: '#fff',
            transition: 'all 0.2s',
            opacity: 0.7,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'; }}
        >
          {muted ? '🔇' : '🔊'}
        </button>

        {/* HUD */}
        {state.status === 'playing' && (
          <HUD
            score={state.score}
            highScore={state.highScore}
            lives={state.lives}
            wave={state.wave}
            combo={state.combo}
            activePowerUps={state.activePowerUps}
          />
        )}

        {/* Wave Announcement */}
        {state.waveAnnounce && state.status === 'playing' && (
          <div
            className="wave-announce"
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 55,
              textAlign: 'center',
            }}
          >
            <div className="neon-text-pink" style={{ fontSize: '28px', marginBottom: '8px' }}>
              WAVE {state.wave}
            </div>
            {state.wave % 5 === 0 && (
              <div className="neon-text-yellow" style={{ fontSize: '14px' }}>
                ⚠️ BOSS INCOMING ⚠️
              </div>
            )}
          </div>
        )}

        {/* Player */}
        {state.status === 'playing' && (
          <div style={{ opacity: isInvincible ? (Math.floor(Date.now() / 100) % 2 ? 0.4 : 1) : 1 }}>
            <Player
              x={state.playerX}
              y={state.playerY}
              hasShield={state.activePowerUps.some((p) => p.type === 'shield')}
            />
          </div>
        )}

        {/* Bullets */}
        {state.bullets.map((b) => (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              left: `${b.x}px`,
              top: `${b.y}px`,
              transform: 'translate(-50%, -50%)',
              width: b.isEnemy ? '4px' : '3px',
              height: b.isEnemy ? '12px' : '14px',
              background: b.isEnemy
                ? 'linear-gradient(180deg, #ff0040, #ff2d95)'
                : 'linear-gradient(180deg, #ffffff, #00f0ff)',
              borderRadius: '2px',
              boxShadow: b.isEnemy
                ? '0 0 6px #ff0040, 0 0 12px #ff2d95'
                : '0 0 6px #00f0ff, 0 0 12px #00f0ff',
              zIndex: 10,
            }}
          />
        ))}

        {/* Enemies */}
        {state.enemies.map((e) => (
          <EnemySprite
            key={e.id}
            x={e.x}
            y={e.y}
            type={e.type}
            health={e.health}
            maxHealth={e.maxHealth}
            enterDelay={e.enterDelay}
          />
        ))}

        {/* Particles */}
        {state.particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: '50%',
              opacity: p.life / p.maxLife,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              zIndex: 25,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Power-ups */}
        {state.powerUps.map((pu) => {
          const icons: Record<PowerUpType, string> = {
            health: '❤️',
            rapid: '⚡',
            spread: '🔥',
            shield: '🛡️',
          };
          const colors: Record<PowerUpType, string> = {
            health: '#ff2d95',
            rapid: '#ffe600',
            spread: '#ff6600',
            shield: '#00f0ff',
          };
          return (
            <div
              key={pu.id}
              style={{
                position: 'absolute',
                left: `${pu.x}px`,
                top: `${pu.y}px`,
                transform: 'translate(-50%, -50%)',
                fontSize: '18px',
                zIndex: 18,
                filter: `drop-shadow(0 0 8px ${colors[pu.type]})`,
                animation: 'powerup-float 1s ease-in-out infinite',
              }}
            >
              {icons[pu.type]}
            </div>
          );
        })}

        {/* Score popups */}
        {state.scorePopups.map((sp) => (
          <div
            key={sp.id}
            className="score-pop"
            style={{
              position: 'absolute',
              left: `${sp.x}px`,
              top: `${sp.y}px`,
              transform: 'translate(-50%, -50%)',
              fontSize: '10px',
              color: sp.value > 0 ? '#ffe600' : '#00f0ff',
              textShadow: `0 0 6px ${sp.value > 0 ? '#ffe600' : '#00f0ff'}`,
              zIndex: 30,
              pointerEvents: 'none',
              fontFamily: "'Press Start 2P', monospace",
            }}
          >
            {sp.value > 0 ? `+${sp.value}` : '✨'}
          </div>
        ))}

        {/* Menu */}
        {state.status === 'menu' && (
          <MenuScreen highScore={state.highScore} onStart={startGame} onShowScores={showScores} />
        )}

        {/* Scores */}
        {state.status === 'scores' && (
          <ScoreBoard onBack={goToMenu} />
        )}

        {/* Pause */}
        {state.status === 'paused' && (
          <PauseScreen onResume={() => {
            sfx.playResume();
            setState((prev) => ({ ...prev, status: 'playing' }));
          }} />
        )}

        {/* Game Over */}
        {state.status === 'gameover' && (
          <GameOverScreen
            score={state.score}
            highScore={Math.max(state.score, state.highScore)}
            wave={state.wave}
            duration={gameDuration}
            isNewHighScore={state.score >= state.highScore && state.score > 0}
            onRestart={startGame}
            onMenu={goToMenu}
            onShowScores={showScores}
          />
        )}

        {/* Bottom border glow */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #ff2d95, #00f0ff, #ff2d95, transparent)',
            boxShadow: '0 0 10px rgba(255, 45, 149, 0.5)',
          }}
        />
      </div>
    </div>
  );
}
