import express from 'express'
import { prisma } from '../services/database.js'
import { calculateLeaderboardMetrics } from '../services/metrics.js'

const router = express.Router()

// In-memory cache for leaderboard data
let leaderboardCache: {
  data: any[]
  timestamp: number
  windowDays: number
} | null = null

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * @api {get} /api/leaderboard Get ranked relationships by EC growth
 * @apiQuery {number} [days=7] - Window for growth calculation (default: 7 days)
 * @apiQuery {number} [limit=50] - Maximum number of results (default: 50)
 * @apiSuccess {object[]} leaderboard - Array of ranked relationships
 */
router.get('/', async (req, res) => {
  try {
    const windowDays = parseInt(req.query.days as string) || 7
    const limit = parseInt(req.query.limit as string) || 50

    // Check cache first
    const now = Date.now()
    if (leaderboardCache && 
        (now - leaderboardCache.timestamp) < CACHE_TTL &&
        leaderboardCache.windowDays === windowDays) {
      const limitedData = leaderboardCache.data.slice(0, limit)
      return res.json({
        leaderboard: limitedData,
        cached: true,
        window: `${windowDays} days`,
        generatedAt: new Date(leaderboardCache.timestamp).toISOString(),
      })
    }

    // Fetch fresh data
    const cutoffDate = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000)

    const relationships = await prisma.relationship.findMany({
      include: {
        transactions: {
          where: {
            timestamp: { gte: cutoffDate },
          },
          orderBy: { timestamp: 'desc' },
        },
        relationshipPrices: {
          where: {
            date: { gte: cutoffDate },
          },
          orderBy: { date: 'desc' },
        },
      },
    })

    const leaderboardData = calculateLeaderboardMetrics(relationships, windowDays)

    // Update cache
    leaderboardCache = {
      data: leaderboardData,
      timestamp: now,
      windowDays,
    }

    const limitedData = leaderboardData.slice(0, limit)

    res.json({
      leaderboard: limitedData,
      cached: false,
      window: `${windowDays} days`,
      generatedAt: new Date(now).toISOString(),
      totalRelationships: relationships.length,
    })
  } catch (error) {
    console.error('Error generating leaderboard:', error)
    res.status(500).json({ error: 'Failed to generate leaderboard' })
  }
})

/**
 * @api {post} /api/leaderboard/refresh Force refresh leaderboard cache
 * @apiBody {number} [days=7] - Window for growth calculation
 * @apiSuccess {object} result - Refresh confirmation
 */
router.post('/refresh', async (req, res) => {
  try {
    const windowDays = parseInt(req.body.days) || 7

    // Clear cache to force refresh
    leaderboardCache = null

    const cutoffDate = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000)

    const relationships = await prisma.relationship.findMany({
      include: {
        transactions: {
          where: {
            timestamp: { gte: cutoffDate },
          },
          orderBy: { timestamp: 'desc' },
        },
        relationshipPrices: {
          where: {
            date: { gte: cutoffDate },
          },
          orderBy: { date: 'desc' },
        },
      },
    })

    const leaderboardData = calculateLeaderboardMetrics(relationships, windowDays)

    // Update cache
    leaderboardCache = {
      data: leaderboardData,
      timestamp: Date.now(),
      windowDays,
    }

    res.json({
      message: 'Leaderboard cache refreshed successfully',
      window: `${windowDays} days`,
      totalRelationships: relationships.length,
      refreshedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error refreshing leaderboard:', error)
    res.status(500).json({ error: 'Failed to refresh leaderboard' })
  }
})

/**
 * @api {get} /api/leaderboard/stats Get leaderboard statistics
 * @apiSuccess {object} stats - Cache status and general statistics
 */
router.get('/stats', (req, res) => {
  const stats = {
    cacheStatus: leaderboardCache ? 'active' : 'empty',
    lastRefresh: leaderboardCache?.timestamp 
      ? new Date(leaderboardCache.timestamp).toISOString() 
      : null,
    cacheAge: leaderboardCache ? Date.now() - leaderboardCache.timestamp : null,
    windowDays: leaderboardCache?.windowDays || null,
    cachedEntries: leaderboardCache?.data.length || 0,
    ttl: CACHE_TTL,
  }

  res.json(stats)
})

export default router
