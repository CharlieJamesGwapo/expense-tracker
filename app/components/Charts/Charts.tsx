'use client'

import TrendChart from './TrendChart'
import CategoryChart from './CategoryChart'
import ComparisonChart from './ComparisonChart'

export default function Charts() {
  return (
    <div className="space-y-6">
      <CategoryChart />
      <ComparisonChart />
      <TrendChart />
    </div>
  )
}
