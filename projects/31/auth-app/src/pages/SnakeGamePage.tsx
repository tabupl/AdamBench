import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SnakeGamePage.css';

type Position = { x: number; y: number };

const GRID_SIZE = 15;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;

export default function SnakeGamePage() {
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 7, y: 7 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPlaying(false);
  };

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying || gameOver) return;

    const currentDir = directionRef.current;
    let newDir = currentDir;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) newDir = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) newDir = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) newDir = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) newDir = { x: 1, y: 0 };
        break;
    }

    if (newDir !== currentDir) {
      directionRef.current = newDir;
      setDirection(newDir);
    }
  }, [isPlaying, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || 
            newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          setSpeed(s => Math.max(50, s - SPEED_INCREMENT));
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, food, speed, score, highScore, generateFood]);

  const getCellClass = (x: number, y: number): string => {
    if (x === food.x && y === food.y) return 'cell food';
    const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
    if (snakeIndex === 0) return 'cell snake-head';
    if (snakeIndex > 0) return 'cell snake-body';
    return 'cell';
  };

  return (
    <div className="snake-page">
      <div className="snake-container">
        <header className="snake-header">
          <h1>🐍 Snake Game</h1>
          <Link to="/login" className="login-link">Login</Link>
        </header>

        <div className="game-info">
          <div className="score-box">
            <span className="label">Score</span>
            <span className="value">{score}</span>
          </div>
          <div className="score-box">
            <span className="label">High Score</span>
            <span className="value">{highScore}</span>
          </div>
        </div>

        <div className="game-board">
          {Array.from({ length: GRID_SIZE }, (_, y) =>
            Array.from({ length: GRID_SIZE }, (_, x) => (
              <div key={`${x}-${y}`} className={getCellClass(x, y)} />
            ))
          )}
        </div>

        {gameOver && (
          <div className="game-over-overlay">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            {score >= highScore && score > 0 && <p className="new-high-score">🎉 New High Score! 🎉</p>}
          </div>
        )}

        <div className="game-controls">
          {!isPlaying && !gameOver ? (
            <button className="btn btn-start" onClick={startGame}>
              Start Game
            </button>
          ) : (
            <button className="btn btn-reset" onClick={resetGame}>
              Reset Game
            </button>
          )}
        </div>

        <div className="game-rules">
          <h2>📖 Rules & Controls</h2>
          <div className="rules-content">
            <div className="rule-section">
              <h3>🎮 How to Play</h3>
              <ul>
                <li>Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to control the snake</li>
                <li>Eat the <span className="food-color">● Food</span> to grow and score points</li>
                <li>Each food eaten increases your score by 1</li>
                <li>The snake speeds up as you eat more food</li>
              </ul>
            </div>

            <div className="rule-section">
              <h3>❌ Game Over</h3>
              <ul>
                <li>Don't hit the walls!</li>
                <li>Don't collide with your own body!</li>
                <li>Try to beat your high score!</li>
              </ul>
            </div>

            <div className="rule-section">
              <h3>⌨️ Controls</h3>
              <table className="controls-table">
                <tbody>
                  <tr><td>↑ or W</td><td>Move Up</td></tr>
                  <tr><td>↓ or S</td><td>Move Down</td></tr>
                  <tr><td>← or A</td><td>Move Left</td></tr>
                  <tr><td>→ or D</td><td>Move Right</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="game-legend">
          <div className="legend-item">
            <span className="legend-cell snake-head"></span> Snake Head
          </div>
          <div className="legend-item">
            <span className="legend-cell snake-body"></span> Snake Body
          </div>
          <div className="legend-item">
            <span className="legend-cell food"></span> Food
          </div>
        </div>
      </div>
    </div>
  );
}
