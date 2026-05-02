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

async function limpiarSucursalEliminada(sheets, sucursalesActuales, sucursalesNuevas, form_id) {
  const eliminadas = sucursalesActuales.filter(s => !sucursalesNuevas.includes(s))
  if (eliminadas.length === 0) return

  // Limpiar en Servicios
  const serviciosRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: "Servicios",
  })
  const [sHeaders, ...sRows] = serviciosRes.data.values || []
  if (sHeaders) {
    const fiSucursal = sHeaders.indexOf("sucursal")
    const fiFormId = sHeaders.indexOf("form_id")
    for (let i = 0; i < sRows.length; i++) {
      const row = sRows[i]
      if (row[fiFormId] !== form_id) continue
      const subs = (row[fiSucursal] || "").split("|").map(s => s.trim()).filter(Boolean)
      const nuevasSubs = subs.filter(s => !eliminadas.includes(s))
      if (nuevasSubs.length !== subs.length) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SHEETS_ID,
          range: `Servicios!E${i + 2}`,
          valueInputOption: "RAW",
          requestBody: { values: [[nuevasSubs.join("|")]] },
        })
      }
    }
  }

  // Limpiar en Especialistas
  const espRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: "Especialistas",
  })
  const [eHeaders, ...eRows] = espRes.data.values || []
  if (eHeaders) {
    const fiSucursal = eHeaders.indexOf("sucursal")
    const fiFormId = eHeaders.indexOf("form_id")
    for (let i = 0; i < eRows.length; i++) {
      const row = eRows[i]
      if (row[fiFormId] !== form_id) continue
      const sucursal = row[fiSucursal] || ""
      if (eliminadas.includes(sucursal)) {
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SHEETS_ID,
          range: `Especialistas!G${i + 2}`,
          valueInputOption: "RAW",
          requestBody: { values: [[""]] },
        })
      }
    }
  }
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

  // Detectar sucursales eliminadas y limpiarlas
  const sucursalesActuales = (empresa.sucursales || "").split("|").map(s => s.trim()).filter(Boolean)
  const sucursalesNuevas = (sucursales || "").split("|").map(s => s.trim()).filter(Boolean)
  await limpiarSucursalEliminada(sheets, sucursalesActuales, sucursalesNuevas, empresa.form_id)

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