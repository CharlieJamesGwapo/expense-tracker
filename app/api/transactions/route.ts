import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'
import { filterByMonth, getMonthKey } from '@/lib/utils'
import { Transaction } from '@/lib/types'

export async function GET(req: NextRequest) {
  const store = getStore()
  const searchParams = req.nextUrl.searchParams
  const month = searchParams.get('month')
  const category = searchParams.get('category')
  const type = searchParams.get('type') as 'income' | 'expense' | null

  let transactions = store.getAllTransactions()

  if (month) {
    const [year, monthNum] = month.split('-')
    const date = new Date(parseInt(year), parseInt(monthNum) - 1)
    transactions = filterByMonth(transactions, date)
  }

  if (category) {
    transactions = transactions.filter((t) => t.category === category)
  }

  if (type) {
    transactions = transactions.filter((t) => t.type === type)
  }

  return NextResponse.json(transactions)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const store = getStore()

    if (!body.type || !['income', 'expense'].includes(body.type)) {
      return NextResponse.json(
        { error: 'type must be "income" or "expense"' },
        { status: 400 }
      )
    }
    if (typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { error: 'amount must be a positive number' },
        { status: 400 }
      )
    }
    if (!body.category) {
      return NextResponse.json(
        { error: 'category is required' },
        { status: 400 }
      )
    }
    if (!store.getCategory(body.category)) {
      return NextResponse.json(
        { error: 'category does not exist' },
        { status: 400 }
      )
    }
    if (!body.date) {
      return NextResponse.json(
        { error: 'date is required' },
        { status: 400 }
      )
    }

    const transaction = store.addTransaction({
      type: body.type,
      amount: body.amount,
      category: body.category,
      description: body.description || '',
      date: new Date(body.date),
      recurring: body.recurring === 'monthly' ? 'monthly' : null,
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
