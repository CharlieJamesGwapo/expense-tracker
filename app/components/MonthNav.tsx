'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'
import { getMonthKey } from '@/lib/utils'

export default function MonthNav() {
  const { state, setSelectedMonth } = useApp()

  const goToPreviousMonth = () => {
    const prev = new Date(state.selectedMonth)
    prev.setMonth(prev.getMonth() - 1)
    setSelectedMonth(prev)
  }

  const goToNextMonth = () => {
    const next = new Date(state.selectedMonth)
    next.setMonth(next.getMonth() + 1)
    setSelectedMonth(next)
  }

  const goToToday = () => {
    setSelectedMonth(new Date())
  }

  const monthDisplay = state.selectedMonth.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <div className="card flex items-center justify-between">
      <button onClick={goToPreviousMonth} className="btn btn-secondary">
        ← Previous
      </button>
      <h2 className="text-2xl font-bold">{monthDisplay}</h2>
      <div className="space-x-2">
        <button onClick={goToToday} className="btn btn-secondary">
          Today
        </button>
        <button onClick={goToNextMonth} className="btn btn-secondary">
          Next →
        </button>
      </div>
    </div>
  )
}
