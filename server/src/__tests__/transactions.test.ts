import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import app from '../app.js'

const prisma = new PrismaClient()

describe('Transactions API', () => {
  let testRelationshipId: string

  beforeAll(async () => {
    // Create a test relationship
    const relationship = await prisma.relationship.create({
      data: { name: 'Test Relationship' },
    })
    testRelationshipId = relationship.id
  })

  afterAll(async () => {
    // Clean up test data
    await prisma.transaction.deleteMany({})
    await prisma.relationship.deleteMany({})
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    // Clean transactions before each test
    await prisma.transaction.deleteMany({})
  })

  describe('POST /api/transactions', () => {
    test('should create a new transaction', async () => {
      const transactionData = {
        relationshipId: testRelationshipId,
        amountEc: 100.50,
        isCredit: true,
        note: 'Test transaction',
      }

      const response = await request(app)
        .post('/api/transactions')
        .send(transactionData)
        .expect(201)

      expect(response.body).toMatchObject({
        relationshipId: testRelationshipId,
        amountEc: 100.50,
        isCredit: true,
        note: 'Test transaction',
      })
      expect(response.body.id).toBeDefined()
      expect(response.body.timestamp).toBeDefined()
    })

    test('should require relationshipId, amountEc, and isCredit', async () => {
      const incompleteData = {
        amountEc: 100,
      }

      await request(app)
        .post('/api/transactions')
        .send(incompleteData)
        .expect(400)
    })

    test('should handle missing note field', async () => {
      const transactionData = {
        relationshipId: testRelationshipId,
        amountEc: 50,
        isCredit: false,
      }

      const response = await request(app)
        .post('/api/transactions')
        .send(transactionData)
        .expect(201)

      expect(response.body.note).toBeNull()
    })
  })

  describe('GET /api/transactions', () => {
    test('should return all transactions', async () => {
      // Create test transactions
      await prisma.transaction.createMany({
        data: [
          {
            relationshipId: testRelationshipId,
            amountEc: 100,
            isCredit: true,
            note: 'Credit transaction',
          },
          {
            relationshipId: testRelationshipId,
            amountEc: 50,
            isCredit: false,
            note: 'Debit transaction',
          },
        ],
      })

      const response = await request(app)
        .get('/api/transactions')
        .expect(200)

      expect(response.body).toHaveLength(2)
      expect(response.body[0].amountEc).toBe(50) // Most recent first
      expect(response.body[1].amountEc).toBe(100)
    })

    test('should filter by relationshipId', async () => {
      // Create another relationship and transaction
      const otherRelationship = await prisma.relationship.create({
        data: { name: 'Other Relationship' },
      })

      await prisma.transaction.createMany({
        data: [
          {
            relationshipId: testRelationshipId,
            amountEc: 100,
            isCredit: true,
          },
          {
            relationshipId: otherRelationship.id,
            amountEc: 200,
            isCredit: true,
          },
        ],
      })

      const response = await request(app)
        .get(`/api/transactions?relationshipId=${testRelationshipId}`)
        .expect(200)

      expect(response.body).toHaveLength(1)
      expect(response.body[0].relationshipId).toBe(testRelationshipId)
    })
  })

  describe('GET /api/transactions/:id', () => {
    test('should return a specific transaction', async () => {
      const transaction = await prisma.transaction.create({
        data: {
          relationshipId: testRelationshipId,
          amountEc: 75,
          isCredit: true,
          note: 'Specific transaction',
        },
      })

      const response = await request(app)
        .get(`/api/transactions/${transaction.id}`)
        .expect(200)

      expect(response.body.id).toBe(transaction.id)
      expect(response.body.amountEc).toBe(75)
    })

    test('should return 404 for non-existent transaction', async () => {
      await request(app)
        .get('/api/transactions/non-existent-id')
        .expect(404)
    })
  })

  describe('PUT /api/transactions/:id', () => {
    test('should update a transaction', async () => {
      const transaction = await prisma.transaction.create({
        data: {
          relationshipId: testRelationshipId,
          amountEc: 100,
          isCredit: true,
          note: 'Original note',
        },
      })

      const updateData = {
        amountEc: 150,
        note: 'Updated note',
      }

      const response = await request(app)
        .put(`/api/transactions/${transaction.id}`)
        .send(updateData)
        .expect(200)

      expect(response.body.amountEc).toBe(150)
      expect(response.body.note).toBe('Updated note')
      expect(response.body.isCredit).toBe(true) // Should remain unchanged
    })
  })

  describe('DELETE /api/transactions/:id', () => {
    test('should delete a transaction', async () => {
      const transaction = await prisma.transaction.create({
        data: {
          relationshipId: testRelationshipId,
          amountEc: 100,
          isCredit: true,
        },
      })

      await request(app)
        .delete(`/api/transactions/${transaction.id}`)
        .expect(200)

      // Verify deletion
      const deletedTransaction = await prisma.transaction.findUnique({
        where: { id: transaction.id },
      })
      expect(deletedTransaction).toBeNull()
    })
  })
})
