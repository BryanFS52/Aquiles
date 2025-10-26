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
    <div className="bg-white dark:bg-shadowBlue p-4 sm:p-6 rounded-xl shadow-md border border-lightGray dark:border-grayText">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-primary dark:text-secondary">Crear Nuevo Aprendiz</h2>
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-grayText dark:text-white" htmlFor="name">Nombres</label>
            <input 
              className="input px-3 sm:px-4 py-2 border border-lightGray dark:border-grayText rounded-lg w-full text-sm sm:text-base bg-white dark:bg-shadowBlue text-grayText dark:text-white focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all" 
              id="name" 
              name="name" 
              value={newApprentice.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-grayText dark:text-white" htmlFor="lastName">Apellidos</label>
            <input 
              className="input px-3 sm:px-4 py-2 border border-lightGray dark:border-grayText rounded-lg w-full text-sm sm:text-base bg-white dark:bg-shadowBlue text-grayText dark:text-white focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all" 
              id="lastName" 
              name="lastName" 
              value={newApprentice.lastName} 
              onChange={handleInputChange} 
              required 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-grayText dark:text-white" htmlFor="documentType">Tipo de Documento</label>
            <select 
              className="input px-3 sm:px-4 py-2 border border-lightGray dark:border-grayText rounded-lg w-full text-sm sm:text-base bg-white dark:bg-shadowBlue text-grayText dark:text-white focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all" 
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
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-xs sm:text-sm font-medium text-grayText dark:text-white" htmlFor="documentNumber">Número de Documento</label>
            <input 
              className="input px-3 sm:px-4 py-2 border border-lightGray dark:border-grayText rounded-lg w-full text-sm sm:text-base bg-white dark:bg-shadowBlue text-grayText dark:text-white focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all" 
              id="documentNumber" 
              name="documentNumber" 
              value={newApprentice.documentNumber} 
              onChange={handleInputChange} 
              required 
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-grayText dark:text-white" htmlFor="program">Programa</label>
          <input 
            className="input px-3 sm:px-4 py-2 border border-lightGray dark:border-grayText rounded-lg w-full text-sm sm:text-base bg-white dark:bg-shadowBlue text-grayText dark:text-white focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all" 
            id="program" 
            name="program" 
            value={newApprentice.program} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-grayText dark:text-white" htmlFor="email">Correo Institucional</label>
          <input 
            className="input px-3 sm:px-4 py-2 border border-lightGray dark:border-grayText rounded-lg w-full text-sm sm:text-base bg-white dark:bg-shadowBlue text-grayText dark:text-white focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all" 
            type="email" 
            id="email" 
            name="email" 
            value={newApprentice.email} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-xs sm:text-sm font-medium text-grayText dark:text-white" htmlFor="teamNumber">Número del Team</label>
          <input 
            className="input px-3 sm:px-4 py-2 border border-lightGray dark:border-grayText rounded-lg w-full text-sm sm:text-base bg-white dark:bg-shadowBlue text-grayText dark:text-white focus:border-primary dark:focus:border-secondary focus:ring-2 focus:ring-primary/20 dark:focus:ring-secondary/20 transition-all" 
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
          className="w-full bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-blue-900 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
        >
          {isSubmitting ? 'Creando...' : 'Crear Aprendiz'}
        </button>
      </form>
    </div>
  )
}

export default ApprenticeForm