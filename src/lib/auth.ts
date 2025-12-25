import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const validEmail = "admin@iconpln.co.id"
        // Hashed password for "admin1234"
        const validPasswordHash = "$2b$10$7dv0aZleGYMwRNbqh5yi4OGvXQ2k.Rp4p4H1cMiGL3R2yKs.MG5Ga"

        if (credentials.email === validEmail) {
            const isValid = await bcrypt.compare(credentials.password, validPasswordHash)
            if (isValid) {
                return {
                    id: "1",
                    name: "Admin ICONNET",
                    email: validEmail,
                    role: "admin"
                }
            }
        }
        
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
