import React, { useState, useEffect, useRef, useCallback } from 'react'

const GRID_SIZE = 20
const INITIAL_SPEED = 150

type Point = { x: number; y: number }
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

const SnakeGamePage: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Point>({ x: 15, y: 15 })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(INITIAL_SPEED)

  const directionRef = useRef<Direction>('RIGHT')
  const directionDisplayRef = useRef<Direction>('RIGHT')
  const gameLoopRef = useRef<number>()

  const generateFood = useCallback((): Point => {
    let newFood: Point
    let isOnSnake: boolean
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
      isOnSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    } while (isOnSnake)
    return newFood
  }, [snake])

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood(generateFood())
    directionDisplayRef.current = 'RIGHT'
    directionRef.current = 'RIGHT'
    setGameOver(false)
    setScore(0)
    setSpeed(INITIAL_SPEED)
    setIsPlaying(true)
  }

  const gameOverEffect = () => {
    setGameOver(true)
    setIsPlaying(false)
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }
  }

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0]
      const newHead = { ...head }

      switch (directionRef.current) {
        case 'UP':
          newHead.y -= 1
          break
        case 'DOWN':
          newHead.y += 1
          break
        case 'LEFT':
          newHead.x -= 1
          break
        case 'RIGHT':
          newHead.x += 1
          break
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        gameOverEffect()
        return prevSnake
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOverEffect()
        return prevSnake
      }

      const newSnake = [newHead, ...prevSnake]

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 1)
        setFood(generateFood())
        // Increase speed slightly every 5 points
        if ((score + 1) % 5 === 0 && speed > 50) {
          setSpeed((s) => s - 5)
        }
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [food, generateFood, score, speed])

  useEffect(() => {
    if (isPlaying && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, speed)
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [isPlaying, gameOver, moveSnake, speed])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') directionRef.current = 'UP'
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') directionRef.current = 'DOWN'
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT'
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT'
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, gameOver])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Snake Game</h1>
          <p className="text-gray-600">A classic snake game built with React</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Board */}
          <div className="flex flex-col items-center">
            <div
              className="bg-gray-900 rounded-lg p-4 shadow-xl"
              style={{ width: 'fit-content' }}
            >
              <div
                className="grid gap-px bg-gray-800"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 24px)`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, 24px)`,
                }}
              >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                  const x = i % GRID_SIZE
                  const y = Math.floor(i / GRID_SIZE)

                  const isSnakeHead = snake[0].x === x && snake[0].y === y
                  const isSnakeBody = snake.some((s) => s.x === x && s.y === y && s !== snake[0])
                  const isFood = food.x === x && food.y === y

                  return (
                    <div
                      key={i}
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: isSnakeHead
                          ? '#22c55e'
                          : isSnakeBody
                          ? '#86efac'
                          : isFood
                          ? '#ef4444'
                          : '#374151',
                      }}
                    />
                  )
                })}
              </div>
            </div>

            {!isPlaying && !gameOver && (
              <button
                onClick={resetGame}
                className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Game
              </button>
            )}

            {gameOver && (
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Game Over!</h2>
                <p className="text-gray-700 mb-4">Final Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>

          {/* Rules and Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Play</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Objective</h3>
                <p className="text-gray-600 text-sm">
                  Guide the snake to eat the red food blocks. Each food block increases your
                  score and makes the snake longer. Avoid hitting the walls or your own tail.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Controls</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gray-100 rounded border text-xs font-mono">W</span>
                    <span>or</span>
                    <span className="px-2 py-1 bg-gray-100 rounded border text-xs font-mono">↑</span>
                    <span>Move Up</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gray-100 rounded border text-xs font-mono">S</span>
                    <span>or</span>
                    <span className="px-2 py-1 bg-gray-100 rounded border text-xs font-mono">↓</span>
                    <span>Move Down</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gray-100 rounded border text-xs font-mono">A</span>
                    <span>or</span>
                    <span className="px-2 py-1 bg-gray-100 rounded border text-xs font-mono">←</span>
                    <span>Move Left</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gray-100 rounded border text-xs font-mono">D</span>
                    <span>or</span>
                    <span className="px-2 py-1 bg-gray-100 rounded border text-xs font-mono">→</span>
                    <span>Move Right</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Scoring</h3>
                <p className="text-gray-600 text-sm">
                  +1 point for each food block eaten. The game speeds up slightly every 5 points.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Current Score</span>
                  <span className="text-2xl font-bold text-blue-600">{score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SnakeGamePage
