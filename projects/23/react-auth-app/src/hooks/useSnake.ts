import { useState, useEffect, useCallback, useRef } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────

export const COLS = 20;
export const ROWS = 20;
const BASE_INTERVAL = 150; // ms per tick
const SPEED_STEP = 5;      // ms faster every 5 food eaten

// ── Types ─────────────────────────────────────────────────────────────────────

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type GameState = "idle" | "running" | "paused" | "dead";

export interface Point { x: number; y: number }

export interface SnakeGame {
  snake: Point[];
  food: Point;
  score: number;
  best: number;
  state: GameState;
  /** Call once to start, again to pause/resume, again after death to restart */
  togglePlay: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function randomFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 9,  y: 10 },
  { x: 8,  y: 10 },
];

function freshState() {
  return {
    snake: INITIAL_SNAKE,
    food: randomFood(INITIAL_SNAKE),
    dir: "RIGHT" as Direction,
    nextDir: "RIGHT" as Direction,
    score: 0,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSnake(): SnakeGame {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [best, setBest] = useState(0);

  // All mutable game data lives in a ref so the tick callback always sees
  // the latest values without needing to be re-created every render.
  const data = useRef(freshState());
  // Snapshot of renderable state — updated after every tick or input.
  const [snapshot, setSnapshot] = useState<Pick<ReturnType<typeof freshState>, "snake" | "food" | "score">>(
    () => ({ snake: data.current.snake, food: data.current.food, score: data.current.score }),
  );

  const flush = useCallback(() => {
    const d = data.current;
    setSnapshot({ snake: d.snake, food: d.food, score: d.score });
  }, []);

  // ── Tick ────────────────────────────────────────────────────────────────────

  const tick = useCallback(() => {
    const d = data.current;
    d.dir = d.nextDir;

    const head = d.snake[0]!;
    const next: Point = {
      x: (head.x + (d.dir === "RIGHT" ? 1 : d.dir === "LEFT" ? -1 : 0) + COLS) % COLS,
      y: (head.y + (d.dir === "DOWN"  ? 1 : d.dir === "UP"   ? -1 : 0) + ROWS) % ROWS,
    };

    // Self-collision
    if (d.snake.some((s) => s.x === next.x && s.y === next.y)) {
      setGameState("dead");
      setBest((b) => Math.max(b, d.score));
      return;
    }

    const ate = next.x === d.food.x && next.y === d.food.y;
    d.snake = [next, ...d.snake.slice(0, ate ? undefined : -1)];
    if (ate) {
      d.score += 1;
      d.food = randomFood(d.snake);
    }
    flush();
  }, [flush]);

  // ── Interval ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (gameState !== "running") return;
    const interval = BASE_INTERVAL - Math.floor(snapshot.score / 5) * SPEED_STEP;
    const id = setInterval(tick, Math.max(interval, 60));
    return () => clearInterval(id);
  }, [gameState, snapshot.score, tick]);

  // ── Keyboard ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const DIR_MAP: Record<string, Direction> = {
      ArrowUp: "UP",    w: "UP",    W: "UP",
      ArrowDown: "DOWN", s: "DOWN", S: "DOWN",
      ArrowLeft: "LEFT", a: "LEFT", A: "LEFT",
      ArrowRight: "RIGHT", d: "RIGHT", D: "RIGHT",
    };

    const OPPOSITE: Record<Direction, Direction> = {
      UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT",
    };

    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        togglePlay();
        return;
      }
      const newDir = DIR_MAP[e.key];
      if (!newDir) return;
      if (newDir === OPPOSITE[data.current.dir]) return; // no 180°
      e.preventDefault();
      data.current.nextDir = newDir;
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]); // re-bind when state changes so togglePlay closure is fresh

  // ── Controls ─────────────────────────────────────────────────────────────────

  // Defined after the keyboard effect so the closure captures the right state.
  // Using useCallback with gameState in deps is sufficient.
  const togglePlay = useCallback(() => {
    setGameState((current) => {
      if (current === "idle" || current === "dead") {
        data.current = freshState();
        flush();
        return "running";
      }
      if (current === "running") return "paused";
      return "running"; // paused → running
    });
  }, [flush]);

  return {
    snake: snapshot.snake,
    food: snapshot.food,
    score: snapshot.score,
    best,
    state: gameState,
    togglePlay,
  };
}
