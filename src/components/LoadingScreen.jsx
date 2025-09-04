import { useState, useEffect } from 'react'
import './LoadingScreen.css'

const LoadingScreen = ({ onLoadingComplete }) => {
  const [loadingText, setLoadingText] = useState('Loading TicTacToe Pro')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          setTimeout(() => {
            onLoadingComplete()
          }, 500) // Small delay before transitioning
          return 100
        }
        return newProgress
      })
    }, 100)

    // Loading text animation
    const textStates = [
      'Loading TicTacToe Pro',
      'Loading TicTacToe Pro.',
      'Loading TicTacToe Pro..',
      'Loading TicTacToe Pro...',
      'Initializing Game Board',
      'Initializing Game Board.',
      'Initializing Game Board..',
      'Initializing Game Board...',
      'Starting AI Engine',
      'Starting AI Engine.',
      'Starting AI Engine..',
      'Starting AI Engine...',
      'Ready to Play!',
    ]

    let textIndex = 0
    const textInterval = setInterval(() => {
      setLoadingText(textStates[textIndex])
      textIndex = (textIndex + 1) % textStates.length
    }, 400)

    return () => {
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [onLoadingComplete])

  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* Animated TicTacToe Grid */}
        <div className="loading-grid">
          <div className="grid-cell">
            <span className="animated-x">X</span>
          </div>
          <div className="grid-cell">
            <span className="animated-o">O</span>
          </div>
          <div className="grid-cell">
            <span className="animated-x delay-1">X</span>
          </div>
          <div className="grid-cell">
            <span className="animated-o delay-2">O</span>
          </div>
          <div className="grid-cell center-cell">
            <div className="loading-spinner"></div>
          </div>
          <div className="grid-cell">
            <span className="animated-x delay-3">X</span>
          </div>
          <div className="grid-cell">
            <span className="animated-o delay-4">O</span>
          </div>
          <div className="grid-cell">
            <span className="animated-x delay-5">X</span>
          </div>
          <div className="grid-cell">
            <span className="animated-o delay-6">O</span>
          </div>
        </div>

        {/* Game Title */}
        <h1 className="loading-title">TicTacToe Pro</h1>
        
        {/* Loading Text */}
        <p className="loading-text">{loadingText}</p>
        
        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        
        {/* Progress Percentage */}
        <div className="progress-percentage">{Math.round(progress)}%</div>

        {/* Floating X and O elements */}
        <div className="floating-elements">
          <span className="floating-x float-1">X</span>
          <span className="floating-o float-2">O</span>
          <span className="floating-x float-3">X</span>
          <span className="floating-o float-4">O</span>
          <span className="floating-x float-5">X</span>
          <span className="floating-o float-6">O</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
