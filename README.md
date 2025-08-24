# TicTacToe Pro

A modern, responsive TicTacToe game built with React and Vite, featuring AI opponents with multiple difficulty levels and beautiful animations.

##  Features

###  Game Modes
- ** Two Players**: Play with a friend locally
- ** vs AI Bot**: Challenge AI opponents with varying difficulty levels

###  AI Difficulty Levels
- ** Easy**: Random moves - perfect for beginners
- ** Hard**: Strategic gameplay with win/block detection
- ** Advanced**: Unbeatable minimax algorithm implementation

###  Design Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Interactive Elements**: Hover effects, winning animations, and visual feedback
- **Score Tracking**: Keep track of wins and draws across multiple rounds
- **Theme Support**: Automatic dark/light theme detection

##  Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TicTacToe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to play the game!

##  How to Play

### Basic Rules
1. The game is played on a 3×3 grid
2. Players take turns placing X's and O's
3. First player to get 3 marks in a row (horizontally, vertically, or diagonally) wins
4. If all 9 squares are filled and no player has won, it's a draw

### Game Controls
- **Click** on any empty cell to make your move
- ** New Round**: Start a new game with the same settings
- ** Reset Scores**: Clear the scoreboard
- ** Back to Menu**: Return to mode selection

##  AI Implementation

### Easy Bot
- Makes completely random moves
- Great for beginners and casual play

### Hard Bot
- **Win Detection**: Takes winning moves when available
- **Block Detection**: Prevents player from winning
- **Strategic Positioning**: Prefers center and corners
- **Fallback**: Random moves when no strategy applies

### Advanced Bot
- **Minimax Algorithm**: Uses game theory for optimal play
- **Depth-based Scoring**: Prioritizes quicker wins and slower losses
- **Perfect Play**: Impossible to beat, will always win or draw
- **Efficient Pruning**: Optimized for fast decision making

##  Technical Details

### Built With
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with gradients and animations
- **ES6+** - Modern JavaScript features

### Key Components
- **Game State Management**: React hooks for state handling
- **AI Algorithms**: Minimax with alpha-beta concepts
- **Responsive Design**: CSS Grid and Flexbox
- **Animation System**: CSS animations and transitions

### Project Structure
```
TicTacToe/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── Favicon.jsx
│   ├── App.jsx          # Main game component
│   ├── App.css          # Game styling
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
└── README.md           # This file
```

##  Styling Features

### Visual Design
- **Gradient Backgrounds**: Beautiful purple-blue gradients
- **Glass Morphism**: Semi-transparent containers with blur effects
- **Smooth Animations**: Cell appearances, winning celebrations, hover effects
- **Responsive Typography**: Scalable text for all screen sizes

### Animations
- **Cell Placement**: Rotating scale animation when placing X/O
- **Winning Combination**: Pulsing glow effect for winning cells
- **Bot Thinking**: Subtle pulse animation while AI calculates
- **Hover Effects**: Lift and glow effects on interactive elements

##  Responsive Design

The game automatically adapts to different screen sizes:

- **Desktop**: Full-featured layout with side-by-side elements
- **Tablet**: Stacked layout with optimized button sizes
- **Mobile**: Compact design with touch-friendly controls

### Breakpoints
- **768px and below**: Mobile/tablet optimizations
- **480px and below**: Extra compact mobile layout

##  Game Logic

### Win Detection
```javascript
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
]
```

### Minimax Algorithm
The advanced AI uses the minimax algorithm to evaluate all possible game states and choose the optimal move. The algorithm:
1. Evaluates all possible moves recursively
2. Assumes both players play optimally
3. Scores positions based on win/loss/draw outcomes
4. Includes depth preference for faster wins

##  Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

##  Future Enhancements

### Planned Features
- ** Tournament Mode**: Multi-round competitions
- ** Statistics**: Detailed game statistics and history
- ** Sound Effects**: Audio feedback for moves and wins
- ** Online Multiplayer**: Play with friends over the internet
- ** Custom Themes**: Multiple color schemes and styles
- ** PWA Support**: Install as a mobile app

### AI Improvements
- ** Alpha-Beta Pruning**: Faster AI calculations
- ** Difficulty Customization**: Adjustable mistake rates
- ** Different AI Personalities**: Various playing styles

##  Troubleshooting

### Common Issues

**Game not loading?**
- Make sure Node.js is installed
- Run `npm install` to install dependencies
- Check that port 5173 is not in use

**Styling looks broken?**
- Clear browser cache
- Ensure all CSS files are loading properly
- Check browser console for errors

**AI not working?**
- Refresh the page
- Check browser console for JavaScript errors
- Ensure all game logic files are present

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow the existing code style
2. Test your changes thoroughly
3. Update documentation as needed
4. Ensure responsive design is maintained

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite** for the lightning-fast build tool
- **Game Theory** concepts for AI implementation
- **Modern CSS** techniques for beautiful styling

---

**Enjoy playing TicTacToe Pro! 🎮**

*Built with React and modern web technologies*
