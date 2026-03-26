import React, { useState, useEffect, useRef } from 'react';

const SNAKE_SPEED = 200; // milliseconds
const GRID_SIZE = 20;
const CELL_SIZE = 20; // pixels

type Position = { x: number; y: number };

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'>('ArrowRight');
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameOver) return;

    gameLoopRef.current = window.setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        switch (direction) {
          case 'ArrowUp': head.y--; break;
          case 'ArrowDown': head.y++; break;
          case 'ArrowLeft': head.x--; break;
          case 'ArrowRight': head.x++; break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prevScore => prevScore + 1);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
          return [head, ...prevSnake];
        }

        return [head, ...prevSnake.slice(0, -1)];
      });
    }, SNAKE_SPEED);

    return () => {
      if (gameLoopRef.current !== null) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [direction, food, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'ArrowDown') setDirection('ArrowUp');
          break;
        case 'ArrowDown':
          if (direction !== 'ArrowUp') setDirection('ArrowDown');
          break;
        case 'ArrowLeft':
          if (direction !== 'ArrowRight') setDirection('ArrowLeft');
          break;
        case 'ArrowRight':
          if (direction !== 'ArrowLeft') setDirection('ArrowRight');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('ArrowRight');
    setFood({ x: 5, y: 5 });
    setGameOver(false);
    setScore(0);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Snake Game</h2>
      <div>
        <svg
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          style={{ border: '1px solid #333', margin: '0 auto', display: 'block' }}
        >
          {/* Grid lines (optional, for clarity) */}
          {[...Array(GRID_SIZE + 1)].map((_, i) => (
            <React.Fragment key={i}>
              <line
                x1={i * CELL_SIZE}
                y1={0}
                x2={i * CELL_SIZE}
                y2={GRID_SIZE * CELL_SIZE}
                stroke="#eee"
                strokeWidth={1}
              />
              <line
                x1={0}
                y1={i * CELL_SIZE}
                x2={GRID_SIZE * CELL_SIZE}
                y2={i * CELL_SIZE}
                stroke="#eee"
                strokeWidth={1}
              />
            </React.Fragment>
          ))}
          {/* Snake body */}
          {snake.map((segment, index) => (
            <rect
              key={index}
              x={segment.x * CELL_SIZE}
              y={segment.y * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              fill={index === 0 ? '#4CAF50' : '#8BC34A'}
            />
          ))}
          {/* Food */}
          <circle
            cx={food.x * CELL_SIZE + CELL_SIZE / 2}
            cy={food.y * CELL_SIZE + CELL_SIZE / 2}
            r={CELL_SIZE / 2 - 2}
            fill="#FF5722"
          />
        </svg>
      </div>
      <div>
        <p>Score: {score}</p>
        {gameOver ? (
          <button onClick={resetGame}>Play Again</button>
        ) : (
          <p>Use arrow keys to move the snake. Eat the red food to grow.</p>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
