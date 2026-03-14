import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  const { comidas } = await request.json()

  if (!comidas) {
    return NextResponse.json({ error: "No hay comidas para analizar" }, { status: 400 })
  }

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analizá estas comidas y estimá las calorías totales del día. 
        Sé conciso y práctico. Devolvé solo un objeto JSON con este formato exacto:
        {
          "total": 1850,
          "detalle": [
            { "comida": "nombre", "calorias": 300 }
          ],
          "mensaje": "Un comentario breve sobre la alimentación del día"
        }
        
        Comidas del día: ${comidas}`,
      },
    ],
  })

  const texto = message.content[0].type === "text" ? message.content[0].text : ""

  try {
    const limpio = texto.replace(/```json\n?/g, "").replace(/```/g, "").trim()
    const resultado = JSON.parse(limpio)
    return NextResponse.json(resultado)
  } catch (e) {
    console.error("Error parseando respuesta:", texto, e)
    return NextResponse.json({ error: "No se pudo analizar la respuesta" }, { status: 500 })
  }
}