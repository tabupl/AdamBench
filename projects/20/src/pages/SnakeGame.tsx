import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const GAME_SPEED = 150;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback((): Position => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  }, []);

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection('RIGHT');
    setScore(0);
    setIsPlaying(true);
    setGameOver(false);
  }, [generateFood]);

  const checkCollision = (head: Position): boolean => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    return snake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y);
  };

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        
        switch (direction) {
          case 'UP': head.y -= 1; break;
          case 'DOWN': head.y += 1; break;
          case 'LEFT': head.x -= 1; break;
          case 'RIGHT': head.x += 1; break;
        }

        if (checkCollision(head)) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];
        
        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          if (newScore > highScore) setHighScore(newScore);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, direction, snake, food, score, highScore, generateFood]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver && (e.key === ' ' || e.key === 'Enter')) {
        startGame();
        return;
      }

      if (!isPlaying && (e.key === ' ' || e.key === 'Enter')) {
        startGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ':
        case 'Enter':
          if (isPlaying) setIsPlaying(false);
          else startGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPlaying, gameOver, startGame]);

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(s => s.x === x && s.y === y);
        const isFood = food.x === x && food.y === y;
        const isHead = snake[0]?.x === x && snake[0]?.y === y;
        
        let bgColor = 'bg-gray-100';
        if (isHead) bgColor = 'bg-green-600';
        else if (isSnake) bgColor = 'bg-green-500';
        else if (isFood) bgColor = 'bg-red-500';

        grid.push(
          <div
            key={`${x}-${y}`}
            className={`border border-gray-200 ${bgColor}`}
            style={{ width: CELL_SIZE, height: CELL_SIZE }}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🐍 Snake Game</h1>
          <p className="text-gray-600 mb-6">A simple snake game - no login required!</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">Score</div>
                    <div className="text-3xl font-bold text-gray-900">{score}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">High Score</div>
                    <div className="text-3xl font-bold text-gray-900">{highScore}</div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  {!isPlaying && !gameOver && (
                    <button
                      onClick={startGame}
                      className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
                    >
                      Start Game
                    </button>
                  )}
                  {isPlaying && (
                    <button
                      onClick={() => setIsPlaying(false)}
                      className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700"
                    >
                      Pause
                    </button>
                  )}
                  {gameOver && (
                    <button
                      onClick={startGame}
                      className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
                    >
                      Play Again
                    </button>
                  )}
                </div>
              </div>

              {gameOver && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <h3 className="text-lg font-medium text-red-800">Game Over! Score: {score}</h3>
                  <p className="text-red-700">Press Space or Enter to play again.</p>
                </div>
              )}

              {!isPlaying && !gameOver && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="text-lg font-medium text-blue-800">Ready to Play?</h3>
                  <p className="text-blue-700">Press Space or Enter, or click Start Game.</p>
                </div>
              )}

              {/* Game Grid */}
              <div className="flex justify-center mb-8">
                <div 
                  className="grid border-2 border-gray-300 rounded-lg overflow-hidden"
                  style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                    width: GRID_SIZE * CELL_SIZE,
                    height: GRID_SIZE * CELL_SIZE,
                  }}
                >
                  {renderGrid()}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Play</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Objective</h3>
                  <p className="text-gray-600">
                    Control the snake to eat red food. Each food increases your score and makes the snake longer.
                    Avoid walls and the snake's body.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Controls</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Move Up</span>
                      <span className="font-bold">↑ Arrow Up</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Move Down</span>
                      <span className="font-bold">↓ Arrow Down</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Move Left</span>
                      <span className="font-bold">← Arrow Left</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Move Right</span>
                      <span className="font-bold">→ Arrow Right</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Start/Pause</span>
                      <span className="font-bold">Space or Enter</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Rules</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Red square = Food (+10 points)</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Green = Snake body</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                      <span>Dark green = Snake head</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Game ends if snake hits wall or itself</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    This page is accessible to all users, authenticated or not.
                    Enjoy the game!
                  </p>
                  <div className="mt-4 flex space-x-3">
                    <Link
                      to="/login"
                      className="flex-1 text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Go to Login
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex-1 text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Try Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;