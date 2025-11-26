import { User } from "../types/user";

// モックデータベース
const mockUsers: User[] = [
  { id: "user1", name: "ユーザー1" },
  { id: "user2", name: "ユーザー2" },
  { id: "user3", name: "ユーザー3" },
];

const followingUsers = new Set<string>(["user1"]); // 既にフォローしているユーザー
const blockedUsers = new Set<string>(["user2"]); // ブロックされているユーザー

export class UserRepository {
  /**
   * ユーザーIDでユーザーを取得
   */
  async findById(userId: string): Promise<User | null> {
    return mockUsers.find((u) => u.id === userId) || null;
  }

  /**
   * ユーザーが存在するかチェック
   */
  async exists(userId: string): Promise<boolean> {
    return mockUsers.some((u) => u.id === userId);
  }

  /**
   * ユーザーがフォロー済みかチェック
   */
  async isFollowing(userId: string): Promise<boolean> {
    return followingUsers.has(userId);
  }

  /**
   * ユーザーをフォローする
   */
  async follow(userId: string): Promise<void> {
    followingUsers.add(userId);
  }

  /**
   * ユーザーがブロックされているかチェック
   */
  async isBlocked(userId: string): Promise<boolean> {
    return blockedUsers.has(userId);
  }
}
