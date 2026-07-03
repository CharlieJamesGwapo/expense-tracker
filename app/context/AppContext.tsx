'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Transaction, Category, AppState } from '@/lib/types'
import { getStore, resetStore } from '@/lib/store'

interface AppContextType {
  state: AppState
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Transaction>
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<Transaction | null>
  deleteTransaction: (id: string) => Promise<boolean>
  getTransactions: () => Promise<Transaction[]>
  addCategory: (c: Omit<Category, 'id' | 'createdAt'>) => Promise<Category>
  getCategories: () => Promise<Category[]>
  deleteCategory: (id: string) => Promise<boolean>
  setSelectedMonth: (date: Date) => void
  getSummary: (month: string) => Promise<any>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    transactions: [],
    categories: [],
    selectedMonth: new Date(),
    loading: false,
    error: null,
  })

  useEffect(() => {
    const stored = localStorage.getItem('expense-tracker-state')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        const store = getStore()
        store.fromJSON(data)
      } catch (err) {
        console.error('Failed to restore state:', err)
      }
    }
    refreshState()
  }, [])

  const refreshState = () => {
    const store = getStore()
    setState((prev) => ({
      ...prev,
      transactions: store.getAllTransactions(),
      categories: store.getAllCategories(),
    }))
    saveToLocalStorage()
  }

  const saveToLocalStorage = () => {
    const store = getStore()
    const data = store.toJSON()
    localStorage.setItem('expense-tracker-state', JSON.stringify(data))
  }

  const addTransaction = async (t: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(t),
      })
      if (!res.ok) throw new Error('Failed to add transaction')
      const transaction = await res.json()
      refreshState()
      return transaction
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      setState((prev) => ({ ...prev, error }))
      throw err
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update transaction')
      const transaction = await res.json()
      refreshState()
      return transaction
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      setState((prev) => ({ ...prev, error }))
      return null
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  const deleteTransaction = async (id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete transaction')
      refreshState()
      return true
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      setState((prev) => ({ ...prev, error }))
      return false
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  const getTransactions = async () => {
    const res = await fetch('/api/transactions')
    if (!res.ok) throw new Error('Failed to fetch transactions')
    return res.json()
  }

  const addCategory = async (c: Omit<Category, 'id' | 'createdAt'>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(c),
      })
      if (!res.ok) throw new Error('Failed to add category')
      const category = await res.json()
      refreshState()
      return category
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      setState((prev) => ({ ...prev, error }))
      throw err
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  const getCategories = async () => {
    const res = await fetch('/api/categories')
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json()
  }

  const deleteCategory = async (id: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete category')
      refreshState()
      return true
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error'
      setState((prev) => ({ ...prev, error }))
      return false
    } finally {
      setState((prev) => ({ ...prev, loading: false }))
    }
  }

  const setSelectedMonth = (date: Date) => {
    setState((prev) => ({ ...prev, selectedMonth: date }))
  }

  const getSummary = async (month: string) => {
    const res = await fetch(`/api/summary?month=${month}`)
    if (!res.ok) throw new Error('Failed to fetch summary')
    return res.json()
  }

  return (
    <AppContext.Provider
      value={{
        state,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactions,
        addCategory,
        getCategories,
        deleteCategory,
        setSelectedMonth,
        getSummary,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
