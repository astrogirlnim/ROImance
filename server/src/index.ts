import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { connectDatabase } from './services/database.js'
import transactionRoutes from './routes/transactions.js'
import relationshipRoutes from './routes/relationships.js'
import orderRoutes from './routes/orders.js'
import leaderboardRoutes from './routes/leaderboard.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/transactions', transactionRoutes)
app.use('/api/relationships', relationshipRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  
  // Connect to database
  try {
    await connectDatabase()
  } catch (error) {
    console.error('Failed to connect to database:', error)
    process.exit(1)
  }
})
