"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { usePerfil } from "@/hooks/usePerfil"

type Paciente = {
  id: string
  nombre: string | null
  apellido: string | null
  created_at: string
}

export default function Pacientes() {
  const { perfil, cargando: cargandoPerfil } = usePerfil()
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarPacientes() {
      if (!perfil) return

      const { data, error } = await supabase
        .from("perfiles")
        .select("id, nombre, apellido, created_at")
        .eq("nutricionista_id", perfil.id)
        .eq("rol", "paciente")

      if (error) {
        console.error(error)
        return
      }

      setPacientes(data || [])
      setCargando(false)
    }

    if (!cargandoPerfil) cargarPacientes()
  }, [perfil, cargandoPerfil])

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-400 mb-2">
          Mis pacientes
        </h1>
        <p className="text-gray-400 mb-8">Seguimiento de tus pacientes</p>

        {cargando ? (
          <p className="text-gray-400">Cargando...</p>
        ) : pacientes.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400">No tenés pacientes todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pacientes.map((p) => (
              <div
                key={p.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-colors cursor-pointer"
              >
                <h2 className="text-lg font-semibold">
                  {p.nombre} {p.apellido}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Paciente desde {new Date(p.created_at).toLocaleDateString("es-AR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}