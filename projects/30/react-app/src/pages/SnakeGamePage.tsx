import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SPEED = 150;

type Position = { x: number; y: number };

export function SnakeGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Position>({ x: 15, y: 15 });
  const directionRef = useRef<Position>({ x: 1, y: 0 });
  const lastDirectionRef = useRef<Position>({ x: 1, y: 0 });
  const gameLoopRef = useRef<number | null>(null);

  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    foodRef.current = generateFood(snakeRef.current);
    directionRef.current = { x: 1, y: 0 };
    lastDirectionRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameState('playing');
  }, []);

  const generateFood = (snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    snakeRef.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#4ade80' : '#22c55e';
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(
      foodRef.current.x * CELL_SIZE + 1,
      foodRef.current.y * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2
    );
  }, []);

  const update = useCallback(() => {
    const snake = snakeRef.current;
    const direction = directionRef.current;

    const newHead: Position = {
      x: snake[0].x + direction.x,
      y: snake[0].y + direction.y,
    };

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      setGameState('gameover');
      setHighScore((prev) => Math.max(prev, score));
      return;
    }

    // Check self collision
    if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
      setGameState('gameover');
      setHighScore((prev) => Math.max(prev, score));
      return;
    }

    snake.unshift(newHead);

    // Check food collision
    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      setScore((prev) => prev + 1);
      foodRef.current = generateFood(snake);
    } else {
      snake.pop();
    }

    lastDirectionRef.current = directionRef.current;
  }, [score]);

  const gameLoop = useCallback(() => {
    update();
    draw();
  }, [update, draw]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;

    const lastDir = lastDirectionRef.current;
    let newDir = directionRef.current;

    switch (e.key) {
      case 'ArrowUp':
        if (lastDir.y !== 1) newDir = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        if (lastDir.y !== -1) newDir = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        if (lastDir.x !== 1) newDir = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        if (lastDir.x !== -1) newDir = { x: 1, y: 0 };
        break;
      default:
        return;
    }

    if (newDir.x !== directionRef.current.x || newDir.y !== directionRef.current.y) {
      directionRef.current = newDir;
    }
  }, [gameState]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = window.setInterval(gameLoop, INITIAL_SPEED);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  useEffect(() => {
    if (gameState === 'playing') {
      draw();
    }
  }, [gameState, draw]);

  const startGame = () => {
    resetGame();
  };

  return (
    <div className="snake-page">
      <header className="snake-header">
        <h1>🐍 Snake Game</h1>
        <Link to="/login" className="login-link">Login</Link>
      </header>

      <main className="snake-content">
        <div className="game-section">
          <div className="score-board">
            <div className="score">Score: {score}</div>
            <div className="high-score">High Score: {highScore}</div>
          </div>

          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="game-canvas"
            />
          </div>

          {gameState === 'idle' && (
            <div className="game-status">
              <p>Press Start to play!</p>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="game-status game-over">
              <p>Game Over!</p>
              <p>Final Score: {score}</p>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="game-status playing">
              <p>Playing... Score: {score}</p>
            </div>
          )}

          <button onClick={startGame} className="start-button">
            {gameState === 'playing' ? 'Restart' : 'Start Game'}
          </button>
        </div>

        <div className="rules-section">
          <h2>How to Play</h2>
          <div className="rules-card">
            <h3>Rules</h3>
            <ul>
              <li>Move the snake using arrow keys</li>
              <li>Eat the red food to grow and gain points</li>
              <li>Don't hit the walls!</li>
              <li>Don't hit yourself!</li>
              <li>Each food = 1 point</li>
            </ul>

            <h3>Controls</h3>
            <ul>
              <li>⬆️ <strong>Up Arrow</strong> - Move up</li>
              <li>⬇️ <strong>Down Arrow</strong> - Move down</li>
              <li>⬅️ <strong>Left Arrow</strong> - Move left</li>
              <li>➡️ <strong>Right Arrow</strong> - Move right</li>
            </ul>

            <h3>Tips</h3>
            <ul>
              <li>Plan your moves ahead</li>
              <li>Don't trap yourself</li>
              <li>Try to beat your high score!</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
