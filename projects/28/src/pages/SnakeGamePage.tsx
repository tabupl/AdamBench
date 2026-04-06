import { useState, useEffect, useRef } from "react";

const SIZE = 20;
const CELL = 15;

function SnakePage() {
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [pause, setPause] = useState(false);
  const [start, setStart] = useState(false);
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [food] = useState({ x: 10, y: 10 });

  const snakeRef = useRef(snake);
  const dirRef = useRef(dir);
  const runningRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { dirRef.current = dir; }, [dir]);

  const tick = () => {
    if (!runningRef.current || over || pause) return;
    
    const head = { x: snakeRef.current[0].x + dirRef.current.x, y: snakeRef.current[0].y + dirRef.current.y };
    
    if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE) {
      setOver(true);
      runningRef.current = false;
      return;
    }
    
    if (snakeRef.current.some((s, i) => i < snakeRef.current.length - 1 && s.x === head.x && s.y === head.y)) {
      setOver(true);
      runningRef.current = false;
      return;
    }
    
    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 10);
    }
    
    if (head.x === food.x && head.y === food.y) {
      setSnake([head, ...snakeRef.current]);
    } else {
      setSnake([...snakeRef.current.slice(0, -1), head]);
    }
    
    timeoutRef.current = window.setTimeout(tick, 150);
  };

  useEffect(() => {
    if (start && !over && !pause) {
      runningRef.current = true;
      timeoutRef.current = window.setTimeout(tick, 150);
    } else if (runningRef.current) {
      runningRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
    return () => { 
      runningRef.current = false; 
      if (timeoutRef.current) clearTimeout(timeoutRef.current); 
    };
  }, [start, over, pause]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (!pause && !over) {
        if (e.key === "ArrowUp" && dir.y !== 1) setDir({ x: 0, y: -1 });
        else if (e.key === "ArrowDown" && dir.y !== -1) setDir({ x: 0, y: 1 });
        else if (e.key === "ArrowLeft" && dir.x !== 1) setDir({ x: -1, y: 0 });
        else if (e.key === "ArrowRight" && dir.x !== -1) setDir({ x: 1, y: 0 });
        else if (e.key === " ") setPause(p => !p);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [pause, over, dir]);

  const reset = () => { 
    setStart(false); setOver(false); setScore(0); 
    setSnake([{ x: 5, y: 5 }]); 
    setDir({ x: 1, y: 0 }); 
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  return (
    <div>
      <h1>Snake</h1>
      {(!start && !over) && <button onClick={() => setStart(true)}>Start</button>}
      {(start || over) && (
        <>
          <div>Score: {score}</div>
          <button onClick={() => setPause(p => !p)} disabled={over && !start}>{pause ? "Resume" : "Pause"}</button>
          <button onClick={reset}>Restart</button>
        </>
      )}
      {over && <div style={{ background: "#ef4444", color: "#fff", padding: "1rem", borderRadius: "8px", fontWeight: 600 }}>Game Over! Score: {score}</div>}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${SIZE}, ${CELL}px)`, gap: "1px", background: "#334155", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const row = Math.floor(i / SIZE);
          const col = i % SIZE;
          const isHead = snake[0].x === col && snake[0].y === row;
          const isSnake = snake.some(s => s.x === col && s.y === row);
          const f = food.x === col && food.y === row;
          return <div key={i} style={{ width: CELL, height: CELL, background: isHead ? "#6366f1" : isSnake ? "#4f46e5" : f ? "#ef4444" : "#1e293b", borderRadius: isHead ? "3px" : "2px" }} />;
        })}
      </div>
      <div style={{ background: "#1e293b", padding: "1rem", borderRadius: "8px" }}>
        <h2>Rules</h2>
        <p><strong>Goal:</strong> Eat red food to score +10 points!</p>
        <p><strong>Controls:</strong> Arrow Keys or WASD to move, Space to pause</p>
        <p><strong>Game Over:</strong> Don't hit walls or yourself!</p>
      </div>
    </div>
  );
}

export default SnakePage;
