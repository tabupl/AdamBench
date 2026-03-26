import { useState, useEffect, useRef } from 'react';

const GRID_SIZE = 10;
const CELL_EMPTY = '⬛';
const CELL_SNAKE = '🟩';
const CELL_FOOD = '🟥';

interface Point {x:number; y:number;}

const randomFood = (snake:Point[]):Point => {
  const empty:Point[]=[];
  for(let y=0;y<GRID_SIZE;y++){
    for(let x=0;x<GRID_SIZE;x++){
      if(!snake.some(p=>p.x===x&&p.y===y)) empty.push({x,y});
    }
  }
  return empty[Math.floor(Math.random()*empty.length)]
}

const SnakeGame = () => {
  const [snake,setSnake]=useState<Point[]>([{x:5,y:5}]);
  const [dir,setDir]=useState<Point>({x:1,y:0});
  const [food,setFood]=useState<Point>(randomFood(snake));
  const [gameOver,setGameOver]=useState(false);
  const [score,setScore]=useState(0);
  const timerRef=useRef<number>();

  const move = () => {
    if(gameOver) return;
    const newHead={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
    // wrap around
    newHead.x=(newHead.x+GRID_SIZE)%GRID_SIZE;
    newHead.y=(newHead.y+GRID_SIZE)%GRID_SIZE;
    if(snake.some(p=>p.x===newHead.x&&p.y===newHead.y)){
      setGameOver(true);return;
    }
    const newSnake=[newHead,...snake];
    if(newHead.x===food.x&&newHead.y===food.y){
      setScore(score+1);
      setFood(randomFood(newSnake));
    }else{
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  useEffect(()=>{
    timerRef.current=window.setInterval(move,200);
    const handler=(e:KeyboardEvent)=>{
      if(e.key==='ArrowUp') setDir({x:0,y:-1});
      if(e.key==='ArrowDown') setDir({x:0,y:1});
      if(e.key==='ArrowLeft') setDir({x:-1,y:0});
      if(e.key==='ArrowRight') setDir({x:1,y:0});
    };
    window.addEventListener('keydown',handler);
    return ()=>{window.clearInterval(timerRef.current!);window.removeEventListener('keydown',handler);}  
  },[snake,dir,food,gameOver]);

  const renderGrid = () => {
    const grid=[];
    for(let y=0;y<GRID_SIZE;y++){
      const row=[];
      for(let x=0;x<GRID_SIZE;x++){
        let cell=CELL_EMPTY;
        if(snake.some(p=>p.x===x&&p.y===y)) cell=CELL_SNAKE;
        else if(food.x===x&&food.y===y) cell=CELL_FOOD;
        row.push(<span key={x}>{cell}</span>);
      }
      grid.push(<div key={y} style={{fontSize:'2rem'}}>{row}</div>);
    }
    return grid;
  };

  return (
    <div style={{maxWidth:400,margin:'auto',padding:20,textAlign:'center'}}>
      <h2>Snake Game</h2>
      <p>Use arrow keys to move. Eat the red squares to grow.</p>
      <p>Score: {score}</p>
      {gameOver? <p>Game Over! Press Refresh to play again.</p> : renderGrid()}
    </div>
  );
};

export default SnakeGame;
