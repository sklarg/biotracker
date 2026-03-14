"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Perfil = {
  id: string
  rol: "nutricionista" | "paciente"
  nombre: string | null
  apellido: string | null
  nutricionista_id: string | null
}

export function usePerfil() {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarPerfil() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setCargando(false)
        return
      }

      const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error(error)
      } else {
        setPerfil(data)
      }

      setCargando(false)
    }

    cargarPerfil()
  }, [])

  return { perfil, cargando }
}