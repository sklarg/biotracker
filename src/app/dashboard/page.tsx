"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import StatCard from "@/components/StatCard"

type Registro = {
  id: string
  fecha: string
  peso: number | null
  km: number | null
  tiempo: string | null
  comidas: string | null
}

export default function Dashboard() {
  const [registros, setRegistros] = useState<Registro[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarDatos() {
      const { data, error } = await supabase
        .from("registros_diarios")
        .select("*")
        .order("fecha", { ascending: false })
        .limit(30)

      if (error) {
        console.error(error)
        return
      }

      setRegistros(data || [])
      setCargando(false)
    }

    cargarDatos()
  }, [])

  // Calculos para las tarjetas
  const ultimoPeso = registros.find((r) => r.peso !== null)?.peso
  const totalKmMes = registros.reduce((acc, r) => acc + (r.km || 0), 0)
  const racha = registros.filter((r) => r.km && r.km > 0).length

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-400 mb-8">Dashboard</h1>

        {cargando ? (
          <p className="text-gray-400">Cargando datos...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard
                titulo="Último peso"
                valor={ultimoPeso ? ultimoPeso.toString() : "-"}
                unidad="kg"
              />
              <StatCard
                titulo="Km últimos 30 días"
                valor={totalKmMes.toFixed(1)}
                unidad="km"
                color="text-blue-400"
              />
              <StatCard
                titulo="Días entrenados"
                valor={racha.toString()}
                unidad="días"
                color="text-yellow-400"
              />
            </div>

            {/* Tabla de registros recientes */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Registros recientes</h2>
              {registros.length === 0 ? (
                <p className="text-gray-400">No hay registros todavía.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-800">
                      <th className="text-left py-2">Fecha</th>
                      <th className="text-left py-2">Peso</th>
                      <th className="text-left py-2">Km</th>
                      <th className="text-left py-2">Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.map((r) => (
                      <tr key={r.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                        <td className="py-2">{r.fecha}</td>
                        <td className="py-2">{r.peso ? `${r.peso} kg` : "-"}</td>
                        <td className="py-2">{r.km ? `${r.km} km` : "-"}</td>
                        <td className="py-2">{r.tiempo || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}