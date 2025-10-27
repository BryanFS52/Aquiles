'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import { NewApprentice, Apprentice } from '@type/slices/aprendices'
import { toast } from 'react-toastify'

interface ApprenticeFormProps {
  onApprenticeCreated: (apprentice: Apprentice) => void
}

const ApprenticeForm = ({ onApprenticeCreated }: ApprenticeFormProps) => {
  const [newApprentice, setNewApprentice] = useState<NewApprentice>({
    name: '',
    lastName: '',
    documentType: '',
    documentNumber: '',
    program: '',
    email: '',
    teamNumber: '',
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewApprentice(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8081/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApprentice),
      })
      const createdApprentice: Apprentice = await response.json()
      onApprenticeCreated(createdApprentice)
      setNewApprentice({
        name: '',
        lastName: '',
        documentType: '',
        documentNumber: '',
        program: '',
        email: '',
        teamNumber: '',
      })
      toast.success("Aprendiz creado correctamente.")
    } catch (error) {
      console.error('Error al crear el aprendiz:', error)
      toast.error("No se pudo crear el aprendiz. Por favor, intente de nuevo.")
    }
  }

  return (
    <div className="bg-white dark:bg-[#0b1f33] p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Crear Nuevo Aprendiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="name">Nombres</label>
            <input 
              className="input px-4 py-2 border rounded-lg w-full" 
              id="name" 
              name="name" 
              value={newApprentice.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="lastName">Apellidos</label>
            <input 
              className="input px-4 py-2 border rounded-lg w-full" 
              id="lastName" 
              name="lastName" 
              value={newApprentice.lastName} 
              onChange={handleInputChange} 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="documentType">Tipo de Documento</label>
            <select 
              className="input px-4 py-2 border rounded-lg w-full" 
              id='documentType' 
              name="documentType" 
              value={newApprentice.documentType} 
              onChange={handleInputChange} 
              required
            >
              <option value="">Seleccionar</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="CE">Cédula de Extranjería</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="documentNumber">Número de Documento</label>
            <input 
              className="input px-4 py-2 border rounded-lg w-full" 
              id="documentNumber" 
              name="documentNumber" 
              value={newApprentice.documentNumber} 
              onChange={handleInputChange} 
              required 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="program">Programa</label>
          <input 
            className="input px-4 py-2 border rounded-lg w-full" 
            id="program" 
            name="program" 
            value={newApprentice.program} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="email">Correo Institucional</label>
          <input 
            className="input px-4 py-2 border rounded-lg w-full" 
            type="email" 
            id="email" 
            name="email" 
            value={newApprentice.email} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="teamNumber">Número del Team</label>
          <input 
            className="input px-4 py-2 border rounded-lg w-full" 
            id="teamNumber" 
            name="teamNumber" 
            value={newApprentice.teamNumber} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="bg-lightGreen text-black font-bold dark:bg-darkBlue dark:text-white px-6 py-3 rounded-lg mt-4"
        >
          Crear Aprendiz
        </button>
      </form>
    </div>
  )
}

export default ApprenticeForm