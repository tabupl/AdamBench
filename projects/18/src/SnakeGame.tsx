import { useEffect, useRef, useState, useCallback } from 'react';

const GRID = 20, CELL = 20, SPEED = 150;

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => +(localStorage.getItem('snake_high') || 0));
  const [gameOver, setGameOver] = useState(false);
  const [playing, setPlaying] = useState(false);

  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 10 },
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
  });

  const spawnFood = useCallback((snake: { x: number; y: number }[]) => {
    let food: { x: number; y: number };
    do {
      food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (snake.some((s) => s.x === food.x && s.y === food.y));
    return food;
  }, []);

  const reset = useCallback(() => {
    const snake = [{ x: 10, y: 10 }];
    stateRef.current = { snake, food: spawnFood(snake), dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 } };
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  }, [spawnFood]);

  useEffect(() => {
    if (!playing || gameOver) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const loop = setInterval(() => {
      const { snake, food, dir, nextDir } = stateRef.current;
      stateRef.current.dir = nextDir;

      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || snake.some((s) => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        setPlaying(false);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snake_high', score.toString());
        }
        return;
      }

      const newSnake = [head, ...snake];
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 10);
        stateRef.current.food = spawnFood(newSnake);
      } else {
        newSnake.pop();
      }
      stateRef.current.snake = newSnake;

      // Draw
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(food.x * CELL, food.y * CELL, CELL - 1, CELL - 1);
      newSnake.forEach((s, i) => {
        ctx.fillStyle = i ? '#2ecc71' : '#27ae60';
        ctx.fillRect(s.x * CELL, s.y * CELL, CELL - 1, CELL - 1);
      });
    }, SPEED);

    return () => clearInterval(loop);
  }, [playing, gameOver, score, highScore, spawnFood]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const keys: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
        a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      };
      const newDir = keys[e.key];
      const { dir } = stateRef.current;
      if (newDir && !(newDir.x === -dir.x && newDir.y === -dir.y)) {
        stateRef.current.nextDir = newDir;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, GRID * CELL, GRID * CELL);
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(10 * CELL, 10 * CELL, CELL - 1, CELL - 1);
    }
  }, []);

  return (
    <div className="snake-page">
      <div className="snake-container">
        <h1>🐍 Snake Game</h1>
        <div className="game-header">
          <span>Score: <strong>{score}</strong></span>
          <span>High: <strong>{highScore}</strong></span>
        </div>
        <div className="game-area">
          <canvas ref={canvasRef} width={GRID * CELL} height={GRID * CELL} />
          {!playing && (
            <div className="game-overlay">
              {gameOver && <p className="game-over">Game Over!</p>}
              <button onClick={reset} className="start-button">{gameOver ? 'Play Again' : 'Start'}</button>
            </div>
          )}
        </div>
        <div className="game-info">
          <div className="info-section">
            <h3>Controls</h3>
            <ul>
              <li><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></li>
            </ul>
          </div>
          <div className="info-section">
            <h3>Rules</h3>
            <ul>
              <li>Eat red food to grow (+10 pts)</li>
              <li>Don't hit walls or yourself</li>
            </ul>
          </div>
        </div>
        <a href="/login" className="login-link">← Login</a>
      </div>
    </div>
  );
}
