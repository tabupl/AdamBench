import { useEffect, useRef, useCallback, useState } from 'react';

// Snake game configuration
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

interface GameState {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  score: number;
  isGameOver: boolean;
}

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    score: 0,
    isGameOver: false,
  });

  // Use refs for game loop state
  const snakeRef = useRef<{ x: number; y: number }[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 15 });
  const directionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const scoreRef = useRef<number>(0);
  const isGameOverRef = useRef<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  // Get random position not on snake
  const getRandomPosition = useCallback((): { x: number; y: number } => {
    const snake = snakeRef.current;
    let position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    while (snake.some((segment) => segment.x === position.x && segment.y === position.y)) {
      position = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    }
    return position;
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    directionRef.current = { x: 1, y: 0 };
    snakeRef.current = [{ x: 10, y: 10 }];
    foodRef.current = getRandomPosition();
    scoreRef.current = 0;
    isGameOverRef.current = false;
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: foodRef.current,
      score: 0,
      isGameOver: false,
    });
  }, [getRandomPosition]);

  // Draw game
  const drawGame = useCallback((currentFood?: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawSize = GRID_SIZE * CELL_SIZE;
    canvas.width = drawSize;
    canvas.height = drawSize;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, drawSize, drawSize);

    // Draw food
    ctx.fillStyle = '#e94560';
    const foodX = (currentFood || foodRef.current).x * CELL_SIZE;
    const foodY = (currentFood || foodRef.current).y * CELL_SIZE;
    ctx.fillRect(foodX + 1, foodY + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    // Draw snake
    ctx.fillStyle = '#0f3460';
    snakeRef.current.forEach((segment, index) => {
      const segmentX = segment.x * CELL_SIZE;
      const segmentY = segment.y * CELL_SIZE;
      ctx.fillStyle = index === 0 ? '#16213e' : '#0f3460';
      ctx.fillRect(segmentX + 1, segmentY + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current.y !== -1) {
            directionRef.current = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current.y !== 1) {
            directionRef.current = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current.x !== -1) {
            directionRef.current = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current.x !== 1) {
            directionRef.current = { x: 1, y: 0 };
          }
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (isGameOverRef.current) {
            initGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initGame]);

  // Game loop
  useEffect(() => {
    if (isGameOverRef.current) {
      clearInterval(intervalRef.current!);
      return;
    }

    const gameLoop = () => {
      const currentSnake = snakeRef.current;
      const newHead = {
        x: currentSnake[0].x + directionRef.current.x,
        y: currentSnake[0].y + directionRef.current.y,
      };

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        isGameOverRef.current = true;
        return;
      }

      // Self collision
      if (currentSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        isGameOverRef.current = true;
        return;
      }

      const ateFood = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
      const newSnake = [newHead, ...currentSnake];

      if (ateFood) {
        foodRef.current = getRandomPosition();
        scoreRef.current += 10;
        snakeRef.current = newSnake;
        setGameState((prev: GameState) => ({
          ...prev,
          snake: newSnake,
          food: foodRef.current,
          score: scoreRef.current,
        }));
      } else {
        snakeRef.current = newSnake.slice(0, -1);
        setGameState((prev: GameState) => ({
          ...prev,
          snake: snakeRef.current,
          score: scoreRef.current,
        }));
      }

      drawGame();
    };

    intervalRef.current = window.setInterval(gameLoop, INITIAL_SPEED);
    return () => clearInterval(intervalRef.current!);
  }, [drawGame, getRandomPosition]);

  // Initial draw
  useEffect(() => {
    drawGame();
    initGame();
  }, [drawGame, initGame]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '1px solid #333' }} />
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <p>Score: {gameState.score}</p>
        <button onClick={initGame} className="start-game-btn">
          {gameState.isGameOver ? 'Restart' : 'Start'}
        </button>
      </div>
    </div>
  );
}
