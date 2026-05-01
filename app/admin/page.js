import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { getSheetData, getReservas } from "@/lib/sheets"

export default async function AdminPage() {
  const session = await getServerSession()
  if (!session) redirect("/admin/login")

  const empresas = await getSheetData("Empresas")
  const empresa = empresas.find(e => e.gmail_admin === session.user.email)

  if (!empresa) redirect("/admin/login")

  const reservas = await getReservas(empresa.sheet_id)
  const hoy = new Date().toLocaleDateString("es-PE")
  const reservasHoy = reservas.filter(r => r.fecha === hoy)

  return (
    <div style={{ padding: "32px", fontFamily: "DM Sans, sans-serif" }}>
      <h1 style={{ color: "#534AB7", marginBottom: "8px" }}>
        Bienvenido, {empresa.nombre_negocio}
      </h1>
      <p style={{ color: "#666", marginBottom: "32px" }}>
        Plan: <strong>{empresa.plan}</strong>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <div style={{ background: "#534AB7", color: "white", borderRadius: "12px", padding: "24px" }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Reservas hoy</p>
          <h2 style={{ margin: "8px 0 0", fontSize: "36px" }}>{reservasHoy.length}</h2>
        </div>
        <div style={{ background: "#CECBF6", borderRadius: "12px", padding: "24px" }}>
          <p style={{ margin: 0, color: "#534AB7", opacity: 0.8 }}>Total reservas</p>
          <h2 style={{ margin: "8px 0 0", fontSize: "36px", color: "#534AB7" }}>{reservas.length}</h2>
        </div>
        <div style={{ background: "#f5f5f5", borderRadius: "12px", padding: "24px" }}>
          <p style={{ margin: 0, color: "#666" }}>Fecha</p>
          <h2 style={{ margin: "8px 0 0", fontSize: "20px", color: "#333" }}>{hoy}</h2>
        </div>
      </div>
    </div>
  )
}