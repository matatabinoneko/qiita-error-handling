import { UserRepository } from '../repositories/userRepository'
import { User } from '../types/user'

export class UserService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository
  }

  /**
   * ユーザーをフォローする
   */
  async followUser(userId: string): Promise<{ success: boolean; errorCode?: number }> {
    // パラメータ検証
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return { success: false, errorCode: 4001 }
    }

    // ユーザー存在確認
    const userExists = await this.userRepository.exists(userId)
    if (!userExists) {
      return { success: false, errorCode: 4041 }
    }

    // 既にフォロー済みかチェック
    const isFollowing = await this.userRepository.isFollowing(userId)
    if (isFollowing) {
      return { success: false, errorCode: 4002 }
    }

    // フォロー処理
    await this.userRepository.follow(userId)

    return { success: true }
  }

  /**
   * ユーザーを検索する
   */
  async searchUser(userId: string): Promise<{ user: User | null; errorCode?: number }> {
    // パラメータ検証
    if (!userId || typeof userId !== 'string' || userId.trim() === '' || !userId.startsWith('user')) {
      return { user: null, errorCode: 400 }
    }

    // ユーザー検索
    const user = await this.userRepository.findById(userId)
    if (!user) {
      return { user: null, errorCode: 404 }
    }

    // ブロックチェック
    const isBlocked = await this.userRepository.isBlocked(userId)
    if (isBlocked) {
      return { user: null, errorCode: 404 }
    }

    return { user }
  }
}

