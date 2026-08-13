import { memo } from 'react';

interface PlayerProps {
  x: number;
  y: number;
  hasShield: boolean;
}

function Player({ x, y, hasShield }: PlayerProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
      }}
    >
      {/* Shield effect */}
      {hasShield && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            border: '2px solid rgba(0, 240, 255, 0.5)',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.3), inset 0 0 15px rgba(0, 240, 255, 0.1)',
            animation: 'pulse-glow 1s ease-in-out infinite',
          }}
        />
      )}
      
      {/* Ship body - CSS only spaceship */}
      <div style={{ position: 'relative', width: '40px', height: '44px' }}>
        {/* Main body */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            transform: 'translateX(-50%)',
            width: '12px',
            height: '28px',
            background: 'linear-gradient(180deg, #00f0ff, #0080ff)',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
          }}
        />
        {/* Cockpit */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '10px',
            transform: 'translateX(-50%)',
            width: '6px',
            height: '8px',
            background: 'radial-gradient(circle, #ffffff, #00f0ff)',
            borderRadius: '50% 50% 40% 40%',
            boxShadow: '0 0 8px #00f0ff',
          }}
        />
        {/* Left wing */}
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: '14px',
            width: '14px',
            height: '22px',
            background: 'linear-gradient(90deg, #ff2d95, #b026ff)',
            clipPath: 'polygon(0% 100%, 100% 30%, 100% 100%)',
            boxShadow: '0 0 5px rgba(255, 45, 149, 0.5)',
          }}
        />
        {/* Right wing */}
        <div
          style={{
            position: 'absolute',
            right: '0',
            top: '14px',
            width: '14px',
            height: '22px',
            background: 'linear-gradient(-90deg, #ff2d95, #b026ff)',
            clipPath: 'polygon(100% 100%, 0% 30%, 0% 100%)',
            boxShadow: '0 0 5px rgba(255, 45, 149, 0.5)',
          }}
        />
        {/* Left thruster */}
        <div
          style={{
            position: 'absolute',
            left: '8px',
            bottom: '-8px',
            width: '4px',
            height: '12px',
            background: 'linear-gradient(180deg, #ffe600, #ff6600, transparent)',
            borderRadius: '0 0 2px 2px',
            animation: 'thruster 0.15s ease-in-out infinite',
            opacity: 0.9,
          }}
        />
        {/* Center thruster */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '-10px',
            transform: 'translateX(-50%)',
            width: '5px',
            height: '16px',
            background: 'linear-gradient(180deg, #ffffff, #ffe600, #ff2d00, transparent)',
            borderRadius: '0 0 3px 3px',
            animation: 'thruster 0.1s ease-in-out infinite',
          }}
        />
        {/* Right thruster */}
        <div
          style={{
            position: 'absolute',
            right: '8px',
            bottom: '-8px',
            width: '4px',
            height: '12px',
            background: 'linear-gradient(180deg, #ffe600, #ff6600, transparent)',
            borderRadius: '0 0 2px 2px',
            animation: 'thruster 0.15s ease-in-out infinite',
            opacity: 0.9,
          }}
        />
      </div>
    </div>
  );
}

export default memo(Player);
