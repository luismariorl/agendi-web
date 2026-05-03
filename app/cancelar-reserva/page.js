import { Suspense } from "react"
import CancelarContenido from "./CancelarContenido"

export default function CancelarReservaPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh", background: "#F8F8FC",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>⏳</div>
          <p style={{ color: "#666" }}>Cargando...</p>
        </div>
      </div>
    }>
      <CancelarContenido />
    </Suspense>
  )
}