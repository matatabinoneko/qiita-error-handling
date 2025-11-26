import { NextRequest, NextResponse } from "next/server";
import { UserService } from "../services/userService";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  /**
   * ユーザーフォローAPI
   */
  async followUser(
    request: NextRequest,
    userId: string
  ): Promise<NextResponse> {
    try {
      const result = await this.userService.followUser(userId);

      if (!result.success) {
        return NextResponse.json(
          { errorCode: result.errorCode },
          { status: result.status }
        );
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ errorCode: 4001 }, { status: 400 });
    }
  }

  /**
   * ユーザー検索API
   */
  async searchUser(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const { userId } = body;

      const result = await this.userService.searchUser(userId);

      if (!result.user) {
        return NextResponse.json(null, { status: 404 });
      }

      return NextResponse.json({ user: result.user });
    } catch (error) {
      return NextResponse.json(null, { status: 400 });
    }
  }
}
