import { Link } from "react-router-dom";
import { useSnake, COLS, ROWS } from "../hooks/useSnake";
import type { Point } from "../hooks/useSnake";

// ── Grid cell classifier ──────────────────────────────────────────────────────

function cellType(
  x: number,
  y: number,
  snake: Point[],
  food: Point,
): "head" | "body" | "food" | "empty" {
  if (snake[0]?.x === x && snake[0]?.y === y) return "head";
  if (x === food.x && y === food.y) return "food";
  if (snake.some((s) => s.x === x && s.y === y)) return "body";
  return "empty";
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function SnakePage() {
  const { snake, food, score, best, state, togglePlay } = useSnake();

  const statusLabel: Record<typeof state, string> = {
    idle:    "Press Space to start",
    running: "Press Space to pause",
    paused:  "Paused — Space to resume",
    dead:    "Game over! Space to restart",
  };

  return (
    <div className="snake-page">

      {/* ── Top bar ── */}
      <header className="snake-header">
        <div className="snake-brand">
          <span className="logo-icon">⚡</span>
          <span>AppName</span>
        </div>
        <Link to="/login" className="snake-login-link">Sign in →</Link>
      </header>

      {/* ── Main content ── */}
      <main className="snake-main">
        <h1 className="snake-title">Snake</h1>

        {/* Scoreboard */}
        <div className="snake-scores">
          <div className="snake-score-item">
            <span className="snake-score-label">Score</span>
            <span className="snake-score-value">{score}</span>
          </div>
          <div className="snake-score-item">
            <span className="snake-score-label">Best</span>
            <span className="snake-score-value">{best}</span>
          </div>
        </div>

        {/* Game board */}
        <div
          className="snake-board"
          style={{ "--cols": COLS, "--rows": ROWS } as React.CSSProperties}
          aria-label="Snake game board"
        >
          {Array.from({ length: ROWS }, (_, y) =>
            Array.from({ length: COLS }, (_, x) => {
              const type = cellType(x, y, snake, food);
              return (
                <div
                  key={`${x}-${y}`}
                  className={`snake-cell snake-cell--${type}`}
                  aria-hidden="true"
                />
              );
            })
          )}

          {/* Overlay for idle / paused / dead */}
          {state !== "running" && (
            <div className="snake-overlay">
              {state === "dead" && (
                <p className="snake-overlay-score">Score: {score}</p>
              )}
              <button className="btn-primary snake-play-btn" onClick={togglePlay}>
                {state === "idle"   ? "▶  Start"   : null}
                {state === "paused" ? "▶  Resume"  : null}
                {state === "dead"   ? "↺  Restart" : null}
              </button>
            </div>
          )}
        </div>

        {/* Status line */}
        <p className="snake-status">{statusLabel[state]}</p>

        {/* ── Rules & Controls ── */}
        <div className="snake-info">
          <section className="snake-info-section">
            <h2>Rules</h2>
            <ul>
              <li>Guide the snake to eat the <span className="snake-chip snake-chip--food">food</span>.</li>
              <li>Each piece of food grows the snake by one segment and adds 1 point.</li>
              <li>The snake wraps around the edges — passing through a wall exits the other side.</li>
              <li>Running into your own body ends the game.</li>
              <li>Speed increases by a small amount every 5 food eaten.</li>
            </ul>
          </section>

          <section className="snake-info-section">
            <h2>Controls</h2>
            <table className="snake-controls-table">
              <tbody>
                <tr>
                  <td><kbd>↑</kbd> / <kbd>W</kbd></td>
                  <td>Move up</td>
                </tr>
                <tr>
                  <td><kbd>↓</kbd> / <kbd>S</kbd></td>
                  <td>Move down</td>
                </tr>
                <tr>
                  <td><kbd>←</kbd> / <kbd>A</kbd></td>
                  <td>Move left</td>
                </tr>
                <tr>
                  <td><kbd>→</kbd> / <kbd>D</kbd></td>
                  <td>Move right</td>
                </tr>
                <tr>
                  <td><kbd>Space</kbd> / <kbd>Enter</kbd></td>
                  <td>Start · Pause · Resume · Restart</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>

      </main>
    </div>
  );
}
