"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const inputStyle = {
  width: "100%", padding: "10px 14px", borderRadius: "10px",
  border: "1.5px solid #E8E8F0", fontSize: "14px",
  fontFamily: "'DM Sans', sans-serif", outline: "none", color: "#1a1a2e",
  boxSizing: "border-box",
}

function Campo({ label, hint, children }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#888", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {children}
      {hint && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#bbb" }}>{hint}</p>}
    </div>
  )
}

export default function ConfiguracionClient({ empresa }) {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  const sucursalesIniciales = (empresa.sucursales || "").split("|").map(s => s.trim()).filter(Boolean)

  const whatsappActual = empresa.whatsapp_dueño || ""
  const codigosConocidos = ["51","1","52","54","56","57","58","591","593","595","598","34","44"]
  const codigoDetectado = codigosConocidos.find(c => whatsappActual.startsWith(c)) || "51"
  const numeroDetectado = whatsappActual.startsWith(codigoDetectado) ? whatsappActual.slice(codigoDetectado.length) : whatsappActual

  const [form, setForm] = useState({
    nombre_negocio: empresa.nombre_negocio || "",
    codigoPais: codigoDetectado,
    numeroLocal: numeroDetectado,
    sucursales: sucursalesIniciales,
  })

  const [nuevaSucursal, setNuevaSucursal] = useState("")

  function agregarSucursal() {
    const s = nuevaSucursal.trim()
    if (!s || form.sucursales.includes(s)) return
    setForm(f => ({ ...f, sucursales: [...f.sucursales, s] }))
    setNuevaSucursal("")
  }

  function eliminarSucursal(s) {
    setForm(f => ({ ...f, sucursales: f.sucursales.filter(x => x !== s) }))
  }

  async function guardar() {
    if (!form.nombre_negocio || !form.numeroLocal) return alert("Completa los campos obligatorios")
    setCargando(true)
    await fetch("/api/configuracion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        whatsapp_dueño: `${form.codigoPais}${form.numeroLocal}`,
        sucursales: form.sucursales.join("|"),
      }),
    })
    setCargando(false)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3000)
    window.location.reload()
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>Configuración</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>Información general de tu negocio</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {guardado && (
            <div style={{ padding: "10px 20px", borderRadius: "10px", background: "#DCFCE7", color: "#16a34a", fontSize: "14px", fontWeight: "600" }}>
              ✓ Cambios guardados
            </div>
          )}
          <button onClick={guardar} disabled={cargando} style={{
            padding: "12px 28px", borderRadius: "10px", border: "none",
            background: "#534AB7", color: "white", fontSize: "14px", fontWeight: "600",
            cursor: cargando ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif",
            opacity: cargando ? 0.7 : 1,
          }}>{cargando ? "Guardando..." : "Guardar cambios"}</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" }}>

        {/* Info general */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 8px rgba(83,74,183,0.08)" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>Información general</h2>

          <Campo label="Nombre del negocio *">
            <input style={inputStyle} value={form.nombre_negocio}
              onChange={e => setForm(f => ({ ...f, nombre_negocio: e.target.value }))}
              placeholder="Ej: Salon Pro" />
          </Campo>

          <Campo label="WhatsApp del dueño *" hint="Selecciona el código de país e ingresa tu número local">
            <div style={{ display: "flex", gap: "8px" }}>
              <select
                value={form.codigoPais}
                onChange={e => setForm(f => ({ ...f, codigoPais: e.target.value }))}
                style={{ ...inputStyle, width: "140px", flexShrink: 0 }}
              >
                <option value="51">PE +51 Perú</option>
                <option value="1">US +1 EE.UU.</option>
                <option value="52">MX +52 México</option>
                <option value="54">AR +54 Argentina</option>
                <option value="56">CL +56 Chile</option>
                <option value="57">CO +57 Colombia</option>
                <option value="58">VE +58 Venezuela</option>
                <option value="591">BO +591 Bolivia</option>
                <option value="593">EC +593 Ecuador</option>
                <option value="595">PY +595 Paraguay</option>
                <option value="598">UY +598 Uruguay</option>
                <option value="34">ES +34 España</option>
                <option value="44">GB +44 Reino Unido</option>
              </select>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={form.numeroLocal}
                onChange={e => setForm(f => ({ ...f, numeroLocal: e.target.value.replace(/\D/g, "") }))}
                placeholder="987456321"
              />
            </div>
          </Campo>

          <Campo label="Gmail admin" hint="No se puede cambiar desde aquí">
            <input style={{ ...inputStyle, background: "#FAFAFA", color: "#aaa" }}
              value={empresa.gmail_admin} disabled />
          </Campo>

          <Campo label="Plan actual" hint="Para cambiar de plan contáctanos">
            <div style={{
              padding: "10px 14px", borderRadius: "10px", background: "#F0EEFF",
              fontSize: "14px", fontWeight: "600", color: "#534AB7",
              display: "inline-block",
            }}>{(empresa.plan || "").toUpperCase()}</div>
          </Campo>
        </div>

        {/* Sucursales */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 8px rgba(83,74,183,0.08)" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: "700", color: "#1a1a2e" }}>Sucursales</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
            {form.sucursales.length === 0 ? (
              <p style={{ color: "#ccc", fontSize: "14px" }}>No hay sucursales registradas</p>
            ) : form.sucursales.map(s => (
              <div key={s} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px", borderRadius: "10px",
                border: "1.5px solid #E8E8F0", background: "#FAFAFA",
              }}>
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a2e" }}>{s}</span>
                <button onClick={() => eliminarSucursal(s)} style={{
                  background: "none", border: "none", color: "#dc2626",
                  fontSize: "18px", cursor: "pointer", lineHeight: 1,
                }}>×</button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={nuevaSucursal}
              onChange={e => setNuevaSucursal(e.target.value)}
              onKeyDown={e => e.key === "Enter" && agregarSucursal()}
              placeholder="Nueva sucursal..."
            />
            <button onClick={agregarSucursal} style={{
              padding: "10px 16px", borderRadius: "10px", border: "none",
              background: "#534AB7", color: "white", fontSize: "14px", fontWeight: "600",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
            }}>+ Agregar</button>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#bbb" }}>Presiona Enter o click en Agregar</p>
        </div>
      </div>
    </div>
  )
}