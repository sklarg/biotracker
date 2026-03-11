import StatCard from "@/components/StatCard"

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-400 mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard titulo="Peso actual" valor="78.5" unidad="kg" />
          <StatCard titulo="Km este mes" valor="42" unidad="km" color="text-blue-400" />
          <StatCard titulo="Racha actual" valor="5" unidad="días" color="text-yellow-400" />
        </div>
      </div>
    </main>
  )
}