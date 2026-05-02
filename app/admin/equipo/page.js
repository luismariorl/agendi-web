import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getSheetData, getReservas } from "@/lib/sheets"
import EquipoClient from "@/components/EquipoClient"

export default async function EquipoPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)
  if (!empresa) redirect("/admin/login")

  const todosEspecialistas = await getSheetData("Especialistas")
  const misEspecialistas = todosEspecialistas
    .map((e, i) => ({ ...e, _fila: i + 2 }))
    .filter(e => e.form_id === empresa.form_id)

  const reservas = await getReservas(empresa.sheet_id)

  // Sucursales vienen de Configuración, no de los especialistas
  const sucursales = (empresa.sucursales || "").split("|").map(s => s.trim()).filter(Boolean)

  return <EquipoClient especialistas={misEspecialistas} reservas={reservas} sucursales={sucursales} />
}