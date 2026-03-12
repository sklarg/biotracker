"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [esRegistro, setEsRegistro] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [mensaje, setMensaje] = useState("")

  async function handleSubmit() {
    setCargando(true)
    setError("")
    setMensaje("")

    if (esRegistro) {
      // Crear cuenta nueva
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        setError(error.message)
      } else {
        setMensaje("¡Cuenta creada! Revisá tu email para confirmar.")
      }
    } else {
      // Iniciar sesión
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setError("Email o contraseña incorrectos.")
      } else {
        router.push("/dashboard")
      }
    }

    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-400">BioTracker</h1>
          <p className="text-gray-400 mt-2">Tu seguimiento físico y nutricional</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            {esRegistro ? "Crear cuenta" : "Iniciar sesión"}
          </h2>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-xl px-4 py-3 mb-4 text-sm">
              ❌ {error}
            </div>
          )}

          {mensaje && (
            <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-xl px-4 py-3 mb-4 text-sm">
              ✅ {mensaje}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-1 block">Contraseña</label>
            <input
              type="password"
              placeholder="mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Botón */}
          <button
            onClick={handleSubmit}
            disabled={cargando}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-bold py-3 rounded-xl transition-colors"
          >
            {cargando ? "Cargando..." : esRegistro ? "Crear cuenta" : "Entrar"}
          </button>

          {/* Toggle registro/login */}
          <p className="text-center text-gray-400 text-sm mt-4">
            {esRegistro ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
            <button
              onClick={() => setEsRegistro(!esRegistro)}
              className="text-emerald-400 hover:underline"
            >
              {esRegistro ? "Iniciá sesión" : "Registrate"}
            </button>
          </p>
        </div>

      </div>
    </main>
  )
}