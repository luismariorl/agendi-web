import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getSheetData } from "@/lib/sheets"
import { google } from "googleapis"

async function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
}

export async function PUT(req) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 })

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)
  if (!empresa) return Response.json({ error: "No autorizado" }, { status: 401 })

  const indice = empresas.findIndex(e => e.gmail_admin === session.user.email)
const fila = indice + 2
  const body = await req.json()
  const { nombre_negocio, whatsapp_dueño, sucursales } = body

  const auth = await getAuth()
  const sheets = google.sheets({ version: "v4", auth })

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: `Empresas!A${fila}:G${fila}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        empresa.form_id,
        nombre_negocio,
        empresa.sheet_id,
        whatsapp_dueño,
        empresa.plan,
        empresa.gmail_admin,
        sucursales,
      ]],
    },
  })

  return Response.json({ ok: true })
}