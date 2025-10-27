'use client'

import { useState } from "react"
import { FaTrashAlt, FaEdit } from "react-icons/fa"
import CrearListaChequeo from "@components/Modals/modalNewChecklist"
import PageTitle from "@components/UI/pageTitle"

export default function CoordinadorChecklistView() {
  const [checklists, setChecklists] = useState([
    {
      id: "1",
      trimester: "1",
      trainingProjectName: "Proyecto de Software",
      component: "Desarrollo Frontend",
      studySheets: "2835109,2856210",
      items: [{}, {}, {}, {}],
      state: true,
      remarks: "Competencia técnica avanzada"
    },
    {
      id: "2",
      trimester: "2",
      trainingProjectName: "Proyecto de Redes",
      component: "Infraestructura",
      studySheets: "2901321",
      items: [{}, {}],
      state: false,
      remarks: "Evaluar desempeño grupal"
    }
  ])

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [selectedTrimestre, setSelectedTrimestre] = useState("todos")
  const [isEditing, setIsEditing] = useState(false)
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null)

  // 🔹 Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false)
    setIsEditing(false)
    setSelectedChecklist(null)
  }

  // 🔹 Abrir modal para crear
  const handleOpenCreateModal = () => {
    setIsEditing(false)
    setSelectedChecklist(null)
    setModalOpen(true)
  }

  // 🔹 Abrir modal para editar (se envían los datos al modal)
  const handleOpenEditModal = (checklist: any) => {
    setIsEditing(true)
    setSelectedChecklist(checklist)
    setModalOpen(true)
  }

  // 🔹 Abrir modal de confirmación
  const handleOpenConfirmModal = (checklist: any) => {
    setSelectedChecklist(checklist)
    setConfirmModalOpen(true)
  }

  // 🔹 Eliminar lista
  const handleDeleteChecklist = () => {
    if (selectedChecklist) {
      setChecklists(prev => prev.filter(c => c.id !== selectedChecklist.id))
    }
    setConfirmModalOpen(false)
  }

  // ✅ Crear o actualizar lista
  const handleSaveChecklist = (data: any) => {
    if (isEditing) {
      // 🔹 Actualiza la lista existente
      setChecklists(prev =>
        prev.map(c =>
          c.id === data.id ? { ...c, ...data } : c
        )
      )
    } else {
      // 🔹 Crea nueva lista
      const newChecklist = {
        id: String(Date.now()),
        ...data,
        items: data.items || [],
        state: true
      }
      setChecklists(prev => [...prev, newChecklist])
    }

    // Cierra el modal
    setModalOpen(false)
    setIsEditing(false)
    setSelectedChecklist(null)
  }

  const getFormattedStudySheets = (studySheets: string): string => {
    if (!studySheets) return 'Sin fichas asociadas'
    const sheetIds = studySheets.split(',')
    if (sheetIds.length === 1) return `Ficha ${sheetIds[0]}`
    return `${sheetIds.length} fichas asociadas`
  }

  const filteredChecklists = checklists.filter(
    (checklist) => selectedTrimestre === "todos" || checklist.trimester === selectedTrimestre
  )

  return (
    <>
      <PageTitle>Listas de Chequeo Trimestrales</PageTitle>

      {/* Filtro y botón */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <label
            htmlFor="trimestre-select"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Filtrar por trimestre:
          </label>
          <select
            id="trimestre-select"
            value={selectedTrimestre}
            onChange={(e) => setSelectedTrimestre(e.target.value)}
            className="px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-full focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
          >
            <option value="todos">Todos los Trimestres</option>
            <option value="1">Primer Trimestre</option>
            <option value="2">Segundo Trimestre</option>
            <option value="3">Tercer Trimestre</option>
            <option value="4">Cuarto Trimestre</option>
            <option value="5">Quinto Trimestre</option>
            <option value="6">Sexto Trimestre</option>
            <option value="7">Séptimo Trimestre</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white px-6 py-3 rounded-full hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
        >
          + Crear Lista de Chequeo
        </button>
      </div>

      {/* Listas */}
      <div className="mt-6 overflow-visible">
        {filteredChecklists.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No hay listas de chequeo disponibles
              </p>
            </div>
          </div>
        ) : (
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto pb-8 px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
              {filteredChecklists.map((checklist) => (
                <div
                  key={checklist.id}
                  className="group relative transform transition-all duration-300 hover:scale-105 hover:z-10"
                >
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border-2 border-lime-500/30 dark:border-shadowBlue/50 shadow-2xl hover:shadow-lime-200 dark:hover:shadow-shadowBlue/30 overflow-hidden">
                    <div className="bg-gradient-to-br from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-white">
                          {checklist.trimester}° Trimestre
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(checklist)}
                            className="text-white hover:text-yellow-300 transition-colors p-2 rounded-full hover:bg-white/10"
                            title="Editar"
                            
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenConfirmModal(checklist)}
                            className="text-white hover:text-red-300 transition-colors p-2 rounded-full hover:bg-white/10"
                            title="Eliminar"
                          >
                            <FaTrashAlt className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                          Proyecto Formativo
                        </span>
                        <p className="text-sm text-gray-700 dark:text-white mt-1 font-medium">
                          {checklist.trainingProjectName}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                          Componente
                        </span>
                        <p className="text-sm text-gray-700 dark:text-white mt-1 font-medium">
                          {checklist.component}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                          Fichas Asociadas
                        </span>
                        <span className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-blue-800/20 dark:to-blue-600/20 text-gray-800 dark:text-blue-300 rounded-full text-xs font-bold border border-gray-300 dark:border-blue-500/30">
                          {getFormattedStudySheets(checklist.studySheets)}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                          Indicadores
                        </span>
                        <span className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-lime-100 to-lime-200 dark:from-shadowBlue/20 dark:to-darkBlue/20 text-lime-800 dark:text-gray-300 rounded-full text-xs font-bold border border-lime-300 dark:border-shadowBlue/30">
                          {checklist.items.length} indicadores
                        </span>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                          Estado
                        </span>
                        <div className="mt-2 flex items-center">
                          <button
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${checklist.state
                              ? 'bg-gradient-to-r from-lime-600 to-lime-500 dark:from-blue-600 dark:to-blue-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-lg ${checklist.state ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                          </button>
                          <span className={`ml-3 text-xs font-bold ${checklist.state
                            ? 'text-lime-600 dark:text-gray-300'
                            : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {checklist.state ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-lime-600 dark:text-gray-300 uppercase tracking-wide">
                          Competencia
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                          {checklist.remarks}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🔹 Modal Crear/Editar */}
      <CrearListaChequeo
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onCreate={handleSaveChecklist}
        isEditing={isEditing}
        checklist={selectedChecklist}
      />

      {/* 🔹 Modal Confirmar eliminación */}
      {confirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que deseas eliminar esta lista de chequeo?
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
