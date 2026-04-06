import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

const SnakeGamePage: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const newHead = {
        x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 1);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x !== -1) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setFood(generateFood());
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <h1>Snake Game</h1>
      
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
        <div><strong>Score: {score}</strong></div>
        {gameOver && <div style={{ color: 'red', fontWeight: 'bold' }}>GAME OVER!</div>}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`, 
        gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`, 
        border: '5px solid #333',
        backgroundColor: '#eee'
      }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          
          return (
            <div key={i} style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: isSnake ? '#4CAF50' : isFood ? '#f44336' : 'transparent',
              border: '1px solid #ddd'
            }} />
          );
        })}
      </div>

      {gameOver && <button onClick={resetGame} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Restart Game</button>}

      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px' }}>
        <h3>How to Play</h3>
        <ul style={{ lineHeight: '1.6' }}>
          <li><strong>Controls:</strong> Use the <strong>Arrow Keys</strong> (↑, ↓, ←, →) to change direction.</li>
          <li><strong>Goal:</strong> Eat the <span style={{ color: 'red', fontWeight: 'bold' }}>red food</span> to grow and increase your score.</li>
          <li><strong>Rules:</strong> The game ends if you crash into your own body. (The walls are wrap-around!)</li>
        </ul>
      </div>
    </div>
  );
};

export default SnakeGamePage;