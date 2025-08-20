# Shape-Color Multiplayer Game

A real-time multiplayer puzzle game where players click on grid cells to change their shapes and colors while avoiding conflicts with adjacent cells. The goal is to maximize your score while managing cooldowns and strategic placement.

## 🎮 What This Game Is About

This is a strategic puzzle game played on a 3x6 grid where:
- Each cell contains a shape (triangle, square, diamond, circle) with a color (red, green, blue, yellow)
- Players click cells to change them, but the new shape/color must be different from all adjacent cells
- After clicking, cells enter a 3-turn cooldown period where they can't be modified
- The game ends when no valid moves are available
- Players compete for high scores on a shared leaderboard

## 📁 Folder Structure

```
SF-Multiplayer-finish/
├── BE/                          # Backend (NestJS)
│   ├── src/
│   │   ├── game/               # Game logic and WebSocket handling
│   │   │   ├── game.gateway.ts  # Socket.IO WebSocket gateway
│   │   │   ├── game.service.ts  # Core game logic and state management
│   │   │   ├── game.store.ts    # Game state storage
│   │   │   ├── game.types.ts    # Game-specific type definitions
│   │   │   └── mutex.util.ts    # Thread-safe move processing
│   │   ├── leaderboard/        # Leaderboard functionality
│   │   │   ├── leaderboard.controller.ts  # REST API endpoints
│   │   │   └── leaderboard.service.ts     # Score management
│   │   └── main.ts             # Application entry point
│   ├── dist/                   # Compiled output
│   └── package.json
├── FE/                         # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── GameBoard.tsx   # Main game grid component
│   │   │   ├── GameCell.tsx    # Individual cell component
│   │   │   ├── GameOverModal.tsx        # Game over dialog
│   │   │   ├── LeaderboardModal.tsx     # Leaderboard display
│   │   │   └── ShapeComponent.tsx       # SVG shape renderer
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useGameState.ts # Game state management
│   │   │   └── useSocket.ts    # WebSocket connection
│   │   ├── pages/game/        # Page components
│   │   ├── assets/icons/      # SVG shape files
│   │   ├── api/              # HTTP API calls
│   │   ├── constants/        # Frontend constants
│   │   ├── types/           # TypeScript definitions
│   │   └── utils/           # Utility functions
│   └── package.json
└── shared/                   # Shared types and constants
    ├── types.ts             # Common TypeScript interfaces
    ├── constants.ts         # Game constants (grid size, shapes, etc.)
    └── DTOs.ts             # Data transfer objects
```

## 🔧 Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **Socket.IO** - Real-time bidirectional communication
- **TypeScript** - Type-safe JavaScript
- **Class Validator** - Request validation
- **Helmet** - Security middleware
- **UUID** - Unique identifier generation

### Frontend
- **React 19** - UI library with latest features
- **Vite** - Fast build tool and dev server
- **Material-UI (MUI)** - Component library and theming
- **Socket.IO Client** - WebSocket client
- **TanStack React Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **SVGR** - SVG as React components

### Development Tools
- **TypeScript** - Type safety across the stack
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Core Features

### Game Mechanics
- **Real-time Multiplayer**: Multiple players can interact with the same game board simultaneously
- **Grid-based Gameplay**: 3x6 grid (18 cells total) with shape-color combinations
- **Constraint-based Rules**: New shapes/colors must differ from adjacent cells
- **Cooldown System**: Clicked cells are locked for 3 turns
- **Score System**: Points awarded for each successful move
- **Game Over Detection**: Automatic detection when no valid moves remain

### Real-time Features
- **Live Game State Synchronization**: All players see updates instantly
- **WebSocket Communication**: Bidirectional real-time data flow
- **Optimistic Updates**: Responsive UI with error handling
- **Connection Status**: Visual feedback for network state

### Leaderboard System
- **Top 10 Scores**: Persistent high score tracking
- **Score Submission**: Players can submit their final scores with nicknames
- **Real-time Updates**: Leaderboard refreshes automatically

## 🎯 Example Game Flow

1. **Game Start**: Players connect and see a randomly generated 3x6 grid
2. **Making Moves**: Click any cell to change its shape and color (must be different from adjacent cells)
3. **Cooldown Management**: Clicked cells show cooldown indicators (3 turns)
4. **Strategic Play**: Plan moves considering cooldowns and available adjacent options
5. **Game Over**: When no valid moves remain, final score is calculated
6. **Leaderboard**: Submit score with nickname to compete globally

## 🏗️ Architecture Highlights

- **Shared Type System**: Common TypeScript definitions across frontend/backend
- **Thread-safe Game Logic**: Mutex-protected move processing prevents race conditions
- **Component-based UI**: Modular React components with Material-UI theming
- **Real-time State Management**: WebSocket-driven state synchronization
- **RESTful API**: HTTP endpoints for leaderboard operations
- **Error Boundary Support**: Robust error handling throughout the application

## 🔒 Security & Performance

- **Input Validation**: Server-side validation using class-validator
- **Rate Limiting**: Throttling protection for API endpoints
- **Secure Headers**: Helmet middleware for security headers
- **Optimized Builds**: Vite for fast development and production builds
- **Type Safety**: Full TypeScript coverage for runtime error prevention