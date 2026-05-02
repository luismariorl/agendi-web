import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getSheetData } from "@/lib/sheets"
import ServiciosClient from "@/components/ServiciosClient"

export default async function ServiciosPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)
  if (!empresa) redirect("/admin/login")

  const todosServicios = await getSheetData("Servicios")
  const misServicios = todosServicios
    .map((s, i) => ({ ...s, _fila: i + 2 }))
    .filter(s => s.form_id === empresa.form_id)

  const sucursales = (empresa.sucursales || "").split("|").map(s => s.trim()).filter(Boolean)

  return <ServiciosClient servicios={misServicios} empresa={empresa} sucursales={sucursales} />
  
}