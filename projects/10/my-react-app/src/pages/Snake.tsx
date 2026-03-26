import { useEffect, useRef, useState, useCallback } from 'react';
import './Snake.css';

/**
 * Simple Snake game – public page (no auth required)
 *
 * Controls: Arrow keys – move the snake
 *   Eat the red food to grow
 *   Game ends when the snake hits the wall or itself
 *
 * Implementation notes:
 *   • All hooks are declared in a fixed order to satisfy the Rules of Hooks.
 *   • Refs are grouped together, then state, then effects.
 *   • Every state update is guarded by an `isMounted` ref to prevent
 *     “destroy” errors when the component unmounts.
 *   • The drawing routine safely checks the 2‑D context before using it.
 */
const SnakeGame = () => {
  /* -------------------------------------------------------------
   * 1️⃣ Refs – grouped first
   * ------------------------------------------------------------- */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tickInterval = useRef(200);
  const gameLoop = useRef<number | null>(null);
  const directionRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const isMounted = useRef(true);
  const snakeRef = useRef<number[][]>([]);
  const foodRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  /* -------------------------------------------------------------
   * 2️⃣ State – declared after refs
   * ------------------------------------------------------------- */
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState<number[][]>([
    [5, 5],
    [5, 4],
    [5, 3],
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const cellSize = 40; // 400px / 10 cells

  /* -------------------------------------------------------------
   * 3️⃣ Initialise refs with the latest state values
   * ------------------------------------------------------------- */
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  /* -------------------------------------------------------------
   * 4️⃣ Helper functions
   * ------------------------------------------------------------- */
  const generateFood = (): { x: number; y: number } => {
    const pos = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
    };
    foodRef.current = pos;
    return pos;
  };

  const computeNewHead = (): number[] => {
    console.log('computeNewHead called');
    if (!snakeRef.current.length) {
      console.warn('⚠️ computeNewHead called while snakeRef is empty');
      return [0, 0];
    }
    const head = snakeRef.current[0];
    const dx = directionRef.current.x;
    const dy = directionRef.current.y;
    // new head position
    console.log('newHead', [head[0] + dy, head[1] + dx]);
    return [head[0] + dy, head[1] + dx];
  };

  /* -------------------------------------------------------------
   * 5️⃣ Cleanup – ensure we don’t update state after unmount
   * ------------------------------------------------------------- */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* -------------------------------------------------------------
   * 6️⃣ Game tick – moves the snake, checks collisions, handles food
   * ------------------------------------------------------------- */
  const gameTick = useCallback(() => {
    console.log('tick running');
    console.log('gameTick executed');
    if (!tickInterval.current) return;

    const newHead = computeNewHead();

    // ---- Wall collision -------------------------------------------------
    console.log('Wall collision detected');
    if (
      newHead[0] < 0 ||
      newHead[0] >= 10 ||
      newHead[1] < 0 ||
      newHead[1] >= 10
    ) {
      setGameOver(true);
      clearInterval(gameLoop.current ?? undefined);
      return;
    }

    // ---- Self‑collision -------------------------------------------------
    console.log('Self‑collision detected');
    if (
      snakeRef.current.slice(1).some(
        (seg) => seg[0] === newHead[0] && seg[1] === newHead[1]
      )
    ) {
      setGameOver(true);
      clearInterval(gameLoop.current ?? undefined);
      return;
    }

    // ---- Build new snake ------------------------------------------------
    const newSnake = [newHead, ...snakeRef.current];

    // ---- Food handling --------------------------------------------------
    if (
      newHead[0] === foodRef.current.x &&
      newHead[1] === foodRef.current.y
    ) {
      if (isMounted.current) setScore((s) => s + 1);
      console.log('Score incremented');
      generateFood(); // place new food
      console.log('Food eaten');
    } else {
      // Keep length constant by removing the tail
      newSnake.pop();
    }

    // ---- Update state (only if still mounted) ---------------------------
    if (isMounted.current) {
      setSnake(newSnake);
    }
  }, []);

  /* -------------------------------------------------------------
   * 7️⃣ Keyboard handling – updates directionRef
   * ------------------------------------------------------------- */
  const handleKey = useCallback((e: KeyboardEvent) => {
    console.log('keydown', e.key, '→', directionRef.current);
    const key = e.key;
    if (key === 'ArrowUp') directionRef.current = { x: 0, y: -1 };
    else if (key === 'ArrowDown') directionRef.current = { x: 0, y: 1 };
    else if (key === 'ArrowLeft') directionRef.current = { x: -1, y: 0 };
    else if (key === 'ArrowRight') directionRef.current = { x: 1, y: 0 };
    e.preventDefault();
    console.log('Direction updated to:', directionRef.current);
  }, []);

  /* -------------------------------------------------------------
   * 8️⃣ Drawing routine – safe 2‑D context access
   * ------------------------------------------------------------- */
  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const size = canvasRef.current!.width;

    ctx.clearRect(0, 0, size, size);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(
      foodRef.current.x * cellSize,
      foodRef.current.y * cellSize,
      cellSize,
      cellSize
    );

    // Draw snake
    ctx.fillStyle = 'green';
    snakeRef.current.forEach((segment) => {
      ctx.fillRect(
        segment[1] * cellSize,
        segment[0] * cellSize,
        cellSize,
        cellSize
      );
    });
  };

  /* -------------------------------------------------------------
   * 9️⃣ Redraw whenever snake or food changes
   * ------------------------------------------------------------- */
  useEffect(() => {
    draw();
  }, [snakeRef.current, foodRef.current]);

  /* -------------------------------------------------------------
   * 🔟 Set up the game loop and keyboard listener
   * ------------------------------------------------------------- */
  useEffect(() => {
    // Start (or restart) the interval
    if (!gameLoop.current) {
      gameLoop.current = window.setInterval(gameTick, tickInterval.current);
      console.log('⏱️ interval started, id =', gameLoop.current);
    }
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      clearInterval(gameLoop.current ?? undefined);
      console.log('Game loop cleared');
      isMounted.current = false;
    };
    // `gameTick` is a dependency so the effect reacts if the callback ever changes
  }, [gameTick]);

  /* -------------------------------------------------------------
   * 1️⃣1️⃣ Reset / initialisation
   * ------------------------------------------------------------- */
  const resetGame = () => {
    setSnake([
      [5, 5],
      [5, 4],
      [5, 3],
    ]);
    setScore(0);
    setGameOver(false);
    clearInterval(gameLoop.current ?? undefined);
    tickInterval.current = 200;
    generateFood(); // new food location
    // restart the loop
    gameLoop.current = window.setInterval(gameTick, tickInterval.current);
  };

  // Seed the first food item
  generateFood();

  /* -------------------------------------------------------------
   * 1️⃣2️⃣ Render
   * ------------------------------------------------------------- */
  const canvasSize = 400; // px

  return (
    <div className="snake-wrapper">
      <h2>Snake – Public Game</h2>
      <p>
        <strong>Goal:</strong> Eat the red food. Each bite grows the snake.
        The game ends if you hit the wall or yourself.
      </p>
      <p>
        <strong>Controls:</strong> Use the <em>arrow keys</em> to move.
      </p>

      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="snake-canvas"
      />
      {gameOver && (
        <div className="game-over">
          <p>Game Over! Your score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;