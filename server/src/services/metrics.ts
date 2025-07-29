import type { Transaction, RelationshipPrice } from '@prisma/client'

export interface MetricsResult {
  aph: number // Average Performance per Hour
  ccr: number // Cash Conversion Rate
  dnii: number // Daily Net Interaction Index
  totalTransactions: number
  totalEcValue: number
  averageTransactionValue: number
  growthRate: number
}

export function calculateMetrics(
  transactions: Transaction[],
  priceHistory: RelationshipPrice[]
): MetricsResult {
  if (transactions.length === 0) {
    return {
      aph: 0,
      ccr: 0,
      dnii: 0,
      totalTransactions: 0,
      totalEcValue: 0,
      averageTransactionValue: 0,
      growthRate: 0,
    }
  }

  // Calculate basic transaction metrics
  const totalTransactions = transactions.length
  const totalEcValue = transactions.reduce((sum, t) => {
    return sum + (t.isCredit ? t.amountEc : -t.amountEc)
  }, 0)
  const averageTransactionValue = Math.abs(totalEcValue) / totalTransactions

  // Calculate APH (Average Performance per Hour)
  const firstTransaction = transactions[transactions.length - 1]
  const lastTransaction = transactions[0]
  const timeSpanHours = (lastTransaction.timestamp.getTime() - firstTransaction.timestamp.getTime()) / (1000 * 60 * 60)
  const aph = timeSpanHours > 0 ? totalEcValue / timeSpanHours : 0

  // Calculate CCR (Cash Conversion Rate)
  const credits = transactions.filter(t => t.isCredit).reduce((sum, t) => sum + t.amountEc, 0)
  const debits = transactions.filter(t => !t.isCredit).reduce((sum, t) => sum + t.amountEc, 0)
  const ccr = debits > 0 ? credits / debits : credits > 0 ? 1 : 0

  // Calculate DNII (Daily Net Interaction Index)
  const dailyTransactionCounts = new Map<string, number>()
  transactions.forEach(t => {
    const date = t.timestamp.toISOString().split('T')[0]
    dailyTransactionCounts.set(date, (dailyTransactionCounts.get(date) || 0) + 1)
  })
  const averageDailyTransactions = dailyTransactionCounts.size > 0 
    ? Array.from(dailyTransactionCounts.values()).reduce((a, b) => a + b, 0) / dailyTransactionCounts.size
    : 0
  const dnii = averageDailyTransactions * (totalEcValue / totalTransactions)

  // Calculate Growth Rate
  let growthRate = 0
  if (priceHistory.length >= 2) {
    const latestPrice = priceHistory[0]?.priceEc || 0
    const oldestPrice = priceHistory[priceHistory.length - 1]?.priceEc || 0
    if (oldestPrice > 0) {
      growthRate = ((latestPrice - oldestPrice) / oldestPrice) * 100
    }
  }

  return {
    aph: Math.round(aph * 100) / 100,
    ccr: Math.round(ccr * 100) / 100,
    dnii: Math.round(dnii * 100) / 100,
    totalTransactions,
    totalEcValue: Math.round(totalEcValue * 100) / 100,
    averageTransactionValue: Math.round(averageTransactionValue * 100) / 100,
    growthRate: Math.round(growthRate * 100) / 100,
  }
}

export function calculateLeaderboardMetrics(
  relationships: Array<{
    id: string
    name: string
    transactions: Transaction[]
    relationshipPrices: RelationshipPrice[]
  }>,
  windowDays: number = 7
): Array<{
  relationshipId: string
  name: string
  ecGrowth: number
  totalValue: number
  rank: number
}> {
  const cutoffDate = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000)

  const leaderboardData = relationships.map(rel => {
    const recentTransactions = rel.transactions.filter(t => t.timestamp >= cutoffDate)
    const recentPrices = rel.relationshipPrices.filter(p => p.date >= cutoffDate)

    const metrics = calculateMetrics(recentTransactions, recentPrices)
    
    return {
      relationshipId: rel.id,
      name: rel.name,
      ecGrowth: metrics.growthRate,
      totalValue: metrics.totalEcValue,
    }
  })

  // Sort by EC growth and assign ranks
  const sorted = leaderboardData
    .sort((a, b) => b.ecGrowth - a.ecGrowth)
    .map((item, index) => ({ ...item, rank: index + 1 }))

  return sorted
}
