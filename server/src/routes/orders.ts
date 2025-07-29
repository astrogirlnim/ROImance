import express from 'express'
import { prisma } from '../services/database.js'
import { OrderSide } from '@prisma/client'

const router = express.Router()

/**
 * @api {post} /api/orders Place a new buy/sell order
 * @apiBody {string} relationshipId - ID of the relationship
 * @apiBody {string} user - Username placing the order
 * @apiBody {string} side - Order side: "BUY" or "SELL"
 * @apiBody {number} shares - Number of shares
 * @apiBody {number} price - Price per share
 * @apiSuccess {object} order - Created order object
 */
router.post('/', async (req, res) => {
  try {
    const { relationshipId, user, side, shares, price } = req.body

    if (!relationshipId || !user || !side || !shares || !price) {
      return res.status(400).json({ 
        error: 'Missing required fields: relationshipId, user, side, shares, price' 
      })
    }

    if (!['BUY', 'SELL'].includes(side)) {
      return res.status(400).json({ error: 'Side must be "BUY" or "SELL"' })
    }

    const order = await prisma.order.create({
      data: {
        relationshipId,
        user,
        side: side as OrderSide,
        shares: parseInt(shares),
        price: parseFloat(price),
      },
      include: {
        relationship: true,
      },
    })

    // TODO: Implement order matching logic in Phase 4
    console.log(`Order placed: ${side} ${shares} shares at $${price} for ${user}`)

    res.status(201).json(order)
  } catch (error) {
    console.error('Error placing order:', error)
    res.status(500).json({ error: 'Failed to place order' })
  }
})

/**
 * @api {get} /api/orders Get all orders
 * @apiQuery {string} [relationshipId] - Filter by relationship ID
 * @apiQuery {string} [user] - Filter by username
 * @apiQuery {string} [status] - Filter by order status
 * @apiSuccess {object[]} orders - Array of order objects
 */
router.get('/', async (req, res) => {
  try {
    const { relationshipId, user, status } = req.query

    const where: any = {}
    if (relationshipId) where.relationshipId = relationshipId as string
    if (user) where.user = user as string
    if (status) where.status = status as string

    const orders = await prisma.order.findMany({
      where,
      include: {
        relationship: true,
        trades: true,
      },
      orderBy: [
        { timestamp: 'desc' },
        { price: 'desc' },
      ],
    })

    res.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

/**
 * @api {get} /api/orders/book/:relationshipId Get order book for a relationship
 * @apiParam {string} relationshipId - Relationship ID
 * @apiSuccess {object} orderBook - Order book with aggregated buy/sell levels
 */
router.get('/book/:relationshipId', async (req, res) => {
  try {
    const { relationshipId } = req.params

    const [buyOrders, sellOrders] = await Promise.all([
      prisma.order.findMany({
        where: {
          relationshipId,
          side: OrderSide.BUY,
          status: 'PENDING',
        },
        orderBy: { price: 'desc' },
      }),
      prisma.order.findMany({
        where: {
          relationshipId,
          side: OrderSide.SELL,
          status: 'PENDING',
        },
        orderBy: { price: 'asc' },
      }),
    ])

    // Aggregate orders by price level
    const buyLevels = aggregateOrdersByPrice(buyOrders)
    const sellLevels = aggregateOrdersByPrice(sellOrders)

    const orderBook = {
      relationshipId,
      bids: buyLevels,
      asks: sellLevels,
      spread: sellLevels[0] && buyLevels[0] 
        ? sellLevels[0].price - buyLevels[0].price 
        : null,
      timestamp: new Date().toISOString(),
    }

    res.json(orderBook)
  } catch (error) {
    console.error('Error fetching order book:', error)
    res.status(500).json({ error: 'Failed to fetch order book' })
  }
})

/**
 * @api {get} /api/orders/:id Get a specific order
 * @apiParam {string} id - Order ID
 * @apiSuccess {object} order - Order object with trades
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        relationship: true,
        trades: true,
      },
    })

    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

/**
 * @api {delete} /api/orders/:id Cancel an order
 * @apiParam {string} id - Order ID
 * @apiSuccess {object} order - Updated order object
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const order = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        relationship: true,
      },
    })

    res.json(order)
  } catch (error) {
    console.error('Error cancelling order:', error)
    res.status(500).json({ error: 'Failed to cancel order' })
  }
})

function aggregateOrdersByPrice(orders: any[]) {
  const priceMap = new Map<number, { price: number; shares: number; orderCount: number }>()

  orders.forEach(order => {
    const existing = priceMap.get(order.price)
    if (existing) {
      existing.shares += order.shares
      existing.orderCount += 1
    } else {
      priceMap.set(order.price, {
        price: order.price,
        shares: order.shares,
        orderCount: 1,
      })
    }
  })

  return Array.from(priceMap.values()).sort((a, b) => b.price - a.price)
}

export default router
