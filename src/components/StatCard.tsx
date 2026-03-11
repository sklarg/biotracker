type Props = {
  titulo: string
  valor: string
  unidad: string
  color?: string
}

export default function StatCard({ titulo, valor, unidad, color = "text-emerald-400" }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-sm mb-1">{titulo}</p>
      <p className={`text-3xl font-bold ${color}`}>
        {valor} <span className="text-lg font-normal text-gray-400">{unidad}</span>
      </p>
    </div>
  )
}