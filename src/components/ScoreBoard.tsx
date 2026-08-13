import { memo, useState } from 'react';
import type { ScoreEntry } from '../types';
import { getScoreHistory, clearScoreHistory } from '../utils/scoreHistory';
import { playClick } from '../utils/soundEngine';

interface ScoreBoardProps {
  onBack: () => void;
}

function ScoreBoard({ onBack }: ScoreBoardProps) {
  const [scores, setScores] = useState<ScoreEntry[]>(getScoreHistory());
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    playClick();
    clearScoreHistory();
    setScores([]);
    setShowConfirm(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${month} ${day}  ${hours}:${mins}`;
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return { color: '#ffe600', textShadow: '0 0 10px #ffe600, 0 0 20px #ffe600' };
    if (index === 1) return { color: '#c0c0c0', textShadow: '0 0 8px #c0c0c0' };
    if (index === 2) return { color: '#cd7f32', textShadow: '0 0 8px #cd7f32' };
    return { color: '#888' };
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 60,
        background: 'radial-gradient(ellipse at center, rgba(10,10,40,0.92) 0%, rgba(5,5,16,0.98) 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', paddingTop: '24px', marginBottom: '16px' }}>
        <h2
          className="title-animate"
          style={{
            fontSize: '24px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#ffe600',
            letterSpacing: '4px',
            marginBottom: '6px',
          }}
        >
          🏆 HIGH SCORES
        </h2>
        <div style={{ fontSize: '8px', color: '#666', letterSpacing: '3px' }}>
          YOUR BEST RUNS
        </div>
      </div>

      {/* Scores container */}
      <div
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '700px',
          overflowY: 'auto',
          padding: '0 20px 10px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#333 transparent',
        }}
      >
        {scores.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>👾</div>
            <div className="neon-text-cyan" style={{ fontSize: '12px', marginBottom: '10px' }}>
              NO SCORES YET
            </div>
            <div style={{ fontSize: '8px', color: '#666', lineHeight: '1.8' }}>
              Play the game to record your scores!<br />
              Your top 20 runs will be saved here.
            </div>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '42px 1fr 70px 70px 100px',
                gap: '4px',
                padding: '8px 12px',
                fontSize: '7px',
                color: '#555',
                letterSpacing: '1.5px',
                borderBottom: '1px solid rgba(0,240,255,0.1)',
                marginBottom: '4px',
              }}
            >
              <span>RANK</span>
              <span>SCORE</span>
              <span>WAVE</span>
              <span>TIME</span>
              <span style={{ textAlign: 'right' }}>DATE</span>
            </div>

            {/* Score rows */}
            {scores.map((entry, index) => {
              const rankStyle = getRankStyle(index);
              const isTop3 = index < 3;
              return (
                <div
                  key={`${entry.date}-${index}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '42px 1fr 70px 70px 100px',
                    gap: '4px',
                    padding: '10px 12px',
                    fontSize: '9px',
                    alignItems: 'center',
                    background: isTop3
                      ? `linear-gradient(90deg, rgba(${index === 0 ? '255,230,0' : index === 1 ? '192,192,192' : '205,127,50'},0.06), transparent)`
                      : index % 2 === 0
                        ? 'rgba(255,255,255,0.015)'
                        : 'transparent',
                    borderLeft: isTop3 ? `2px solid ${rankStyle.color}` : '2px solid transparent',
                    borderRadius: '2px',
                    transition: 'background 0.2s',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,240,255,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = isTop3
                      ? `linear-gradient(90deg, rgba(${index === 0 ? '255,230,0' : index === 1 ? '192,192,192' : '205,127,50'},0.06), transparent)`
                      : index % 2 === 0
                        ? 'rgba(255,255,255,0.015)'
                        : 'transparent';
                  }}
                >
                  {/* Rank */}
                  <span style={{ ...rankStyle, fontSize: isTop3 ? '12px' : '9px' }}>
                    {getRankIcon(index)}
                  </span>

                  {/* Score */}
                  <span
                    style={{
                      color: isTop3 ? rankStyle.color : '#fff',
                      textShadow: isTop3 ? rankStyle.textShadow : 'none',
                      fontSize: isTop3 ? '12px' : '10px',
                      fontFamily: "'Press Start 2P', monospace",
                    }}
                  >
                    {entry.score.toLocaleString()}
                  </span>

                  {/* Wave */}
                  <span style={{ color: '#39ff14', textShadow: '0 0 4px rgba(57,255,20,0.3)' }}>
                    W{entry.wave}
                  </span>

                  {/* Duration */}
                  <span style={{ color: '#00f0ff' }}>
                    {formatDuration(entry.duration)}
                  </span>

                  {/* Date */}
                  <span style={{ color: '#666', textAlign: 'right', fontSize: '7px' }}>
                    {formatDate(entry.date)}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Stats summary */}
      {scores.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '24px',
            padding: '12px 20px',
            borderTop: '1px solid rgba(0,240,255,0.08)',
            marginBottom: '8px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '7px', color: '#555', marginBottom: '3px', letterSpacing: '1px' }}>GAMES PLAYED</div>
            <div className="neon-text-cyan" style={{ fontSize: '14px' }}>{scores.length}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '7px', color: '#555', marginBottom: '3px', letterSpacing: '1px' }}>BEST SCORE</div>
            <div className="neon-text-yellow" style={{ fontSize: '14px' }}>{scores[0]?.score.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '7px', color: '#555', marginBottom: '3px', letterSpacing: '1px' }}>BEST WAVE</div>
            <div className="neon-text-green" style={{ fontSize: '14px' }}>
              {Math.max(...scores.map((s) => s.wave))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '7px', color: '#555', marginBottom: '3px', letterSpacing: '1px' }}>AVG SCORE</div>
            <div className="neon-text-pink" style={{ fontSize: '14px' }}>
              {Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', paddingBottom: '20px', alignItems: 'center' }}>
        <button className="arcade-btn" onClick={() => { playClick(); onBack(); }}>
          ◀ BACK
        </button>

        {scores.length > 0 && !showConfirm && (
          <button
            className="arcade-btn"
            onClick={() => setShowConfirm(true)}
            style={{
              borderColor: '#ff0040',
              color: '#ff0040',
              fontSize: '9px',
              padding: '8px 16px',
            }}
          >
            🗑️ CLEAR
          </button>
        )}

        {showConfirm && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '8px', color: '#ff0040' }}>SURE?</span>
            <button
              className="arcade-btn"
              onClick={handleClear}
              style={{
                borderColor: '#ff0040',
                color: '#ff0040',
                fontSize: '8px',
                padding: '6px 12px',
              }}
            >
              YES
            </button>
            <button
              className="arcade-btn"
              onClick={() => setShowConfirm(false)}
              style={{
                fontSize: '8px',
                padding: '6px 12px',
              }}
            >
              NO
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ScoreBoard);
