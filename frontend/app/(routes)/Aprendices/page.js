  'use client'

  import React, { useState, useEffect } from 'react'
  import { ToastContainer, toast } from 'react-toastify'
  import 'react-toastify/dist/ReactToastify.css'
  import { HeaderCoordinador } from "@components/HeaderCoordinador"
  import { Sidebarcoordinador } from "@components/SidebarCoordinador"

  function ListaApprentices() {
    const [apprentices, setApprentices] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [newApprentice, setNewApprentice] = useState({
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
    
    const filteredApprentices = Array.isArray(apprentices) 
    ? apprentices.filter(apprentice =>
        Object.values(apprentice).some(value =>
          value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];


    const handleInputChange = (e) => {
      const { name, value } = e.target
      setNewApprentice(prev => ({ ...prev, [name]: value }))
    }
    
    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        const response = await fetch('http://localhost:8081/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newApprentice),
        })
        const createdApprentice = await response.json()
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
      <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6 bg-gray-50">
        <Sidebarcoordinador />
        <div className="xl:col-span-5">
          <HeaderCoordinador />


          <div className="container mx-auto p-6 space-y-6">
          <h1 className="text-3xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">Gestión de Aprendices</h1>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Crear Nuevo Aprendiz */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Crear Nuevo Aprendiz</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="name">Nombres</label>
                    <input 
                      className="input px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="name" 
                      name="name" 
                      value={newApprentice.name} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">Apellidos</label>
                    <input 
                      className="input px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <label className="block text-sm font-medium text-gray-700" htmlFor="documentType">Tipo de Documento</label>
                    <select 
                      className="input px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="documentType" 
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
                    <label className="block text-sm font-medium text-gray-700" htmlFor="documentNumber">Número de Documento</label>
                    <input 
                      className="input px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      id="documentNumber" 
                      name="documentNumber" 
                      value={newApprentice.documentNumber} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="program">Programa</label>
                  <input 
                    className="input px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="program" 
                    name="program" 
                    value={newApprentice.program} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="email">Correo Institucional</label>
                  <input 
                    className="input px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="email" 
                    name="email" 
                    type="email" 
                    value={newApprentice.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="teamNumber">Número del Team</label>
                  <input 
                    className="input px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="teamNumber" 
                    name="teamNumber" 
                    value={newApprentice.teamNumber} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-600">Crear Aprendiz</button>
              </form>
            </div>

            {/* Lista de Aprendices */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Lista de Aprendices</h2>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar aprendices"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="border rounded-lg overflow-hidden shadow-md">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Programa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApprentices.map((apprentice) => (
                      <tr key={apprentice.documentNumber}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{apprentice.name} {apprentice.lastName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apprentice.documentNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apprentice.program}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apprentice.teamNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          </div>

          <ToastContainer />
        </div>
      </div>
    )
  }

  export default ListaApprentices
