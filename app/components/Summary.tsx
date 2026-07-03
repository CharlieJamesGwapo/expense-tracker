'use client'

import React, { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { getMonthKey, formatCurrency } from '@/lib/utils'

interface SummaryData {
  totalIncome: number
  totalExpense: number
  netBalance: number
}

export default function Summary() {
  const { state } = useApp()
  const [summary, setSummary] = useState<SummaryData>({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  })

  useEffect(() => {
    const monthKey = getMonthKey(state.selectedMonth)
    const monthTransactions = state.transactions.filter((t) => {
      const tKey = getMonthKey(t.date)
      return tKey === monthKey
    })

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    setSummary({
      totalIncome: income,
      totalExpense: expense,
      netBalance: income - expense,
    })
  }, [state.selectedMonth, state.transactions])

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="card bg-blue-50">
        <p className="text-sm text-gray-600">Total Income</p>
        <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.totalIncome)}</p>
      </div>
      <div className="card bg-red-50">
        <p className="text-sm text-gray-600">Total Expenses</p>
        <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalExpense)}</p>
      </div>
      <div className={`card ${summary.netBalance >= 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
        <p className="text-sm text-gray-600">Net Balance</p>
        <p className={`text-2xl font-bold ${summary.netBalance >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
          {formatCurrency(summary.netBalance)}
        </p>
      </div>
    </div>
  )
}
