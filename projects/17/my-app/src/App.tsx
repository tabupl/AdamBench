import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SnakeGame from './pages/SnakeGame';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SnakeGame />} />
        <Route path="/snake" element={<SnakeGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
