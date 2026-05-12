import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Color default si la empresa no tiene color_marca o no es plan Pro
const COLOR_DEFAULT = '#534AB7';

// Plan que tiene acceso a personalización de color
const PLAN_CON_COLOR_CUSTOM = 'Pro';

// Valida que el color sea un hex válido (#RRGGBB)
function validarColor(color) {
  if (!color) return COLOR_DEFAULT;
  const regex = /^#[0-9A-Fa-f]{6}$/;
  if (!regex.test(color.trim())) return COLOR_DEFAULT;
  return color.trim();
}

// Genera una versión clara del color (mezcla con blanco al 75%)
function colorClaro(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mezcla = 0.75;
  const nR = Math.round(r + (255 - r) * mezcla);
  const nG = Math.round(g + (255 - g) * mezcla);
  const nB = Math.round(b + (255 - b) * mezcla);
  return `#${nR.toString(16).padStart(2, '0')}${nG.toString(16).padStart(2, '0')}${nB.toString(16).padStart(2, '0')}`;
}

// Genera una versión muy clara del color (mezcla con blanco al 92%) — para fondos sutiles
function colorMuyClaro(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mezcla = 0.92;
  const nR = Math.round(r + (255 - r) * mezcla);
  const nG = Math.round(g + (255 - g) * mezcla);
  const nB = Math.round(b + (255 - b) * mezcla);
  return `#${nR.toString(16).padStart(2, '0')}${nG.toString(16).padStart(2, '0')}${nB.toString(16).padStart(2, '0')}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug requerido' }, { status: 400 });
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const sheetId = process.env.GOOGLE_SHEETS_ID;

    // Rango A:H para leer color_marca (columna H) y plan (columna E)
    const empresasRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Empresas!A:H',
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
    const plan = (empresa[headers.indexOf('plan')] || '').trim();

    // Solo aplica color custom si el plan es Pro
    // Si no es Pro o no tiene color válido, usa el default
    let colorMarca = COLOR_DEFAULT;
    if (plan === PLAN_CON_COLOR_CUSTOM) {
      const colorMarcaRaw = empresa[headers.indexOf('color_marca')] || '';
      colorMarca = validarColor(colorMarcaRaw);
    }

    const colorMarcaClaro = colorClaro(colorMarca);
    const colorMarcaMuyClaro = colorMuyClaro(colorMarca);

    const espRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Especialistas!A:G',
    });

    const espRows = espRes.data.values || [];
    const espHeaders = espRows[0];

    const especialistas = espRows.slice(1)
      .filter(row => (row[espHeaders.indexOf('form_id')] || '') === formId)
      .map(row => {
        const horaInicioRaw = row[espHeaders.indexOf('hora_inicio')] || '09:00';
        const horaFinRaw = row[espHeaders.indexOf('hora_fin')] || '18:00';
        const horasInicio = horaInicioRaw.split('|').map(h => h.trim());
        const horasFin = horaFinRaw.split('|').map(h => h.trim());
        const turnos = horasInicio.map((ini, i) => ({
          inicio: ini,
          fin: horasFin[i] || horasFin[horasFin.length - 1],
        }));

        return {
          nombre: row[espHeaders.indexOf('nombre_especialista')] || '',
          calendar_id: row[espHeaders.indexOf('calendar_id')] || '',
          hora_inicio: horasInicio[0],
          hora_fin: horasFin[horasFin.length - 1],
          turnos,
          dias_trabajo: (row[espHeaders.indexOf('dias_trabajo')] || '').split(',').map(d => d.trim()),
          sucursal: row[espHeaders.indexOf('sucursal')] || 'Principal',
        };
      });

    const sucursalesUnicas = [...new Set(especialistas.map(e => e.sucursal))];
    const tieneSucursales = sucursalesUnicas.length > 1;

    const servRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Servicios!A:E',
    });

    const servRows = servRes.data.values || [];
    const servHeaders = servRows[0];
    const servicios = servRows.slice(1)
      .filter(row => (row[servHeaders.indexOf('form_id')] || '') === formId)
      .map(row => ({
        nombre: row[servHeaders.indexOf('nombre_servicio')] || '',
        precio: row[servHeaders.indexOf('precio')] || '0',
        duracion: parseInt(row[servHeaders.indexOf('duracion_min')] || '60'),
        sucursales: (row[servHeaders.indexOf('sucursal')] || '').split('|').map(s => s.trim()).filter(Boolean),
      }));

    return NextResponse.json({
      nombreNegocio,
      formId,
      especialistas,
      servicios,
      sucursales: sucursalesUnicas,
      tieneSucursales,
      colorMarca,
      colorMarcaClaro,
      colorMarcaMuyClaro,
    });

  } catch (error) {
    console.error('Error leyendo config:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
