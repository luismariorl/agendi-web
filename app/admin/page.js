import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { getSheetData, getReservas } from "@/lib/sheets"
import DashboardClient from "@/components/DashboardClient"

export default async function AdminPage() {
  const session = await getServerSession()
  if (!session) redirect("/admin/login")

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)
  if (!empresa) redirect("/admin/login")

  const especialistas = await getSheetData("Especialistas")
  const misEspecialistas = especialistas.filter(e => e.form_id === empresa.form_id)
  const sucursales = (empresa.sucursales || "").split("|").map(s => s.trim()).filter(Boolean)

  const reservas = await getReservas(empresa.sheet_id)

  return (
    <DashboardClient
      empresa={empresa}
      reservas={reservas}
      sucursales={sucursales}
    />
  )
}