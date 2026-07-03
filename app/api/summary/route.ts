import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'
import { filterByMonth, groupByCategory, sumTransactions, getMonthKey } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const store = getStore()
  const searchParams = req.nextUrl.searchParams
  const month = searchParams.get('month')

  if (!month) {
    return NextResponse.json(
      { error: 'month query parameter is required (format: YYYY-MM)' },
      { status: 400 }
    )
  }

  const [year, monthNum] = month.split('-')
  const targetMonth = new Date(parseInt(year), parseInt(monthNum) - 1)

  const allTransactions = store.getAllTransactions()
  const monthTransactions = filterByMonth(allTransactions, targetMonth)

  const totalIncome = sumTransactions(monthTransactions, { type: 'income' })
  const totalExpense = sumTransactions(monthTransactions, { type: 'expense' })

  const expenseByCategory = groupByCategory(monthTransactions, 'expense')
  const incomeByCategory = groupByCategory(monthTransactions, 'income')

  const byCategory = [
    ...Object.entries(expenseByCategory).map(([catId, amount]) => ({
      category: catId,
      amount,
      type: 'expense' as const,
      percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
    })),
    ...Object.entries(incomeByCategory).map(([catId, amount]) => ({
      category: catId,
      amount,
      type: 'income' as const,
      percentage: totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0,
    })),
  ]

  const last12Months = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const filtered = filterByMonth(allTransactions, d)
    const income = sumTransactions(filtered, { type: 'income' })
    const expense = sumTransactions(filtered, { type: 'expense' })

    last12Months.push({
      month: getMonthKey(d),
      income,
      expense,
    })
  }

  return NextResponse.json({
    month,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    byCategory,
    trends: {
      last12Months,
    },
  })
}
