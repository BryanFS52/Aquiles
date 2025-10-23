'use client'
import { useState } from 'react'
import { Apprentice } from '@/components/features/Apprentices/aprendices'

interface ApprenticeListProps {
  apprentices: Apprentice[]
}

const ApprenticeList = ({ apprentices }: ApprenticeListProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const filteredApprentices: Apprentice[] = Array.isArray(apprentices)
    ? apprentices.filter(apprentice =>
      Object.values(apprentice).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    : []

  return (
    <div className="bg-white dark:bg-[#0b1f33] p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Lista de Aprendices</h2>
      
      <input
        type="text"
        placeholder="Buscar aprendices"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input px-4 py-2 border rounded-lg w-full mb-4"
      />
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Nombre</th>
              <th className="px-6 py-3 text-left font-medium">Documento</th>
              <th className="px-6 py-3 text-left font-medium">Programa</th>
              <th className="px-6 py-3 text-left font-medium">Team</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#002033] divide-y divide-gray-200 dark:divide-gray-600">
            {filteredApprentices.map((apprentice) => (
              <tr key={apprentice.documentNumber}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {apprentice.name} {apprentice.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {apprentice.documentNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {apprentice.program}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {apprentice.teamNumber}
                </td>
              </tr>
            ))}
            {filteredApprentices.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No se encontraron aprendices
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ApprenticeList