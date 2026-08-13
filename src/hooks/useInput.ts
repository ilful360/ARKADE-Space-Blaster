import { useEffect, useRef } from 'react';

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  shoot: boolean;
}

export function useInput() {
  const keys = useRef<InputState>({
    left: false,
    right: false,
    up: false,
    down: false,
    shoot: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keys.current.left = true;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          keys.current.right = true;
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          keys.current.up = true;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          keys.current.down = true;
          break;
        case ' ':
          e.preventDefault();
          keys.current.shoot = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keys.current.left = false;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          keys.current.right = false;
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          keys.current.up = false;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          keys.current.down = false;
          break;
        case ' ':
          keys.current.shoot = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}
