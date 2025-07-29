# R.O.I.mance - Setup and Run Guide

This guide provides all commands needed to set up and run the R.O.I.mance application with database.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**

## 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd /Users/ns/Development/GauntletAI/ROImance

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root
cd ..
```

## 2. Environment Setup

Create the environment file for the server:

```bash
# Create server environment file
cd server
cp .env.example .env
```

Edit `server/.env` with these values:
```env
DATABASE_URL="postgresql://roimance:dev_password@localhost:5432/roimance_dev"
PORT=3001
CLIENT_URL="http://localhost:5173"
NODE_ENV=development
```

## 3. Database Setup

```bash
# From the root directory
cd /Users/ns/Development/GauntletAI/ROImance

# Start PostgreSQL database with Docker
docker-compose up -d

# Wait for database to be ready (check with)
docker-compose logs postgres

# Generate Prisma client and push schema
cd server
npx prisma generate
npx prisma db push

# Verify database connection
npx prisma db seed # (optional, if seed file exists)
```

## 4. Start the Development Servers

### Option A: Run Both Servers Simultaneously

```bash
# From the root directory
npm run dev
```

### Option B: Run Servers Separately

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend Client:**
```bash
cd client
npm run dev
```

## 5. Verify Everything is Running

### Check Services
- **Database**: `docker ps` (should show postgres container running)
- **Backend**: http://localhost:3001/health
- **Frontend**: http://localhost:5173

### Test API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Create a test relationship
curl -X POST http://localhost:3001/api/relationships \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Relationship"}'

# Get all relationships
curl http://localhost:3001/api/relationships

# Get leaderboard
curl http://localhost:3001/api/leaderboard
```

## 6. Development Workflow

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests (when available)
cd client
npm test
```

### Code Quality
```bash
# Lint backend code
cd server
npm run lint
npm run lint:fix

# Lint frontend code
cd client
npm run lint
npm run lint:fix

# Build for production
cd server
npm run build

cd client
npm run build
```

### Database Management

```bash
# View database schema
cd server
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# View database logs
docker-compose logs postgres

# Connect to database directly
docker exec -it roimance-postgres-1 psql -U roimance -d roimance_dev
```

## 7. Stopping Services

```bash
# Stop all services
docker-compose down

# Stop with volume cleanup (WARNING: deletes all data)
docker-compose down -v

# Stop development servers: Ctrl+C in each terminal
```

## 8. Troubleshooting

### Database Connection Issues
```bash
# Check if database is running
docker ps | grep postgres

# Restart database
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

### Port Conflicts
```bash
# Check what's using port 3001
lsof -i :3001

# Check what's using port 5173
lsof -i :5173

# Check what's using port 5432
lsof -i :5432
```

### Clean Install
```bash
# Remove all node_modules and reinstall
rm -rf node_modules server/node_modules client/node_modules
npm install
cd server && npm install
cd ../client && npm install
```

## 9. Production Setup (Future)

For production deployment, you'll need:

```bash
# Build all components
npm run build

# Set production environment variables
export NODE_ENV=production
export DATABASE_URL="your-production-db-url"

# Start production server
cd server
npm start
```

## API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/relationships` | Get all relationships |
| POST | `/api/relationships` | Create new relationship |
| GET | `/api/relationships/:id` | Get specific relationship |
| GET | `/api/relationships/:id/metrics` | Get relationship metrics |
| GET | `/api/relationships/public` | Get public relationship data |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Create new transaction |
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Place new order |
| GET | `/api/orders/book/:id` | Get order book |
| GET | `/api/leaderboard` | Get leaderboard |

---

## Quick Start Summary

### Option A: One Command (Recommended)
```bash
./start-dev.sh
```

### Option B: Manual Steps
```bash
# 1. Start database
docker-compose up -d

# 2. Setup database schema
cd server && npx prisma db push

# 3. Start development servers
cd .. && npm run dev
```

Visit http://localhost:5173 to access the application!

## Development Scripts

Two convenient scripts are available in the root directory:

- **`./start-dev.sh`** - Simple one-command startup (recommended for daily use)
- **`./dev.sh`** - Advanced script with error handling and cleanup

Both scripts will:
1. Start the PostgreSQL database
2. Set up the database schema
3. Start both frontend and backend servers
4. Display helpful URLs and status messages
