'use client';
import { useState, useEffect, use } from 'react';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

export default function ReservaPage({ params }) {
  const { slug } = use(params);
  const [paso, setPaso] = useState(1);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sucursal, setSucursal] = useState(null);
  const [servicio, setServicio] = useState(null);
  const [especialista, setEspecialista] = useState(null);
  const [fecha, setFecha] = useState('');
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [notas, setNotas] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    fetch(`/api/config?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); setLoading(false); return; }
        setConfig(data);
        // Si solo hay 1 sucursal, seleccionarla automáticamente
        if (!data.tieneSucursales) {
          setSucursal(data.sucursales[0]);
        }
        // Si solo hay 1 especialista total, seleccionarlo automáticamente
        if (data.especialistas?.length === 1) {
          setEspecialista(data.especialistas[0]);
        }
        setLoading(false);
      })
      .catch(() => { setError('Error cargando el negocio'); setLoading(false); });
  }, [slug]);

  // Especialistas filtrados por sucursal seleccionada
  const especialistasDeSucursal = config?.especialistas?.filter(
    e => !sucursal || e.sucursal === sucursal
  ) || [];

  const soloUnEspecialista = especialistasDeSucursal.length === 1;

  useEffect(() => {
    if (!fecha || !especialista || !servicio) return;

    const fechaObj = new Date(fecha + 'T12:00:00');
    const diaSemana = DIAS[fechaObj.getDay()];

    if (!especialista.dias_trabajo.includes(diaSemana)) {
      setSlots([]);
      setErrorSlots(`${especialista.nombre} no trabaja los ${diaSemana}. Elige otro día.`);
      return;
    }

    setLoadingSlots(true);
    setErrorSlots(null);
    setHoraSeleccionada(null);

    const url = `/api/slots?calendarId=${encodeURIComponent(especialista.calendar_id)}&fecha=${fecha}&duracion=${servicio.duracion || 60}&horaInicio=${especialista.hora_inicio}&horaFin=${especialista.hora_fin}`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setErrorSlots('Error consultando disponibilidad: ' + data.error); setSlots([]); }
        else {
          setSlots(data.slots || []);
          if ((data.slots || []).length === 0) setErrorSlots('No hay horarios disponibles para este día.');
        }
        setLoadingSlots(false);
      })
      .catch(() => { setErrorSlots('Error de conexión.'); setSlots([]); setLoadingSlots(false); });
  }, [fecha, especialista, servicio]);

  // Auto-seleccionar especialista cuando cambia la sucursal y hay solo 1
  useEffect(() => {
    if (especialistasDeSucursal.length === 1) {
      setEspecialista(especialistasDeSucursal[0]);
    } else {
      setEspecialista(null);
    }
    setSlots([]);
    setErrorSlots(null);
    setHoraSeleccionada(null);
    setFecha('');
  }, [sucursal]);

  const handleConfirmar = async () => {
    if (!nombre || !telefono) return;
    setEnviando(true);
    try {
      const res = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: config.formId,
          nombre, telefono, notas,
          servicio: `${servicio.nombre} — S/ ${servicio.precio}`,
          especialista: especialista.nombre,
          sucursal: sucursal || 'Principal',
          fecha,
          hora: horaSeleccionada.horaDisplay,
          hora24: horaSeleccionada.hora24,
          duracion: servicio.duracion,
        }),
      });
      const data = await res.json();
      if (data.success) setConfirmado(true);
      else alert('Error al enviar la reserva: ' + (data.error || 'Intenta de nuevo.'));
    } catch { alert('Error de conexión. Intenta de nuevo.'); }
    setEnviando(false);
  };

  // Calcular pasos totales
  const tieneSucursales = config?.tieneSucursales;
  const totalPasos = (tieneSucursales ? 1 : 0) + 1 + (!soloUnEspecialista ? 1 : 0) + 1 + 1;

  // Labels de pasos dinámicos
  const labelsBase = [];
  if (tieneSucursales) labelsBase.push('Sucursal');
  labelsBase.push('Servicio');
  if (!soloUnEspecialista) labelsBase.push('Especialista y fecha');
  else labelsBase.push('Fecha');
  labelsBase.push('Horario');
  labelsBase.push('Tus datos');

  const hoy = new Date().toISOString().split('T')[0];

  // Calcular paso real según si hay sucursales
  const pasoBase = tieneSucursales ? paso : paso + 1;

  if (loading) return <div style={s.center}><div style={s.spinner}></div><p style={s.muted}>Cargando...</p></div>;
  if (error) return <div style={s.center}><p style={{ color: '#991B1B' }}>❌ {error}</p></div>;

  if (confirmado) return (
    <div style={s.center}>
      <div style={s.confirmBox}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1A1834', margin: '0 0 8px' }}>¡Reserva confirmada!</h2>
        <p style={{ fontSize: 15, color: '#6B69A0', margin: '0 0 20px' }}>Recibirás un WhatsApp con los detalles.</p>
        <div style={s.resumen}>
          <p><strong>{config.nombreNegocio}</strong>{sucursal && config.tieneSucursales ? ` — ${sucursal}` : ''}</p>
          <p>{servicio.nombre} con {especialista.nombre}</p>
          <p>{fecha} · {horaSeleccionada.horaDisplay}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.headerTitle}>{config?.nombreNegocio}</h1>
        <p style={s.headerSub}>Reserva tu cita en segundos</p>
      </div>

      <div style={s.progressWrap}>
        {labelsBase.map((_, i) => (
          <div key={i} style={{ ...s.progressStep, background: paso > i ? '#534AB7' : '#E2E1F5' }} />
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: 13, color: '#6B69A0', margin: '8px 0 0' }}>
        Paso {paso} de {labelsBase.length} — {labelsBase[paso - 1]}
      </p>

      <div style={s.card}>

        {/* PASO SUCURSAL — solo si hay más de 1 */}
        {tieneSucursales && paso === 1 && (
          <div>
            <h2 style={s.stepTitle}>¿A qué sucursal quieres ir?</h2>
            <div style={s.list}>
              {config.sucursales.map(suc => (
                <div key={suc}
                  onClick={() => { setSucursal(suc); setPaso(2); }}
                  style={{ ...s.option, borderColor: sucursal === suc ? '#534AB7' : '#E2E1F5', background: sucursal === suc ? '#EEEDFE' : 'white' }}>
                  <div style={{ fontSize: 20 }}>📍</div>
                  <div style={s.optName}>{suc}</div>
                  {sucursal === suc && <span style={{ marginLeft: 'auto', color: '#534AB7', fontWeight: 700 }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PASO SERVICIO */}
        {pasoBase === 2 && (
          <div>
            <h2 style={s.stepTitle}>¿Qué servicio deseas?</h2>
            {tieneSucursales && sucursal && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 13, color: '#6B69A0' }}>
                <span>📍</span><span>{sucursal}</span>
              </div>
            )}
            <div style={s.list}>
              {config.servicios.map(sv => (
                <div key={sv.nombre}
                  onClick={() => { setServicio(sv); setPaso(paso + 1); }}
                  style={{ ...s.option, borderColor: servicio?.nombre === sv.nombre ? '#534AB7' : '#E2E1F5', background: servicio?.nombre === sv.nombre ? '#EEEDFE' : 'white' }}>
                  <div>
                    <div style={s.optName}>{sv.nombre}</div>
                    <div style={s.muted}>{sv.duracion} min</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontWeight: 600, color: '#534AB7' }}>S/ {sv.precio}</div>
                </div>
              ))}
            </div>
            {tieneSucursales && <button onClick={() => setPaso(1)} style={s.btnBack}>← Volver</button>}
          </div>
        )}

        {/* PASO ESPECIALISTA + FECHA */}
        {pasoBase === 3 && (
          <div>
            <h2 style={s.stepTitle}>{soloUnEspecialista ? '¿Qué día prefieres?' : '¿Con quién y cuándo?'}</h2>

            {!soloUnEspecialista && (
              <>
                <p style={s.label}>Especialista</p>
                <div style={s.list}>
                  {especialistasDeSucursal.map(e => (
                    <div key={e.nombre}
                      onClick={() => { setEspecialista(e); setSlots([]); setErrorSlots(null); setHoraSeleccionada(null); }}
                      style={{ ...s.option, borderColor: especialista?.nombre === e.nombre ? '#534AB7' : '#E2E1F5', background: especialista?.nombre === e.nombre ? '#EEEDFE' : 'white' }}>
                      <div style={s.avatar}>{e.nombre[0]}</div>
                      <div style={s.optName}>{e.nombre}</div>
                      {especialista?.nombre === e.nombre && <span style={{ marginLeft: 'auto', color: '#534AB7', fontWeight: 700 }}>✓</span>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {soloUnEspecialista && especialista && (
              <div style={{ background: '#EEEDFE', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={s.avatar}>{especialista.nombre[0]}</div>
                <div>
                  <div style={s.optName}>{especialista.nombre}</div>
                  <div style={s.muted}>{especialista.hora_inicio} — {especialista.hora_fin}</div>
                </div>
              </div>
            )}

            <p style={s.label}>Fecha</p>
            <input type="date" min={hoy} value={fecha}
              onChange={e => { setFecha(e.target.value); setSlots([]); setErrorSlots(null); setHoraSeleccionada(null); }}
              style={s.input} />

            {especialista && (
              <p style={{ fontSize: 12, color: '#6B69A0', marginTop: 8, marginBottom: 4 }}>
                🕐 Horario de {especialista.nombre}: {especialista.hora_inicio} — {especialista.hora_fin} · {especialista.dias_trabajo.join(', ')}
              </p>
            )}

            <button onClick={() => setPaso(paso + 1)} disabled={!especialista || !fecha}
              style={{ ...s.btn, opacity: (!especialista || !fecha) ? 0.5 : 1 }}>
              Ver horarios disponibles →
            </button>
            <button onClick={() => setPaso(paso - 1)} style={s.btnBack}>← Volver</button>
          </div>
        )}

        {/* PASO SLOTS */}
        {pasoBase === 4 && (
          <div>
            <h2 style={s.stepTitle}>Elige tu horario</h2>
            <p style={{ fontSize: 14, color: '#6B69A0', margin: '0 0 20px' }}>{especialista.nombre} · {fecha}</p>

            {loadingSlots && <div style={s.center}><div style={s.spinner}></div><p style={s.muted}>Consultando disponibilidad...</p></div>}
            {!loadingSlots && errorSlots && <p style={{ color: '#991B1B', fontSize: 14, textAlign: 'center', padding: '16px 0' }}>⚠️ {errorSlots}</p>}
            {!loadingSlots && !errorSlots && slots.length === 0 && <p style={{ color: '#6B69A0', fontSize: 14, textAlign: 'center', padding: '24px 0' }}>No hay horarios disponibles. Prueba otra fecha.</p>}

            {!loadingSlots && slots.length > 0 && (
              <div style={s.slotsGrid}>
                {slots.map(slot => (
                  <div key={slot.hora24}
                    onClick={() => slot.disponible && setHoraSeleccionada(slot)}
                    style={{
                      ...s.slot,
                      background: !slot.disponible ? '#F1F0FA' : horaSeleccionada?.hora24 === slot.hora24 ? '#534AB7' : '#EEEDFE',
                      color: !slot.disponible ? '#9896C8' : horaSeleccionada?.hora24 === slot.hora24 ? 'white' : '#534AB7',
                      cursor: slot.disponible ? 'pointer' : 'not-allowed',
                      textDecoration: !slot.disponible ? 'line-through' : 'none',
                      opacity: !slot.disponible ? 0.5 : 1,
                    }}>
                    {slot.horaDisplay}
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setPaso(paso + 1)} disabled={!horaSeleccionada}
              style={{ ...s.btn, opacity: !horaSeleccionada ? 0.5 : 1 }}>
              Continuar →
            </button>
            <button onClick={() => setPaso(paso - 1)} style={s.btnBack}>← Volver</button>
          </div>
        )}

        {/* PASO DATOS */}
        {pasoBase === 5 && (
          <div>
            <h2 style={s.stepTitle}>Tus datos</h2>
            <div style={s.resumen}>
              {config.tieneSucursales && <p>📍 {sucursal}</p>}
              <p>💅 {servicio.nombre}</p>
              <p>👩 {especialista.nombre}</p>
              <p>📅 {fecha} · {horaSeleccionada.horaDisplay}</p>
            </div>
            <p style={s.label}>Nombre completo *</p>
            <input type="text" placeholder="Ej: María López" value={nombre} onChange={e => setNombre(e.target.value)} style={s.input} />
            <p style={s.label}>WhatsApp *</p>
            <input type="tel" placeholder="Ej: 987654321" value={telefono} onChange={e => setTelefono(e.target.value)} style={s.input} />
            <p style={s.label}>Notas (opcional)</p>
            <textarea placeholder="Ej: Quiero uñas en rojo" value={notas} onChange={e => setNotas(e.target.value)} style={{ ...s.input, height: 80, resize: 'vertical' }} />
            <button onClick={handleConfirmar} disabled={!nombre || !telefono || enviando}
              style={{ ...s.btn, opacity: (!nombre || !telefono) ? 0.5 : 1 }}>
              {enviando ? 'Enviando...' : 'Confirmar reserva ✓'}
            </button>
            <button onClick={() => setPaso(paso - 1)} style={s.btnBack}>← Volver</button>
          </div>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#9896C8', marginTop: 24 }}>
        Powered by <strong>Agendi</strong> · agendi.pe
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: '#F8F8FC', fontFamily: "'DM Sans', system-ui, sans-serif", padding: '0 0 40px' },
  header: { background: '#534AB7', padding: '32px 24px 24px', textAlign: 'center' },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 600, margin: 0 },
  headerSub: { color: '#CECBF6', fontSize: 14, margin: '6px 0 0' },
  progressWrap: { display: 'flex', gap: 6, padding: '20px 24px 0', maxWidth: 480, margin: '0 auto' },
  progressStep: { flex: 1, height: 4, borderRadius: 2, transition: 'background 0.3s' },
  card: { background: 'white', borderRadius: 20, margin: '20px auto', padding: '24px', boxShadow: '0 4px 24px rgba(83,74,183,0.08)', maxWidth: 480 },
  stepTitle: { fontSize: 20, fontWeight: 600, color: '#1A1834', margin: '0 0 16px' },
  label: { fontSize: 13, fontWeight: 500, color: '#3D3B6E', margin: '16px 0 8px', display: 'block' },
  list: { display: 'flex', flexDirection: 'column', gap: 10, margin: '8px 0' },
  option: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 12, border: '1.5px solid', cursor: 'pointer', transition: 'all 0.2s' },
  optName: { fontSize: 15, fontWeight: 500, color: '#1A1834' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#EEEDFE', color: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600, flexShrink: 0 },
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E2E1F5', fontSize: 15, fontFamily: 'inherit', outline: 'none', color: '#1A1834', display: 'block' },
  slotsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, margin: '16px 0 24px' },
  slot: { padding: '12px 8px', borderRadius: 10, textAlign: 'center', fontSize: 14, fontWeight: 500, transition: 'all 0.2s' },
  btn: { width: '100%', background: '#534AB7', color: 'white', border: 'none', borderRadius: 50, padding: '16px', fontSize: 16, fontWeight: 500, cursor: 'pointer', marginTop: 16, fontFamily: 'inherit' },
  btnBack: { width: '100%', background: 'transparent', color: '#6B69A0', border: 'none', padding: '12px', fontSize: 14, cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' },
  resumen: { background: '#F8F8FC', borderRadius: 12, padding: '14px 16px', margin: '0 0 20px', border: '1px solid #E2E1F5', fontSize: 14, color: '#3D3B6E', lineHeight: 1.8 },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 },
  spinner: { width: 32, height: 32, border: '3px solid #EEEDFE', borderTop: '3px solid #534AB7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  muted: { color: '#6B69A0', fontSize: 14 },
  confirmBox: { background: 'white', borderRadius: 20, padding: 32, textAlign: 'center', maxWidth: 360, boxShadow: '0 4px 24px rgba(83,74,183,0.08)' },
};