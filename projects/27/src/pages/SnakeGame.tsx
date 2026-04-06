/**
 * Snake Game - Minimal, browser-based snake game
 */

import { useState, useEffect, useCallback } from 'react';
import './SnakeGame.css';

const SIZE = 20;

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState('right');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);

  const nextFood = () => ({
    x: Math.floor(Math.random() * SIZE),
    y: Math.floor(Math.random() * SIZE),
  });

  const reset = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(nextFood());
    setDir('right');
    setGameOver(false);
    setScore(0);
    setPlaying(true);
  };

  const move = useCallback(() => {
    if (gameOver || !playing) return;
    setSnake((s) => {
      const h = { ...s[0] };
      if (dir === 'up') h.y -= 1;
      if (dir === 'down') h.y += 1;
      if (dir === 'left') h.x -= 1;
      if (dir === 'right') h.x += 1;

      if (h.x < 0 || h.x >= SIZE || h.y < 0 || h.y >= SIZE) {
        setGameOver(true);
        setPlaying(false);
        return s;
      }
      if (s.some((seg) => seg.x === h.x && seg.y === h.y)) {
        setGameOver(true);
        setPlaying(false);
        return s;
      }

      const ns = [h, ...s];
      if (h.x === food.x && h.y === food.y) {
        setScore((sc) => sc + 1);
        setFood(nextFood());
      } else {
        ns.pop();
      }
      return ns;
    });
  }, [dir, gameOver, playing, food, nextFood]);

  useEffect(() => {
    const id = setInterval(move, 150);
    return () => clearInterval(id);
  }, [move]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      switch (e.key) {
        case 'ArrowUp': if (dir !== 'down') setDir('up'); break;
        case 'ArrowDown': if (dir !== 'up') setDir('down'); break;
        case 'ArrowLeft': if (dir !== 'right') setDir('left'); break;
        case 'ArrowRight': if (dir !== 'left') setDir('right'); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dir, gameOver]);

  return (
    <div className="snake-game">
      <header className="game-header">
        <h1>Snake Game</h1>
        <div className="score">Score: {score}</div>
      </header>

      <div className="board">
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const x = i % SIZE;
          const y = Math.floor(i / SIZE);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          const cellClass = (isHead ? 'head ' : '') + (isBody ? 'body ' : '') + (isFood ? 'food' : '');
          return <div key={`${x}-${y}`} className={`cell ${cellClass}`} />;
        })}
      </div>

      <div className="controls">
        <button className="btn btn-primary" onClick={reset}>Start Game</button>
        <button className="btn btn-secondary" onClick={() => setPlaying(!playing)} disabled={gameOver}>
          {playing ? 'Pause' : 'Resume'}
        </button>
      </div>

      {gameOver && (
        <div className="game-over">
          <p>Game Over!</p>
          <p>Final Score: {score}</p>
          <button className="btn btn-primary" onClick={reset}>Play Again</button>
        </div>
      )}

      <div className="rules">
        <h2>How to Play</h2>
        <ul>
          <li>Use <strong>Arrow Keys</strong> to control the snake</li>
          <li>Collect the <strong>red food</strong> to grow and score points</li>
          <li>Avoid hitting the <strong>walls</strong> or your own <strong>tail</strong></li>
        </ul>
      </div>

      <div className="legend">
        <span><div className="head" /> Head</span>
        <span><div className="body" /> Body</span>
        <span><div className="food" /> Food</span>
      </div>
    </div>
  );
};

export default SnakeGame;