"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { signOut } from "next-auth/react"

const ICONS = {
  dashboard: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>,
  reservas: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M5 1v4M11 1v4M2 7h12"/></svg>,
  equipo: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="5" r="2.5"/><path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5"/><circle cx="12" cy="5" r="2"/><path d="M15 13c0-2.21-1.79-4-4-4"/></svg>,
  servicios: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg>,
  configuracion: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/></svg>,
}

const NAV = [
  { href: "/admin", label: "Dashboard", key: "dashboard" },
  { href: "/admin/reservas", label: "Reservas", key: "reservas" },
  { href: "/admin/equipo", label: "Equipo", key: "equipo" },
  { href: "/admin/servicios", label: "Servicios", key: "servicios" },
  { href: "/admin/configuracion", label: "Configuración", key: "configuracion" },
]

export default function AdminShell({ empresa, usuario, children }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#F8F8FC",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? "72px" : "240px",
        background: "#534AB7",
        borderRight: "none",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        overflow: "hidden",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        boxShadow: "2px 0 12px rgba(83,74,183,0.2)",
      }}>

        {/* Logo */}
        <div style={{
          padding: "24px 16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{
            width: "36px", height: "36px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            fontSize: "18px", fontWeight: "700", color: "white",
            fontFamily: "'DM Serif Display', serif",
          }}>A</div>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: "700", fontSize: "16px", color: "#fff" }}>Agendi</div>
              <div style={{ fontSize: "11px", color: "#CECBF6", fontWeight: "500" }}>{empresa.plan?.toUpperCase()}</div>
            </div>
          )}
        </div>

        {/* Negocio */}
        {!collapsed && (
          <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Negocio</div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>{empresa.nombre_negocio}</div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "10px",
                background: active ? "#CECBF6" : "transparent",
                color: active ? "#3C3489" : "rgba(255,255,255,0.65)",
                fontWeight: active ? "600" : "400",
                fontSize: "14px",
                textDecoration: "none",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}>
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "16px", height: "16px", flexShrink: 0,
                  color: active ? "#3C3489" : "rgba(255,255,255,0.65)",
                }}>{ICONS[item.key]}</span>
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        {/* Usuario + logout */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {!collapsed && (
            <div style={{ padding: "8px 12px", marginBottom: "4px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#fff" }}>{usuario.name}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{usuario.email}</div>
            </div>
          )}
          <button onClick={() => signOut({ callbackUrl: "/admin/login" })} style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "10px",
            border: "none",
            background: "transparent",
            color: "rgba(255,255,255,0.5)",
            fontSize: "13px",
            cursor: "pointer",
            textAlign: collapsed ? "center" : "left",
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {collapsed ? "↩" : "↩ Cerrar sesión"}
          </button>
        </div>

        {/* Toggle collapse */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          position: "absolute",
          top: "50%",
          right: "-12px",
          width: "24px", height: "24px",
          borderRadius: "50%",
          border: "1px solid #CECBF6",
          background: "white",
          cursor: "pointer",
          fontSize: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
          {collapsed ? "›" : "‹"}
        </button>
      </aside>

      {/* Contenido principal */}
      <main style={{
        flex: 1,
        marginLeft: collapsed ? "72px" : "240px",
        transition: "margin-left 0.2s ease",
        minHeight: "100vh",
      }}>
        {/* Header */}
        <header style={{
          background: "#EEEDFE",
          borderBottom: "1px solid #CECBF6",
          padding: "0 32px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#26215C" }}>
            {NAV.find(n => n.href === pathname)?.label || "Panel"}
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "#fff",
            padding: "6px 12px",
            borderRadius: "20px",
            border: "0.5px solid #CECBF6",
          }}>
            <div style={{
              width: "28px", height: "28px",
              borderRadius: "50%",
              background: "#534AB7",
              color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: "600",
            }}>
              {usuario.name?.[0] || "U"}
            </div>
            <span style={{ fontSize: "13px", fontWeight: "500", color: "#534AB7" }}>
              {empresa.plan?.toUpperCase()}
            </span>
          </div>
        </header>

        {/* Página */}
        <div style={{ padding: "32px" }}>
          {children}
        </div>
      </main>
    </div>
  )
}