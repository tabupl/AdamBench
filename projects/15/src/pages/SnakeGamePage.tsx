import React, { useState, useEffect, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface Direction {
  x: number;
  y: number;
}

const GRID_SIZE = 15;
const INITIAL_SPEED = 200;

const DIRECTION = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
} as const;

const INITIAL_SNAKE: Point[] = [
  { x: 7, y: 7 },
  { x: 7, y: 8 },
  { x: 7, y: 9 },
];

export const SnakeGamePage: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>(DIRECTION.UP);
  const [nextDirection, setNextDirection] = useState<Direction>(DIRECTION.UP);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Generate random food position
  const generateFood = useCallback((): Point => {
    let newFood: Point;
    let isOnSnake;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (isOnSnake);
    return newFood;
  }, [snake]);

  // Move snake
  const moveSnake = useCallback(() => {
    setDirection(nextDirection);
    const newHead = {
      x: snake[0].x + nextDirection.x,
      y: snake[0].y + nextDirection.y,
    };

    // Check wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y < 0 ||
      newHead.y >= GRID_SIZE
    ) {
      setGameOver(true);
      setGameStarted(false);
      return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameOver(true);
      setGameStarted(false);
      return;
    }

    const newSnake = [newHead, ...snake];

    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(prev => prev + 1);
      if (score + 1 > highScore) {
        setHighScore(score + 1);
        localStorage.setItem('snakeHighScore', (score + 1).toString());
      }
      setFood(generateFood());
      setSpeed(prev => Math.max(50, prev - 5));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, nextDirection, food, score, highScore, generateFood]);

  // Game loop
  useEffect(() => {
    if (!gameOver && !gameStarted) return;
    if (gameOver) {
      const interval = setInterval(() => {
        setGameOver(prev => !prev);
        setGameStarted(prev => !prev);
        if (!gameStarted) {
          setSnake(INITIAL_SNAKE);
          setDirection(DIRECTION.UP);
          setNextDirection(DIRECTION.UP);
          setScore(0);
          setSpeed(INITIAL_SPEED);
        }
      }, 500);
      return () => clearInterval(interval);
    }

    if (!gameOver && gameStarted) {
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [gameOver, gameStarted, moveSnake, speed]);

  // Handle keyboard input
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!gameStarted && gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setNextDirection(DIRECTION.UP);
          break;
        case 'ArrowDown':
          if (direction.y === 0) setNextDirection(DIRECTION.DOWN);
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setNextDirection(DIRECTION.LEFT);
          break;
        case 'ArrowRight':
          if (direction.x === 0) setNextDirection(DIRECTION.RIGHT);
          break;
      }
    },
    [direction, gameOver, gameStarted]
  );

  // Handle button click
  const handleDirectionClick = (dir: Direction) => {
    if (gameOver) return;
    if (dir.y !== direction.y && dir.x !== direction.x) {
      setNextDirection(dir);
    }
  };

  // Reset game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(DIRECTION.UP);
    setNextDirection(DIRECTION.UP);
    setFood(generateFood());
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setGameStarted(true);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Render grid cell
  const renderCell = (x: number, y: number) => {
    const isHead = snake[0].x === x && snake[0].y === y;
    const isBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;

    let cellClass = 'cell';
    let content = '';

    if (isHead) {
      cellClass += ' head';
      content = '🐍';
    } else if (isBody) {
      cellClass += ' body';
      content = '⬜';
    } else if (isFood) {
      cellClass += ' food';
      content = '🍎';
    } else {
      cellClass += ' empty';
    }

    return <div key={`${x}-${y}`} className={cellClass}>{content}</div>;
  };

  return (
    <div className="snake-game-page">
      <div className="snake-container">
        <div className="snake-header">
          <h1>Snake Game 🐍</h1>
          <div className="score-board">
            <span className="score">Score: {score}</span>
            <span className="high-score">Best: {highScore}</span>
          </div>
        </div>

        <div className="snake-info">
          <div className="game-status">
            {!gameStarted && !gameOver && (
              <span className="status-text">Press Start to Play</span>
            )}
            {gameStarted && !gameOver && <span className="status-text">Playing...</span>}
            {gameOver && <span className="status-text">Game Over!</span>}
          </div>

          <div className="rules">
            <h2>Rules</h2>
            <ul>
              <li>Use <strong>Arrow Keys</strong> or <strong>Buttons</strong> to move</li>
              <li>Eat <strong>🍎 apples</strong> to grow and score points</li>
              <li>Avoid hitting <strong>walls</strong> and <strong>your own body</strong></li>
              <li>Each apple gives you <strong>1 point</strong></li>
              <li>Speed increases with every apple eaten</li>
              <li>Press <strong>Space</strong> or <strong>Restart</strong> to continue after game over</li>
            </ul>
          </div>

          <div className="controls">
            <h2>Controls</h2>
            <div className="control-buttons">
              <button
                className="control-btn"
                onClick={() => handleDirectionClick(DIRECTION.UP)}
                disabled={gameOver || !gameStarted}
              >
                ⬆️
              </button>
              <button
                className="control-btn"
                onClick={() => handleDirectionClick(DIRECTION.LEFT)}
                disabled={gameOver || !gameStarted}
              >
                ⬅️
              </button>
              <button
                className="control-btn"
                onClick={() => handleDirectionClick(DIRECTION.DOWN)}
                disabled={gameOver || !gameStarted}
              >
                ⬇️
              </button>
              <button
                className="control-btn"
                onClick={() => handleDirectionClick(DIRECTION.RIGHT)}
                disabled={gameOver || !gameStarted}
              >
                ➡️
              </button>
            </div>
            <p className="control-hint">Or use arrow keys on your keyboard</p>
          </div>

          <div className="actions">
            {!gameStarted && !gameOver && (
              <button className="start-btn" onClick={resetGame}>
                Start Game
              </button>
            )}
            {gameOver && (
              <button className="restart-btn" onClick={resetGame}>
                Restart Game
              </button>
            )}
          </div>
        </div>

        <div className="snake-grid">
          {Array.from({ length: GRID_SIZE }).map((_, y) =>
            Array.from({ length: GRID_SIZE }).map((_, x) => renderCell(x, y))
          )}
        </div>
      </div>
    </div>
  );
};
