'use client'

import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '@/context/AppContext'
import { getMonthKey } from '@/lib/utils'

export default function TrendChart() {
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
      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      last12Months.push({
        month: key.slice(5),
        amount: expense / 100,
      })
    }
    return last12Months
  }, [state.transactions])

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">12-Month Spending Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Line type="monotone" dataKey="amount" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
