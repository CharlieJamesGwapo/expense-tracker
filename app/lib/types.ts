export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: Date
  recurring: 'monthly' | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
  createdAt: Date
}

export interface AppState {
  transactions: Transaction[]
  categories: Category[]
  selectedMonth: Date
  loading: boolean
  error: string | null
}

export interface MonthlySummary {
  month: string
  totalIncome: number
  totalExpense: number
  netBalance: number
  byCategory: {
    category: string
    amount: number
    type: 'income' | 'expense'
    percentage: number
  }[]
  trends: {
    last12Months: {
      month: string
      income: number
      expense: number
    }[]
  }
}
