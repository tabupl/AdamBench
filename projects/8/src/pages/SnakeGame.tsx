import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './SnakeGame.css';

const GRID_SIZE = 15;
const CELL_SIZE = 24;
const INITIAL_SPEED = 150;

const Direction = { UP: 0, DOWN: 1, LEFT: 2, RIGHT: 3 };

export function SnakeGame() {
  const { isAuthenticated } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [direction, setDirection] = useState(Direction.RIGHT);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const directionRef = useRef(direction);

  const getRandomFood = useCallback((snakePos: { x: number; y: number }[]) => {
    let newFood: { x: number; y: number };
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakePos.some((s) => s.x === newFood.x && s.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    const startPos = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) };
    setSnake([startPos]);
    setFood(getRandomFood([startPos]));
    setDirection(Direction.RIGHT);
    directionRef.current = Direction.RIGHT;
    setScore(0);
    setGameState('playing');
  }, [getRandomFood]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      if (gameState === 'gameover') resetGame();
      return;
    }
    
    if (gameState !== 'playing') return;
    
    const currentDir = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== Direction.DOWN) {
          directionRef.current = Direction.UP;
          setDirection(Direction.UP);
        }
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== Direction.UP) {
          directionRef.current = Direction.DOWN;
          setDirection(Direction.DOWN);
        }
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== Direction.RIGHT) {
          directionRef.current = Direction.LEFT;
          setDirection(Direction.LEFT);
        }
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== Direction.LEFT) {
          directionRef.current = Direction.RIGHT;
          setDirection(Direction.RIGHT);
        }
        break;
    }
  }, [gameState, resetGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 5) * 10);
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        
        switch (directionRef.current) {
          case Direction.UP:
            head.y -= 1;
            break;
          case Direction.DOWN:
            head.y += 1;
            break;
          case Direction.LEFT:
            head.x -= 1;
            break;
          case Direction.RIGHT:
            head.x += 1;
            break;
        }

        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          prev.some((s) => s.x === head.x && s.y === head.y)
        ) {
          setGameState('gameover');
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeHighScore', score.toString());
          }
          return prev;
        }

        const newSnake = [head, ...prev];
        
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1);
          setFood(getRandomFood(newSnake));
        } else {
          newSnake.pop();
        }
        
        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [gameState, food, score, highScore, getRandomFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#4ecdc4' : '#45b7aa';
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.strokeStyle = '#252540';
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }
  }, [snake, food, gameState]);

  const handleMobileDirection = (dir: number) => {
    if (gameState !== 'playing') return;
    const currentDir = directionRef.current;
    if (
      (dir === Direction.UP && currentDir !== Direction.DOWN) ||
      (dir === Direction.DOWN && currentDir !== Direction.UP) ||
      (dir === Direction.LEFT && currentDir !== Direction.RIGHT) ||
      (dir === Direction.RIGHT && currentDir !== Direction.LEFT)
    ) {
      directionRef.current = dir;
      setDirection(dir);
    }
  };

  return (
    <div className="snake-page">
      <div className="snake-container">
        <div className="snake-header">
          <h1>🐍 Snake Game</h1>
          {isAuthenticated && (
            <Link to="/dashboard" className="back-link">
              ← Back to Dashboard
            </Link>
          )}
        </div>

        <div className="snake-info">
          <div className="snake-stats">
            <div className="stat">
              <span className="stat-label">Score</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat">
              <span className="stat-label">High Score</span>
              <span className="stat-value">{highScore}</span>
            </div>
          </div>
        </div>

        <div className="snake-game-wrapper">
          <canvas
            ref={canvasRef}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            className="snake-canvas"
          />
          
          {gameState === 'menu' && (
            <div className="snake-overlay">
              <h2>🐍 Snake Game</h2>
              <div className="snake-rules">
                <h3>Rules</h3>
                <ul>
                  <li>Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to move</li>
                  <li>Eat the <span className="food-dot">●</span> food to grow and score points</li>
                  <li>Avoid hitting the walls or your own tail</li>
                  <li>Speed increases as you eat more food!</li>
                </ul>
              </div>
              <button onClick={resetGame} className="snake-start-btn">
                🎮 Start Game
              </button>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="snake-overlay">
              <h2>💀 Game Over!</h2>
              <div className="snake-final-score">
                <p>Final Score: <strong>{score}</strong></p>
                {score >= highScore && score > 0 && (
                  <p className="new-high-score">🎉 New High Score!</p>
                )}
              </div>
              <button onClick={resetGame} className="snake-start-btn">
                🔄 Play Again
              </button>
              <p className="snake-hint">Press <strong>Space</strong> to restart</p>
            </div>
          )}
        </div>

        <div className="snake-controls">
          <p className="controls-hint">Use Arrow Keys or WASD to move</p>
          <div className="mobile-controls">
            <button onClick={() => handleMobileDirection(Direction.UP)} className="control-btn">
              ↑
            </button>
            <div className="control-row">
              <button onClick={() => handleMobileDirection(Direction.LEFT)} className="control-btn">
                ←
              </button>
              <button onClick={() => handleMobileDirection(Direction.DOWN)} className="control-btn">
                ↓
              </button>
              <button onClick={() => handleMobileDirection(Direction.RIGHT)} className="control-btn">
                →
              </button>
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <div className="snake-footer">
            <Link to="/login" className="auth-link">🔒 Login to access Dashboard</Link>
          </div>
        )}
      </div>
    </div>
  );
}
