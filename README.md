FarQuest 🎮⚡
An immersive blockchain-powered quiz adventure game built on the Celo network. Test your knowledge, collect crystals, level up, and receive Celo rewards in this engaging Web3 gaming experience.
🌟 Features

Interactive Quiz Gameplay: Answer questions across multiple difficulty levels
Blockchain Integration: Built on Celo network with smart contract rewards
Celo Rewards:Receive Celo based on your performance
Real-time Progress Tracking: Persistent game state with health, experience, and crystals
3D Immersive Experience: Enhanced with Three.js animations and effects
Responsive Design: Beautiful UI with Tailwind CSS and Framer Motion animations
Web3 Wallet Integration: Seamless wallet connection with automatic chain switching

🛠️ Tech Stack
Frontend

Next.js - React framework for production
TypeScript - Type-safe development
Tailwind CSS - Utility-first CSS framework
Three.js - 3D graphics and animations
Framer Motion - Smooth animations and transitions

Blockchain & Web3

Wagmi - React hooks for Ethereum
Viem - TypeScript interface for Ethereum
Dynamic - Web3 wallet connection and management
Solidity - Smart contracts for reward claiming
Celo Network - Layer-1 blockchain platform

Backend & Database

Convex - Real-time backend with database
Sonner - Toast notifications

🚀 Getting Started
Prerequisites

Node.js 18+ and npm/yarn
Git
A Web3 wallet (MetaMask, WalletConnect, etc.)

Installation

Clone the repository
bashgit clone git@github.com:numdinkushi/FarQuest.git

cd farquest

Install dependencies
bashnpm install
# or
yarn install

Environment Setup
Create a .env.local file in the root directory:
env# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
CONVEX_DEPLOY_KEY=your_convex_deploy_key

# Dynamic Wallet
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id

# Game Configuration
NEXT_PUBLIC_FARQUEST_CONTRACT_ADDRESS=your_contract_address
CLAIM_SECRET=your_claim_secret
SCALE_FACTOR=1000

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=42220

Set up Convex Database
bashnpx convex dev

Run the development server
bashnpm run dev
# or
yarn dev

Open your browser
Navigate to http://localhost:3000

🎯 How to Play

Connect Your Wallet: Click "Connect Wallet" and select your preferred Web3 wallet
Create Your Profile: Set up your username to start playing
Start the Game: Begin your quiz adventure across multiple difficulty levels
Answer Questions: Test your knowledge and earn crystals and experience
Maintain Health: Answer correctly to avoid losing health points
Level Up: Progress through increasingly challenging questions
Claim Rewards: Receive Celo based on your performance

🏗️ Project Structure
farquest/
├── components/           # React components
├── hooks/               # Custom React hooks
│   ├── use-wallet.ts    # Wallet connection logic
│   ├── use-game-state.ts # Game state management
│   ├── use-player-stats.ts # Player statistics
│   └── use-game-logic.ts # Main game logic
├── lib/                 # Utility functions and configurations
├── constants/           # Game constants and configurations
├── convex/             # Convex backend functions
├── contracts/          # Solidity smart contracts
├── public/             # Static assets
└── pages/              # Next.js pages
🔧 Key Components
Game Logic Hook (useGameLogic)
The central hook that orchestrates all game functionality:

Wallet Management: Connection, disconnection, and network validation
Game State: Start, pause, resume, and complete games
Question Handling: Process answers and calculate rewards
Blockchain Integration: Claim Celo rewards
Data Persistence: Save and restore game progress

Smart Contract Integration

Reward Claiming: Celo Rewards based on performance
Gas Optimization: Efficient transaction handling
Error Recovery: Robust error handling for blockchain operations

🎮 Game Mechanics

Health System: Start with full health, lose 20 HP for wrong answers
Experience Points: Gain XP for correct answers
Crystal Collection: Earn crystals to claim more celo reward
Consecutive Bonuses: Every 10 correct answers triggers health bonuses
Difficulty Progression: Questions get harder as you advance
Timer Challenges: Answer within the time limit or lose health

🌐 Deployment
Frontend Deployment (Vercel)
bashnpm run build
npx vercel --prod
Convex Backend Deployment
bashnpx convex deploy
Smart Contract Deployment
bashnpx hardhat deploy --network celo
🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📋 Development Guidelines

Follow TypeScript best practices
Use conventional commit messages
Ensure all tests pass before submitting PR
Update documentation for new features
Maintain consistent code formatting

🐛 Troubleshooting
Common Issues
Wallet Connection Issues

Ensure you're on the Celo network (Chain ID: 42220)
Clear browser cache and try reconnecting
Check if your wallet supports Celo network

Game State Not Saving

Verify Convex connection in network tab
Check if wallet is properly connected
Ensure user profile is created before playing

Transaction Failures

Check if you have sufficient CELO for gas fees
Verify contract address is correct
Ensure you're on the correct network

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
🎉 Acknowledgments

Built with ❤️ for the Web3 gaming community
Special thanks to the Celo ecosystem
Inspired by classic quiz games with modern blockchain twist

📞 Support

Create an issue for bug reports
Join our Discord community for discussions
Follow us on Twitter for updates


Happy Gaming! 🎮✨
Ready to embark on your FarQuest adventure? Connect your wallet and start your journey!