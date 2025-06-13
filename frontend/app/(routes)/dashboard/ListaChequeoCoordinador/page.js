'use client'

import { useState } from "react"
import { FaTrashAlt } from "react-icons/fa"
import { toast } from "react-toastify"
import ModalNewChecklist from "@components/Modals/modalNewChecklist"
import PageTitle from "@components/UI/pageTitle"
import { addChecklist } from "@services/checkListService"

export default function CoordinadorChecklistView() {
  const [modalOpen, setModalOpen] = useState(false)
  const [checklists, setChecklists] = useState([])
  const [selectedTrimestre, setSelectedTrimestre] = useState("1")
  const [/*confirmModalOpen*/, setConfirmModalOpen] = useState(false)
  const [/*checklistToDelete*/, setChecklistToDelete] = useState(null)

  const handleCreateChecklist = async (checklistData) => {
    try {
      const response = await addChecklist(checklistData)
      if (response.code === 200) {
        toast.success("Lista de chequeo creada exitosamente")
        setChecklists((prev) => [...prev, response.data])
        setModalOpen(false)
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error("Error creating checklist:", error)
      toast.error("Error al crear la lista de chequeo")
    }
  }

  const handleCloseModal = () => setModalOpen(false)

  const handleOpenConfirmModal = (checklistId) => {
    setChecklistToDelete(checklistId)
    setConfirmModalOpen(true)
  }

  return (
    <>
      <PageTitle>Listas de Chequeo Trimestrales</PageTitle>

      <div className="flex items-center justify-between mb-6">
        <div>
          <label htmlFor="trimestre" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
            Trimestre
          </label>
          <select
            id="trimestre"
            value={selectedTrimestre}
            onChange={(e) => setSelectedTrimestre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d]"
          >
            <option value="" disabled hidden>
              Selecciona un trimestre
            </option>
            <option value="1">Primer Trimestre</option>
            <option value="2">Segundo Trimestre</option>
            <option value="3">Tercer Trimestre</option>
            <option value="4">Cuarto Trimestre</option>
          </select>
        </div>

        <ModalNewChecklist isOpen={modalOpen} onClose={handleCloseModal} onCreate={handleCreateChecklist} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {checklists
          .filter((checklist) => checklist.trimester === selectedTrimestre)
          .map((checklist) => (
            <div key={checklist.id} className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#40b003] font-bold text-xl">{checklist.name}</span>
                  <button onClick={() => handleOpenConfirmModal(checklist.id)} className="text-xl text-[#00324d]">
                    <FaTrashAlt />
                  </button>
                </div>
                <p className="text-gray-600">ID: {checklist.id}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}