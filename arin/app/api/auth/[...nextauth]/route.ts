import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import FacebookProvider from "next-auth/providers/facebook"

// In a real app, you would connect to a database
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    password: "password123", // In a real app, this would be hashed
    image: "/placeholder.svg?height=32&width=32",
  },
]

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = users.find((user) => user.email === credentials.email)

        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        }

        return null
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || "",
      clientSecret: process.env.FACEBOOK_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})

export { handler as GET, handler as POST }

