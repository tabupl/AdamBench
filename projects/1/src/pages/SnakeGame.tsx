import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

type Position = { x: number; y: number }
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150

function SnakeGame() {
  const navigate = useNavigate()
  const resetGameRef = useRef<() => void>()
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Position>({ x: 15, y: 15 })
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const generateFood = useCallback((): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [snake])

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }])
    setFood(generateFood())
    setDirection('RIGHT')
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
  }, [generateFood])

  useEffect(() => {
    resetGameRef.current = resetGame
  }, [resetGame])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') {
          resetGameRef.current?.()
        }
        return
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setDirection('UP')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setDirection('DOWN')
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setDirection('LEFT')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setDirection('RIGHT')
          break
        case 'p':
        case 'P':
        case ' ':
          setIsPaused(prev => !prev)
          break
        case 'Escape':
          navigate('/welcome')
          break
      }
    },
    [direction, gameOver, navigate]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (gameOver || isPaused) return

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] }

        switch (direction) {
          case 'UP':
            head.y -= 1
            break
          case 'DOWN':
            head.y += 1
            break
          case 'LEFT':
            head.x -= 1
            break
          case 'RIGHT':
            head.x += 1
            break
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true)
          return prevSnake
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true)
          return prevSnake
        }

        const newSnake = [head, ...prevSnake]

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => prev + 10)
          setFood(generateFood())
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }

    const gameInterval = setInterval(moveSnake, INITIAL_SPEED)
    return () => clearInterval(gameInterval)
  }, [direction, food, gameOver, isPaused, generateFood])

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/welcome')} style={styles.backButton}>
        ← Back
      </button>

      <h1 style={styles.title}>🐍 Snake Game</h1>

      <div style={styles.infoSection}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Rules</h2>
          <ul style={styles.rulesList}>
            <li>Use arrow keys or WASD to control the snake</li>
            <li>Eat the red food to grow and gain 10 points</li>
            <li>Don&apos;t hit the walls or yourself!</li>
            <li>Press Space or P to pause/resume</li>
            <li>Press Escape to quit</li>
          </ul>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Controls</h2>
          <div style={styles.controlsGrid}>
            <div style={styles.controlRow}>
              <kbd style={styles.key}>↑</kbd>
              <kbd style={styles.key}>↓</kbd>
              <kbd style={styles.key}>←</kbd>
              <kbd style={styles.key}>→</kbd>
            </div>
            <p style={styles.controlText}>Move the snake</p>

            <div style={styles.controlRow}>
              <kbd style={styles.key}>W</kbd>
              <kbd style={styles.key}>A</kbd>
              <kbd style={styles.key}>S</kbd>
              <kbd style={styles.key}>D</kbd>
            </div>
            <p style={styles.controlText}>Alternative controls</p>

            <div style={styles.controlRow}>
              <kbd style={styles.key}>Space</kbd>
            </div>
            <p style={styles.controlText}>Pause/Resume</p>

            <div style={styles.controlRow}>
              <kbd style={styles.key}>Esc</kbd>
            </div>
            <p style={styles.controlText}>Quit game</p>
          </div>
        </div>
      </div>

      <div style={styles.gameSection}>
        <div style={styles.scoreBoard}>
          <span style={styles.scoreLabel}>Score:</span>
          <span style={styles.scoreValue}>{score}</span>
        </div>

        <div style={styles.gameBoard}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE
            const y = Math.floor(index / GRID_SIZE)
            const isSnakeHead = snake[0].x === x && snake[0].y === y
            const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y)
            const isFood = food.x === x && food.y === y

            return (
              <div
                key={index}
                style={{
                  ...styles.cell,
                  backgroundColor: isSnakeHead
                    ? '#4CAF50'
                    : isSnakeBody
                    ? '#81C784'
                    : isFood
                    ? '#E53935'
                    : '#E8F5E9',
                  border: isSnakeHead ? '2px solid #2E7D32' : '1px solid #C8E6C9',
                }}
              />
            )
          })}
        </div>

        {gameOver && (
          <div style={styles.gameOverOverlay}>
            <h2 style={styles.gameOverTitle}>Game Over!</h2>
            <p style={styles.gameOverText}>Final Score: {score}</p>
            <button onClick={resetGame} style={styles.restartButton}>
              Play Again
            </button>
            <p style={styles.gameOverHint}>Or press Enter to restart</p>
          </div>
        )}

        {isPaused && !gameOver && (
          <div style={styles.pauseOverlay}>
            <h2 style={styles.pauseTitle}>Paused</h2>
            <p style={styles.pauseText}>Press Space or P to continue</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SnakeGame

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '24px',
  },
  infoSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '800px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '16px',
  },
  rulesList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#666',
    lineHeight: '1.8',
  },
  controlsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  controlRow: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },
  key: {
    padding: '6px 12px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 2px 0 #ddd',
  },
  controlText: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    margin: '0',
  },
  gameSection: {
    position: 'relative',
  },
  scoreBoard: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '12px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  scoreLabel: {
    marginRight: '8px',
  },
  scoreValue: {
    color: '#4CAF50',
  },
  gameBoard: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
    gap: '1px',
    backgroundColor: '#C8E6C9',
    border: '4px solid #81C784',
    borderRadius: '4px',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  gameOverOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  gameOverTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: '12px',
  },
  gameOverText: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '20px',
  },
  restartButton: {
    padding: '12px 32px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  gameOverHint: {
    marginTop: '12px',
    fontSize: '12px',
    color: '#999',
  },
  pauseOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  pauseTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  pauseText: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
}
