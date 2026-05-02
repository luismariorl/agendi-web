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
  const { nombre_servicio, precio, duracion_min } = body

  await appendRow("Servicios", [empresa.form_id, nombre_servicio, precio, duracion_min])

  return Response.json({ ok: true })
}

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)
  if (!empresa) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  console.log("PUT servicios body:", body)
  const { fila, nombre_servicio, precio, duracion_min, sucursal } = body

  await updateRow("Servicios", fila, [empresa.form_id, nombre_servicio, precio, duracion_min, sucursal])  

  return Response.json({ ok: true })
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)
  if (!empresa) return Response.json({ error: "No autorizado" }, { status: 401 })

  const body = await req.json()
  await deleteRow("Servicios", body.fila)

  return Response.json({ ok: true })
}