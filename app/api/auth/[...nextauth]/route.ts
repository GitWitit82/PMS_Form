import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@/types"

// Define our custom properties
type UserProps = {
  id: number
  username: string
  email: string
  role: UserRole
}

// Extend the built-in types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number
      username: string
      email: string
      role: UserRole
    } & DefaultSession["user"]
  }
}

// Define a separate type for the User object
type AuthUser = {
  id: number
  username: string
  email: string
  role: UserRole
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT extends UserProps {}
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        pin: { label: "PIN", type: "password" }
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.username || !credentials?.pin) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          select: {
            user_id: true,
            username: true,
            email: true,
            role: true,
            pin_hash: true
          }
        })

        if (!user || !(await bcrypt.compare(credentials.pin, user.pin_hash))) {
          return null
        }

        return {
          id: user.user_id,
          username: user.username,
          email: user.email,
          role: user.role as UserRole
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser
        token.id = authUser.id
        token.username = authUser.username
        token.email = authUser.email
        token.role = authUser.role as UserRole
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          email: token.email,
          role: token.role as UserRole
        }
      }
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    signOut: "/auth/signin"
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 