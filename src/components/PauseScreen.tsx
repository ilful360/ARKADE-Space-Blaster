import { memo } from 'react';
import { playClick } from '../utils/soundEngine';

interface PauseScreenProps {
  onResume: () => void;
}

function PauseScreen({ onResume }: PauseScreenProps) {
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
        background: 'rgba(5, 5, 16, 0.85)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <h2
        className="neon-text-cyan pulse-neon"
        style={{
          fontSize: '32px',
          fontFamily: "'Press Start 2P', monospace",
          marginBottom: '30px',
          letterSpacing: '6px',
        }}
      >
        ⏸ PAUSED
      </h2>

      <button className="arcade-btn" onClick={() => { playClick(); onResume(); }}>
        ▶ RESUME
      </button>

      <div style={{ marginTop: '20px', fontSize: '8px', color: '#666' }}>
        PRESS P OR ESC TO RESUME
      </div>
    </div>
  );
}

export default memo(PauseScreen);
