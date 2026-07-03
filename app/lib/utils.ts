import { Transaction, Category } from './types'

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function sumTransactions(
  transactions: Transaction[],
  filter?: { type?: 'income' | 'expense'; category?: string }
): number {
  return transactions
    .filter((t) => {
      if (filter?.type && t.type !== filter.type) return false
      if (filter?.category && t.category !== filter.category) return false
      return true
    })
    .reduce((sum, t) => sum + t.amount, 0)
}

export function groupByCategory(
  transactions: Transaction[],
  type: 'income' | 'expense'
): Record<string, number> {
  return transactions
    .filter((t) => t.type === type)
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>
    )
}

export function filterByMonth(
  transactions: Transaction[],
  month: Date
): Transaction[] {
  const year = month.getFullYear()
  const monthNum = month.getMonth()
  return transactions.filter((t) => {
    const tYear = t.date.getFullYear()
    const tMonth = t.date.getMonth()
    return tYear === year && tMonth === monthNum
  })
}

export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}
