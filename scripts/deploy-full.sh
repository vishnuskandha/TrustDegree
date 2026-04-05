#!/bin/bash
# Deploy TrustDegree to Polygon Mumbai testnet
# Usage: ./scripts/deploy-full.sh [private_key]

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <private_key>"
  echo "Example: ./scripts/deploy-full.sh 0xYourPrivateKey..."
  exit 1
fi

PRIVATE_KEY="$1"

echo "🔗 Deploying TrustDegree to Polygon Mumbai..."

# Ensure .env exists with RPC URL
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from example"
fi

# Set private key in .env
sed -i.bak "s/PRIVATE_KEY=.*/PRIVATE_KEY=$PRIVATE_KEY/" .env
rm -f .env.bak

# Compile contracts
echo "🔨 Compiling contracts..."
npm run compile

# Deploy
echo "🚀 Deploying..."
npm run deploy:mumbai

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Save the contract address from output"
echo "2. Update backend/.env and frontend/.env with CONTRACT_ADDRESS"
echo "3. Verify contract on Polygonscan (optional):"
echo "   - Go to https://mumbai.polygonscan.com/verifyContract"
echo "   - Paste contract address and flattened source (from 'flatten' folder)"
echo ""
echo "4. Start backend and frontend according to their READMEs"
