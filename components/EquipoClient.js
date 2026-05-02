"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

function parseDate(str) {
  if (!str) return null
  const [y, m, d] = str.split("-")
  if (!y || !m || !d) return null
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
}

function initials(name) {
  if (!name) return "?"
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

const COLORES = ["#534AB7", "#7C3AED", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444"]
const DIAS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]

function Modal({ titulo, onClose, onGuardar, cargando, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{
        background: "white", borderRadius: "16px", padding: "28px",
        width: "100%", maxWidth: "480px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1a1a2e" }}>{titulo}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}>×</button>
        </div>
        {children}
        <div style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "10px 20px", borderRadius: "10px", border: "1.5px solid #E8E8F0",
            background: "white", color: "#666", fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Cancelar</button>
          <button onClick={onGuardar} disabled={cargando} style={{
            padding: "10px 20px", borderRadius: "10px", border: "none",
            background: "#534AB7", color: "white", fontSize: "14px", fontWeight: "600",
            cursor: cargando ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif",
            opacity: cargando ? 0.7 : 1,
          }}>{cargando ? "Guardando..." : "Guardar"}</button>
        </div>
      </div>
    </div>
  )
}

function Campo({ label, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#888", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: "10px",
  border: "1.5px solid #E8E8F0", fontSize: "14px",
  fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#1a1a2e",
  boxSizing: "border-box",
}

export default function EquipoClient({ especialistas, reservas, sucursales }) {
  const router = useRouter()
  const [filtroSucursal, setFiltroSucursal] = useState("Todas")
  const [modalAgregar, setModalAgregar] = useState(false)
  const [modalEditar, setModalEditar] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [form, setForm] = useState({
    nombre_especialista: "", calendar_id: "",
    hora_inicio: "", hora_fin: "", dias_trabajo: [], sucursal: "",
  })

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const filtrados = especialistas.filter(e =>
    filtroSucursal === "Todas" || e.sucursal === filtroSucursal
  )

function abrirEditar(esp) {
  setForm({
    nombre_especialista: esp.nombre_especialista,
    calendar_id: esp.calendar_id || "",
    hora_inicio: esp.hora_inicio || "",
    hora_fin: esp.hora_fin || "",
    dias_trabajo: (esp.dias_trabajo || "").split(",").map(d => d.trim()).filter(Boolean),
    sucursal: esp.sucursal || "",
    _fila: esp._fila,
  })
  setModalEditar(esp)
}

  function abrirAgregar() {
    setForm({ nombre_especialista: "", calendar_id: "", hora_inicio: "", hora_fin: "", dias_trabajo: [], sucursal: "" })
    setModalAgregar(true)
  }

  function toggleDia(dia) {
    setForm(f => ({
      ...f,
      dias_trabajo: f.dias_trabajo.includes(dia)
        ? f.dias_trabajo.filter(d => d !== dia)
        : [...f.dias_trabajo, dia],
    }))
  }

  async function guardarNuevo() {
    if (!form.nombre_especialista || !form.hora_inicio || !form.hora_fin || !form.sucursal) return alert("Completa todos los campos obligatorios")
    setCargando(true)
    await fetch("/api/especialistas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, dias_trabajo: form.dias_trabajo.join(",") }),
    })
    setCargando(false)
    setModalAgregar(false)
    router.refresh()
  }

  async function guardarEditar() {
    if (!form.nombre_especialista || !form.hora_inicio || !form.hora_fin || !form.sucursal) return alert("Completa todos los campos obligatorios")
    setCargando(true)
    await fetch("/api/especialistas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, fila: form._fila, dias_trabajo: form.dias_trabajo.join(",") }),
    })
    setCargando(false)
    setModalEditar(null)
    router.refresh()
  }

  async function eliminar() {
  if (!confirm(`¿Eliminar a ${form.nombre_especialista}? Esta acción no se puede deshacer.`)) return
  setCargando(true)
  await fetch("/api/especialistas", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fila: form._fila }),
  })
  setCargando(false)
  setModalEditar(null)
  router.refresh()
}

  const formulario = (
    <>
      <Campo label="Nombre *">
        <input style={inputStyle} value={form.nombre_especialista} onChange={e => setForm(f => ({ ...f, nombre_especialista: e.target.value }))} placeholder="Ej: Carmen López" />
      </Campo>
      <Campo label="Sucursal *">
  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
    {sucursales.map(s => (
      <button key={s} type="button" onClick={() => setForm(f => ({ ...f, sucursal: s }))} style={{
        padding: "8px 16px", borderRadius: "20px", border: "1.5px solid",
        borderColor: form.sucursal === s ? "#534AB7" : "#E8E8F0",
        background: form.sucursal === s ? "#534AB7" : "white",
        color: form.sucursal === s ? "white" : "#888",
        fontSize: "13px", fontWeight: form.sucursal === s ? "600" : "400",
        cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
      }}>{s}</button>
    ))}
  </div>
</Campo>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Campo label="Hora inicio *">
          <input style={inputStyle} value={form.hora_inicio} onChange={e => setForm(f => ({ ...f, hora_inicio: e.target.value }))} placeholder="08:00" />
        </Campo>
        <Campo label="Hora fin *">
          <input style={inputStyle} value={form.hora_fin} onChange={e => setForm(f => ({ ...f, hora_fin: e.target.value }))} placeholder="18:00" />
        </Campo>
      </div>
      <Campo label="Días de trabajo">
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {DIAS.map(d => (
            <button key={d} type="button" onClick={() => toggleDia(d)} style={{
              padding: "6px 12px", borderRadius: "20px", border: "1.5px solid",
              borderColor: form.dias_trabajo.includes(d) ? "#534AB7" : "#E8E8F0",
              background: form.dias_trabajo.includes(d) ? "#534AB7" : "white",
              color: form.dias_trabajo.includes(d) ? "white" : "#888",
              fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>{d}</button>
          ))}
        </div>
      </Campo>
      <Campo label="Calendar ID (opcional)">
        <input style={inputStyle} value={form.calendar_id} onChange={e => setForm(f => ({ ...f, calendar_id: e.target.value }))} placeholder="ID del Google Calendar" />
      </Campo>
      <div style={{ marginTop: "8px", paddingTop: "16px", borderTop: "1px solid #F0EEFF" }}>
  <button type="button" onClick={eliminar} style={{
    width: "100%", padding: "10px", borderRadius: "10px",
    border: "1.5px solid #FEE2E2", background: "#FFF1F1",
    color: "#dc2626", fontSize: "14px", fontWeight: "600",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  }}>Eliminar especialista</button>
</div>
    </>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>Equipo</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>{especialistas.length} especialistas registrados</p>
        </div>
        <button onClick={abrirAgregar} style={{
          padding: "10px 20px", borderRadius: "10px", border: "none",
          background: "#534AB7", color: "white", fontSize: "14px", fontWeight: "600",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          display: "flex", alignItems: "center", gap: "8px",
        }}>+ Agregar especialista</button>
      </div>

      {/* Filtro sucursal */}
      {sucursales.length > 1 && (
        <div style={{
          background: "white", borderRadius: "14px", padding: "14px 20px",
          boxShadow: "0 1px 8px rgba(83,74,183,0.08)",
          display: "flex", gap: "10px", alignItems: "center",
        }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#888" }}>Sucursal:</span>
          {["Todas", ...sucursales].map(s => (
            <button key={s} onClick={() => setFiltroSucursal(s)} style={{
              padding: "6px 14px", borderRadius: "20px", border: "1.5px solid",
              borderColor: filtroSucursal === s ? "#534AB7" : "#E8E8F0",
              background: filtroSucursal === s ? "#534AB7" : "white",
              color: filtroSucursal === s ? "white" : "#888",
              fontSize: "13px", fontWeight: filtroSucursal === s ? "600" : "400",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>{s}</button>
          ))}
        </div>
      )}

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {filtrados.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#ccc", fontSize: "14px", background: "white", borderRadius: "14px" }}>
            No hay especialistas en esta sucursal
          </div>
        ) : filtrados.map((esp, i) => {
          const color = COLORES[i % COLORES.length]
          const reservasEsp = reservas.filter(r => r.Especialista === esp.nombre_especialista)
          const reservasHoy = reservasEsp.filter(r => {
            const d = parseDate(r.Fecha)
            return d && d.toDateString() === hoy.toDateString()
          })
          const reservasMes = reservasEsp.filter(r => {
            const d = parseDate(r.Fecha)
            return d && d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear()
          })
          const horarios = (esp.hora_inicio || "").split("|")
          const horariosF = (esp.hora_fin || "").split("|")
          const horarioTexto = horarios.map((h, i) => `${h} - ${horariosF[i] || ""}`).join("  |  ")
          const diasTexto = (esp.dias_trabajo || "").split(",").map(d => d.trim()).join(", ")

          // índice real en el sheet (con encabezado)

          return (
            <div key={esp.nombre_especialista} style={{
              background: "white", borderRadius: "16px",
              boxShadow: "0 1px 8px rgba(83,74,183,0.08)", overflow: "hidden",
            }}>
              <div style={{ background: color, padding: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", fontWeight: "700", color: "white", flexShrink: 0,
                }}>{initials(esp.nombre_especialista)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>{esp.nombre_especialista}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", marginTop: "2px" }}>{esp.sucursal}</div>
                </div>
                <button onClick={() => abrirEditar(esp)} style={{
                  background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "8px",
                  padding: "6px 12px", color: "white", fontSize: "12px", fontWeight: "600",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}>✏ Editar</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #F0EEFF" }}>
                <div style={{ padding: "16px", textAlign: "center", borderRight: "1px solid #F0EEFF" }}>
                  <div style={{ fontSize: "28px", fontWeight: "700", color }}>{reservasHoy.length}</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>Hoy</div>
                </div>
                <div style={{ padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", fontWeight: "700", color }}>{reservasMes.length}</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>Este mes</div>
                </div>
              </div>

              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span>🕐</span>
                  <div>
                    <div style={{ fontSize: "12px", color: "#888" }}>Horario</div>
                    <div style={{ fontSize: "13px", color: "#1a1a2e", fontWeight: "500" }}>{horarioTexto || "—"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span>📅</span>
                  <div>
                    <div style={{ fontSize: "12px", color: "#888" }}>Días</div>
                    <div style={{ fontSize: "13px", color: "#1a1a2e", fontWeight: "500" }}>{diasTexto || "—"}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span>📊</span>
                  <div>
                    <div style={{ fontSize: "12px", color: "#888" }}>Total reservas</div>
                    <div style={{ fontSize: "13px", color: "#1a1a2e", fontWeight: "500" }}>{reservasEsp.length}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal agregar */}
      {modalAgregar && (
        <Modal titulo="Agregar especialista" onClose={() => setModalAgregar(false)} onGuardar={guardarNuevo} cargando={cargando}>
          {formulario}
        </Modal>
      )}

      {/* Modal editar */}
      {modalEditar && (
        <Modal titulo={`Editar — ${modalEditar.nombre_especialista}`} onClose={() => setModalEditar(null)} onGuardar={guardarEditar} cargando={cargando}>
          {formulario}
        </Modal>
      )}
    </div>
  )
}