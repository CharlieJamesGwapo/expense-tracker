'use client'

import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useApp } from '@/context/AppContext'
import { getMonthKey } from '@/lib/utils'

export default function ComparisonChart() {
  const { state } = useApp()

  const data = useMemo(() => {
    const last12Months = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = getMonthKey(d)
      const monthTransactions = state.transactions.filter(
        (t) => getMonthKey(t.date) === key
      )
      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      last12Months.push({
        month: key.slice(5),
        income: income / 100,
        expense: expense / 100,
      })
    }
    return last12Months
  }, [state.transactions])

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Income vs Expenses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `$${(value as number).toFixed(2)}`} />
          <Legend />
          <Bar dataKey="income" fill="#10b981" />
          <Bar dataKey="expense" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
