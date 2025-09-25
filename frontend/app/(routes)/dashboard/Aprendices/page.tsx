// Pendiente sigue en api Rest
'use client'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Apprentice, NewApprentice } from '@type/slices/aprendices'
import { toast } from 'react-toastify'
import PageTitle from '@components/UI/pageTitle'
const ListaApprentices = () => {
  const [apprentices, setApprentices] = useState<Apprentice[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [newApprentice, setNewApprentice] = useState<NewApprentice>({
    name: '',
    lastName: '',
    documentType: '',
    documentNumber: '',
    program: '',
    email: '',
    teamNumber: '',
  })

  useEffect(() => {
    const fetchApprentices = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/students')
        const data = await response.json()
        setApprentices(data)
      } catch (error) {
        console.error('Error al obtener los aprendices:', error)
        toast.error("No se pudieron cargar los aprendices. Por favor, intente de nuevo más tarde.")
      }
    }

    fetchApprentices()
  }, [])

  const filteredApprentices: Apprentice[] = Array.isArray(apprentices)
    ? apprentices.filter(apprentice =>
      Object.values(apprentice).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    : []

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
      setApprentices(prev => [...prev, createdApprentice])
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
    <>
      <PageTitle>Gestión de Aprendices</PageTitle>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Crear Nuevo Aprendiz */}
        <div className="bg-white dark:bg-[#0b1f33] p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Crear Nuevo Aprendiz</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="name">Nombres</label>
                <input className="input px-4 py-2 border rounded-lg w-full" id="name" name="name" value={newApprentice.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="lastName">Apellidos</label>
                <input className="input px-4 py-2 border rounded-lg w-full" id="lastName" name="lastName" value={newApprentice.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="documentType">Tipo de Documento</label>
                <select className="input px-4 py-2 border rounded-lg w-full" id='documentType' name="documentType" value={newApprentice.documentType} onChange={handleInputChange} required>
                  <option value="">Seleccionar</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CE">Cédula de Extranjería</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="documentNumber">Número de Documento</label>
                <input className="input px-4 py-2 border rounded-lg w-full" id="documentNumber" name="documentNumber" value={newApprentice.documentNumber} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="program">Programa</label>
              <input className="input px-4 py-2 border rounded-lg w-full" id="program" name="program" value={newApprentice.program} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="email">Correo Institucional</label>
              <input className="input px-4 py-2 border rounded-lg w-full" type="email" id="email" name="email" value={newApprentice.email} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-100" htmlFor="teamNumber">Número del Team</label>
              <input className="input px-4 py-2 border rounded-lg w-full" id="teamNumber" name="teamNumber" value={newApprentice.teamNumber} onChange={handleInputChange} required />
            </div>

            <button type="submit" className="bg-lightGreen text-black font-bold dark:bg-darkBlue dark:text-white px-6 py-3 rounded-lg mt-4 ">Crear Aprendiz</button>
          </form>
        </div>

        {/* Lista de Aprendices */}
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
                    <td className="px-6 py-4 whitespace-nowrap">{apprentice.name} {apprentice.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{apprentice.documentNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{apprentice.program}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{apprentice.teamNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default ListaApprentices;