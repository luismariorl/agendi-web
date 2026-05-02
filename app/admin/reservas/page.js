import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getSheetData, getReservas } from "@/lib/sheets"
import ReservasClient from "@/components/ReservasClient"

export default async function ReservasPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)
  if (!empresa) redirect("/admin/login")

const reservas = await getReservas(empresa.sheet_id)
const sucursales = (empresa.sucursales || "").split("|").map(s => s.trim()).filter(Boolean)

return <ReservasClient reservas={reservas} empresa={empresa} sucursales={sucursales} />
}