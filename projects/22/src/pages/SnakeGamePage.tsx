import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

export function SnakeGamePage() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef(direction);
  const gameLoopRef = useRef<number | null>(null);

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

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  }, [generateFood]);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };
      const currentDirection = directionRef.current;

      switch (currentDirection) {
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
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snakeHighScore', newScore.toString());
          }
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, generateFood, highScore]);

  // Game loop
  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, INITIAL_SPEED);
    }
    return () => {
      if (gameLoopRef.current) window.clearInterval(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying && !gameOver && e.code === 'Space') {
        resetGame();
        return;
      }
      if (gameOver && e.code === 'Space') {
        resetGame();
        return;
      }

      const keyDirectionMap: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        KeyW: 'UP',
        KeyS: 'DOWN',
        KeyA: 'LEFT',
        KeyD: 'RIGHT',
      };

      const newDirection = keyDirectionMap[e.code];
      if (!newDirection) return;

      const opposites: Record<Direction, Direction> = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
      };

      if (opposites[newDirection] !== directionRef.current) {
        setDirection(newDirection);
        directionRef.current = newDirection;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver, resetGame]);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const handleDirectionButton = (newDir: Direction) => {
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };
    if (opposites[newDir] !== directionRef.current) {
      setDirection(newDir);
      directionRef.current = newDir;
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/login" style={styles.backLink}>
          ← Back to Login
        </Link>
        <h1 style={styles.title}>🐍 Snake Game</h1>
      </header>

      <main style={styles.main}>
        <div style={styles.gameContainer}>
          <div style={styles.scoreBoard}>
            <span style={styles.score}>Score: {score}</span>
            <span style={styles.highScore}>High Score: {highScore}</span>
          </div>

          <div style={styles.grid}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isSnakeHead = snake[0].x === x && snake[0].y === y;
              const isSnakeBody = snake.slice(1).some((seg) => seg.x === x && seg.y === y);
              const isFood = food.x === x && food.y === y;

              let cellStyle = styles.cell;
              if (isSnakeHead) cellStyle = { ...cellStyle, ...styles.snakeHead };
              else if (isSnakeBody) cellStyle = { ...cellStyle, ...styles.snakeBody };
              else if (isFood) cellStyle = { ...cellStyle, ...styles.food };

              return <div key={index} style={cellStyle} />;
            })}
          </div>

          {(!isPlaying || gameOver) && (
            <div style={styles.overlay}>
              {gameOver ? (
                <>
                  <h2 style={styles.gameOverTitle}>Game Over!</h2>
                  <p style={styles.finalScore}>Final Score: {score}</p>
                </>
              ) : (
                <h2 style={styles.gameOverTitle}>Ready to Play?</h2>
              )}
              <button onClick={resetGame} style={styles.startButton}>
                {gameOver ? 'Play Again' : 'Start Game'}
              </button>
              <p style={styles.hint}>or press Space</p>
            </div>
          )}
        </div>

        <div style={styles.infoPanel}>
          <div style={styles.infoSection}>
            <h3 style={styles.infoTitle}>🎮 Controls</h3>
            <ul style={styles.controlList}>
              <li><strong>Arrow Keys</strong> or <strong>WASD</strong> - Move</li>
              <li><strong>Space</strong> - Start / Restart</li>
            </ul>
            
            <div style={styles.mobileControls}>
              <button onClick={() => handleDirectionButton('UP')} style={styles.dPadButton}>▲</button>
              <div style={styles.dPadRow}>
                <button onClick={() => handleDirectionButton('LEFT')} style={styles.dPadButton}>◀</button>
                <button onClick={() => handleDirectionButton('DOWN')} style={styles.dPadButton}>▼</button>
                <button onClick={() => handleDirectionButton('RIGHT')} style={styles.dPadButton}>▶</button>
              </div>
            </div>
          </div>

          <div style={styles.infoSection}>
            <h3 style={styles.infoTitle}>📜 Rules</h3>
            <ul style={styles.rulesList}>
              <li>Eat the red food to grow and score points</li>
              <li>Each food gives you +10 points</li>
              <li>Don't hit the walls!</li>
              <li>Don't eat yourself!</li>
              <li>Try to beat your high score</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#eee',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 24px',
    gap: '24px',
  },
  backLink: {
    color: '#4a9eff',
    textDecoration: 'none',
    fontSize: '16px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '24px',
    gap: '24px',
  },
  gameContainer: {
    position: 'relative',
    border: '3px solid #4a9eff',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  scoreBoard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: '#16213e',
    fontSize: '18px',
  },
  score: {
    color: '#4a9eff',
    fontWeight: 'bold',
  },
  highScore: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
    gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
    gap: '1px',
    backgroundColor: '#0f0f23',
    padding: '4px',
  },
  cell: {
    width: '20px',
    height: '20px',
    backgroundColor: '#1a1a2e',
    borderRadius: '2px',
  },
  snakeHead: {
    backgroundColor: '#4a9eff',
    borderRadius: '4px',
  },
  snakeBody: {
    backgroundColor: '#2d6cdf',
    borderRadius: '3px',
  },
  food: {
    backgroundColor: '#ff4757',
    borderRadius: '50%',
  },
  overlay: {
    position: 'absolute',
    top: '44px',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  gameOverTitle: {
    margin: 0,
    fontSize: '32px',
    color: '#ff4757',
  },
  finalScore: {
    fontSize: '20px',
    color: '#eee',
  },
  startButton: {
    padding: '12px 32px',
    backgroundColor: '#4a9eff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  hint: {
    color: '#888',
    fontSize: '14px',
  },
  infoPanel: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    width: '100%',
    maxWidth: '800px',
  },
  infoSection: {
    backgroundColor: '#16213e',
    padding: '20px',
    borderRadius: '8px',
  },
  infoTitle: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    color: '#4a9eff',
  },
  controlList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#ccc',
  },
  rulesList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#ccc',
  },
  mobileControls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
  },
  dPadRow: {
    display: 'flex',
    gap: '8px',
  },
  dPadButton: {
    width: '50px',
    height: '50px',
    backgroundColor: '#2d6cdf',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '20px',
    cursor: 'pointer',
  },
};
