import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { formId, nombre, telefono, servicio, especialista, sucursal, fecha, hora, hora24, notas, duracion } = body;

    if (!formId || !nombre || !telefono || !servicio || !especialista || !fecha || !hora) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Construir hora24 si no viene — convertir "2:00 pm" → "14:00"
    let hora24Final = hora24;
    if (!hora24Final || hora24Final.includes('am') || hora24Final.includes('pm')) {
      const lower = (hora24Final || hora).toLowerCase().trim();
      const tienePeriod = lower.includes('am') || lower.includes('pm');
      if (tienePeriod) {
        const partes = lower.split(' ');
        const period = partes[1];
        let [h, m] = partes[0].split(':').map(Number);
        m = m || 0;
        if (period === 'pm' && h !== 12) h += 12;
        if (period === 'am' && h === 12) h = 0;
        hora24Final = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      }
    }

    // Enviar a n8n
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formId,
        nombre,
        telefono,
        servicio,
        especialista,
        fecha,
        hora,         // formato display para WhatsApp: "2:00 pm"
        hora24: hora24Final,  // formato 24h para Calendar: "14:00"
        notas: notas || '',
        source: 'agendi-web',
        duracion: duracion || 60,
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('Error n8n:', errorText);
      throw new Error('Error enviando a n8n');
    }

    return NextResponse.json({ success: true, mensaje: 'Reserva enviada correctamente' });

  } catch (error) {
    console.error('Error en reservar:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
