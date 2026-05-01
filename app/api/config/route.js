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

    const empresasRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Empresas!A:G',
    });

    const empresas = empresasRes.data.values || [];
    const headers = empresas[0];
    const rows = empresas.slice(1);

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

    const espRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Especialistas!A:G',
    });

    const espRows = espRes.data.values || [];
    const espHeaders = espRows[0];

    const especialistas = espRows.slice(1)
      .filter(row => (row[espHeaders.indexOf('form_id')] || '') === formId)
      .map(row => {
        // Soportar múltiples horarios separados por | ej: "08:00|14:00"
        const horaInicioRaw = row[espHeaders.indexOf('hora_inicio')] || '09:00';
        const horaFinRaw = row[espHeaders.indexOf('hora_fin')] || '18:00';

        const horasInicio = horaInicioRaw.split('|').map(h => h.trim());
        const horasFin = horaFinRaw.split('|').map(h => h.trim());

        // Construir array de turnos: [{ inicio: '08:00', fin: '12:00' }, { inicio: '14:00', fin: '18:00' }]
        const turnos = horasInicio.map((ini, i) => ({
          inicio: ini,
          fin: horasFin[i] || horasFin[horasFin.length - 1],
        }));

        return {
          nombre: row[espHeaders.indexOf('nombre_especialista')] || '',
          calendar_id: row[espHeaders.indexOf('calendar_id')] || '',
          hora_inicio: horasInicio[0], // primer turno para mostrar en UI
          hora_fin: horasFin[horasFin.length - 1], // último turno para mostrar en UI
          turnos, // array completo de turnos
          dias_trabajo: (row[espHeaders.indexOf('dias_trabajo')] || '').split(',').map(d => d.trim()),
          sucursal: row[espHeaders.indexOf('sucursal')] || 'Principal',
        };
      });

    const sucursalesUnicas = [...new Set(especialistas.map(e => e.sucursal))];
    const tieneSucursales = sucursalesUnicas.length > 1;

    const servRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Servicios!A:D',
    });

    const servRows = servRes.data.values || [];
    const servHeaders = servRows[0];
    const servicios = servRows.slice(1)
      .filter(row => (row[servHeaders.indexOf('form_id')] || '') === formId)
      .map(row => ({
        nombre: row[servHeaders.indexOf('nombre_servicio')] || '',
        precio: row[servHeaders.indexOf('precio')] || '0',
        duracion: parseInt(row[servHeaders.indexOf('duracion_min')] || '60'),
      }));

    return NextResponse.json({
      nombreNegocio,
      formId,
      especialistas,
      servicios,
      sucursales: sucursalesUnicas,
      tieneSucursales,
    });

  } catch (error) {
    console.error('Error leyendo config:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
