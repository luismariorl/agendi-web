"use client"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5",
    }}>
      <div style={{
        background: "white",
        padding: "48px",
        borderRadius: "16px",
        textAlign: "center",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        maxWidth: "400px",
        width: "100%",
      }}>
        <h1 style={{ color: "#534AB7", fontFamily: "DM Sans, sans-serif", marginBottom: "8px" }}>
          Agendi
        </h1>
        <p style={{ color: "#666", marginBottom: "32px", fontFamily: "DM Sans, sans-serif" }}>
          Panel de administración
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          style={{
            background: "#534AB7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "14px 32px",
            fontSize: "16px",
            cursor: "pointer",
            fontFamily: "DM Sans, sans-serif",
            width: "100%",
          }}
        >
          Ingresar con Google
        </button>
      </div>
    </div>
  )
}