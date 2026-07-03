import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export async function GET(req: NextRequest) {
  const store = getStore()
  const categories = store.getAllCategories()
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const store = getStore()

    if (!body.name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 }
      )
    }
    if (!['income', 'expense'].includes(body.type)) {
      return NextResponse.json(
        { error: 'type must be "income" or "expense"' },
        { status: 400 }
      )
    }

    const category = store.addCategory({
      name: body.name,
      type: body.type,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
