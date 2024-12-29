import "next-auth"
import { User } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: number
      username: string
      email: string
      role: string
    }
  }

  interface User extends Omit<User, "pin_hash"> {
    id: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number
    username: string
    email: string
    role: string
  }
} 