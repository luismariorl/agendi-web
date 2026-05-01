import { google } from "googleapis"

async function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  })
}

async function leerSheet(sheetId, pestana) {
  const auth = await getAuth()
  const sheets = google.sheets({ version: "v4", auth })

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: pestana,
  })

  const [headers, ...rows] = response.data.values || []
  if (!headers) return []

  return rows.map(row =>
    headers.reduce((obj, header, i) => {
      obj[header] = row[i] || ""
      return obj
    }, {})
  )
}

export async function getSheetData(pestana) {
  return leerSheet(process.env.GOOGLE_SHEETS_ID, pestana)
}

export async function getReservas(sheetId) {
  return leerSheet(sheetId, "Reservas")
}