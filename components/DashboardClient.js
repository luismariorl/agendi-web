"use client"
import { useState, useMemo } from "react"
import Link from "next/link"

const FILTROS_TIEMPO = ["Hoy", "Esta semana", "Este mes", "Todo"]

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

export default function DashboardClient({ empresa, reservas, sucursales }) {
  const [filtroTiempo, setFiltroTiempo] = useState("Hoy")
  const [filtroSucursal, setFiltroSucursal] = useState("Todas")

  const filtradas = useMemo(() => {
    return reservas.filter(r => {
      const enRango = estaEnRango(r.Fecha, filtroTiempo)
      const enSucursal = filtroSucursal === "Todas" || r.Sucursal === filtroSucursal
      return enRango && enSucursal
    })
  }, [reservas, filtroTiempo, filtroSucursal])

  const canceladas = filtradas.filter(r => (r.Estado || "").toLowerCase() === "cancelada").length

  const noCancel = filtradas.filter(r => (r.Estado || "").toLowerCase() !== "cancelada")

  const ingresos = noCancel.reduce((sum, r) => sum + extraerPrecio(r.Servicio), 0)

  // Clientes nuevos = teléfonos que NO aparecen en reservas fuera del período filtrado
  const telefonosEnPeriodo = new Set(filtradas.map(r => r.Telefono).filter(Boolean))
  const telefonosFuera = new Set(
    reservas
      .filter(r => !estaEnRango(r.Fecha, filtroTiempo))
      .map(r => r.Telefono)
      .filter(Boolean)
  )
  const clientesNuevos = [...telefonosEnPeriodo].filter(t => !telefonosFuera.has(t)).length

  // Servicios más pedidos
  const serviciosCount = filtradas.reduce((acc, r) => {
    const s = r.Servicio?.split("—")[0].trim() || "Sin servicio"
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})
  const topServicios = Object.entries(serviciosCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const maxServicio = topServicios[0]?.[1] || 1

  // Ocupación equipo
  const espCount = filtradas.reduce((acc, r) => {
    if (r.Especialista) acc[r.Especialista] = (acc[r.Especialista] || 0) + 1
    return acc
  }, {})
  const totalReservas = filtradas.length || 1
  const topEsp = Object.entries(espCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const hoy = new Date().toLocaleDateString("es-PE", {
    weekday: "long", day: "numeric", month: "long"
  })

  const proximasHoy = reservas
    .filter(r => estaEnRango(r.Fecha, "Hoy") && (r.Estado || "").toLowerCase() !== "cancelada")
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

  const stats = [
    { label: "Total reservas", value: filtradas.length, color: "#534AB7", sub: filtroTiempo },
    { label: "Ingresos estimados", value: `S/${ingresos}`, color: "#16a34a", sub: "sin canceladas" },
    { label: "Clientes nuevos", value: clientesNuevos, color: "#f59e0b", sub: "primera vez" },
    { label: "Cancelaciones", value: canceladas, color: "#dc2626", sub: filtroTiempo },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>
          Bienvenido, {empresa.nombre_negocio} 👋
        </h1>
        <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px", textTransform: "capitalize" }}>{hoy}</p>
      </div>

      {/* Filtros */}
      <div style={{
        background: "white", borderRadius: "14px", padding: "16px 20px",
        boxShadow: "0 1px 8px rgba(83,74,183,0.08)",
        display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center",
      }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#534AB7", marginRight: "4px" }}>Período:</span>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {FILTROS_TIEMPO.map(f => pill(f, filtroTiempo === f, () => setFiltroTiempo(f), "primary"))}
        </div>
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

      {/* Stats */}
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

      {/* Fila inferior */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

        {/* Próximas reservas hoy */}
        <div style={{
          background: "white", borderRadius: "14px",
          boxShadow: "0 1px 8px rgba(83,74,183,0.08)", overflow: "hidden",
        }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid #F0EEFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>
              Reservas de hoy ({proximasHoy.length})
            </h2>
            <Link href="/admin/reservas" style={{ fontSize: "12px", color: "#534AB7", fontWeight: "600", textDecoration: "none" }}>Ver todas →</Link>
          </div>
          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {proximasHoy.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "#ccc", fontSize: "14px" }}>No hay reservas para hoy</div>
            ) : proximasHoy.map((r, i) => {
              const st = estadoStyle(r.Estado)
              return (
                <div key={i} style={{
                  padding: "14px 20px", borderBottom: "1px solid #F8F8FC",
                  display: "flex", alignItems: "center", gap: "12px",
                }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: "#F0EEFF", color: "#534AB7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: "700", flexShrink: 0,
                  }}>{initials(r.Nombre)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>{r.Nombre}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{r.Servicio?.split("—")[0].trim()} · {r.Especialista}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: "#534AB7" }}>{r.Hora}</div>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: st.bg, color: st.color, fontWeight: "600" }}>
                      {r.Estado}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel derecho */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Servicios más pedidos */}
          <div style={{
            background: "white", borderRadius: "14px", padding: "18px 20px",
            boxShadow: "0 1px 8px rgba(83,74,183,0.08)",
          }}>
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

          {/* Ocupación equipo */}
          <div style={{
            background: "white", borderRadius: "14px", padding: "18px 20px",
            boxShadow: "0 1px 8px rgba(83,74,183,0.08)",
          }}>
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
    </div>
  )
}