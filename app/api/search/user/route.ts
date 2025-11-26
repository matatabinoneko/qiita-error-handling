import { NextRequest } from 'next/server'
import { UserController } from '@/lib/controllers/userController'


const userController = new UserController()

export async function POST(request: NextRequest) {
  return userController.searchUser(request)
}

