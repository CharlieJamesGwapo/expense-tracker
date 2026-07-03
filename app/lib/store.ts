import { Transaction, Category } from './types'
import { DEFAULT_CATEGORIES } from './constants'
import { generateId, getMonthKey } from './utils'

class DataStore {
  private transactions: Map<string, Transaction> = new Map()
  private categories: Map<string, Category> = new Map()
  private recurringTransactions: Map<string, Transaction> = new Map()

  constructor() {
    this.initializeDefaults()
  }

  private initializeDefaults() {
    DEFAULT_CATEGORIES.forEach((cat) => {
      this.categories.set(cat.id, cat)
    })
  }

  addTransaction(t: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const id = generateId()
    const transaction: Transaction = {
      ...t,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.transactions.set(id, transaction)

    if (t.recurring === 'monthly') {
      this.recurringTransactions.set(id, transaction)
      this.generateRecurringInstances(transaction)
    }

    return transaction
  }

  getTransaction(id: string): Transaction | null {
    return this.transactions.get(id) || null
  }

  getAllTransactions(): Transaction[] {
    return Array.from(this.transactions.values())
  }

  updateTransaction(
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>
  ): Transaction | null {
    const existing = this.transactions.get(id)
    if (!existing) return null

    const updated: Transaction = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    }
    this.transactions.set(id, updated)
    return updated
  }

  deleteTransaction(id: string): boolean {
    const existed = this.transactions.has(id)
    this.transactions.delete(id)
    this.recurringTransactions.delete(id)
    return existed
  }

  addCategory(c: Omit<Category, 'id' | 'createdAt'>): Category {
    const id = generateId()
    const category: Category = {
      ...c,
      id,
      createdAt: new Date(),
    }
    this.categories.set(id, category)
    return category
  }

  getCategory(id: string): Category | null {
    return this.categories.get(id) || null
  }

  getAllCategories(): Category[] {
    return Array.from(this.categories.values())
  }

  deleteCategory(id: string): boolean {
    if (id.startsWith('income-') || id.startsWith('expense-')) {
      return false
    }
    const existed = this.categories.has(id)
    this.categories.delete(id)
    return existed
  }

  private generateRecurringInstances(template: Transaction) {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    for (let i = 0; i < 12; i++) {
      const targetMonth = (currentMonth + i) % 12
      const targetYear = currentYear + Math.floor((currentMonth + i) / 12)

      if (
        template.date.getFullYear() === targetYear &&
        template.date.getMonth() === targetMonth
      ) {
        continue
      }

      const generated: Transaction = {
        ...template,
        id: generateId(),
        date: new Date(targetYear, targetMonth, template.date.getDate()),
        recurring: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.transactions.set(generated.id, generated)
    }
  }

  toJSON() {
    return {
      transactions: Array.from(this.transactions.entries()),
      categories: Array.from(this.categories.entries()),
    }
  }

  fromJSON(data: any) {
    this.transactions.clear()
    this.categories.clear()

    data.transactions?.forEach(([id, t]: [string, any]) => {
      this.transactions.set(id, {
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      })
    })

    data.categories?.forEach(([id, c]: [string, any]) => {
      this.categories.set(id, {
        ...c,
        createdAt: new Date(c.createdAt),
      })
    })

    if (!data.categories || data.categories.length === 0) {
      this.initializeDefaults()
    }
  }
}

let storeInstance: DataStore | null = null

export function getStore(): DataStore {
  if (!storeInstance) {
    storeInstance = new DataStore()
  }
  return storeInstance
}

export function resetStore() {
  storeInstance = null
}
