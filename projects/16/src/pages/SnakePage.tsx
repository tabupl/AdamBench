import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../Layout';

type Point = { x: number; y: number };
type Direction = 'up' | 'down' | 'left' | 'right';

const SIZE = 12;
const TICK_MS = 160;

const randomPoint = (snake: Point[]): Point => {
  while (true) {
    const p = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
};

export const SnakePage = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Point>({ x: 8, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const directionRef = useRef<Direction>('right');

  const restart = () => {
    const start = [{ x: 5, y: 5 }];
    setSnake(start);
    setFood(randomPoint(start));
    directionRef.current = 'right';
    setIsGameOver(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const d = directionRef.current;

      if (key === 'r') return restart();
      if ((key === 'arrowup' || key === 'w') && d !== 'down') directionRef.current = 'up';
      if ((key === 'arrowdown' || key === 's') && d !== 'up') directionRef.current = 'down';
      if ((key === 'arrowleft' || key === 'a') && d !== 'right') directionRef.current = 'left';
      if ((key === 'arrowright' || key === 'd') && d !== 'left') directionRef.current = 'right';
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (isGameOver) return;

    const id = window.setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const next: Point = { ...head };

        if (directionRef.current === 'up') next.y -= 1;
        if (directionRef.current === 'down') next.y += 1;
        if (directionRef.current === 'left') next.x -= 1;
        if (directionRef.current === 'right') next.x += 1;

        const hitWall = next.x < 0 || next.x >= SIZE || next.y < 0 || next.y >= SIZE;
        const hitSelf = currentSnake.some((segment) => segment.x === next.x && segment.y === next.y);

        if (hitWall || hitSelf) {
          setIsGameOver(true);
          return currentSnake;
        }

        const ateFood = next.x === food.x && next.y === food.y;
        const grownSnake = [next, ...currentSnake];

        if (ateFood) {
          setFood(randomPoint(grownSnake));
          return grownSnake;
        }

        return grownSnake.slice(0, -1);
      });
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [food, isGameOver]);

  const board = useMemo(() => {
    const snakeSet = new Set(snake.map((s) => `${s.x}-${s.y}`));

    let text = '';
    for (let y = 0; y < SIZE; y += 1) {
      for (let x = 0; x < SIZE; x += 1) {
        if (x === snake[0].x && y === snake[0].y) text += '🟢';
        else if (snakeSet.has(`${x}-${y}`)) text += '🟩';
        else if (x === food.x && y === food.y) text += '🍎';
        else text += '· ';
      }
      text += '\n';
    }

    return text;
  }, [snake, food]);

  return (
    <Layout>
      <h1>Snake Game</h1>
      <p className="muted">A tiny public mini-game (no login required).</p>

      <pre className="snake-board">{board}</pre>

      <p>
        Score: <strong>{snake.length - 1}</strong>
      </p>

      {isGameOver && <p className="error">Game over. Press R to restart.</p>}

      <h3>Rules & Controls</h3>
      <ul className="rules-list muted small">
        <li>Eat 🍎 to grow and gain score.</li>
        <li>Avoid walls and your own body.</li>
        <li>Move with Arrow keys or W/A/S/D.</li>
        <li>Press R to restart.</li>
      </ul>

      <p className="muted small">
        Go to <Link to="/login">login</Link> or <Link to="/dashboard">dashboard</Link>.
      </p>
    </Layout>
  );
};
