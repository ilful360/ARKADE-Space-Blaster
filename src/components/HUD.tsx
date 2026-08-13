import { memo } from 'react';
import type { PowerUpType } from '../types';

interface HUDProps {
  score: number;
  highScore: number;
  lives: number;
  wave: number;
  combo: number;
  activePowerUps: { type: PowerUpType; timer: number }[];
}

const powerUpLabels: Record<PowerUpType, { label: string; color: string }> = {
  health: { label: '❤️ HP', color: '#ff2d95' },
  rapid: { label: '⚡ RAPID', color: '#ffe600' },
  spread: { label: '🔥 SPREAD', color: '#ff6600' },
  shield: { label: '🛡️ SHIELD', color: '#00f0ff' },
};

function HUD({ score, highScore, lives, wave, combo, activePowerUps }: HUDProps) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, padding: '12px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left: Score */}
        <div>
          <div style={{ fontSize: '8px', color: '#888', marginBottom: '4px', letterSpacing: '2px' }}>SCORE</div>
          <div className="neon-text-cyan" style={{ fontSize: '18px' }}>
            {score.toLocaleString().padStart(8, '0')}
          </div>
          {combo > 1 && (
            <div className="neon-text-yellow" style={{ fontSize: '10px', marginTop: '4px' }}>
              x{combo} COMBO!
            </div>
          )}
        </div>

        {/* Center: Wave */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '8px', color: '#888', marginBottom: '4px', letterSpacing: '2px' }}>WAVE</div>
          <div className="neon-text-pink" style={{ fontSize: '22px' }}>
            {wave}
          </div>
        </div>

        {/* Right: Lives & High Score */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '8px', color: '#888', marginBottom: '4px', letterSpacing: '2px' }}>HI-SCORE</div>
          <div className="neon-text-green" style={{ fontSize: '12px' }}>
            {highScore.toLocaleString().padStart(8, '0')}
          </div>
          <div style={{ marginTop: '6px', fontSize: '16px' }}>
            {Array.from({ length: lives }).map((_, i) => (
              <span key={i} style={{ marginLeft: '2px', filter: 'drop-shadow(0 0 4px #ff2d95)' }}>💖</span>
            ))}
          </div>
        </div>
      </div>

      {/* Active power-ups */}
      {activePowerUps.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'center' }}>
          {activePowerUps.map((pu, i) => {
            const info = powerUpLabels[pu.type];
            return (
              <div
                key={i}
                style={{
                  padding: '3px 8px',
                  fontSize: '8px',
                  color: info.color,
                  border: `1px solid ${info.color}`,
                  borderRadius: '4px',
                  background: 'rgba(0,0,0,0.5)',
                  boxShadow: `0 0 6px ${info.color}40`,
                }}
              >
                {info.label} {Math.ceil(pu.timer)}s
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(HUD);
