import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const calendarId = searchParams.get('calendarId');
  const fecha = searchParams.get('fecha');
  const duracion = parseInt(searchParams.get('duracion') || '60');
  const horaInicio = searchParams.get('horaInicio') || '09:00';
  const horaFin = searchParams.get('horaFin') || '18:00';

  if (!calendarId || !fecha) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
  }

  // Limpiar fecha — solo YYYY-MM-DD sin espacios ni caracteres extra
  const fechaLimpia = fecha.trim().substring(0, 10);

  // Validar formato de fecha
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaLimpia)) {
    return NextResponse.json({ 
      slots: [], 
      error: `Formato de fecha inválido: ${fecha}` 
    });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const [hIni, mIni] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);

    // Construir fechas usando fechaLimpia
    const timeMin = new Date(`${fechaLimpia}T${horaInicio}:00-05:00`).toISOString();
    const timeMax = new Date(`${fechaLimpia}T${horaFin}:00-05:00`).toISOString();

    const res = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const eventos = res.data.items || [];

    const slots = [];
    let hora = hIni * 60 + mIni;
    const fin = hFin * 60 + mFin;

    while (hora + duracion <= fin) {
      const h = Math.floor(hora / 60);
      const m = hora % 60;
      const horaStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const slotInicio = new Date(`${fechaLimpia}T${horaStr}:00-05:00`);
      const slotFin = new Date(slotInicio.getTime() + duracion * 60000);

      const ocupado = eventos.some(evento => {
        const eventoInicio = new Date(evento.start.dateTime || evento.start.date);
        const eventoFin = new Date(evento.end.dateTime || evento.end.date);
        return slotInicio < eventoFin && slotFin > eventoInicio;
      });

      const period = h >= 12 ? 'pm' : 'am';
      const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const horaDisplay = `${h12}:${String(m).padStart(2, '0')} ${period}`;

      slots.push({
        hora24: horaStr,
        horaDisplay,
        disponible: !ocupado,
      });

      hora += duracion;
    }

    return NextResponse.json({ slots });

  } catch (error) {
    console.error('Error Calendar:', calendarId, error.message);
    return NextResponse.json({ 
      slots: [], 
      error: error.message 
    });
  }
}