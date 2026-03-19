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
    <div className="bg-white dark:bg-shadowBlue p-4 sm:p-6 rounded-xl shadow-md border border-lightGray dark:border-grayText">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-primary dark:text-secondary">Lista de aprendices</h2>
      
      <input
        type="text"
        placeholder="Buscar aprendices"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 sm:px-4 py-2 border border-lightGray dark:border-grayText rounded-lg w-full mb-3 sm:mb-4 text-sm sm:text-base bg-white dark:bg-shadowBlue text-grayText dark:text-white focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all"
      />
      
      {/* Tabla para desktop */}
      <div className="hidden md:block overflow-x-auto border border-lightGray dark:border-grayText rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-lightGray/30 dark:bg-grayText/20 text-primary dark:text-secondary">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold text-xs sm:text-sm">Nombre</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold text-xs sm:text-sm">Documento</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold text-xs sm:text-sm">Programa</th>
              <th className="px-4 sm:px-6 py-3 text-left font-semibold text-xs sm:text-sm">Team</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-shadowBlue divide-y divide-lightGray dark:divide-grayText">
            {filteredApprentices.map((apprentice) => (
              <tr key={apprentice.documentNumber} className="hover:bg-lightGray/20 dark:hover:bg-grayText/10 transition-colors">
                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-grayText dark:text-white text-xs sm:text-sm">
                  {apprentice.name} {apprentice.lastName}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-grayText dark:text-white text-xs sm:text-sm">
                  {apprentice.documentNumber}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-grayText dark:text-white text-xs sm:text-sm">
                  {apprentice.program}
                </td>
                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-grayText dark:text-white text-xs sm:text-sm">
                  {apprentice.teamNumber}
                </td>
              </tr>
            ))}
            {filteredApprentices.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 sm:px-6 py-6 sm:py-8 text-center text-grayText/70 dark:text-white/70 text-sm">
                  No se encontraron aprendices
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards para móvil */}
      <div className="md:hidden space-y-3">
        {filteredApprentices.map((apprentice) => (
          <div 
            key={apprentice.documentNumber}
            className="bg-lightGray/20 dark:bg-grayText/10 p-3 rounded-lg border border-lightGray dark:border-grayText"
          >
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-primary dark:text-secondary">Nombre:</span>
                <p className="text-sm text-grayText dark:text-white font-semibold">
                  {apprentice.name} {apprentice.lastName}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs font-medium text-primary dark:text-secondary">Documento:</span>
                  <p className="text-sm text-grayText dark:text-white">{apprentice.documentNumber}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-primary dark:text-secondary">Team:</span>
                  <p className="text-sm text-grayText dark:text-white">{apprentice.teamNumber}</p>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-primary dark:text-secondary">Programa:</span>
                <p className="text-sm text-grayText dark:text-white truncate">{apprentice.program}</p>
              </div>
            </div>
          </div>
        ))}
        {filteredApprentices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-grayText/70 dark:text-white/70">
              No se encontraron aprendices
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApprenticeList