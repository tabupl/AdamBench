import React, { useRef, useEffect, useState } from 'react';

// Simple Snake game using a HTML canvas.
// Controls: Arrow keys (← ↑ → ↓) to change direction.
// Goal: Eat the red square (food). Each food increases the snake length.
// The game ends when the snake runs into the wall or itself.

const CELL_SIZE = 20; // px
const CANVAS_SIZE = 400; // width & height in px (20 cells)

type Point = { x: number; y: number };

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const getRandomFood = (snake: Point[]): Point => {
  let point: Point;
  do {
    point = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / CELL_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / CELL_SIZE)),
    };
  } while (snake.some(seg => seg.x === point.x && seg.y === point.y));
  return point;
};

const SnakeGamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 5, y: 5 }]);
  const [food, setFood] = useState<Point>(getRandomFood(snake));
  const [dir, setDir] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  // Handle key presses
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (dir !== 'DOWN') setDir('UP');
          break;
        case 'ArrowDown':
          if (dir !== 'UP') setDir('DOWN');
          break;
        case 'ArrowLeft':
          if (dir !== 'RIGHT') setDir('LEFT');
          break;
        case 'ArrowRight':
          if (dir !== 'LEFT') setDir('RIGHT');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dir]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        let newHead: Point = { ...head };
        switch (dir) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }
        // Wall collision
        if (
          newHead.x < 0 || newHead.x >= CANVAS_SIZE / CELL_SIZE ||
          newHead.y < 0 || newHead.y >= CANVAS_SIZE / CELL_SIZE
        ) {
          setGameOver(true);
          return prev;
        }
        // Self collision
        if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }
        // Grow when eating food
        const ateFood = newHead.x === food.x && newHead.y === food.y;
        const newSnake = [newHead, ...prev];
        if (!ateFood) newSnake.pop();
        if (ateFood) setFood(getRandomFood(newSnake));
        return newSnake;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [dir, food, gameOver]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Clear
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(seg => {
      ctx.fillRect(seg.x * CELL_SIZE, seg.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
    // Game over overlay
    if (gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = 'white';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }
  }, [snake, food, gameOver]);

  const restart = () => {
    setSnake([{ x: 5, y: 5 }]);
    setFood(getRandomFood([{ x: 5, y: 5 }]));
    setDir('RIGHT');
    setGameOver(false);
  };

  return (
    <div style={styles.container}>
      <h2>Snake Game (Unauthenticated)</h2>
      <p>Use arrow keys to move. Eat the red square. Avoid walls and yourself.</p>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={styles.canvas}
      />
      {gameOver && (
        <button onClick={restart} style={styles.button}>Restart</button>
      )}
    </div>
  );
};

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  canvas: {
    border: '2px solid #333',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: '10px',
    padding: '8px 12px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default SnakeGamePage;
