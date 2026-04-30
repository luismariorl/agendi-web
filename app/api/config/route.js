import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug requerido' }, { status: 400 });
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = process.env.GOOGLE_SHEETS_ID;

    // Leer empresas
    const empresasRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Empresas!A:E',
    });

    const empresas = empresasRes.data.values || [];
    const headers = empresas[0];
    const rows = empresas.slice(1);

    // Buscar empresa por slug (form_id)
    const empresa = rows.find(row => {
      const formId = row[headers.indexOf('form_id')] || '';
      const nombre = (row[headers.indexOf('nombre_negocio')] || '').toLowerCase().replace(/\s+/g, '-');
      return formId === slug || nombre === slug;
    });

    if (!empresa) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 });
    }

    const formId = empresa[headers.indexOf('form_id')];
    const nombreNegocio = empresa[headers.indexOf('nombre_negocio')];

    // Leer especialistas
    const espRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Especialistas!A:F',
    });

    const espRows = espRes.data.values || [];
    const espHeaders = espRows[0];
    const especialistas = espRows.slice(1)
      .filter(row => (row[espHeaders.indexOf('form_id')] || '') === formId)
      .map(row => ({
        nombre: row[espHeaders.indexOf('nombre_especialista')],
        calendar_id: row[espHeaders.indexOf('calendar_id')],
        hora_inicio: row[espHeaders.indexOf('hora_inicio')] || '09:00',
        hora_fin: row[espHeaders.indexOf('hora_fin')] || '18:00',
        dias_trabajo: (row[espHeaders.indexOf('dias_trabajo')] || '').split(',').map(d => d.trim()),
      }));

    // Leer servicios
    const servRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Servicios!A:D',
    });

    const servRows = servRes.data.values || [];
    const servHeaders = servRows[0];
    const servicios = servRows.slice(1)
      .filter(row => (row[servHeaders.indexOf('form_id')] || '') === formId)
      .map(row => ({
        nombre: row[servHeaders.indexOf('nombre_servicio')],
        precio: row[servHeaders.indexOf('precio')],
        duracion: parseInt(row[servHeaders.indexOf('duracion_min')] || '60'),
      }));

    return NextResponse.json({ nombreNegocio, formId, especialistas, servicios });

  } catch (error) {
    console.error('Error leyendo config:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}