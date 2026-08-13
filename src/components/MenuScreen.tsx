import { memo } from 'react';
import { playClick } from '../utils/soundEngine';

interface MenuScreenProps {
  highScore: number;
  onStart: () => void;
  onShowScores: () => void;
}

function MenuScreen({ highScore, onStart, onShowScores }: MenuScreenProps) {
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
        background: 'radial-gradient(ellipse at center, rgba(10,10,26,0.8) 0%, rgba(5,5,16,0.95) 100%)',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1
          className="title-animate"
          style={{
            fontSize: '48px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#ff2d95',
            letterSpacing: '6px',
            marginBottom: '8px',
          }}
        >
          ARKADE
        </h1>
        <div
          className="neon-text-cyan"
          style={{
            fontSize: '12px',
            letterSpacing: '8px',
          }}
        >
          SPACE BLASTER
        </div>
      </div>

      {/* Ship preview */}
      <div style={{ marginBottom: '32px', position: 'relative' }}>
        <div
          className="pulse-neon"
          style={{
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
          }}
        >
          🚀
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <button className="arcade-btn" onClick={() => { playClick(); onStart(); }}>
          🕹️ START GAME
        </button>
        <button
          className="arcade-btn"
          onClick={() => { playClick(); onShowScores(); }}
          style={{
            borderColor: '#ffe600',
            color: '#ffe600',
            fontSize: '11px',
            padding: '10px 24px',
          }}
        >
          🏆 HIGH SCORES
        </button>
      </div>

      <div className="blink-text neon-text-yellow" style={{ fontSize: '10px', marginBottom: '24px' }}>
        PRESS SPACE OR CLICK TO START
      </div>

      {/* High Score */}
      {highScore > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '8px', color: '#888', marginBottom: '4px' }}>BEST SCORE</div>
          <div className="neon-text-green" style={{ fontSize: '16px' }}>
            {highScore.toLocaleString()}
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,240,255,0.15)',
          borderRadius: '8px',
          padding: '16px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '9px', color: '#00f0ff', marginBottom: '10px', letterSpacing: '2px' }}>
          CONTROLS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', fontSize: '8px', color: '#aaa' }}>
          <span>⬅️➡️⬆️⬇️</span><span style={{ color: '#fff' }}>MOVE</span>
          <span>WASD</span><span style={{ color: '#fff' }}>MOVE</span>
          <span>SPACE</span><span style={{ color: '#fff' }}>SHOOT</span>
          <span>P / ESC</span><span style={{ color: '#fff' }}>PAUSE</span>
          <span>M</span><span style={{ color: '#fff' }}>MUTE</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '20px', fontSize: '7px', color: '#444', letterSpacing: '2px' }}>
        MADE WITH ❤️ FOR GITHUB
      </div>
    </div>
  );
}

export default memo(MenuScreen);
