import React from 'react';
import SnakeGame from '../components/SnakeGame';
import '../styles/SnakeGamePage.css';

const SnakeGamePage: React.FC = () => {
  return (
    <div className="snake-game-page">
      <div className="snake-game-container">
        <SnakeGame />
      </div>
    </div>
  );
};

export default SnakeGamePage;