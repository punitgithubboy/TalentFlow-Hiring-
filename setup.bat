@echo off
REM TalentFlow Hiring Platform Setup Script for Windows
REM This script sets up the development environment for TalentFlow

echo 🚀 Setting up TalentFlow Hiring Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm
    pause
    exit /b 1
)

echo ✅ npm detected

REM Install dependencies
echo 📦 Installing dependencies...
npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create .env.local file if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local file...
    (
        echo # TalentFlow Environment Variables
        echo VITE_API_BASE_URL=http://localhost:8081/api
        echo VITE_APP_NAME=TalentFlow
        echo VITE_APP_VERSION=1.0.0
        echo VITE_APP_DESCRIPTION=Modern Hiring Platform
    ) > .env.local
    echo ✅ .env.local file created
) else (
    echo ✅ .env.local file already exists
)

REM Run type checking
echo 🔍 Running TypeScript type checking...
npm run type-check

if %errorlevel% neq 0 (
    echo ⚠️  TypeScript type checking failed - please review the errors
) else (
    echo ✅ TypeScript type checking passed
)

REM Run linting
echo 🧹 Running ESLint...
npm run lint

if %errorlevel% neq 0 (
    echo ⚠️  ESLint found issues - please review the warnings
) else (
    echo ✅ ESLint passed
)

echo.
echo 🎉 Setup complete! You can now start the development server:
echo.
echo    npm run dev
echo.
echo    Then open http://localhost:8081 in your browser
echo.
echo 📚 For more information, see README.md
echo 🔧 For technical details, see TECHNICAL_DOCS.md
echo.
echo Happy coding! 🚀
pause
