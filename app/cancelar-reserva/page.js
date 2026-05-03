"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function CancelarReservaPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [estado, setEstado] = useState("cargando")

  useEffect(() => {
    if (!id) { setEstado("error"); return }

    fetch(`/api/cancelar?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) setEstado("cancelado")
        else setEstado(data.mensaje || "error")
      })
      .catch(() => setEstado("error"))
  }, [id])

  const contenido = {
    cargando: {
      emoji: "⏳",
      titulo: "Procesando...",
      mensaje: "Estamos cancelando tu reserva.",
      color: "#534AB7",
    },
    cancelado: {
      emoji: "✅",
      titulo: "Reserva cancelada",
      mensaje: "Tu reserva fue cancelada exitosamente. ¡Esperamos verte pronto!",
      color: "#16a34a",
    },
    error: {
      emoji: "⚠️",
      titulo: "Link inválido",
      mensaje: "Esta reserva ya fue cancelada o el link no es válido.",
      color: "#dc2626",
    },
  }

  const c = contenido[estado] || contenido.error

  return (
    <div style={{
      minHeight: "100vh", background: "#F8F8FC",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif", padding: "24px",
    }}>
      <div style={{
        background: "white", borderRadius: "20px", padding: "48px 40px",
        textAlign: "center", maxWidth: "400px", width: "100%",
        boxShadow: "0 4px 24px rgba(83,74,183,0.10)",
      }}>
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>{c.emoji}</div>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 12px" }}>{c.titulo}</h1>
        <p style={{ fontSize: "15px", color: "#666", margin: "0 0 32px", lineHeight: 1.6 }}>{c.mensaje}</p>
        <a href="/" style={{
          display: "inline-block", padding: "12px 28px",
          background: "#534AB7", color: "white",
          borderRadius: "50px", fontSize: "14px", fontWeight: "600",
          textDecoration: "none",
        }}>Ir a Agendi</a>
        <p style={{ marginTop: "24px", fontSize: "12px", color: "#bbb" }}>
          Powered by <strong>Agendi</strong> · agendi.pe
        </p>
      </div>
    </div>
  )
}