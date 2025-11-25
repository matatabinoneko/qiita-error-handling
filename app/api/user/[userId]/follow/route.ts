import { NextRequest, NextResponse } from 'next/server'

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
      return NextResponse.json({ errorCode: 4001 }, { status: 400 })
    }

    // ユーザー存在確認
    const user = mockUsers.find(u => u.id === userId)
    if (!user) {
      return NextResponse.json({ errorCode: 4041 }, { status: 404 })
    }

    // 既にフォロー済みかチェック
    if (followingUsers.has(userId)) {
      return NextResponse.json({ errorCode: 4002 }, { status: 400 })
    }

    // フォロー処理
    followingUsers.add(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ errorCode: 4001 }, { status: 400 })
  }
}

