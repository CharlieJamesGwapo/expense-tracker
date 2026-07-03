'use client'

import React, { useState } from 'react'
import { useApp } from '@/context/AppContext'

export default function CategoryManager() {
  const { state, addCategory } = useApp()
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('Please enter a category name')
      return
    }

    try {
      await addCategory({
        name: formData.name,
        type: formData.type,
      })

      setFormData({ name: '', type: 'expense' })
    } catch (err) {
      alert('Failed to add category')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
          placeholder="e.g., Coffee"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
          className="select"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <button type="submit" disabled={state.loading} className="btn btn-primary w-full">
        {state.loading ? 'Adding...' : 'Add Category'}
      </button>
    </form>
  )
}
