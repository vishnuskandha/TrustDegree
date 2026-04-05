#!/bin/bash
# Setup script for local development
# Run from project root

set -e

echo "🚀 Setting up TrustDegree for local development..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm not installed. Aborting." >&2; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "PostgreSQL not installed. Aborting." >&2; exit 1; }

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Compile contracts
echo "🔨 Compiling smart contracts..."
npm run compile

# Setup backend
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Setup frontend
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create PostgreSQL database: createdb trustdegree"
echo "2. Initialize backend DB schema: psql -d trustdegree -f backend/sql/schema.sql"
echo "3. Create .env files from .env.example in root, backend/, frontend/"
echo "4. Start local blockchain: npx hardhat node"
echo "5. Deploy contract to localhost: npm run deploy:localhost"
echo "6. Update CONTRACT_ADDRESS in backend/.env and frontend/.env"
echo "7. Run backend: cd backend && npm run dev"
echo "8. Run frontend: cd frontend && npm run dev"
echo ""
echo "For testnet deployment (Polygon Mumbai):"
echo "1. Fund your wallet with test MATIC from https://faucet.polygon.technology/"
echo "2. Edit .env with PRIVATE_KEY"
echo "3. npm run deploy:mumbai"
