import express from 'express'
import { prisma } from '../services/database.js'
import { calculateMetrics } from '../services/metrics.js'

const router = express.Router()

/**
 * @api {post} /api/relationships Create a new relationship
 * @apiBody {string} name - Relationship name
 * @apiSuccess {object} relationship - Created relationship object
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Missing required field: name' })
    }

    const relationship = await prisma.relationship.create({
      data: { name },
    })

    res.status(201).json(relationship)
  } catch (error) {
    console.error('Error creating relationship:', error)
    res.status(500).json({ error: 'Failed to create relationship' })
  }
})

/**
 * @api {get} /api/relationships Get all relationships
 * @apiSuccess {object[]} relationships - Array of relationship objects
 */
router.get('/', async (req, res) => {
  try {
    const relationships = await prisma.relationship.findMany({
      include: {
        transactions: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
        relationshipPrices: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(relationships)
  } catch (error) {
    console.error('Error fetching relationships:', error)
    res.status(500).json({ error: 'Failed to fetch relationships' })
  }
})

/**
 * @api {get} /api/relationships/public Get all public relationships with latest EC value
 * @apiSuccess {object[]} relationships - Array of public relationship data
 */
router.get('/public', async (req, res) => {
  try {
    const relationships = await prisma.relationship.findMany({
      include: {
        relationshipPrices: {
          orderBy: { date: 'desc' },
          take: 1,
        },
        transactions: {
          select: {
            amountEc: true,
            isCredit: true,
            timestamp: true,
          },
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    })

    const publicData = relationships.map(rel => ({
      id: rel.id,
      name: rel.name,
      createdAt: rel.createdAt,
      latestEcValue: rel.relationshipPrices[0]?.priceEc || 0,
      lastActivity: rel.transactions[0]?.timestamp || rel.createdAt,
    }))

    res.json(publicData)
  } catch (error) {
    console.error('Error fetching public relationships:', error)
    res.status(500).json({ error: 'Failed to fetch public relationships' })
  }
})

/**
 * @api {get} /api/relationships/:id Get a specific relationship
 * @apiParam {string} id - Relationship ID
 * @apiSuccess {object} relationship - Relationship object with full data
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const relationship = await prisma.relationship.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { timestamp: 'desc' },
        },
        relationshipPrices: {
          orderBy: { date: 'desc' },
        },
      },
    })

    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' })
    }

    res.json(relationship)
  } catch (error) {
    console.error('Error fetching relationship:', error)
    res.status(500).json({ error: 'Failed to fetch relationship' })
  }
})

/**
 * @api {get} /api/relationships/:id/metrics Get relationship metrics
 * @apiParam {string} id - Relationship ID
 * @apiQuery {number} [days=30] - Number of days for metrics calculation
 * @apiSuccess {object} metrics - APH, CCR, DNII metrics and history
 */
router.get('/:id/metrics', async (req, res) => {
  try {
    const { id } = req.params
    const days = parseInt(req.query.days as string) || 30

    const relationship = await prisma.relationship.findUnique({
      where: { id },
      include: {
        transactions: {
          where: {
            timestamp: {
              gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { timestamp: 'desc' },
        },
        relationshipPrices: {
          where: {
            date: {
              gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { date: 'desc' },
        },
      },
    })

    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' })
    }

    const metrics = calculateMetrics(relationship.transactions, relationship.relationshipPrices)

    res.json({
      relationshipId: id,
      period: `${days} days`,
      metrics,
      history: {
        transactions: relationship.transactions,
        prices: relationship.relationshipPrices,
      },
    })
  } catch (error) {
    console.error('Error calculating metrics:', error)
    res.status(500).json({ error: 'Failed to calculate metrics' })
  }
})

/**
 * @api {post} /api/relationships/:id/price-snapshot Create daily price snapshot
 * @apiParam {string} id - Relationship ID
 * @apiBody {number} priceEc - Current EC price
 * @apiSuccess {object} snapshot - Created price snapshot
 */
router.post('/:id/price-snapshot', async (req, res) => {
  try {
    const { id } = req.params
    const { priceEc } = req.body

    if (priceEc === undefined) {
      return res.status(400).json({ error: 'Missing required field: priceEc' })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const snapshot = await prisma.relationshipPrice.upsert({
      where: {
        relationshipId_date: {
          relationshipId: id,
          date: today,
        },
      },
      update: {
        priceEc: parseFloat(priceEc),
      },
      create: {
        relationshipId: id,
        priceEc: parseFloat(priceEc),
        date: today,
      },
    })

    res.json(snapshot)
  } catch (error) {
    console.error('Error creating price snapshot:', error)
    res.status(500).json({ error: 'Failed to create price snapshot' })
  }
})

export default router
