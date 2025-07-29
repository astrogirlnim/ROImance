import express from 'express'
import { prisma } from '../services/database.js'

const router = express.Router()

/**
 * @api {post} /api/transactions Create a new transaction
 * @apiBody {string} relationshipId - ID of the relationship
 * @apiBody {number} amountEc - Transaction amount in EC
 * @apiBody {boolean} isCredit - Whether this is a credit (true) or debit (false)
 * @apiBody {string} [note] - Optional transaction note
 * @apiSuccess {object} transaction - Created transaction object
 */
router.post('/', async (req, res) => {
  try {
    const { relationshipId, amountEc, isCredit, note } = req.body

    if (!relationshipId || amountEc === undefined || isCredit === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: relationshipId, amountEc, isCredit' 
      })
    }

    const transaction = await prisma.transaction.create({
      data: {
        relationshipId,
        amountEc: parseFloat(amountEc),
        isCredit,
        note: note || null,
      },
      include: {
        relationship: true,
      },
    })

    res.status(201).json(transaction)
  } catch (error) {
    console.error('Error creating transaction:', error)
    res.status(500).json({ error: 'Failed to create transaction' })
  }
})

/**
 * @api {get} /api/transactions Get all transactions
 * @apiQuery {string} [relationshipId] - Filter by relationship ID
 * @apiSuccess {object[]} transactions - Array of transaction objects
 */
router.get('/', async (req, res) => {
  try {
    const { relationshipId } = req.query

    const where = relationshipId ? { relationshipId: relationshipId as string } : {}

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        relationship: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    })

    res.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})

/**
 * @api {get} /api/transactions/:id Get a specific transaction
 * @apiParam {string} id - Transaction ID
 * @apiSuccess {object} transaction - Transaction object
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        relationship: true,
      },
    })

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    res.json(transaction)
  } catch (error) {
    console.error('Error fetching transaction:', error)
    res.status(500).json({ error: 'Failed to fetch transaction' })
  }
})

/**
 * @api {put} /api/transactions/:id Update a transaction
 * @apiParam {string} id - Transaction ID
 * @apiBody {number} [amountEc] - Updated transaction amount
 * @apiBody {boolean} [isCredit] - Updated credit/debit status
 * @apiBody {string} [note] - Updated transaction note
 * @apiSuccess {object} transaction - Updated transaction object
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { amountEc, isCredit, note } = req.body

    const updateData: any = {}
    if (amountEc !== undefined) updateData.amountEc = parseFloat(amountEc)
    if (isCredit !== undefined) updateData.isCredit = isCredit
    if (note !== undefined) updateData.note = note

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
      include: {
        relationship: true,
      },
    })

    res.json(transaction)
  } catch (error) {
    console.error('Error updating transaction:', error)
    res.status(500).json({ error: 'Failed to update transaction' })
  }
})

/**
 * @api {delete} /api/transactions/:id Delete a transaction
 * @apiParam {string} id - Transaction ID
 * @apiSuccess {object} message - Deletion confirmation
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.transaction.delete({
      where: { id },
    })

    res.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    res.status(500).json({ error: 'Failed to delete transaction' })
  }
})

export default router
