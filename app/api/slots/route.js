import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const calendarId = searchParams.get('calendarId');
  const fecha = searchParams.get('fecha');
  const duracion = parseInt(searchParams.get('duracion') || '60');
  // Soportar múltiples turnos separados por | ej: "08:00|14:00"
  const horaInicioParam = searchParams.get('horaInicio') || '09:00';
  const horaFinParam = searchParams.get('horaFin') || '18:00';

  if (!calendarId || !fecha) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
  }

  const fechaLimpia = fecha.trim().substring(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaLimpia)) {
    return NextResponse.json({ slots: [], error: `Formato de fecha inválido: ${fecha}` });
  }

  // Parsear turnos múltiples
  const horasInicio = horaInicioParam.split('|').map(h => h.trim());
  const horasFin = horaFinParam.split('|').map(h => h.trim());
  const turnos = horasInicio.map((ini, i) => ({
    inicio: ini,
    fin: horasFin[i] || horasFin[horasFin.length - 1],
  }));

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Obtener el rango completo del día (primer inicio → último fin)
    const primerInicio = turnos[0].inicio;
    const ultimoFin = turnos[turnos.length - 1].fin;

    const timeMin = new Date(`${fechaLimpia}T${primerInicio}:00-05:00`).toISOString();
    const timeMax = new Date(`${fechaLimpia}T${ultimoFin}:00-05:00`).toISOString();

    const res = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const eventos = res.data.items || [];

    // ⏰ Obtener la fecha y hora actual en zona horaria de Lima (-05:00)
   // Obtener fecha actual en Lima usando Intl (forma confiable)
const ahora = new Date();
const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Lima',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const fechaHoyLima = formatter.format(ahora); // "YYYY-MM-DD"
const esHoy = fechaLimpia === fechaHoyLima;

    console.log('🔍 DEBUG SLOTS:', {
  fechaHoyLima,
  fechaLimpia,
  esHoy,
  serverNow: new Date().toISOString()
});

    // Generar slots para cada turno y unirlos
    const slots = [];

    for (const turno of turnos) {
      const [hIni, mIni] = turno.inicio.split(':').map(Number);
      const [hFin, mFin] = turno.fin.split(':').map(Number);

      let hora = hIni * 60 + mIni;
      const fin = hFin * 60 + mFin;

      while (hora + duracion <= fin) {
        const h = Math.floor(hora / 60);
        const m = hora % 60;
        const horaStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const slotInicio = new Date(`${fechaLimpia}T${horaStr}:00-05:00`);
        const slotFin = new Date(slotInicio.getTime() + duracion * 60000);

        // Verificar si está ocupado por un evento existente
        const ocupado = eventos.some(evento => {
          const eventoInicio = new Date(evento.start.dateTime || evento.start.date);
          const eventoFin = new Date(evento.end.dateTime || evento.end.date);
          return slotInicio < eventoFin && slotFin > eventoInicio;
        });

        // 🆕 Verificar si la hora ya pasó (solo si la fecha es hoy)
        let yaPaso = false;
        if (esHoy) {
          yaPaso = slotInicio <= new Date();
        }

        const period = h >= 12 ? 'pm' : 'am';
        const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
        const horaDisplay = `${h12}:${String(m).padStart(2, '0')} ${period}`;

        slots.push({
          hora24: horaStr,
          horaDisplay,
          disponible: !ocupado && !yaPaso, // Disponible solo si no está ocupado Y no ha pasado
        });
        hora += duracion;
      }
    }

    return NextResponse.json({ slots });

  } catch (error) {
    console.error('Error Calendar:', calendarId, error.message);
    return NextResponse.json({ slots: [], error: error.message });
  }
}
