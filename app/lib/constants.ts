import { Category } from './types'

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  {
    id: 'income-salary',
    name: 'Salary',
    type: 'income',
    createdAt: new Date(),
  },
  {
    id: 'income-bonus',
    name: 'Bonus',
    type: 'income',
    createdAt: new Date(),
  },
  {
    id: 'income-other',
    name: 'Other',
    type: 'income',
    createdAt: new Date(),
  },
]

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  {
    id: 'expense-food',
    name: 'Food',
    type: 'expense',
    createdAt: new Date(),
  },
  {
    id: 'expense-transport',
    name: 'Transport',
    type: 'expense',
    createdAt: new Date(),
  },
  {
    id: 'expense-utilities',
    name: 'Utilities',
    type: 'expense',
    createdAt: new Date(),
  },
  {
    id: 'expense-entertainment',
    name: 'Entertainment',
    type: 'expense',
    createdAt: new Date(),
  },
  {
    id: 'expense-healthcare',
    name: 'Healthcare',
    type: 'expense',
    createdAt: new Date(),
  },
  {
    id: 'expense-subscriptions',
    name: 'Subscriptions',
    type: 'expense',
    createdAt: new Date(),
  },
  {
    id: 'expense-other',
    name: 'Other',
    type: 'expense',
    createdAt: new Date(),
  },
]

export const DEFAULT_CATEGORIES = [
  ...DEFAULT_INCOME_CATEGORIES,
  ...DEFAULT_EXPENSE_CATEGORIES,
]
