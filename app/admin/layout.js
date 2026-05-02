import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getSheetData } from "@/lib/sheets"
import AdminShell from "@/components/AdminShell"

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <>{children}</>
  }

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)

  if (!empresa) {
    return <>{children}</>
  }

  return (
    <AdminShell empresa={empresa} usuario={session.user}>
      {children}
    </AdminShell>
  )
}