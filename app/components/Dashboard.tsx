'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import MonthNav from './MonthNav'
import Summary from './Summary'
import TransactionList from './TransactionList'
import TransactionForm from './TransactionForm'
import Charts from './Charts/Charts'
import CategoryManager from './CategoryManager'

export default function Dashboard() {
  const { state } = useApp()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
        </div>
      </header>

      <main className="container py-8">
        {state.error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
              <TransactionForm />
            </div>
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Add Category</h2>
              <CategoryManager />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <MonthNav />
            <Summary />
            <Charts />
          </div>
        </div>

        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Transactions</h2>
            <TransactionList />
          </div>
        </div>
      </main>
    </div>
  )
}
