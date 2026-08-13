import { memo } from 'react';
import { playClick } from '../utils/soundEngine';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  wave: number;
  duration: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onMenu: () => void;
  onShowScores: () => void;
}

function GameOverScreen({ score, highScore, wave, duration, isNewHighScore, onRestart, onMenu, onShowScores }: GameOverScreenProps) {
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        background: 'radial-gradient(ellipse at center, rgba(30,0,0,0.85) 0%, rgba(5,5,16,0.95) 100%)',
      }}
    >
      <h2
        className="neon-text-pink"
        style={{
          fontSize: '36px',
          fontFamily: "'Press Start 2P', monospace",
          marginBottom: '24px',
          letterSpacing: '4px',
        }}
      >
        GAME OVER
      </h2>

      {isNewHighScore && (
        <div
          className="blink-text neon-text-yellow"
          style={{ fontSize: '14px', marginBottom: '16px' }}
        >
          ★ NEW HIGH SCORE! ★
        </div>
      )}

      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,45,149,0.2)',
          borderRadius: '8px',
          padding: '20px 40px',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '8px', color: '#888', marginBottom: '4px' }}>FINAL SCORE</div>
          <div className="neon-text-cyan" style={{ fontSize: '24px' }}>
            {score.toLocaleString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
          <div>
            <div style={{ fontSize: '8px', color: '#888', marginBottom: '4px' }}>WAVE</div>
            <div className="neon-text-green" style={{ fontSize: '16px' }}>{wave}</div>
          </div>
          <div>
            <div style={{ fontSize: '8px', color: '#888', marginBottom: '4px' }}>TIME</div>
            <div className="neon-text-cyan" style={{ fontSize: '16px' }}>{formatDuration(duration)}</div>
          </div>
          <div>
            <div style={{ fontSize: '8px', color: '#888', marginBottom: '4px' }}>BEST</div>
            <div className="neon-text-yellow" style={{ fontSize: '16px' }}>{highScore.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Score saved indicator */}
      <div style={{ fontSize: '8px', color: '#39ff14', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ boxShadow: '0 0 6px #39ff14', display: 'inline-block', width: '6px', height: '6px', background: '#39ff14', borderRadius: '50%' }} />
        SCORE SAVED TO HISTORY
      </div>

      <div style={{ display: 'flex', gap: '12px', flexDirection: 'column', alignItems: 'center' }}>
        <button className="arcade-btn" onClick={() => { playClick(); onRestart(); }}>
          🔄 PLAY AGAIN
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="arcade-btn"
            onClick={() => { playClick(); onShowScores(); }}
            style={{ borderColor: '#ffe600', color: '#ffe600', fontSize: '9px', padding: '8px 16px' }}
          >
            🏆 SCORES
          </button>
          <button
            className="arcade-btn"
            onClick={() => { playClick(); onMenu(); }}
            style={{ borderColor: '#ff2d95', color: '#ff2d95', fontSize: '9px', padding: '8px 16px' }}
          >
            MENU
          </button>
        </div>
      </div>

      <div className="blink-text" style={{ fontSize: '9px', color: '#666', marginTop: '20px' }}>
        PRESS SPACE TO CONTINUE
      </div>
    </div>
  );
}

export default memo(GameOverScreen);
