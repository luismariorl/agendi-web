"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

function Modal({ titulo, onClose, onGuardar, cargando, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}>
      <div style={{
        background: "white", borderRadius: "16px", padding: "28px",
        width: "100%", maxWidth: "440px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
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

export default function ServiciosClient({ servicios, empresa }) {
  const router = useRouter()
  const [modalAgregar, setModalAgregar] = useState(false)
  const [modalEditar, setModalEditar] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [form, setForm] = useState({ nombre_servicio: "", precio: "", duracion_min: "" })

  function abrirAgregar() {
    setForm({ nombre_servicio: "", precio: "", duracion_min: "" })
    setModalAgregar(true)
  }

  function abrirEditar(srv) {
    setForm({
      nombre_servicio: srv.nombre_servicio,
      precio: srv.precio,
      duracion_min: srv.duracion_min,
      _fila: srv._fila,
    })
    setModalEditar(srv)
  }

  async function guardarNuevo() {
    if (!form.nombre_servicio || !form.precio || !form.duracion_min) return alert("Completa todos los campos")
    setCargando(true)
    await fetch("/api/servicios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setCargando(false)
    setModalAgregar(false)
    router.refresh()
  }

  async function guardarEditar() {
    if (!form.nombre_servicio || !form.precio || !form.duracion_min) return alert("Completa todos los campos")
    setCargando(true)
    await fetch("/api/servicios", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, fila: form._fila }),
    })
    setCargando(false)
    setModalEditar(null)
    router.refresh()
  }

  async function eliminar() {
    if (!confirm(`¿Eliminar "${form.nombre_servicio}"? Esta acción no se puede deshacer.`)) return
    setCargando(true)
    await fetch("/api/servicios", {
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
      <Campo label="Nombre del servicio *">
        <input style={inputStyle} value={form.nombre_servicio}
          onChange={e => setForm(f => ({ ...f, nombre_servicio: e.target.value }))}
          placeholder="Ej: Corte de cabello" />
      </Campo>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Campo label="Precio (S/) *">
          <input style={inputStyle} type="number" value={form.precio}
            onChange={e => setForm(f => ({ ...f, precio: e.target.value }))}
            placeholder="50" />
        </Campo>
        <Campo label="Duración (min) *">
          <input style={inputStyle} type="number" value={form.duracion_min}
            onChange={e => setForm(f => ({ ...f, duracion_min: e.target.value }))}
            placeholder="45" />
        </Campo>
      </div>
    </>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "700", color: "#1a1a2e" }}>Servicios</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>{servicios.length} servicios registrados</p>
        </div>
        <button onClick={abrirAgregar} style={{
          padding: "10px 20px", borderRadius: "10px", border: "none",
          background: "#534AB7", color: "white", fontSize: "14px", fontWeight: "600",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>+ Agregar servicio</button>
      </div>

      {/* Grid de servicios */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
        {servicios.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#ccc", fontSize: "14px", background: "white", borderRadius: "14px" }}>
            No hay servicios registrados
          </div>
        ) : servicios.map((srv, i) => (
          <div key={i} style={{
            background: "white", borderRadius: "14px",
            boxShadow: "0 1px 8px rgba(83,74,183,0.08)",
            overflow: "hidden",
          }}>
            <div style={{ background: "#534AB7", padding: "16px 20px" }}>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "white" }}>{srv.nombre_servicio}</div>
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>Precio</span>
                <span style={{ fontSize: "18px", fontWeight: "700", color: "#534AB7" }}>S/{srv.precio}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>Duración</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>{srv.duracion_min} min</span>
              </div>
              <button onClick={() => abrirEditar(srv)} style={{
                marginTop: "4px", padding: "8px", borderRadius: "8px",
                border: "1.5px solid #E8E8F0", background: "white",
                color: "#534AB7", fontSize: "13px", fontWeight: "600",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>✏ Editar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal agregar */}
      {modalAgregar && (
        <Modal titulo="Agregar servicio" onClose={() => setModalAgregar(false)} onGuardar={guardarNuevo} cargando={cargando}>
          {formulario}
        </Modal>
      )}

      {/* Modal editar */}
      {modalEditar && (
        <Modal titulo={`Editar — ${modalEditar.nombre_servicio}`} onClose={() => setModalEditar(null)} onGuardar={guardarEditar} cargando={cargando}>
          {formulario}
          <div style={{ marginTop: "8px", paddingTop: "16px", borderTop: "1px solid #F0EEFF" }}>
            <button type="button" onClick={eliminar} style={{
              width: "100%", padding: "10px", borderRadius: "10px",
              border: "1.5px solid #FEE2E2", background: "#FFF1F1",
              color: "#dc2626", fontSize: "14px", fontWeight: "600",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            }}>Eliminar servicio</button>
          </div>
        </Modal>
      )}
    </div>
  )
}