#!/bin/bash

# TalentFlow Hiring Platform Setup Script
# This script sets up the development environment for TalentFlow

echo "🚀 Setting up TalentFlow Hiring Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is not supported. Please install Node.js v18+"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# TalentFlow Environment Variables
VITE_API_BASE_URL=http://localhost:8081/api
VITE_APP_NAME=TalentFlow
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Modern Hiring Platform
EOF
    echo "✅ .env.local file created"
else
    echo "✅ .env.local file already exists"
fi

# Run type checking
echo "🔍 Running TypeScript type checking..."
npm run type-check

if [ $? -eq 0 ]; then
    echo "✅ TypeScript type checking passed"
else
    echo "⚠️  TypeScript type checking failed - please review the errors"
fi

# Run linting
echo "🧹 Running ESLint..."
npm run lint

if [ $? -eq 0 ]; then
    echo "✅ ESLint passed"
else
    echo "⚠️  ESLint found issues - please review the warnings"
fi

echo ""
echo "🎉 Setup complete! You can now start the development server:"
echo ""
echo "   npm run dev"
echo ""
echo "   Then open http://localhost:8081 in your browser"
echo ""
echo "📚 For more information, see README.md"
echo "🔧 For technical details, see TECHNICAL_DOCS.md"
echo ""
echo "Happy coding! 🚀"
