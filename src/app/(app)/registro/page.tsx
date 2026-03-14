"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Registro() {
  const [peso, setPeso] = useState("")
  const [km, setKm] = useState("")
  const [tiempo, setTiempo] = useState("")
  const [comidas, setComidas] = useState("")
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const [calorias, setCalorias] = useState<null | {
    total: number
    detalle: { comida: string; calorias: number }[]
    mensaje: string
  }>(null)
  const [analizando, setAnalizando] = useState(false)
  const [errorCalorias, setErrorCalorias] = useState("")

  async function handleGuardar() {
    setCargando(true)
    setError("")

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError("Tenés que estar logueado para guardar.")
      setCargando(false)
      return
    }

    const { error } = await supabase
      .from("registros_diarios")
      .insert({
        user_id: user.id,
        peso: peso ? parseFloat(peso) : null,
        km: km ? parseFloat(km) : null,
        tiempo: tiempo || null,
        comidas: comidas || null,
      })

    setCargando(false)

    if (error) {
      setError("Hubo un error al guardar. Intentá de nuevo.")
      console.error(error)
      return
    }

    setGuardado(true)
    setPeso("")
    setKm("")
    setTiempo("")
    setComidas("")
    setCalorias(null)
    setTimeout(() => setGuardado(false), 3000)
  }

  async function handleAnalizarCalorias() {
    if (!comidas) return
    setAnalizando(true)
    setErrorCalorias("")
    setCalorias(null)

    try {
      const res = await fetch("/api/calorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comidas }),
      })
      const data = await res.json()
      if (data.error) {
        setErrorCalorias(data.error)
      } else {
        setCalorias(data)
      }
    } catch {
      setErrorCalorias("Error al conectar con la IA.")
    }

    setAnalizando(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-400 mb-8">
          Registro del día
        </h1>

        {guardado && (
          <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-xl px-6 py-4 mb-6">
            ✅ Registro guardado correctamente
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-xl px-6 py-4 mb-6">
            ❌ {error}
          </div>
        )}

        {/* Peso */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">⚖️ Peso</h2>
          <input
            type="number"
            placeholder="Ej: 78.5"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
          <p className="text-gray-500 text-sm mt-2">kg</p>
        </section>

        {/* Actividad */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">🏃 Actividad física</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Distancia</label>
              <input
                type="number"
                placeholder="Ej: 5.2"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-gray-500 text-sm mt-1">km</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Tiempo</label>
              <input
                type="text"
                placeholder="Ej: 32:00"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-gray-500 text-sm mt-1">min:seg</p>
            </div>
          </div>
        </section>

        {/* Comidas */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">🍽️ Comidas del día</h2>
          <textarea
            placeholder="Ej: Desayuno - avena con banana. Almuerzo - arroz con pollo..."
            value={comidas}
            onChange={(e) => setComidas(e.target.value)}
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none mb-3"
          />

          <button
            onClick={handleAnalizarCalorias}
            disabled={analizando || !comidas}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {analizando ? "Analizando..." : "✨ Estimar calorías con IA"}
          </button>

          {errorCalorias && (
            <p className="text-red-400 text-sm mt-3">❌ {errorCalorias}</p>
          )}

          {calorias && (
            <div className="mt-4 bg-gray-800 rounded-xl p-4">
              <p className="text-emerald-400 font-bold text-lg mb-3">
                Total estimado: {calorias.total} kcal
              </p>
              <div className="space-y-1 mb-3">
                {calorias.detalle.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.comida}</span>
                    <span className="text-gray-400">{item.calorias} kcal</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm border-t border-gray-700 pt-3">
                💬 {calorias.mensaje}
              </p>
            </div>
          )}
        </section>

        {/* Botón */}
        <button
          onClick={handleGuardar}
          disabled={cargando}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-bold py-4 rounded-xl transition-colors"
        >
          {cargando ? "Guardando..." : "Guardar registro"}
        </button>

      </div>
    </main>
  )
}