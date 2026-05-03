"use client"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#F8F8FC",
    }}>
      <div style={{
        background: "white",
        padding: "48px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow: "0 4px 24px rgba(83,74,183,0.10)",
        maxWidth: "400px",
        width: "100%",
      }}>
        <div style={{
          width: "56px", height: "56px",
          background: "#534AB7",
          borderRadius: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          fontSize: "28px", fontWeight: "700", color: "white",
          fontFamily: "'DM Serif Display', serif",
        }}>A</div>
        <h1 style={{
          color: "#534AB7",
          fontFamily: "'DM Serif Display', serif",
          fontSize: "36px",
          fontWeight: "700",
          margin: "0 0 8px",
          letterSpacing: "-0.5px",
        }}>Agendi</h1>
        <p style={{
          color: "#888",
          marginBottom: "36px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "15px",
        }}>Panel de administración</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          style={{
            background: "#534AB7",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "14px 32px",
            fontSize: "15px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: "600",
            width: "100%",
            transition: "opacity 0.15s",
          }}
        >
          Ingresar con Google
        </button>
      </div>
    </div>
  )
}