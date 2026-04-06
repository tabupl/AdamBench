import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

type Pos = { x: number; y: number };
type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID = 20;
const CELL = 20;
const SPEED = 150;
const SIZE = GRID * CELL;

function randomFood(snake: Pos[]): Pos {
  let pos: Pos;
  do {
    pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  const snake = useRef<Pos[]>([{ x: 10, y: 10 }]);
  const food = useRef<Pos>(randomFood(snake.current));
  const dir = useRef<Dir>('RIGHT');
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, SIZE, SIZE);

    ctx.strokeStyle = '#252540';
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, SIZE); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(SIZE, i * CELL); ctx.stroke();
    }

    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(food.current.x * CELL + CELL / 2, food.current.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    snake.current.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#51cf66' : '#40c057';
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  const step = useCallback(() => {
    const head = snake.current[0];
    const next: Pos = { ...head };
    if (dir.current === 'UP') next.y -= 1;
    if (dir.current === 'DOWN') next.y += 1;
    if (dir.current === 'LEFT') next.x -= 1;
    if (dir.current === 'RIGHT') next.x += 1;

    if (
      next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID ||
      snake.current.some((s) => s.x === next.x && s.y === next.y)
    ) {
      setGameOver(true);
      clearInterval(timer.current!);
      return;
    }

    const ate = next.x === food.current.x && next.y === food.current.y;
    if (ate) { food.current = randomFood(snake.current); setScore((s) => s + 1); }
    else snake.current.pop();

    snake.current.unshift(next);
    draw();
  }, [draw]);

  const startGame = useCallback(() => {
    snake.current = [{ x: 10, y: 10 }];
    dir.current = 'RIGHT';
    food.current = randomFood(snake.current);
    setScore(0); setGameOver(false); setRunning(true);
    draw();
    clearInterval(timer.current!);
    timer.current = setInterval(step, SPEED);
  }, [draw, step]);

  useEffect(() => {
    if (!running || gameOver) return;
    const map: Record<string, Dir> = {
      ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
      w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
    };
    const opp: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    const handle = (e: KeyboardEvent) => {
      const nd = map[e.key];
      if (!nd) return;
      e.preventDefault();
      if (nd === opp[dir.current]) return;
      dir.current = nd;
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [running, gameOver]);

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => () => clearInterval(timer.current!), []);

  return (
    <div className="snake-page">
      <div className="snake-header">
        <h1>Snake</h1>
        <Link to="/login" className="btn btn-outline btn-sm">Sign In →</Link>
      </div>

      <div className="canvas-wrap">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className="snake-canvas" />
        {gameOver && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <p>Score: {score}</p>
            <button className="btn btn-primary" onClick={startGame}>Play Again</button>
          </div>
        )}
      </div>

      {!running && !gameOver && (
        <div className="snake-start">
          <button className="btn btn-primary" onClick={startGame}>Start Game</button>
        </div>
      )}

      {running && !gameOver && <div className="score-bar">Score: <strong>{score}</strong></div>}

      <div className="snake-info">
        <div className="info-card">
          <h3>How to Play</h3>
          <ul>
            <li>You control a snake that moves continuously across the board.</li>
            <li>Eat the red food to grow longer and earn points.</li>
            <li>The game ends if you hit a wall or your own body.</li>
            <li>Try to get the highest score possible!</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Controls</h3>
          <table>
            <tbody>
              <tr><td><kbd>↑</kbd> or <kbd>W</kbd></td><td>Move up</td></tr>
              <tr><td><kbd>↓</kbd> or <kbd>S</kbd></td><td>Move down</td></tr>
              <tr><td><kbd>←</kbd> or <kbd>A</kbd></td><td>Move left</td></tr>
              <tr><td><kbd>→</kbd> or <kbd>D</kbd></td><td>Move right</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
