#!/bin/bash

# R.O.I.mance Development Environment Stop Script

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🛑 Stopping R.O.I.mance Development Environment${NC}"

# Stop development servers
echo -e "${BLUE}⏹️  Stopping development servers...${NC}"

# Kill processes on ports 3001 and 5173
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}   Stopping backend server (port 3001)...${NC}"
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}   Stopping frontend server (port 5173)...${NC}"
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
fi

if lsof -Pi :5174 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}   Stopping frontend server (port 5174)...${NC}"
    lsof -ti:5174 | xargs kill -9 2>/dev/null || true
fi

# Kill any npm dev processes
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "tsx watch" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Optionally stop database (uncomment if you want to stop the database too)
# echo -e "${BLUE}📊 Stopping database...${NC}"
# docker-compose down

echo -e "${GREEN}✅ Development servers stopped!${NC}"
echo -e "${YELLOW}💡 Database is still running. Use 'docker-compose down' to stop it.${NC}"
