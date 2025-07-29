#!/bin/bash

# R.O.I.mance Development Quick Start
# One command to rule them all!

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting R.O.I.mance Development Environment${NC}"

# Check if ports are already in use
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Port 3001 is already in use. Please stop the existing server first.${NC}"
    echo -e "${YELLOW}   You can run: pkill -f 'npm run dev' or check with: lsof -i :3001${NC}"
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}⚠️  Port 5173 is already in use. Frontend will use next available port.${NC}"
fi

# Start database
echo -e "${BLUE}📊 Starting database...${NC}"
docker-compose up -d

# Wait a moment for database to start
sleep 3

# Ensure all dependencies are installed
echo -e "${BLUE}📦 Ensuring dependencies are installed...${NC}"
npm run install:all > /dev/null 2>&1 || echo -e "${YELLOW}⚠️  Dependency installation had warnings${NC}"

# Setup database schema
echo -e "${BLUE}🗄️  Setting up database schema...${NC}"
cd server
npx prisma db push --accept-data-loss > /dev/null 2>&1 || echo -e "${YELLOW}⚠️  Database schema setup had warnings${NC}"
cd ..

# Start development servers
echo -e "${GREEN}✅ Database ready!${NC}"
echo -e "${BLUE}🌐 Starting development servers...${NC}"
echo ""
echo -e "${GREEN}Frontend: http://localhost:5173 (or next available port)${NC}"
echo -e "${GREEN}Backend:  http://localhost:3001${NC}"
echo -e "${GREEN}Health:   http://localhost:3001/health${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

npm run dev
