#!/bin/bash

# R.O.I.mance Development Environment Startup Script
# This script starts the database and development servers all in one go

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[DEV]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to cleanup on exit
cleanup() {
    print_status "Shutting down development environment..."
    
    # Kill background processes
    if [[ -n $DEV_PID ]]; then
        print_status "Stopping development servers..."
        kill $DEV_PID 2>/dev/null || true
    fi
    
    # Optionally stop database (uncomment if you want database to stop too)
    # print_status "Stopping database..."
    # docker-compose down
    
    print_success "Development environment stopped"
    exit 0
}

# Set up cleanup trap
trap cleanup SIGINT SIGTERM

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Starting R.O.I.mance development environment..."

# Start database
print_status "Starting PostgreSQL database..."
docker-compose up -d

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 3

# Check if database is healthy
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U roimance -d roimance_dev >/dev/null 2>&1; then
        print_success "Database is ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "Database failed to start within expected time"
        docker-compose logs postgres
        exit 1
    fi
    
    print_status "Database not ready yet... (attempt $attempt/$max_attempts)"
    sleep 2
    ((attempt++))
done

# Setup database schema if needed
print_status "Setting up database schema..."
cd server
if ! npx prisma db push --accept-data-loss >/dev/null 2>&1; then
    print_warning "Database schema setup had issues, but continuing..."
fi
cd ..

# Check if node_modules exist
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    print_warning "Some dependencies seem to be missing. Installing..."
    npm install
    cd server && npm install && cd ..
    cd client && npm install && cd ..
fi

print_success "Database is running and ready!"
print_status "Starting development servers..."

# Start development servers
npm run dev &
DEV_PID=$!

print_success "Development environment is ready!"
print_status "Frontend: http://localhost:5173"
print_status "Backend:  http://localhost:3001"
print_status "Health:   http://localhost:3001/health"
print_status ""
print_status "Press Ctrl+C to stop all services"

# Wait for the development servers
wait $DEV_PID
