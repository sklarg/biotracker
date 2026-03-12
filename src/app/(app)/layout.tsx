"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-emerald-400 font-bold text-xl">BioTracker</span>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-emerald-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/registro" className="text-gray-300 hover:text-emerald-400 transition-colors">
              Registro
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-red-400 transition-colors text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>
      {children}
    </>
  )
}