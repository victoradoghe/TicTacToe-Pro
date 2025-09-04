import { useState, useEffect } from 'react'
import './App.css'
import Favicon from './components/Favicon'
import LoadingScreen from './components/LoadingScreen'

// Game constants
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
]

const GAME_MODES = {
  TWO_PLAYER: 'two-player',
  VS_BOT: 'vs-bot'
}

const BOT_DIFFICULTY = {
  EASY: 'easy',
  HARD: 'hard',
  ADVANCED: 'advanced'
}

function App() {
  // Loading state
  const [isLoading, setIsLoading] = useState(true)
  
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [gameMode, setGameMode] = useState(null)
  const [botDifficulty, setBotDifficulty] = useState(BOT_DIFFICULTY.EASY)
  const [winner, setWinner] = useState(null)
  const [isDraw, setIsDraw] = useState(false)
  const [gameActive, setGameActive] = useState(false)
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })
  const [isThinking, setIsThinking] = useState(false)

  // Check for winner
  const checkWinner = (board) => {
    for (let combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], combination }
      }
    }
    return null
  }

  // Check for draw
  const checkDraw = (board) => {
    return board.every(cell => cell !== null) && !checkWinner(board)
  }

  // Handle cell click
  const handleCellClick = (index) => {
    if (board[index] || winner || isDraw || isThinking) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const gameResult = checkWinner(newBoard)
    if (gameResult) {
      setWinner(gameResult)
      setGameActive(false)
      setScores(prev => ({ ...prev, [gameResult.winner]: prev[gameResult.winner] + 1 }))
    } else if (checkDraw(newBoard)) {
      setIsDraw(true)
      setGameActive(false)
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }

  // Bot AI implementation
  const makeBotMove = (board, difficulty) => {
    const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null)
    
    if (availableMoves.length === 0) return

    let move
    switch (difficulty) {
      case BOT_DIFFICULTY.EASY:
        move = getRandomMove(availableMoves)
        break
      case BOT_DIFFICULTY.HARD:
        move = getStrategicMove(board, availableMoves)
        break
      case BOT_DIFFICULTY.ADVANCED:
        move = getMinimaxMove(board)
        break
      default:
        move = getRandomMove(availableMoves)
    }

    return move
  }

  // Easy bot - random moves
  const getRandomMove = (availableMoves) => {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)]
  }

  // Hard bot - strategic moves
  const getStrategicMove = (board, availableMoves) => {
    // First, check if bot can win
    for (let move of availableMoves) {
      const testBoard = [...board]
      testBoard[move] = 'O'
      if (checkWinner(testBoard)) {
        return move
      }
    }

    // Then, check if bot needs to block player from winning
    for (let move of availableMoves) {
      const testBoard = [...board]
      testBoard[move] = 'X'
      if (checkWinner(testBoard)) {
        return move
      }
    }

    // Take center if available
    if (availableMoves.includes(4)) {
      return 4
    }

    // Take corners
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter(corner => availableMoves.includes(corner))
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)]
    }

    // Otherwise, random move
    return getRandomMove(availableMoves)
  }

  // Advanced bot - minimax algorithm
  const getMinimaxMove = (board) => {
    const minimax = (board, depth, isMaximizing) => {
      const result = checkWinner(board)
      
      if (result) {
        return result.winner === 'O' ? 10 - depth : depth - 10
      }
      
      if (checkDraw(board)) {
        return 0
      }

      if (isMaximizing) {
        let bestScore = -Infinity
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = 'O'
            const score = minimax(board, depth + 1, false)
            board[i] = null
            bestScore = Math.max(score, bestScore)
          }
        }
        return bestScore
      } else {
        let bestScore = Infinity
        for (let i = 0; i < 9; i++) {
          if (board[i] === null) {
            board[i] = 'X'
            const score = minimax(board, depth + 1, true)
            board[i] = null
            bestScore = Math.min(score, bestScore)
          }
        }
        return bestScore
      }
    }

    let bestMove = -1
    let bestScore = -Infinity
    
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O'
        const score = minimax(board, 0, false)
        board[i] = null
        if (score > bestScore) {
          bestScore = score
          bestMove = i
        }
      }
    }
    
    return bestMove
  }

  // Bot move effect
  useEffect(() => {
    if (gameMode === GAME_MODES.VS_BOT && currentPlayer === 'O' && !winner && !isDraw && gameActive) {
      setIsThinking(true)
      const timeout = setTimeout(() => {
        const botMove = makeBotMove(board, botDifficulty)
        if (botMove !== undefined) {
          const newBoard = [...board]
          newBoard[botMove] = 'O'
          setBoard(newBoard)

          const gameResult = checkWinner(newBoard)
          if (gameResult) {
            setWinner(gameResult)
            setGameActive(false)
            setScores(prev => ({ ...prev, [gameResult.winner]: prev[gameResult.winner] + 1 }))
          } else if (checkDraw(newBoard)) {
            setIsDraw(true)
            setGameActive(false)
            setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
          } else {
            setCurrentPlayer('X')
          }
        }
        setIsThinking(false)
      }, 500 + Math.random() * 1000) // Random delay to make bot seem more human

      return () => clearTimeout(timeout)
    }
  }, [currentPlayer, gameMode, board, winner, isDraw, gameActive, botDifficulty])

  // Start new game
  const startNewGame = (mode, difficulty = BOT_DIFFICULTY.EASY) => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setGameMode(mode)
    setBotDifficulty(difficulty)
    setWinner(null)
    setIsDraw(false)
    setGameActive(true)
    setIsThinking(false)
  }

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setWinner(null)
    setIsDraw(false)
    setGameActive(true)
    setIsThinking(false)
  }

  // Reset scores
  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 })
  }

  // Go back to menu
  const goBackToMenu = () => {
    setGameMode(null)
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setWinner(null)
    setIsDraw(false)
    setGameActive(false)
    setIsThinking(false)
  }

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  // Show loading screen if still loading
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <>
      <Favicon />
      <div className="app">
        <div className="container">
          <h1 className="title">TicTacToe Pro</h1>
        
        {!gameMode ? (
          <div className="menu">
            <h2>Choose Game Mode</h2>
            <div className="menu-buttons">
              <button 
                className="mode-button" 
                onClick={() => startNewGame(GAME_MODES.TWO_PLAYER)}
              >
                👥 Two Players
              </button>
              <div className="bot-mode">
                <h3>🤖 Play vs Bot</h3>
                <div className="difficulty-buttons">
                  <button 
                    className="difficulty-button easy" 
                    onClick={() => startNewGame(GAME_MODES.VS_BOT, BOT_DIFFICULTY.EASY)}
                  >
                    😊 Easy
                  </button>
                  <button 
                    className="difficulty-button hard" 
                    onClick={() => startNewGame(GAME_MODES.VS_BOT, BOT_DIFFICULTY.HARD)}
                  >
                    🧠 Hard
                  </button>
                  <button 
                    className="difficulty-button advanced" 
                    onClick={() => startNewGame(GAME_MODES.VS_BOT, BOT_DIFFICULTY.ADVANCED)}
                  >
                    🚀 Advanced
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="game">
            <div className="game-header">
              <div className="game-info">
                <h2>
                  {gameMode === GAME_MODES.TWO_PLAYER ? '👥 Two Players' : `🤖 vs Bot (${botDifficulty})`}
                </h2>
                <div className="current-player">
                  {winner ? (
                    <span className={`winner winner-${winner.winner.toLowerCase()}`}>
                      🎉 Player {winner.winner} Wins!
                    </span>
                  ) : isDraw ? (
                    <span className="draw">🤝 It's a Draw!</span>
                  ) : isThinking ? (
                    <span className="thinking">🤔 Bot is thinking...</span>
                  ) : (
                    <span className={`current current-${currentPlayer.toLowerCase()}`}>
                      Player {currentPlayer}'s turn
                    </span>
                  )}
                </div>
              </div>
              
              <div className="scoreboard">
                <div className="score">
                  <span className="score-label">Player X</span>
                  <span className="score-value">{scores.X}</span>
                </div>
                <div className="score">
                  <span className="score-label">Player O</span>
                  <span className="score-value">{scores.O}</span>
                </div>
                <div className="score">
                  <span className="score-label">Draws</span>
                  <span className="score-value">{scores.draws}</span>
                </div>
              </div>
            </div>

            <div className="board">
              {board.map((cell, index) => (
                <button
                  key={index}
                  className={`cell ${
                    cell ? `cell-${cell.toLowerCase()}` : ''
                  } ${
                    winner && winner.combination.includes(index) ? 'winning-cell' : ''
                  }`}
                  onClick={() => handleCellClick(index)}
                  disabled={!!cell || !!winner || isDraw || isThinking}
                >
                  {cell}
                </button>
              ))}
            </div>

            <div className="game-controls">
              <button className="control-button reset" onClick={resetGame}>
                🔄 New Round
              </button>
              <button className="control-button clear-scores" onClick={resetScores}>
                🗑️ Reset Scores
              </button>
              <button className="control-button menu" onClick={goBackToMenu}>
                📋 Back to Menu
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  )
}

export default App