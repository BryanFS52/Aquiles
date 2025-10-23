'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@redux/store'
import { addStudent, fetchStudentList } from '@slice/olympo/studentSlice'
import { NewApprentice } from '@/components/features/Apprentices/aprendices'
import { toast } from 'react-toastify'

const ApprenticeForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [newApprentice, setNewApprentice] = useState<NewApprentice>({
    name: '',
    lastName: '',
    documentType: '',
    documentNumber: '',
    program: '',
    email: '',
    teamNumber: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewApprentice(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await dispatch(addStudent(newApprentice as any)).unwrap()
      
      if (result && result.code === '200') {
        toast.success(result.message || "Aprendiz creado correctamente.")
        setNewApprentice({
          name: '',
          lastName: '',
          documentType: '',
          documentNumber: '',
          program: '',
          email: '',
          teamNumber: '',
        })
        // Recargar la lista de estudiantes
        dispatch(fetchStudentList({}))
      } else {
        toast.error(result?.message || "No se pudo crear el aprendiz.")
      }
    } catch (error: any) {
      console.error('Error al crear el aprendiz:', error)
      toast.error(error.message || "No se pudo crear el aprendiz. Por favor, intente de nuevo.")
    } finally {
      setIsSubmitting(false)
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
          disabled={isSubmitting}
          className="bg-lightGreen text-black font-bold dark:bg-darkBlue dark:text-white px-6 py-3 rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creando...' : 'Crear Aprendiz'}
        </button>
      </form>
    </div>
  )
}

export default ApprenticeForm