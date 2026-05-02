"use client"
import { useState, useMemo } from "react"

function parseDate(str) {
  if (!str) return null
  const [y, m, d] = str.split("-")
  if (!y || !m || !d) return null
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
}

function estaEnRango(fecha, filtro) {
  const d = parseDate(fecha)
  if (!d) return false
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  if (filtro === "Hoy") return d.toDateString() === hoy.toDateString()
  if (filtro === "Esta semana") {
    const lunes = new Date(hoy)
    lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7))
    return d >= lunes
  }
  if (filtro === "Este mes") return d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear()
  return true
}

function estadoStyle(estado) {
  const e = (estado || "").toLowerCase()
  if (e === "confirmada") return { bg: "#DCFCE7", color: "#16a34a" }
  if (e === "cancelada") return { bg: "#FEE2E2", color: "#dc2626" }
  return { bg: "#FEF9C3", color: "#ca8a04" }
}

function initials(name) {
  if (!name) return "?"
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

const FILTROS = ["Hoy", "Esta semana", "Este mes", "Todo"]
const ESTADOS = ["Todos", "Confirmada", "Cancelada"]

export default function ReservasClient({ reservas, empresa, sucursales: propSucursales }) {
  const [filtroTiempo, setFiltroTiempo] = useState("Todo")
  const [filtroEstado, setFiltroEstado] = useState("Todos")
  const [busqueda, setBusqueda] = useState("")

  const sucursales = propSucursales || [...new Set(reservas.map(r => r.Sucursal).filter(Boolean))]
  const [filtroSucursal, setFiltroSucursal] = useState("Todas")

  const filtradas = useMemo(() => {
    return reservas.filter(r => {
      const enRango = estaEnRango(r.Fecha, filtroTiempo)
      const enEstado = filtroEstado === "Todos" || (r.Estado || "").toLowerCase() === filtroEstado.toLowerCase()
      const enSucursal = filtroSucursal === "Todas" || r.Sucursal === filtroSucursal
      const enBusqueda = !busqueda ||
        (r.Nombre || "").toLowerCase().includes(busqueda.toLowerCase()) ||
        (r.Telefono || "").includes(busqueda) ||
        (r.Especialista || "").toLowerCase().includes(busqueda.toLowerCase())
      return enRango && enEstado && enSucursal && enBusqueda
    }).sort((a, b) => {
      const da = parseDate(a.Fecha)
      const db = parseDate(b.Fecha)
      if (!da || !db) return 0
      return db - da || (a.Hora || "").localeCompare(b.Hora || "")
    })
  }, [reservas, filtroTiempo, filtroEstado, filtroSucursal, busqueda])

  const pill = (label, active, onClick) => (
    <button key={label} onClick={onClick} style={{
      padding: "6px 14px", borderRadius: "20px", border: "1.5px solid",
      borderColor: active ? "#534AB7" : "#E8E8F0",
      background: active ? "#534AB7" : "white",
      color: active ? "white" : "#888",
      fontSize: "13px", fontWeight: active ? "600" : "400",
      cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
    }}>{label}</button>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>Reservas</h1>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>{filtradas.length} reservas encontradas</p>
      </div>

      {/* Filtros */}
      <div style={{
        background: "white", borderRadius: "14px", padding: "16px 20px",
        boxShadow: "0 1px 8px rgba(83,74,183,0.08)",
        display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center",
      }}>

        {/* Búsqueda */}
        <input
          type="text"
          placeholder="Buscar cliente, teléfono, especialista..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            padding: "8px 14px", borderRadius: "20px",
            border: "1.5px solid #E8E8F0", fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif", outline: "none",
            width: "260px", color: "#1a1a2e",
          }}
        />

        <div style={{ width: "1px", height: "24px", background: "#E8E8F0" }} />

        {/* Período */}
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#534AB7" }}>Período:</span>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {FILTROS.map(f => pill(f, filtroTiempo === f, () => setFiltroTiempo(f)))}
        </div>

        <div style={{ width: "1px", height: "24px", background: "#E8E8F0" }} />

        {/* Estado */}
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#888" }}>Estado:</span>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {ESTADOS.map(e => pill(e, filtroEstado === e, () => setFiltroEstado(e)))}
        </div>

        {sucursales.length > 1 && (
  <div style={{ width: "100%", display: "flex", gap: "12px", alignItems: "center", paddingTop: "8px", borderTop: "1px solid #F0EEFF" }}>
    <span style={{ fontSize: "13px", fontWeight: "600", color: "#888" }}>Sucursal:</span>
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
      {["Todas", ...sucursales].map(s => pill(s, filtroSucursal === s, () => setFiltroSucursal(s)))}
    </div>
  </div>
)}
      </div>

      {/* Tabla */}
      <div style={{
        background: "white", borderRadius: "14px",
        boxShadow: "0 1px 8px rgba(83,74,183,0.08)", overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAFA", borderBottom: "1px solid #F0EEFF" }}>
                {["Cliente", "Teléfono", "Servicio", "Especialista", "Sucursal", "Fecha", "Hora", "Estado"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: "12px", fontWeight: "600",
                    color: "#888", textTransform: "uppercase", letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "48px", textAlign: "center", color: "#ccc", fontSize: "14px" }}>
                    No hay reservas con estos filtros
                  </td>
                </tr>
              ) : filtradas.map((r, i) => {
                const st = estadoStyle(r.Estado)
                return (
                  <tr key={i} style={{ borderBottom: "1px solid #F8F8FC", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#FAFAFE"}
                    onMouseLeave={e => e.currentTarget.style.background = "white"}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "50%",
                          background: "#F0EEFF", color: "#534AB7",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "12px", fontWeight: "700", flexShrink: 0,
                        }}>{initials(r.Nombre)}</div>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>{r.Nombre || "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#666" }}>{r.Telefono || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555" }}>{r.Servicio?.split("—")[0].trim() || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555" }}>{r.Especialista || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555" }}>{r.Sucursal || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#555", whiteSpace: "nowrap" }}>{r.Fecha || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#534AB7", fontWeight: "600" }}>{r.Hora || "—"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        padding: "4px 10px", borderRadius: "20px",
                        fontSize: "12px", fontWeight: "600",
                        background: st.bg, color: st.color,
                      }}>{r.Estado || "Pendiente"}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}   