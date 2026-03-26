import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/SnakeGame.css';

// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 50;

// Types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };
type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

const SnakeGame: React.FC = () => {
  // Game state
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [gameStatus, setGameStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastRenderTimeRef = useRef<number>(0);
  const foodRef = useRef<Position>(food);

  // Generate random food position
  const generateFood = useCallback((): Position => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    
    // Make sure food doesn't appear on snake
    const isOnSnake = snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    );
    
    if (isOnSnake) {
      return generateFood();
    }
    
    return newFood;
  }, [snake]);

  // Initialize game
  const initGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    const newFood = generateFood();
    setFood(newFood);
    foodRef.current = newFood;
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameStatus('PLAYING');
  }, [generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus === 'GAME_OVER' && e.key === ' ') {
        initGame();
        return;
      }

      if (gameStatus !== 'PLAYING') return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
        case ' ':
          setGameStatus(prev => prev === 'PLAYING' ? 'PAUSED' : 'PLAYING');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameStatus, initGame]);

  // Game loop with explicit dependencies
  useEffect(() => {
    if (gameStatus !== 'PLAYING') return;

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastRenderTimeRef.current < speed) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      
      lastRenderTimeRef.current = timestamp;
      
      setDirection(nextDirection);
      
      // Create a new snake state without using food state directly in the effect
      const newSnake = [...snake];
      const head = { ...newSnake[0] };
      
      // Move head based on direction
      switch (nextDirection) {
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
      if (
        head.x < 0 || 
        head.x >= GRID_SIZE || 
        head.y < 0 || 
        head.y >= GRID_SIZE
      ) {
        setGameStatus('GAME_OVER');
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      
      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameStatus('GAME_OVER');
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      
      // Add new head to snake
      newSnake.unshift(head);
      
      // Check food collision
      const foodAtHead = foodRef.current.x === head.x && foodRef.current.y === head.y;
      if (foodAtHead) {
        // Don't remove tail when food is eaten
        const newFood = generateFood();
        setFood(newFood);
        foodRef.current = newFood;
        setScore(prev => prev + 10);
        
        // Increase speed every 50 points
        if (score > 0 && score % 50 === 0 && speed > MIN_SPEED) {
          setSpeed(prev => Math.max(MIN_SPEED, prev - 10));
        }
      } else {
        // Remove tail if no food eaten
        newSnake.pop();
      }
      
      setSnake(newSnake);
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStatus, nextDirection, speed, score]); // Removed food and generateFood from dependencies

  // Start game on mount
  useEffect(() => {
    initGame();
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [initGame]);

  // Render game grid
  const renderGrid = () => {
    const grid = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        
        let cellClass = 'cell';
        
        if (isSnakeHead) {
          cellClass += ' snake-head';
        } else if (isSnakeBody) {
          cellClass += ' snake-body';
        } else if (isFood) {
          cellClass += ' food';
        }
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        );
      }
    }
    
    return grid;
  };

  return (
    <div className="snake-game">
      <h2>Snake Game</h2>
      
      <div className="game-info">
        <div className="score">Score: {score}</div>
        <div className="speed">Speed: {Math.round((INITIAL_SPEED - speed + MIN_SPEED) / 10)}</div>
      </div>
      
      <div 
        className="game-board"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {renderGrid()}
      </div>
      
      <div className="game-controls">
        {gameStatus === 'IDLE' && (
          <button onClick={initGame} className="start-button">
            Start Game
          </button>
        )}
        
        {gameStatus === 'PLAYING' && (
          <button onClick={() => setGameStatus('PAUSED')} className="pause-button">
            Pause
          </button>
        )}
        
        {gameStatus === 'PAUSED' && (
          <button onClick={() => setGameStatus('PLAYING')} className="resume-button">
            Resume
          </button>
        )}
        
        {gameStatus === 'GAME_OVER' && (
          <div className="game-over">
            <p>Game Over! Final Score: {score}</p>
            <button onClick={initGame} className="restart-button">
              Play Again
            </button>
          </div>
        )}
      </div>
      
      <div className="game-rules">
        <h3>How to Play</h3>
        <ul>
          <li>Use <strong>Arrow Keys</strong> to control the snake</li>
          <li>Eat the <span className="food">food</span> to grow and earn points</li>
          <li>Avoid hitting the walls or yourself</li>
          <li>Press <strong>Space</strong> to pause/resume the game</li>
          <li>Game speeds up as your score increases</li>
        </ul>
      </div>
    </div>
  );
};

export default SnakeGame;