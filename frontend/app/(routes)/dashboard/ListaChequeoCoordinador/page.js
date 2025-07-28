'use client'

import { useState, useEffect } from "react"
import { FaTrashAlt, FaEye, FaUserPlus } from "react-icons/fa"
import { toast } from "react-toastify"
import CrearListaChequeo from "@components/Modals/modalNewChecklist"
import PageTitle from "@components/UI/pageTitle"
import { addChecklist, fetchAllChecklists, deleteChecklist } from "@services/checkListService"

export default function CoordinadorChecklistView() {
  const [modalOpen, setModalOpen] = useState(false)
  const [checklists, setChecklists] = useState([])
  const [selectedTrimestre, setSelectedTrimestre] = useState("1")
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [checklistToDelete, setChecklistToDelete] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar checklists al montar el componente
  useEffect(() => {
    loadChecklists()
  }, [])

  const loadChecklists = async () => {
    try {
      setLoading(true)
      const response = await fetchAllChecklists(0, 100) // Cargar todos los checklists
      if (response.code === "200" && response.data) {
        setChecklists(response.data)
      }
    } catch (error) {
      console.error("Error loading checklists:", error)
      toast.error("Error al cargar las listas de chequeo")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChecklist = async (checklistData) => {
    try {
      const response = await addChecklist(checklistData)
      if (response.code === "200") {
        toast.success("Lista de chequeo creada exitosamente")
        // Recargar la lista para mostrar el nuevo checklist
        await loadChecklists()
        setModalOpen(false)
      } else {
        toast.error(response.message || "Error al crear la lista de chequeo")
      }
    } catch (error) {
      console.error("Error creating checklist:", error)
      toast.error("Error al crear la lista de chequeo")
    }
  }

  const handleDeleteChecklist = async () => {
    if (!checklistToDelete) return
    
    try {
      const response = await deleteChecklist(checklistToDelete)
      if (response.code === "200") {
        toast.success("Lista de chequeo eliminada exitosamente")
        // Recargar la lista
        await loadChecklists()
      } else {
        toast.error(response.message || "Error al eliminar la lista de chequeo")
      }
    } catch (error) {
      console.error("Error deleting checklist:", error)
      toast.error("Error al eliminar la lista de chequeo")
    } finally {
      setConfirmModalOpen(false)
      setChecklistToDelete(null)
    }
  }

  const handleCloseModal = () => setModalOpen(false)

  const handleOpenConfirmModal = (checklistId) => {
    setChecklistToDelete(checklistId)
    setConfirmModalOpen(true)
  }

  const handleViewChecklist = (checklistId) => {
    // Aquí puedes implementar la navegación a la vista detallada del checklist
    toast.info(`Ver detalles del checklist ${checklistId}`)
  }

  const handleAssignChecklist = (checklistId) => {
    // Aquí puedes implementar la funcionalidad de asignación
    toast.info(`Asignar checklist ${checklistId}`)
  }

  // Filtrar checklists por trimestre seleccionado
  // Nota: Si trimester no está disponible, mostrar todos los checklists
  const filteredChecklists = checklists.filter(
    (checklist) => !checklist.trimester || checklist.trimester === selectedTrimestre
  )

  return (
    <>
      <PageTitle>Listas de Chequeo Trimestrales</PageTitle>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="trimestre-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtrar por trimestre:
          </label>
          <select
            id="trimestre-select"
            value={selectedTrimestre}
            onChange={(e) => setSelectedTrimestre(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
          >
            <option value="1">Primer Trimestre</option>
            <option value="2">Segundo Trimestre</option>
            <option value="3">Tercer Trimestre</option>
            <option value="4">Cuarto Trimestre</option>
          </select>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#00324d] text-white px-4 py-2 rounded hover:bg-[#40b003] transition-colors"
        >
          Crear Lista de Chequeo
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00324d]"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando listas de chequeo...</span>
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Componente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Observaciones
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {filteredChecklists.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No hay listas de chequeo para el trimestre {selectedTrimestre}
                  </td>
                </tr>
              ) : (
                filteredChecklists.map((checklist) => (
                  <tr key={checklist.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      {checklist.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {checklist.component || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        checklist.state 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {checklist.state ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {checklist.remarks || 'Sin observaciones'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewChecklist(checklist.id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Ver detalles"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => handleAssignChecklist(checklist.id)}
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          title="Asignar"
                        >
                          <FaUserPlus />
                        </button>
                        <button 
                          onClick={() => handleOpenConfirmModal(checklist.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Eliminar"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de creación */}
      <CrearListaChequeo 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        onCreate={handleCreateChecklist} 
      />

      {/* Modal de confirmación para eliminar */}
      {confirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que deseas eliminar esta lista de chequeo? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteChecklist}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
