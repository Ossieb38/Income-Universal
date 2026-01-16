# IncomeOS Universal - Free Edition

## Overview

IncomeOS is a Progressive Web Application (PWA) that aggregates earnings from multiple passive income platforms (Honeygain, Sahara, Synesis, etc.) and provides blockchain-based task verification and payment processing. The application enables users to earn globally and cash out anywhere with zero upfront cost.

The system combines a static frontend PWA with Ethereum smart contracts deployed on Polygon (Amoy testnet) for trustless task submission and reward distribution.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Type**: Progressive Web Application (PWA)
- **Serving**: Static files served via Python's http.server on port 3000
- **Location**: All frontend code lives in `/public/` directory
- **Key Components**:
  - `index.html` - Main entry point with dashboard UI
  - `js/app.js` - Core application logic (IncomeOS class) handling earnings tracking and platform synchronization
  - `js/web3.js` - Web3Manager class for MetaMask wallet connection and smart contract interaction
  - `sw.js` - Service worker for offline caching and background sync
  - `manifest.json` - PWA manifest for installability

### Blockchain Architecture
- **Framework**: Hardhat for smart contract development and deployment
- **Network**: Polygon Amoy testnet (chainId: 80002)
- **Contract**: AutoTaskExecutor (source in `/contracts/`, compiled to `/artifacts/`)
- **Web3 Library**: ethers.js v5.7.2 for frontend-to-blockchain communication

### Data Storage
- **Client-side**: localStorage for caching earnings data between sessions
- **Blockchain**: Smart contract stores task submissions and proofs on-chain
- **No traditional database** - the app is designed to be serverless

### State Management
- Earnings state managed in IncomeOS class with automatic 5-second sync intervals
- Platform earnings tracked per-service (honeygain, sahara, synesis, pawnos, grass, swagbucks, surveyjunkie, brandaid, opinioninn)
- Cached to localStorage for persistence

### Deployment Flow
1. Compile contracts: `npx hardhat compile`
2. Deploy to testnet: `npx hardhat run scripts/deploy.js --network amoy`
3. Update `contractAddress` in `public/js/web3.js` with deployed address
4. Start frontend: `npm run dev`

## External Dependencies

### Blockchain Services
- **Alchemy**: RPC provider for Polygon Amoy testnet (free tier supported)
  - Endpoint: `https://polygon-amoy.g.alchemy.com/v2/{ALCHEMY_KEY}`
  - Required secret: `ALCHEMY_KEY`

### Wallet Integration
- **MetaMask**: Required for wallet connection and transaction signing
- Uses `window.ethereum` provider injection

### Smart Contract Dependencies
- **OpenZeppelin Contracts v5.0.0**: Standard secure contract implementations

### Environment Variables (Secrets)
- `PRIVATE_KEY`: Deployer wallet private key for contract deployment
- `ALCHEMY_KEY`: Alchemy API key for RPC access

### Development Tools
- Hardhat v2.19.0 with hardhat-toolbox
- dotenv for environment variable management