import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SPEED = 150;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const getRandomPosition = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
    };
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(true);
  }, [getRandomPosition]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !gameStarted) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };
      const currentDir = directionRef.current;

      switch (currentDir) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= CANVAS_SIZE / GRID_SIZE || head.y < 0 || head.y >= CANVAS_SIZE / GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 10);
        setFood(getRandomPosition());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, gameStarted, getRandomPosition]);

  useEffect(() => {
    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted && (e.key === ' ' || e.key === 'Enter')) {
        resetGame();
        return;
      }

      if (gameOver && (e.key === ' ' || e.key === 'Enter')) {
        resetGame();
        return;
      }

      if (e.key === ' ' && gameStarted && !gameOver) {
        setIsPaused((p) => !p);
        return;
      }

      const currentDir = directionRef.current;
      const keyMap: { [key: string]: Direction } = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
      };

      const newDir = keyMap[e.key];
      if (!newDir) return;

      // Prevent 180-degree turns
      const opposites: { [key in Direction]: Direction } = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
      };

      if (opposites[newDir] !== currentDir) {
        setDirection(newDir);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver, resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid (subtle)
    ctx.strokeStyle = '#252542';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#e94560';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ff88' : '#00cc6a';
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });

    // Draw overlay for game states
    if (!gameStarted || gameOver || isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';

      if (!gameStarted) {
        ctx.fillText('Snake Game', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);
        ctx.font = '16px Arial';
        ctx.fillText('Press SPACE or ENTER to start', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
      } else if (gameOver) {
        ctx.fillStyle = '#e94560';
        ctx.font = '28px Arial';
        ctx.fillText('GAME OVER', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);
        ctx.fillStyle = '#fff';
        ctx.font = '18px Arial';
        ctx.fillText(`Score: ${score}`, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 10);
        ctx.font = '14px Arial';
        ctx.fillText('Press SPACE or ENTER to restart', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 40);
      } else if (isPaused) {
        ctx.font = '24px Arial';
        ctx.fillText('PAUSED', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        ctx.font = '14px Arial';
        ctx.fillText('Press SPACE to continue', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 30);
      }
    }
  }, [snake, food, gameOver, isPaused, score, gameStarted]);

  return (
    <div className="snake-game-container">
      <h1>Snake Game</h1>
      <div className="game-wrapper">
        <div className="game-info">
          <div className="score-display">Score: {score}</div>
        </div>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="game-canvas"
        />
      </div>

      <div className="game-rules">
        <h2>How to Play</h2>
        <div className="rules-content">
          <div className="rules-section">
            <h3>Controls</h3>
            <ul>
              <li><kbd>Arrow Keys</kbd> or <kbd>WASD</kbd> - Move the snake</li>
              <li><kbd>Space</kbd> or <kbd>Enter</kbd> - Start/Pause/Restart</li>
            </ul>
          </div>

          <div className="rules-section">
            <h3>Rules</h3>
            <ul>
              <li>Eat the <span className="food-indicator">red food</span> to grow and score points</li>
              <li>Each food = <strong>10 points</strong></li>
              <li>Avoid hitting the walls</li>
              <li>Avoid hitting your own body</li>
              <li>The game ends if you collide with walls or yourself</li>
            </ul>
          </div>

          <div className="rules-section tips">
            <h3>Tips</h3>
            <p>Plan your path ahead of time. The snake keeps growing, so you'll need more space as you play!</p>
          </div>
        </div>
      </div>

      <div className="mobile-controls">
        <p className="mobile-hint">Use keyboard for best experience</p>
      </div>
    </div>
  );
};

export default SnakeGame;
