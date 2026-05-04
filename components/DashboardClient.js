"use client"
import { useState, useMemo } from "react"
import Link from "next/link"

const FILTROS_TIEMPO = ["Hoy", "Esta semana", "Este mes", "Todo", "Personalizado"]

function parseDate(str) {
  if (!str) return null
  const [y, m, d] = str.split("-")
  if (!y || !m || !d) return null
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
}

function estaEnRango(fecha, filtro, inicio, fin) {
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
  if (filtro === "Personalizado") {
    const dInicio = inicio ? new Date(inicio) : null
    const dFin = fin ? new Date(fin) : null
    if (dInicio) dInicio.setHours(0, 0, 0, 0)
    if (dFin) dFin.setHours(23, 59, 59, 999)
    if (dInicio && d < dInicio) return false
    if (dFin && d > dFin) return false
    return true
  }
  return true
}

function initials(name) {
  if (!name) return "?"
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

function estadoStyle(estado) {
  const e = (estado || "").toLowerCase()
  if (e === "confirmada") return { bg: "#DCFCE7", color: "#16a34a" }
  if (e === "cancelada") return { bg: "#FEE2E2", color: "#dc2626" }
  return { bg: "#FEF9C3", color: "#ca8a04" }
}

function extraerPrecio(servicio) {
  const match = (servicio || "").match(/S\/\s*(\d+)/)
  return match ? parseInt(match[1]) : 0
}

function rankColor(i) {
  if (i === 0) return { bg: "#FEF9C3", color: "#ca8a04" }
  if (i === 1) return { bg: "#F1F5F9", color: "#64748b" }
  if (i === 2) return { bg: "#FEF3E2", color: "#c2410c" }
  return { bg: "#F0EEFF", color: "#534AB7" }
}

function getLimite(plan) {
  const p = (plan || "").toLowerCase()
  if (p === "básico" || p === "basico") return 300
  if (p === "regular") return 700
  return null
}

export default function DashboardClient({ empresa, reservas, sucursales }) {
  const [filtroTiempo, setFiltroTiempo] = useState("Hoy")
  const [filtroSucursal, setFiltroSucursal] = useState("Todas")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  // Todas las reservas en rango y sucursal (incluye canceladas para contar cancelaciones)
  const filtradas = useMemo(() => {
    return reservas.filter(r => {
      const enRango = estaEnRango(r.Fecha, filtroTiempo, fechaInicio, fechaFin)
      const enSucursal = filtroSucursal === "Todas" || r.Sucursal === filtroSucursal
      return enRango && enSucursal
    })
  }, [reservas, filtroTiempo, filtroSucursal, fechaInicio, fechaFin])

  // Solo reservas activas (sin canceladas) para métricas reales
  const filtradasActivas = useMemo(() => {
    return filtradas.filter(r => (r.Estado || "").toLowerCase() !== "cancelada")
  }, [filtradas])

  const canceladas = filtradas.filter(r => (r.Estado || "").toLowerCase() === "cancelada").length
  const ingresos = filtradasActivas.reduce((sum, r) => sum + extraerPrecio(r.Servicio), 0)

  // Clientes nuevos — solo de reservas activas
  const telefonosEnPeriodo = new Set(filtradasActivas.map(r => r.Telefono).filter(Boolean))
  const telefonosFuera = new Set(
    reservas
      .filter(r =>
        !estaEnRango(r.Fecha, filtroTiempo, fechaInicio, fechaFin) &&
        (r.Estado || "").toLowerCase() !== "cancelada"
      )
      .map(r => r.Telefono)
      .filter(Boolean)
  )
  const clientesNuevos = [...telefonosEnPeriodo].filter(t => !telefonosFuera.has(t)).length

  // Servicios más pedidos — solo activas
  const serviciosCount = filtradasActivas.reduce((acc, r) => {
    const s = r.Servicio?.split("—")[0].trim() || "Sin servicio"
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})
  const topServicios = Object.entries(serviciosCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxServicio = topServicios[0]?.[1] || 1

  // Ocupación equipo — solo activas
  const espCount = filtradasActivas.reduce((acc, r) => {
    if (r.Especialista) acc[r.Especialista] = (acc[r.Especialista] || 0) + 1
    return acc
  }, {})
  const totalReservas = filtradasActivas.length || 1
  const topEsp = Object.entries(espCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Clientes frecuentes — solo activas
  const clientesMap = {}
  filtradasActivas.forEach(r => {
    const tel = r.Telefono || "sin-tel"
    if (!clientesMap[tel]) {
      clientesMap[tel] = {
        nombre: r.Nombre || "Sin nombre",
        telefono: r.Telefono || "—",
        visitas: 0,
        ingresos: 0,
        ultimoServicio: "",
      }
    }
    clientesMap[tel].visitas += 1
    clientesMap[tel].ingresos += extraerPrecio(r.Servicio)
    clientesMap[tel].ultimoServicio = r.Servicio?.split("—")[0].trim() || "—"
  })
  const topClientes = Object.values(clientesMap).sort((a, b) => b.visitas - a.visitas).slice(0, 10)
  const maxVisitas = topClientes[0]?.visitas || 1

  const reservasMes = reservas.filter(r => {
    const d = parseDate(r.Fecha)
    const hoy = new Date()
    return d && d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear()
  })
  const limiteReservas = getLimite(empresa.plan)
  const porcentajeUso = limiteReservas ? Math.min((reservasMes.length / limiteReservas) * 100, 100) : null

  const hoy = new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })

  const proximasHoy = reservas
    .filter(r => estaEnRango(r.Fecha, "Hoy", "", "") && (r.Estado || "").toLowerCase() !== "cancelada")
    .sort((a, b) => (a.Hora || "").localeCompare(b.Hora || ""))

  const pill = (label, active, onClick, variant = "primary") => (
    <button key={label} onClick={onClick} style={{
      padding: "7px 16px", borderRadius: "20px", border: "1.5px solid",
      borderColor: active ? (variant === "primary" ? "#534AB7" : "#CECBF6") : "#E8E8F0",
      background: active ? (variant === "primary" ? "#534AB7" : "#CECBF6") : "white",
      color: active ? (variant === "primary" ? "white" : "#534AB7") : "#888",
      fontSize: "13px", fontWeight: active ? "600" : "400",
      cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s",
    }}>{label}</button>
  )

  const dateInput = (value, onChange) => (
    <input
      type="date"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: "6px 10px", borderRadius: "10px",
        border: "1.5px solid #534AB7", fontSize: "13px",
        fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e",
      }}
    />
  )

  const stats = [
    { label: "Reservas exitosas", value: filtradasActivas.length, color: "#534AB7", sub: filtroTiempo },
    { label: "Ingresos estimados", value: `S/${ingresos}`, color: "#16a34a", sub: "sin canceladas" },
    { label: "Clientes nuevos", value: clientesNuevos, color: "#f59e0b", sub: "primera vez" },
    { label: "Cancelaciones", value: canceladas, color: "#dc2626", sub: filtroTiempo },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: "'DM Sans', sans-serif" }}>

      <div>
        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>
          Bienvenido, {empresa.nombre_negocio} 👋
        </h1>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px", textTransform: "capitalize" }}>{hoy}</p>
      </div>

      {limiteReservas && (
        <div style={{
          background: porcentajeUso >= 90 ? "#FFF1F1" : porcentajeUso >= 70 ? "#FFFBEB" : "#F0EEFF",
          borderRadius: "14px", padding: "16px 20px",
          border: `1px solid ${porcentajeUso >= 90 ? "#FEE2E2" : porcentajeUso >= 70 ? "#FEF3C7" : "#CECBF6"}`,
          display: "flex", flexDirection: "column", gap: "8px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e" }}>Reservas este mes</span>
            <span style={{ fontSize: "13px", fontWeight: "700", color: porcentajeUso >= 90 ? "#dc2626" : porcentajeUso >= 70 ? "#ca8a04" : "#534AB7" }}>
              {reservasMes.length} / {limiteReservas}
            </span>
          </div>
          <div style={{ height: "8px", background: "rgba(0,0,0,0.08)", borderRadius: "4px" }}>
            <div style={{
              height: "8px", borderRadius: "4px", width: `${porcentajeUso}%`,
              background: porcentajeUso >= 90 ? "#dc2626" : porcentajeUso >= 70 ? "#f59e0b" : "#534AB7",
              transition: "width 0.3s",
            }} />
          </div>
          {porcentajeUso >= 90 && <p style={{ margin: 0, fontSize: "12px", color: "#dc2626", fontWeight: "500" }}>⚠ Estás cerca de tu límite mensual. Considera actualizar tu plan.</p>}
          {porcentajeUso >= 70 && porcentajeUso < 90 && <p style={{ margin: 0, fontSize: "12px", color: "#ca8a04", fontWeight: "500" }}>Llevas el {Math.round(porcentajeUso)}% de tu límite mensual.</p>}
        </div>
      )}

      <div style={{
        background: "white", borderRadius: "14px", padding: "16px 20px",
        boxShadow: "0 1px 8px rgba(83,74,183,0.08)",
        display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center",
      }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#534AB7", marginRight: "4px" }}>Período:</span>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {FILTROS_TIEMPO.map(f => pill(f, filtroTiempo === f, () => setFiltroTiempo(f), "primary"))}
        </div>
        {filtroTiempo === "Personalizado" && (
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {dateInput(fechaInicio, setFechaInicio)}
            <span style={{ fontSize: "13px", color: "#888" }}>—</span>
            {dateInput(fechaFin, setFechaFin)}
          </div>
        )}
        {sucursales.length > 1 && (
          <>
            <div style={{ width: "1px", height: "24px", background: "#E8E8F0", margin: "0 4px" }} />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#888" }}>Sucursal:</span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["Todas", ...sucursales].map(s => pill(s, filtroSucursal === s, () => setFiltroSucursal(s), "secondary"))}
            </div>
          </>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: "white", borderRadius: "14px", padding: "20px 22px",
            boxShadow: "0 1px 8px rgba(83,74,183,0.08)",
            borderLeft: `4px solid ${s.color}`,
          }}>
            <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>{s.label}</div>
            <div style={{ fontSize: "34px", fontWeight: "700", color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#bbb", marginTop: "6px" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 1px 8px rgba(83,74,183,0.08)", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #F0EEFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>Reservas de hoy ({proximasHoy.length})</h2>
            <Link href="/admin/reservas" style={{ fontSize: "12px", color: "#534AB7", fontWeight: "600", textDecoration: "none" }}>Ver todas →</Link>
          </div>
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {proximasHoy.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "#ccc", fontSize: "14px" }}>No hay reservas para hoy</div>
            ) : proximasHoy.map((r, i) => {
              const st = estadoStyle(r.Estado)
              return (
                <div key={i} style={{ padding: "14px 20px", borderBottom: "1px solid #F8F8FC", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#F0EEFF", color: "#534AB7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", flexShrink: 0 }}>{initials(r.Nombre)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>{r.Nombre}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{r.Servicio?.split("—")[0].trim()} · {r.Especialista}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#534AB7" }}>{r.Hora}</div>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: st.bg, color: st.color, fontWeight: "600" }}>{r.Estado}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: "18px 20px", boxShadow: "0 1px 8px rgba(83,74,183,0.08)" }}>
            <h2 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>Servicios más pedidos</h2>
            {topServicios.length === 0 ? (
              <div style={{ color: "#ccc", fontSize: "13px" }}>Sin datos en este período</div>
            ) : topServicios.map(([nombre, count]) => (
              <div key={nombre} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", color: "#444" }}>{nombre}</span>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#534AB7" }}>{count}</span>
                </div>
                <div style={{ height: "6px", background: "#F0EEFF", borderRadius: "4px" }}>
                  <div style={{ height: "6px", background: "#534AB7", borderRadius: "4px", width: `${(count / maxServicio) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "white", borderRadius: "14px", padding: "18px 20px", boxShadow: "0 1px 8px rgba(83,74,183,0.08)" }}>
            <h2 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>Ocupación del equipo</h2>
            {topEsp.length === 0 ? (
              <div style={{ color: "#ccc", fontSize: "13px" }}>Sin datos en este período</div>
            ) : topEsp.map(([nombre, count]) => (
              <div key={nombre} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", color: "#444" }}>{nombre}</span>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#534AB7" }}>{Math.round((count / totalReservas) * 100)}%</span>
                </div>
                <div style={{ height: "6px", background: "#F0EEFF", borderRadius: "4px" }}>
                  <div style={{ height: "6px", background: "#CECBF6", borderRadius: "4px", width: `${(count / totalReservas) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "14px", boxShadow: "0 1px 8px rgba(83,74,183,0.08)", overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid #F0EEFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>Clientes frecuentes</h2>
          <span style={{ fontSize: "12px", color: "#888" }}>por número de visitas · {filtroTiempo}</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAFA", borderBottom: "0.5px solid #F0EEFF" }}>
                {["#", "Cliente", "Teléfono", "Visitas", "Último servicio", "Ingresos"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topClientes.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#ccc", fontSize: "14px" }}>Sin datos en este período</td></tr>
              ) : topClientes.map((c, i) => {
                const rk = rankColor(i)
                return (
                  <tr key={c.telefono} style={{ borderBottom: "0.5px solid #F8F8FC" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: rk.bg, color: rk.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700" }}>{i + 1}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#F0EEFF", color: "#534AB7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", flexShrink: 0 }}>{initials(c.nombre)}</div>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e" }}>{c.nombre}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", color: "#666" }}>{c.telefono}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#534AB7" }}>{c.visitas}</div>
                      <div style={{ height: "4px", background: "#F0EEFF", borderRadius: "3px", marginTop: "4px", width: "60px" }}>
                        <div style={{ height: "4px", background: "#534AB7", borderRadius: "3px", width: `${(c.visitas / maxVisitas) * 100}%` }} />
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", background: "#F0EEFF", color: "#534AB7", padding: "3px 8px", borderRadius: "8px", fontWeight: "500" }}>{c.ultimoServicio}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "14px", fontWeight: "700", color: "#16a34a" }}>S/{c.ingresos}</td>
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