import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getSheetData, appendRow, updateRow, deleteRow } from "@/lib/sheets"

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)
  if (!empresa) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const { nombre_especialista, calendar_id, hora_inicio, hora_fin, dias_trabajo, sucursal } = body

  await appendRow("Especialistas", [
    empresa.form_id,
    nombre_especialista,
    calendar_id || "",
    hora_inicio,
    hora_fin,
    dias_trabajo,
    sucursal,
  ])

  return Response.json({ ok: true })
}

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)
  if (!empresa) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const { fila, nombre_especialista, calendar_id, hora_inicio, hora_fin, dias_trabajo, sucursal } = body

  await updateRow("Especialistas", fila, [
    empresa.form_id,
    nombre_especialista,
    calendar_id || "",
    hora_inicio,
    hora_fin,
    dias_trabajo,
    sucursal,
  ])

  return Response.json({ ok: true })
}
export async function DELETE(req) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)
  if (!empresa) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  const { fila } = body

  await deleteRow("Especialistas", fila)

  return Response.json({ ok: true })
}