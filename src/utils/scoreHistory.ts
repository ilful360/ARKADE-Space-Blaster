import type { ScoreEntry } from '../types';

const STORAGE_KEY = 'arkade_score_history';
const MAX_ENTRIES = 20;

export function getScoreHistory(): ScoreEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data) as ScoreEntry[];
    return parsed.sort((a, b) => b.score - a.score);
  } catch {
    return [];
  }
}

export function saveScore(entry: ScoreEntry): void {
  try {
    const history = getScoreHistory();
    history.push(entry);
    history.sort((a, b) => b.score - a.score);
    const trimmed = history.slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    // Also update single high score key
    const best = trimmed[0]?.score || 0;
    localStorage.setItem('arkade_highscore', best.toString());
  } catch {
    // silently fail
  }
}

export function clearScoreHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('arkade_highscore');
}

export function getHighScore(): number {
  const history = getScoreHistory();
  if (history.length > 0) return history[0].score;
  return parseInt(localStorage.getItem('arkade_highscore') || '0');
}
