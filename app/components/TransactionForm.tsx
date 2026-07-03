'use client'

import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function TransactionForm() {
  const { state, addTransaction } = useApp()
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
  })

  const expenseCategories = state.categories.filter((c) => c.type === 'expense')
  const incomeCategories = state.categories.filter((c) => c.type === 'income')
  const relevantCategories = formData.type === 'expense' ? expenseCategories : incomeCategories

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || !formData.category) {
      alert('Please fill in all fields')
      return
    }

    try {
      await addTransaction({
        type: formData.type,
        amount: Math.round(parseFloat(formData.amount) * 100),
        category: formData.category,
        description: formData.description,
        date: new Date(formData.date),
        recurring: formData.recurring ? 'monthly' : null,
      })

      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        recurring: false,
      })
    } catch (err) {
      alert('Failed to add transaction')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as 'income' | 'expense', category: '' })
          }
          className="select"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="input"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="select"
        >
          <option value="">-- Select Category --</option>
          {relevantCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input"
          placeholder="Optional note"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="input"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="recurring"
          checked={formData.recurring}
          onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor="recurring" className="ml-2 text-sm text-gray-700">
          Recurring monthly
        </label>
      </div>

      <button type="submit" disabled={state.loading} className="btn btn-primary w-full">
        {state.loading ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  )
}
