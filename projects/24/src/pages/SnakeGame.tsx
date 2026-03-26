import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const getRandomPosition = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(getRandomPosition);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snakeHighScore') || '0', 10);
  });
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomPosition());
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead: Position = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snakeHighScore', newScore.toString());
          }
          return newScore;
        });
        setFood(getRandomPosition());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, highScore]);

  // Game loop
  useEffect(() => {
    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver && (e.key === ' ' || e.key === 'Enter')) {
        resetGame();
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        setIsPaused((p) => !p);
        return;
      }

      const opposites: Record<Direction, Direction> = {
        UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT',
      };

      const keyToDirection: Record<string, Direction> = {
        ArrowUp: 'UP', w: 'UP', W: 'UP',
        ArrowDown: 'DOWN', s: 'DOWN', S: 'DOWN',
        ArrowLeft: 'LEFT', a: 'LEFT', A: 'LEFT',
        ArrowRight: 'RIGHT', d: 'RIGHT', D: 'RIGHT',
      };

      const newDirection = keyToDirection[e.key];
      if (newDirection && newDirection !== opposites[directionRef.current]) {
        directionRef.current = newDirection;
        setDirection(newDirection);
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, resetGame]);

  return (
    <div className="snake-page">
      <div className="snake-header">
        <h1>🐍 Snake Game</h1>
        <Link to="/login" className="nav-link-btn">Sign In</Link>
      </div>

      <div className="snake-content">
        <div className="snake-game-container">
          <div className="snake-score">
            <span>Score: {score}</span>
            <span>High Score: {highScore}</span>
          </div>

          <div
            className="snake-board"
            style={{
              width: GRID_SIZE * CELL_SIZE,
              height: GRID_SIZE * CELL_SIZE,
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const isSnake = snake.some((s) => s.x === x && s.y === y);
              const isHead = snake[0].x === x && snake[0].y === y;
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={i}
                  className={`cell ${isSnake ? 'snake' : ''} ${isHead ? 'head' : ''} ${isFood ? 'food' : ''}`}
                />
              );
            })}

            {gameOver && (
              <div className="game-overlay">
                <div className="game-over-text">
                  <h2>Game Over!</h2>
                  <p>Final Score: {score}</p>
                  <button onClick={resetGame}>Play Again</button>
                  <span className="hint">or press Space/Enter</span>
                </div>
              </div>
            )}

            {isPaused && !gameOver && (
              <div className="game-overlay">
                <div className="game-over-text">
                  <h2>Paused</h2>
                  <button onClick={() => setIsPaused(false)}>Resume</button>
                  <span className="hint">or press P</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="snake-info">
          <div className="info-card">
            <h3>📋 Rules</h3>
            <ul>
              <li>Guide the snake to eat the food (red square)</li>
              <li>Each food eaten gives you <strong>10 points</strong></li>
              <li>The snake grows longer with each food eaten</li>
              <li>Don't hit the walls!</li>
              <li>Don't hit your own tail!</li>
              <li>Game speed stays constant - it's all about skill</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>🎮 Controls</h3>
            <div className="controls-grid">
              <div className="control-item">
                <kbd>↑</kbd> or <kbd>W</kbd>
                <span>Move Up</span>
              </div>
              <div className="control-item">
                <kbd>↓</kbd> or <kbd>S</kbd>
                <span>Move Down</span>
              </div>
              <div className="control-item">
                <kbd>←</kbd> or <kbd>A</kbd>
                <span>Move Left</span>
              </div>
              <div className="control-item">
                <kbd>→</kbd> or <kbd>D</kbd>
                <span>Move Right</span>
              </div>
              <div className="control-item">
                <kbd>P</kbd>
                <span>Pause / Resume</span>
              </div>
              <div className="control-item">
                <kbd>Space</kbd>
                <span>Restart (after game over)</span>
              </div>
            </div>
          </div>

          <div className="info-card tips">
            <h3>💡 Tips</h3>
            <ul>
              <li>Plan your path ahead - don't just chase the food</li>
              <li>Use the edges to your advantage</li>
              <li>Stay calm as the snake gets longer!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
