import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const store = getStore()
  const deleted = store.deleteCategory(params.id)

  if (!deleted) {
    return NextResponse.json(
      { error: 'Cannot delete default category or category not found' },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true })
}
