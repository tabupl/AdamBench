import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    setSnake((prevSnake) => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y,
      };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#111827' }}>Snake Game</h1>
      <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Score: {score}</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          width: '400px',
          height: '400px',
          backgroundColor: '#eee',
          margin: '0 auto',
          border: '2px solid #333',
          position: 'relative'
        }}
      >
        {/* Render Food */}
        <div
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            backgroundColor: '#ef4444',
            borderRadius: '50%',
          }}
        />

        {/* Render Snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
              backgroundColor: i === 0 ? '#16a34a' : '#4ade80',
              border: '1px solid #eee'
            }}
          />
        ))}

        {isGameOver && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            zIndex: 10
          }}>
            <h2 style={{ fontSize: '2rem' }}>Game Over!</h2>
            <p>Final Score: {score}</p>
            <button onClick={resetGame} style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>Try Again</button>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'left', marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>Rules & Controls</h3>
        <ul style={{ lineHeight: '1.6', paddingLeft: '1.2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{ fontWeight: 600 }}>Goal:</strong> Eat the red food to grow and increase your score.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong style={{ fontWeight: 600 }}>Controls:</strong> Use your <strong style={{ fontWeight: 600 }}>Arrow Keys</strong> (Up, Down, Left, Right) to move.</li>
          <li><strong style={{ fontWeight: 600 }}>Avoid:</strong> Don't hit the walls or your own tail!</li>
        </ul>
      </div>
    </div>
  );
};

export default SnakeGame;