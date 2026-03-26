import React, { useEffect, useRef, useState } from 'react';

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const GRID = 20;
  const CELL_SIZE = 20;

  const [snake, setSnake] = useState<Array<{ x: number; y: number }>>([]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const directionRef = useRef({ x: 1, y: 0 });

  const generateFood = (snakeBody: Array<{ x: number; y: number }>) => {
    while (true) {
      const candidate = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID),
      };
      if (!snakeBody.some((seg) => seg.x === candidate.x && seg.y === candidate.y)) {
        return candidate;
      }
    }
  };

  // Initialize game
  useEffect(() => {
    const start = { x: 5, y: 5 };
    setSnake([start]);
    setFood(generateFood([start]));
    setScore(0);
    setGameOver(false);
    directionRef.current = { x: 1, y: 0 };
  }, []); // run once

  // Main game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        // Use current head (first segment) to compute next position
        const head = prev[0];
        const newHead: { x: number; y: number } = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID ||
          newHead.y < 0 ||
          newHead.y >= GRID
        ) {
          setGameOver(true);
          return prev;
        }

        // Self collision (ignore the tail because it will move)
        const collisionCheck = prev.slice(0, -1); // all segments except the last one that will be removed if not eating
        if (collisionCheck.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        let newSnake = [newHead, ...prev];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 1);
          // Generate new food that is not in the new snake (including the new head)
          setFood(generateFood(newSnake));
          // Do not remove tail when eating, so snake grows
        } else {
          // Remove tail segment when not eating
          newSnake = [newHead, ...prev.slice(0, -1)];
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [gameOver, food]); // food dependency keeps interval in sync when food changes

  // Keyboard handling
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key.startsWith('Arrow')) {
          const start = { x: 5, y: 5 };
          setSnake([start]);
          setFood(generateFood([start]));
          setScore(0);
          setGameOver(false);
          directionRef.current = { x: 1, y: 0 };
        }
        return;
      }

      const dir = directionRef.current;
      const key = e.key;
      if (key === 'ArrowUp' && dir.y !== 1) {
        directionRef.current = { x: 0, y: -1 };
      } else if (key === 'ArrowDown' && dir.y !== -1) {
        directionRef.current = { x: 0, y: 1 };
      } else if (key === 'ArrowLeft' && dir.x !== 1) {
        directionRef.current = { x: -1, y: 0 };
      } else if (key === 'ArrowRight' && dir.x !== -1) {
        directionRef.current = { x: 1, y: 0 };
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameOver]);

  // Render to canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, GRID * CELL_SIZE, GRID * CELL_SIZE);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    ctx.fillStyle = 'lime';
    snake.forEach((seg) => {
      ctx.fillRect(seg.x * CELL_SIZE, seg.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
  }, [snake, food]); // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', marginTop: '2rem' }}>
      <h2>Snake Game (public)</h2>
      <p>
        Use Arrow keys to move. Eat the red dot and avoid hitting the walls or
        your own tail. Score is the length of the snake minus 1.
      </p>
      <canvas
        ref={canvasRef}
        width={GRID * CELL_SIZE}
        height={GRID * CELL_SIZE}
        style={{ border: '1px solid #333', margin: '0 auto' }}
      />
      <p>Score: {score}</p>
      {gameOver && (
        <p style={{ color: 'red' }}>
          Game Over! Press any Arrow key to restart.
        </p>
      )}
    </div>
  );
};

export default SnakeGame;
