import { NextRequest } from 'next/server'
import { UserController } from '@/lib/controllers/userController'

const userController = new UserController()

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params
  return userController.followUser(request, userId)
}

