'use client'

import React, { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { filterByMonth, getMonthKey, formatCurrency } from '@/lib/utils'

export default function TransactionList() {
  const { state, deleteTransaction } = useApp()

  const monthTransactions = useMemo(() => {
    return filterByMonth(state.transactions, state.selectedMonth).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [state.transactions, state.selectedMonth])

  const getCategoryName = (catId: string) => {
    return state.categories.find((c) => c.id === catId)?.name || catId
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await deleteTransaction(id)
    }
  }

  if (monthTransactions.length === 0) {
    return <p className="text-gray-500">No transactions for this month</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr>
            <th className="text-left py-2 px-4">Date</th>
            <th className="text-left py-2 px-4">Description</th>
            <th className="text-left py-2 px-4">Category</th>
            <th className="text-right py-2 px-4">Amount</th>
            <th className="text-center py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {monthTransactions.map((t) => (
            <tr key={t.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{new Date(t.date).toLocaleDateString()}</td>
              <td className="py-2 px-4">{t.description}</td>
              <td className="py-2 px-4">{getCategoryName(t.category)}</td>
              <td className={`py-2 px-4 text-right font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {t.type === 'income' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
