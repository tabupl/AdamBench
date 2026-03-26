import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './SnakePage.module.css';

type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakePage = () => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
    setSpeed(INITIAL_SPEED);
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };

  const startGame = () => {
    resetGame();
    setIsPlaying(true);
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        setSpeed((s) => Math.max(50, s - 2));
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
          gameLoopRef.current = setInterval(moveSnake, Math.max(50, speed - 2));
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, speed]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPlaying) return;

      const { key } = e;
      const currentDir = directionRef.current;

      if ((key === 'ArrowUp' || key === 'w') && currentDir.y !== 1) {
        directionRef.current = { x: 0, y: -1 };
        setDirection({ x: 0, y: -1 });
      } else if ((key === 'ArrowDown' || key === 's') && currentDir.y !== -1) {
        directionRef.current = { x: 0, y: 1 };
        setDirection({ x: 0, y: 1 });
      } else if ((key === 'ArrowLeft' || key === 'a') && currentDir.x !== 1) {
        directionRef.current = { x: -1, y: 0 };
        setDirection({ x: -1, y: 0 });
      } else if ((key === 'ArrowRight' || key === 'd') && currentDir.x !== -1) {
        directionRef.current = { x: 1, y: 0 };
        setDirection({ x: 1, y: 0 });
      }
    },
    [isPlaying]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, moveSnake, speed]);

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        let cellClass = styles.cell;
        let content = '';

        // Check if snake head
        if (snake[0].x === x && snake[0].y === y) {
          cellClass += ' ' + styles.snakeHead;
          content = '🐍';
        }
        // Check if snake body
        else if (snake.slice(1).some((seg) => seg.x === x && seg.y === y)) {
          cellClass += ' ' + styles.snakeBody;
          content = '█';
        }
        // Check if food
        else if (food.x === x && food.y === y) {
          cellClass += ' ' + styles.food;
          content = '🍎';
        }

        cells.push(
          <div key={`${x}-${y}`} className={cellClass} style={{ width: CELL_SIZE, height: CELL_SIZE }}>
            {content}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameCard}>
        <header className={styles.header}>
          <h1 className={styles.title}>🐍 Snake Game</h1>
          <div className={styles.score}>Score: <span className={styles.scoreValue}>{score}</span></div>
        </header>

        <div className={styles.gameBoard}>{renderGrid()}</div>

        <div className={styles.controls}>
          {!isPlaying && !gameOver && (
            <button className={styles.button} onClick={startGame}>
              Start Game
            </button>
          )}
          {gameOver && (
            <div className={styles.gameOver}>
              <p className={styles.gameOverText}>Game Over!</p>
              <p className={styles.finalScore}>Final Score: {score}</p>
              <button className={styles.button} onClick={startGame}>
                Play Again
              </button>
            </div>
          )}
        </div>

        <section className={styles.rules}>
          <h2>How to Play</h2>
          <ul>
            <li>Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to control the snake</li>
            <li>Eat the <strong>🍎 apples</strong> to grow and score points (+10 per apple)</li>
            <li>Avoid hitting the <strong>walls</strong> or your own <strong>body</strong></li>
            <li>The snake speeds up as you eat more apples!</li>
          </ul>
        </section>

        <section className={styles.controlsInfo}>
          <h2>Controls</h2>
          <div className={styles.controlGrid}>
            <div className={styles.controlItem}>
              <span className={styles.key}>↑ W</span>
              <span>Move Up</span>
            </div>
            <div className={styles.controlItem}>
              <span className={styles.key}>↓ S</span>
              <span>Move Down</span>
            </div>
            <div className={styles.controlItem}>
              <span className={styles.key}>← A</span>
              <span>Move Left</span>
            </div>
            <div className={styles.controlItem}>
              <span className={styles.key}>→ D</span>
              <span>Move Right</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SnakePage;
