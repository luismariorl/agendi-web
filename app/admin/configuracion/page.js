import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getSheetData } from "@/lib/sheets"
import ConfiguracionClient from "@/components/ConfiguracionClient"

export default async function ConfiguracionPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/admin/login")

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)
  if (!empresa) redirect("/admin/login")

  const filaEmpresa = empresas.indexOf(empresa) + 2

  return <ConfiguracionClient empresa={{ ...empresa, _fila: filaEmpresa }} />
}