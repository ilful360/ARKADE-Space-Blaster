import { memo } from 'react';
import type { EnemyType } from '../types';

interface EnemySpriteProps {
  x: number;
  y: number;
  type: EnemyType;
  health: number;
  maxHealth: number;
  enterDelay: number;
}

const enemyMeta: Record<EnemyType, { size: number; glow: string }> = {
  grunt: { size: 34, glow: 'rgba(57, 255, 20, 0.5)' },
  zigzag: { size: 36, glow: 'rgba(255, 230, 0, 0.5)' },
  tank: { size: 42, glow: 'rgba(255, 45, 149, 0.5)' },
  boss: { size: 64, glow: 'rgba(176, 38, 255, 0.6)' },
};

/* ─── Grunt: small scout saucer ─── */
function GruntShip({ s }: { s: number }) {
  return (
    <div style={{ position: 'relative', width: s, height: s }}>
      {/* Dome / cockpit */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '18%',
          transform: 'translateX(-50%)',
          width: s * 0.35,
          height: s * 0.32,
          background: 'radial-gradient(circle at 50% 40%, #7dff7d, #00aa00)',
          borderRadius: '50% 50% 40% 40%',
          boxShadow: '0 0 8px #39ff14, inset 0 -3px 6px rgba(0,0,0,0.4)',
          zIndex: 2,
        }}
      />
      {/* Main hull — flying-saucer disc */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          transform: 'translateX(-50%)',
          width: s * 0.95,
          height: s * 0.3,
          background: 'linear-gradient(180deg, #55ee55 0%, #1a8c1a 60%, #0d5c0d 100%)',
          borderRadius: '50%',
          boxShadow: '0 0 12px rgba(57,255,20,0.4)',
          zIndex: 1,
        }}
      />
      {/* Under-hull shadow */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '55%',
          transform: 'translateX(-50%)',
          width: s * 0.65,
          height: s * 0.18,
          background: 'linear-gradient(180deg, #0d5c0d, #042804)',
          borderRadius: '50%',
          zIndex: 1,
        }}
      />
      {/* Left engine glow */}
      <div
        style={{
          position: 'absolute',
          left: '12%',
          bottom: '14%',
          width: 4,
          height: 6,
          background: 'linear-gradient(180deg, #39ff14, transparent)',
          borderRadius: '0 0 2px 2px',
          boxShadow: '0 2px 6px #39ff14',
          animation: 'thruster 0.12s infinite',
        }}
      />
      {/* Right engine glow */}
      <div
        style={{
          position: 'absolute',
          right: '12%',
          bottom: '14%',
          width: 4,
          height: 6,
          background: 'linear-gradient(180deg, #39ff14, transparent)',
          borderRadius: '0 0 2px 2px',
          boxShadow: '0 2px 6px #39ff14',
          animation: 'thruster 0.12s infinite',
        }}
      />
      {/* Glowing port-holes */}
      {[-1, 0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${50 + i * 18}%`,
            top: '46%',
            transform: 'translate(-50%, -50%)',
            width: 3,
            height: 3,
            background: '#aaffaa',
            borderRadius: '50%',
            boxShadow: '0 0 4px #39ff14',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Zigzag: agile interceptor craft ─── */
function ZigzagShip({ s }: { s: number }) {
  return (
    <div style={{ position: 'relative', width: s, height: s }}>
      {/* Left swept wing */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '28%',
          width: s * 0.38,
          height: s * 0.55,
          background: 'linear-gradient(135deg, #ffdd00 0%, #cc8800 100%)',
          clipPath: 'polygon(0% 100%, 40% 0%, 100% 30%, 100% 70%)',
          boxShadow: '0 0 8px rgba(255,230,0,0.4)',
        }}
      />
      {/* Right swept wing */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '28%',
          width: s * 0.38,
          height: s * 0.55,
          background: 'linear-gradient(-135deg, #ffdd00 0%, #cc8800 100%)',
          clipPath: 'polygon(100% 100%, 60% 0%, 0% 30%, 0% 70%)',
          boxShadow: '0 0 8px rgba(255,230,0,0.4)',
        }}
      />
      {/* Central fuselage */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '10%',
          transform: 'translateX(-50%)',
          width: s * 0.3,
          height: s * 0.72,
          background: 'linear-gradient(180deg, #ffe066 0%, #b38600 60%, #7a5c00 100%)',
          clipPath: 'polygon(50% 0%, 100% 35%, 100% 85%, 70% 100%, 30% 100%, 0% 85%, 0% 35%)',
          boxShadow: '0 0 10px rgba(255,230,0,0.4)',
          zIndex: 2,
        }}
      />
      {/* Cockpit window */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '22%',
          transform: 'translateX(-50%)',
          width: s * 0.14,
          height: s * 0.18,
          background: 'radial-gradient(circle at 50% 30%, #fff, #ffcc00)',
          borderRadius: '50% 50% 40% 40%',
          boxShadow: '0 0 6px #ffe600',
          zIndex: 3,
        }}
      />
      {/* Engine flames */}
      {[-1, 1].map((dir) => (
        <div
          key={dir}
          style={{
            position: 'absolute',
            left: dir === -1 ? '18%' : undefined,
            right: dir === 1 ? '18%' : undefined,
            bottom: '2%',
            width: 4,
            height: 10,
            background: 'linear-gradient(180deg, #ffe600, #ff6600, transparent)',
            borderRadius: '0 0 2px 2px',
            boxShadow: '0 3px 8px #ff9900',
            animation: 'thruster 0.1s infinite',
            zIndex: 1,
          }}
        />
      ))}
      {/* Wing-tip lasers */}
      <div style={{ position: 'absolute', left: '2%', top: '62%', width: 3, height: 3, background: '#ff4444', borderRadius: '50%', boxShadow: '0 0 5px #ff0000' }} />
      <div style={{ position: 'absolute', right: '2%', top: '62%', width: 3, height: 3, background: '#ff4444', borderRadius: '50%', boxShadow: '0 0 5px #ff0000' }} />
    </div>
  );
}

/* ─── Tank: heavy cruiser with armour plates ─── */
function TankShip({ s }: { s: number }) {
  return (
    <div style={{ position: 'relative', width: s, height: s }}>
      {/* Armour top plate */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '5%',
          transform: 'translateX(-50%)',
          width: s * 0.45,
          height: s * 0.28,
          background: 'linear-gradient(180deg, #ff5599 0%, #cc0055 100%)',
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
          boxShadow: '0 0 10px rgba(255,45,149,0.4)',
          zIndex: 3,
        }}
      />
      {/* Main wide hull */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '28%',
          transform: 'translateX(-50%)',
          width: s * 0.92,
          height: s * 0.38,
          background: 'linear-gradient(180deg, #dd2277 0%, #991155 50%, #661144 100%)',
          borderRadius: '6px 6px 4px 4px',
          boxShadow: '0 0 14px rgba(255,45,149,0.35)',
          zIndex: 2,
        }}
      />
      {/* Armour stripe */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '38%',
          transform: 'translateX(-50%)',
          width: s * 0.85,
          height: 3,
          background: '#ff88bb',
          boxShadow: '0 0 4px #ff2d95',
          zIndex: 4,
        }}
      />
      {/* Left gun turret */}
      <div
        style={{
          position: 'absolute',
          left: '2%',
          top: '32%',
          width: s * 0.16,
          height: s * 0.4,
          background: 'linear-gradient(180deg, #cc2266, #880044)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)',
          zIndex: 3,
        }}
      />
      {/* Right gun turret */}
      <div
        style={{
          position: 'absolute',
          right: '2%',
          top: '32%',
          width: s * 0.16,
          height: s * 0.4,
          background: 'linear-gradient(180deg, #cc2266, #880044)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)',
          zIndex: 3,
        }}
      />
      {/* Under-hull / rear */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '8%',
          transform: 'translateX(-50%)',
          width: s * 0.55,
          height: s * 0.22,
          background: 'linear-gradient(180deg, #771144, #440022)',
          borderRadius: '0 0 6px 6px',
          zIndex: 1,
        }}
      />
      {/* Cockpit / sensor array */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '12%',
          transform: 'translateX(-50%)',
          width: s * 0.2,
          height: s * 0.14,
          background: 'radial-gradient(circle at 50% 40%, #ff88bb, #ff0055)',
          borderRadius: '50%',
          boxShadow: '0 0 8px #ff2d95',
          zIndex: 4,
        }}
      />
      {/* Engine exhausts */}
      {[-1, 0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${50 + i * 14}%`,
            bottom: '2%',
            transform: 'translateX(-50%)',
            width: 4,
            height: 9,
            background: 'linear-gradient(180deg, #ff2d95, #ff6600, transparent)',
            borderRadius: '0 0 2px 2px',
            boxShadow: '0 3px 8px #ff2d95',
            animation: 'thruster 0.12s infinite',
            zIndex: 1,
          }}
        />
      ))}
      {/* Gun barrels */}
      <div style={{ position: 'absolute', left: '6%', bottom: '26%', width: 2, height: 8, background: '#ff88bb', borderRadius: '0 0 1px 1px', boxShadow: '0 2px 5px #ff2d95', zIndex: 4 }} />
      <div style={{ position: 'absolute', right: '6%', bottom: '26%', width: 2, height: 8, background: '#ff88bb', borderRadius: '0 0 1px 1px', boxShadow: '0 2px 5px #ff2d95', zIndex: 4 }} />
    </div>
  );
}

/* ─── Boss: massive alien mothership ─── */
function BossShip({ s }: { s: number }) {
  return (
    <div style={{ position: 'relative', width: s, height: s }}>
      {/* Command tower */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '2%',
          transform: 'translateX(-50%)',
          width: s * 0.22,
          height: s * 0.3,
          background: 'linear-gradient(180deg, #dd55ff 0%, #8800cc 100%)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
          boxShadow: '0 0 12px rgba(176,38,255,0.5)',
          zIndex: 4,
        }}
      />
      {/* Main saucer hull */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '28%',
          transform: 'translateX(-50%)',
          width: s * 0.98,
          height: s * 0.3,
          background: 'linear-gradient(180deg, #bb44ee 0%, #7711aa 50%, #440077 100%)',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(176,38,255,0.4)',
          zIndex: 3,
        }}
      />
      {/* Hull neon stripe */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '38%',
          transform: 'translateX(-50%)',
          width: s * 0.88,
          height: 3,
          background: '#dd88ff',
          boxShadow: '0 0 8px #b026ff',
          borderRadius: '50%',
          zIndex: 5,
        }}
      />
      {/* Left heavy wing */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '35%',
          width: s * 0.28,
          height: s * 0.42,
          background: 'linear-gradient(160deg, #9933cc 0%, #5500aa 100%)',
          clipPath: 'polygon(0% 60%, 40% 0%, 100% 15%, 100% 80%, 60% 100%)',
          boxShadow: '0 0 10px rgba(176,38,255,0.3)',
          zIndex: 2,
        }}
      />
      {/* Right heavy wing */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '35%',
          width: s * 0.28,
          height: s * 0.42,
          background: 'linear-gradient(-160deg, #9933cc 0%, #5500aa 100%)',
          clipPath: 'polygon(100% 60%, 60% 0%, 0% 15%, 0% 80%, 40% 100%)',
          boxShadow: '0 0 10px rgba(176,38,255,0.3)',
          zIndex: 2,
        }}
      />
      {/* Undercarriage */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '10%',
          transform: 'translateX(-50%)',
          width: s * 0.45,
          height: s * 0.2,
          background: 'linear-gradient(180deg, #440077, #220044)',
          borderRadius: '4px 4px 8px 8px',
          zIndex: 2,
        }}
      />
      {/* Boss eye / main weapon */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          transform: 'translate(-50%, -50%)',
          width: s * 0.16,
          height: s * 0.12,
          background: 'radial-gradient(circle at 50% 50%, #fff, #ff3366, #cc0044)',
          borderRadius: '50%',
          boxShadow: '0 0 14px #ff0044, 0 0 28px rgba(255,0,68,0.4)',
          animation: 'pulse-glow 1.2s ease-in-out infinite',
          zIndex: 6,
        }}
      />
      {/* Portholes */}
      {[-2, -1, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${50 + i * 10}%`,
            top: '35%',
            transform: 'translate(-50%, -50%)',
            width: 4,
            height: 4,
            background: '#eebbff',
            borderRadius: '50%',
            boxShadow: '0 0 5px #b026ff',
            zIndex: 5,
          }}
        />
      ))}
      {/* Engine bank — 5 exhausts */}
      {[-2, -1, 0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${50 + i * 7}%`,
            bottom: '4%',
            transform: 'translateX(-50%)',
            width: 5,
            height: 14,
            background: 'linear-gradient(180deg, #b026ff, #ff6600, transparent)',
            borderRadius: '0 0 3px 3px',
            boxShadow: '0 4px 10px #b026ff',
            animation: 'thruster 0.1s infinite',
            zIndex: 1,
          }}
        />
      ))}
      {/* Weapon pods on wing tips */}
      <div style={{ position: 'absolute', left: '3%', top: '55%', width: 5, height: 5, background: '#ff4444', borderRadius: '50%', boxShadow: '0 0 8px #ff0000', zIndex: 4 }} />
      <div style={{ position: 'absolute', right: '3%', top: '55%', width: 5, height: 5, background: '#ff4444', borderRadius: '50%', boxShadow: '0 0 8px #ff0000', zIndex: 4 }} />
    </div>
  );
}

function EnemySprite({ x, y, type, health, maxHealth, enterDelay }: EnemySpriteProps) {
  const meta = enemyMeta[type];
  const healthPct = (health / maxHealth) * 100;

  return (
    <div
      className="enemy-enter"
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 15,
        animationDelay: `${enterDelay * 0.1}s`,
        filter: `drop-shadow(0 0 6px ${meta.glow})`,
      }}
    >
      {/* Health bar for non-grunt enemies */}
      {type !== 'grunt' && healthPct < 100 && (
        <div
          style={{
            position: 'absolute',
            top: `-${meta.size / 2 + 10}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${meta.size}px`,
            height: '3px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${healthPct}%`,
              height: '100%',
              background:
                healthPct > 50 ? '#39ff14' : healthPct > 25 ? '#ffe600' : '#ff2d00',
              borderRadius: '2px',
              transition: 'width 0.2s',
              boxShadow:
                healthPct > 50
                  ? '0 0 4px #39ff14'
                  : healthPct > 25
                    ? '0 0 4px #ffe600'
                    : '0 0 4px #ff2d00',
            }}
          />
        </div>
      )}

      {/* Render the correct alien ship */}
      {type === 'grunt' && <GruntShip s={meta.size} />}
      {type === 'zigzag' && <ZigzagShip s={meta.size} />}
      {type === 'tank' && <TankShip s={meta.size} />}
      {type === 'boss' && <BossShip s={meta.size} />}
    </div>
  );
}

export default memo(EnemySprite);
