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
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" viewBox="0 0 20 20" style={{verticalAlign: 'middle', marginRight: 8}}>
                    <g fill="none">
                      <path fill="url(#SVGUOxJqe7I)" d="M10.25 17.998c2.616-.033 4.195-.595 5.122-1.44c.875-.8 1.089-1.777 1.123-2.556h.005v-.69a1.81 1.81 0 0 0-1.81-1.809H11.5V11.5h-3v.003H5.31c-1 0-1.81.81-1.81 1.81v.689h.005c.034.78.248 1.757 1.123 2.555c.927.846 2.506 1.408 5.122 1.441V18h.5z"></path>
                      <path fill="url(#SVGxQ4fKeON)" d="M10.25 17.998c2.616-.033 4.195-.595 5.122-1.44c.875-.8 1.089-1.777 1.123-2.556h.005v-.69a1.81 1.81 0 0 0-1.81-1.809H11.5V11.5h-3v.003H5.31c-1 0-1.81.81-1.81 1.81v.689h.005c.034.78.248 1.757 1.123 2.555c.927.846 2.506 1.408 5.122 1.441V18h.5z"></path>
                      <path fill="url(#SVGbzhGAd0I)" d="M10.5 2.5a.5.5 0 0 0-1 0v1h1z"></path>
                      <path fill="url(#SVGmMrXkefk)" d="M5 4.5A1.5 1.5 0 0 1 6.5 3h7A1.5 1.5 0 0 1 15 4.5v4a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 5 8.5z"></path>
                      <path fill="url(#SVGspsrdbyg)" d="M12 5.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2"></path>
                      <path fill="url(#SVGnjJdNeec)" d="M7 6.5a1 1 0 1 1 2 0a1 1 0 0 1-2 0"></path>
                      <defs>
                        <linearGradient id="SVGxQ4fKeON" x1={10} x2={12.941} y1={10.726} y2={21.714} gradientUnits="userSpaceOnUse">
                          <stop stopColor="#885edb" stopOpacity={0}></stop>
                          <stop offset={1} stopColor="#e362f8"></stop>
                        </linearGradient>
                        <linearGradient id="SVGbzhGAd0I" x1={9.477} x2={10.532} y1={2} y2={3.229} gradientUnits="userSpaceOnUse">
                          <stop stopColor="#8b52f4"></stop>
                          <stop offset={1} stopColor="#3d35b1"></stop>
                        </linearGradient>
                        <linearGradient id="SVGspsrdbyg" x1={11.474} x2={12.99} y1={5.577} y2={8.193} gradientUnits="userSpaceOnUse">
                          <stop stopColor="#fdfdfd"></stop>
                          <stop offset={1} stopColor="#f9dcfa"></stop>
                        </linearGradient>
                        <linearGradient id="SVGnjJdNeec" x1={7.474} x2={8.99} y1={5.577} y2={8.193} gradientUnits="userSpaceOnUse">
                          <stop stopColor="#fdfdfd"></stop>
                          <stop offset={1} stopColor="#f9dcfa"></stop>
                        </linearGradient>
                        <radialGradient id="SVGUOxJqe7I" cx={0} cy={0} r={1} gradientTransform="matrix(15.59372 9.14999 -14.57328 24.83628 .5 9.5)" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#f08af4"></stop>
                          <stop offset={0.535} stopColor="#9c6cfe"></stop>
                          <stop offset={1} stopColor="#4e44db"></stop>
                        </radialGradient>
                        <radialGradient id="SVGmMrXkefk" cx={0} cy={0} r={1} gradientTransform="rotate(39.055 .75 2.115)scale(16.9824 32.4423)" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#f08af4"></stop>
                          <stop offset={0.535} stopColor="#9c6cfe"></stop>
                          <stop offset={1} stopColor="#4e44db"></stop>
                        </radialGradient>
                      </defs>
                    </g>
                  </svg>
                  Play vs Bot
                </h3>
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