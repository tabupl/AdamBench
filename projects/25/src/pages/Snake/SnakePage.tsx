import { useState, useEffect, useCallback } from 'react';
import styles from './Snake.module.css';

const SIZE = 15;
const SPEED = 150;

type Pos = { x: number; y: number };

export const SnakePage: React.FC = () => {
  const [snake, setSnake] = useState<Pos[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Pos>({ x: 10, y: 7 });
  const [dir, setDir] = useState<Pos>({ x: 1, y: 0 });
  const [nextDir, setNextDir] = useState<Pos>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);

  const reset = useCallback(() => {
    setSnake([{ x: 7, y: 7 }]);
    setFood({ x: 10, y: 7 });
    setDir({ x: 1, y: 0 });
    setNextDir({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setRunning(false);
  }, []);

  const spawnFood = useCallback((snake: Pos[]): Pos => {
    let pos: Pos;
    do {
      pos = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      const map: Record<string, Pos> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      };
      const nd = map[e.key];
      if (nd && (nd.x !== -dir.x || nd.y !== -dir.y)) {
        setNextDir(nd);
        if (!running) setRunning(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dir, running, gameOver]);

  useEffect(() => {
    if (!running || gameOver) return;
    const interval = setInterval(() => {
      setDir(nextDir);
      setSnake(prev => {
        const head = { x: prev[0].x + nextDir.x, y: prev[0].y + nextDir.y };
        if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE ||
            prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          setRunning(false);
          return prev;
        }
        const next = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          setFood(spawnFood(next));
        } else {
          next.pop();
        }
        return next;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [running, nextDir, food, gameOver, spawnFood]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Snake Game</h1>
        <p className={styles.subtitle}>Play without logging in!</p>
      </div>

      <div className={styles.gameContainer}>
        <div className={styles.score}>Score: {score}</div>
        
        <div className={styles.board}>
          {Array.from({ length: SIZE }, (_, y) =>
            Array.from({ length: SIZE }, (_, x) => {
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.slice(1).some(s => s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;
              let cls = styles.cell;
              if (isHead) cls += ` ${styles.head}`;
              else if (isBody) cls += ` ${styles.body}`;
              else if (isFood) cls += ` ${styles.food}`;
              return <div key={`${x}-${y}`} className={cls} />;
            })
          )}
        </div>

        {gameOver && (
          <div className={styles.overlay}>
            <p>Game Over!</p>
            <p>Score: {score}</p>
            <button onClick={reset} className={styles.restartBtn}>Play Again</button>
          </div>
        )}

        {!running && !gameOver && <p className={styles.hint}>Press arrow key to start</p>}
      </div>

      <div className={styles.info}>
        <div className={styles.section}>
          <h2>Controls</h2>
          <ul>
            <li><kbd>↑↓←→</kbd> or <kbd>WASD</kbd> to move</li>
            <li>Cannot reverse direction</li>
          </ul>
        </div>
        <div className={styles.section}>
          <h2>Rules</h2>
          <ul>
            <li>Eat red food to grow</li>
            <li>Avoid walls and yourself</li>
            <li>Each food = 10 points</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
