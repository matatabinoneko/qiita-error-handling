import { NextRequest, NextResponse } from 'next/server'
import { ErrorCode } from '@/lib/errors'

// モックデータベース
const mockUsers = [
  { id: 'user1', name: 'ユーザー1' },
  { id: 'user2', name: 'ユーザー2' },
  { id: 'user3', name: 'ユーザー3' },
]

const followingUsers = new Set<string>(['user1']) // 既にフォローしているユーザー

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params

    // パラメータ検証
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json({ isSuccess: false, errorCode: "bad-request" as ErrorCode }, { status: 400 })
    }

    // ユーザー存在確認
    const user = mockUsers.find(u => u.id === userId)
    if (!user) {
      return NextResponse.json({ isSuccess: false, errorCode: "not-found" as ErrorCode }, { status: 404 })
    }

    // 既にフォロー済みかチェック
    if (followingUsers.has(userId)) {
      return NextResponse.json({ isSuccess: false, errorCode: "bad-request/already-followed" as ErrorCode }, { status: 400 })
    }

    // フォロー処理
    followingUsers.add(userId)

    return NextResponse.json({ isSuccess: true })
  } catch (error) {
    return NextResponse.json({ isSuccess: false, errorCode: "bad-request" as ErrorCode }, { status: 400 })
  }
}

