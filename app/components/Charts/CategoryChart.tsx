'use client'

import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '@/context/AppContext'
import { filterByMonth, groupByCategory } from '@/lib/utils'

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

export default function CategoryChart() {
  const { state } = useApp()

  const data = useMemo(() => {
    const monthTransactions = filterByMonth(state.transactions, state.selectedMonth)
    const byCategory = groupByCategory(monthTransactions, 'expense')

    return Object.entries(byCategory).map(([catId, amount]) => ({
      name: state.categories.find((c) => c.id === catId)?.name || catId,
      value: amount / 100,
    }))
  }, [state.transactions, state.selectedMonth, state.categories])

  if (data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-bold mb-4">Expenses by Category</h3>
        <p className="text-gray-500">No expense data for this month</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Expenses by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name} ($${value.toFixed(0)})`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${(value as number).toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
