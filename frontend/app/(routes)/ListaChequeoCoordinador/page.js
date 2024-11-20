'use client'

import React, { useState, useEffect } from "react"
import { Header } from "../../components/header"
import { Sidebarcoordinador } from "../../components/SidebarCoordinador"
import { MdAdd } from "react-icons/md"
import { FaTrashAlt } from "react-icons/fa"
import { listChecklists, createChecklist, deleteChecklist } from "../../services/checkListService"
import { ToastContainer, toast } from "react-toastify"
import ModalNewChecklist from "../../components/Modals/ModalNewChecklist"
import "react-toastify/dist/ReactToastify.css"

export default function CoordinadorChecklistView() {
  const [modalOpen, setModalOpen] = useState(false)
  const [checklists, setChecklists] = useState([])
  const [selectedTrimestre, setSelectedTrimestre] = useState("Q1")
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [checklistToDelete, setChecklistToDelete] = useState(null)

  useEffect(() => {
    fetchChecklists()
  }, [])

  const fetchChecklists = () => {
    listChecklists()
      .then((data) => setChecklists(data))
      .catch((error) => {
        console.error("Error fetching checklists:", error)
        toast.error("Error al obtener las listas de chequeo.")
      })
  }

  const handleCreateChecklist = (checklist) => {
    if (!checklist.name) {
      toast.error('Por favor completa correctamente todos los campos obligatorios.')
      return
    }
    createChecklist(checklist)
      .then(() => {
        fetchChecklists()
        toast.success('¡Nueva lista de chequeo creada con éxito!')
        handleCloseModal()
      })
      .catch(error => {
        console.error('Error creating checklist:', error)
        toast.error('Error al crear la lista de chequeo.')
      })
  }

  const handleDeleteChecklist = (checklistId) => {
    deleteChecklist(checklistId)
      .then(() => {
        setChecklists(checklists.filter((checklist) => checklist.id !== checklistId))
        toast.success("Lista de chequeo eliminada exitosamente.")
      })
      .catch((error) => {
        console.error("Error deleting checklist:", error)
        toast.error("Error al eliminar la lista de chequeo.")
      })
  }

  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const handleOpenConfirmModal = (checklistId) => {
    setChecklistToDelete(checklistId)
    setConfirmModalOpen(true)
  }

  const handleConfirmDelete = () => {
    handleDeleteChecklist(checklistToDelete)
    setConfirmModalOpen(false)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebarcoordinador />
      <div className="xl:col-span-5">
        <Header />
        <div className="container mx-auto p-6 space-y-6">
          <h1 className="text-3xl font-bold text-[#00324d] hover:text-[#01b001] transition-colors duration-300">
            Listas de Chequeo Trimestrales
          </h1>

          <div className="flex items-center justify-between mb-6">
         
            <div>
                  <label htmlFor="trimestre" className="block text-sm font-medium text-gray-700">Trimestre</label>
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
                
            <button >
                 <ModalNewChecklist isOpen={modalOpen} onClose={handleCloseModal} onCreate={handleCreateChecklist} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {checklists
              .filter((checklist) => checklist.trimester === selectedTrimester)
              .map((checklist) => (
                <div key={checklist.id} className="border border-gray-300 rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#40b003] font-bold text-xl">{checklist.name}</span>
                      <button 
                        onClick={() => handleOpenConfirmModal(checklist.id)}
                        className="text-xl text-[#00324d]"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                    <p className="text-gray-600">ID: {checklist.id}</p>
                  </div>
                </div>
              ))}
          </div>       
          <ToastContainer />
        </div>
      </div>
    </div>
  )
}
