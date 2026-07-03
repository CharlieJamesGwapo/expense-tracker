import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const store = getStore()
  const transaction = store.getTransaction(params.id)

  if (!transaction) {
    return NextResponse.json(
      { error: 'Transaction not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(transaction)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const store = getStore()

    const transaction = store.updateTransaction(params.id, body)

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const store = getStore()
  const deleted = store.deleteTransaction(params.id)

  if (!deleted) {
    return NextResponse.json(
      { error: 'Transaction not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true })
}
