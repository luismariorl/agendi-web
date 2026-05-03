export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) return Response.json({ ok: false, mensaje: "error" })

  try {
    const res = await fetch(
      `https://n8n-production-3265.up.railway.app/webhook/cancelar?id=${id}`
    )
    const text = await res.text()

    if (text.includes("cancelada exitosamente")) {
      return Response.json({ ok: true })
    } else {
      return Response.json({ ok: false, mensaje: "error" })
    }
  } catch {
    return Response.json({ ok: false, mensaje: "error" })
  }
}