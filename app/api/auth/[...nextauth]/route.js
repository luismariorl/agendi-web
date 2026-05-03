import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getSheetData } from "@/lib/sheets"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const empresas = await getSheetData("Empresas")
        const fila = empresas.find(row => row.gmail_admin === user.email)
        if (!fila) return false
        return true
      } catch {
        return false
      }
    },
    async session({ session }) {
      try {
        const empresas = await getSheetData("Empresas")
        const fila = empresas.find(row => row.gmail_admin === session.user.email)
        if (fila) {
          session.user.plan = fila.plan
          session.user.form_id = fila.form_id
          session.user.nombre_negocio = fila.nombre_negocio
        }
      } catch {}
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }