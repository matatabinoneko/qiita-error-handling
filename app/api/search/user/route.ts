import { NextRequest, NextResponse } from 'next/server'
import { ErrorCode } from '@/lib/errors'

// モックデータベース（実際の実装ではデータベースを使用）
const mockUsers = [
  { id: 'user1', name: 'ユーザー1' },
  { id: 'user2', name: 'ユーザー2' },
  { id: 'user3', name: 'ユーザー3' },
]

const blockedUsers = ['user2'] // ブロックされているユーザー

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    // パラメータ検証
    if (!userId || typeof userId !== 'string' || userId.trim() === '' || !userId.startsWith("user")) {
      return NextResponse.json({ errorCode: "bad-request" as ErrorCode }, { status: 400 })
    }

    // ユーザー検索
    const user = mockUsers.find(u => u.id === userId)

    if (!user) {
      return NextResponse.json({ errorCode: "not-found" as ErrorCode }, { status: 404 })
    }

    // ブロックチェック
    if (blockedUsers.includes(userId)) {
      return NextResponse.json({ errorCode: "not-found" as ErrorCode }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ errorCode: "bad-request" as ErrorCode }, { status: 400 })
  }
}

