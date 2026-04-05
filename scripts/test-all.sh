#!/bin/bash
# Full stack test script for TrustDegree
# Run from project root

set -e

echo "🧪 Running TrustDegree Full Stack Tests"
echo "========================================"
echo ""

# 1. Smart Contract Tests
echo "1️⃣  Testing Smart Contracts..."
cd contracts
if [ -d "../node_modules" ]; then
  cd ..
  npm test
else
  cd ..
  echo "⚠️  Dependencies not installed. Run 'npm install' first."
  exit 1
fi

# 2. Backend Tests
echo ""
echo "2️⃣  Testing Backend API..."
cd backend
npm test
cd ..

# 3. Frontend Build
echo ""
echo "3️⃣  Building Frontend..."
cd frontend
npm run build
cd ..

echo ""
echo "✅ All tests passed!"
echo ""
echo "To run full demo:"
echo "1. Start local blockchain: npx hardhat node"
echo "2. In another terminal: npm run deploy:localhost"
echo "3. Start backend: cd backend && npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo "5. Open http://localhost:5173/admin and issue a test degree"
