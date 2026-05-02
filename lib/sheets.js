import { google } from "googleapis"

async function getAuth(readonly = false) {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: [readonly
      ? "https://www.googleapis.com/auth/spreadsheets.readonly"
      : "https://www.googleapis.com/auth/spreadsheets"
    ],
  })
}

async function leerSheet(sheetId, pestana) {
  const auth = await getAuth(true)
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

export async function appendRow(pestana, valores) {
  const auth = await getAuth()
  const sheets = google.sheets({ version: "v4", auth })

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: pestana,
    valueInputOption: "RAW",
    requestBody: { values: [valores] },
  })
}

export async function updateRow(pestana, fila, valores) {
  const auth = await getAuth()
  const sheets = google.sheets({ version: "v4", auth })

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: `${pestana}!A${fila}:G${fila}`,
    valueInputOption: "RAW",
    requestBody: { values: [valores] },
  })
}
export async function deleteRow(pestana, fila) {
  const auth = await getAuth()
  const sheets = google.sheets({ version: "v4", auth })

  const sheetInfo = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
  })

  const sheet = sheetInfo.data.sheets.find(s => s.properties.title === pestana)
  const sheetId = sheet.properties.sheetId

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId,
            dimension: "ROWS",
            startIndex: fila - 1,
            endIndex: fila,
          },
        },
      }],
    },
  })
}