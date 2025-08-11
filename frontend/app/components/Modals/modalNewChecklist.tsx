'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { addChecklist } from '@services/checkListService'

interface ChecklistItem {
  id?: string
  code?: string
  indicator: string
  active?: boolean
}

interface Checklist {
  id: string
  state: boolean
  remarks?: string
  trimester?: string
  component?: string
  items?: ChecklistItem[]
  [key: string]: any
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (checklistData: any) => Promise<void>
  editingData?: Checklist | null
  isEditing?: boolean
}

export default function CrearListaChequeo({ isOpen, onClose, onCreate, editingData = null, isEditing = false }: ModalProps) {
  const [trimestre, setTrimestre] = useState<string>('')
  const [componente, setComponente] = useState<string>('')
  const [observaciones, setObservaciones] = useState<string>('')
  const [items, setItems] = useState<{ indicador: string }[]>([{ indicador: '' }])
  const [isModalOpen, setIsOpen] = useState<boolean>(false)

  // Efecto para cargar datos de edición
  useEffect(() => {
    if (isOpen && isEditing && editingData) {
      console.log("Modal received editingData:", editingData) // Debug log
      console.log("Modal editingData type:", typeof editingData) // Debug log
      
      // Cargar datos existentes para edición
      setTrimestre(editingData.trimester?.toString() || '')
      setComponente(editingData.component || '')
      setObservaciones(editingData.remarks || '')
      
      console.log("Loading items from editingData:", editingData.items) // Debug log
      
      // Cargar indicadores existentes si están disponibles
      if (editingData.items && editingData.items.length > 0) {
        const loadedItems = editingData.items.map(item => ({
          indicador: item.indicator || ''
        }))
        console.log("Mapped items for modal:", loadedItems) // Debug log
        setItems(loadedItems)
      } else {
        console.log("No items found, setting default item") // Debug log
        setItems([{ indicador: '' }])
      }
    } else {
      // Limpiar formulario para nueva creación
      setTrimestre('')
      setComponente('')
      setObservaciones('')
      setItems([{ indicador: '' }])
    }
  }, [isEditing, editingData, isOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!trimestre || !componente || items.some(i => !i.indicador)) {
      toast.error('Por favor, complete todos los campos.')
      return
    }

    try {
      const newChecklist = {
        state: false,
        remarks: observaciones || "Sin observaciones",
        trimester: trimestre,
        instructorSignature: "No signature",
        evaluationCriteria: false,
        studySheets: null,
        evaluations: null,
        associatedJuries: null,
        component: componente,
        items: items.map((item, index) => ({
          code: `IND-${index + 1}`,
          indicator: item.indicador,
          active: true
        }))
      }

      console.log('Modal submitting checklist data:', newChecklist); // Debug log
      console.log('Is editing mode:', isEditing); // Debug log

      await onCreate(newChecklist)
    } catch (error) {
      console.error('Error in modal:', error)
      toast.error(isEditing ? 'Error al actualizar la lista de chequeo' : 'Error al crear la lista de chequeo')
    }
  }

  const handleIndicadorChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index].indicador = value
    setItems(newItems)
  }

  const handleAddIndicador = () => {
    setItems([...items, { indicador: '' }])
  }

  const handleRemoveIndicador = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const resetForm = () => {
    setTrimestre('')
    setComponente('')
    setObservaciones('')
    setItems([{ indicador: '' }])
  }

  if (isOpen !== undefined) {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditing ? 'Editar Lista de Chequeo' : 'Crear Lista de Chequeo'}
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              💡 <strong>Nota:</strong> Se creará automáticamente una evaluación vinculada a esta lista. El instructor podrá completarla desde su vista.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="trimestre" className="block text-sm font-medium text-gray-700">Trimestre</label>
                <select
                  id="trimestre"
                  value={trimestre}
                  onChange={(e) => setTrimestre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d]"
                >
                  <option value="">Selecciona un trimestre</option>
                  {[...Array(7)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{`${i + 1}° Trimestre`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="componente" className="block text-sm font-medium text-gray-700">Componente</label>
                <select
                  id="componente"
                  value={componente}
                  onChange={(e) => setComponente(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d]"
                >
                  <option value="">Selecciona un componente</option>
                  <option value="academico">Académico</option>
                  <option value="actitudinal">Actitudinal</option>
                </select>
              </div>
              <div>
                <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">Observaciones</label>
                <textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Escribe las observaciones para esta lista de chequeo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d] h-24 resize-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex space-x-4 items-start">
                  <textarea
                    value={item.indicador}
                    onChange={(e) => handleIndicadorChange(index, e.target.value)}
                    placeholder={`Indicador ${index + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00324d] h-24 resize-none"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIndicador(index)}
                      className="text-red-500 mt-2 flex-shrink-0"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddIndicador}
                className="text-[#00324d] hover:text-[#40b003] transition-colors"
              >
                Agregar Indicador
              </button>
            </div>
            <div className="space-y-2">
              <button
                type="submit"
                className="w-full bg-[#00324d] text-white py-2 rounded hover:bg-[#40b003] transition-colors"
              >
                {isEditing ? 'Actualizar Lista de Chequeo' : 'Crear Lista de Chequeo'}
              </button>
            </div>

          </form>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 underline mt-4"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  // Versión inicial: botón para abrir modal
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#00324d] text-white px-4 py-2 rounded hover:bg-[#40b003] transition-colors"
      >
        Crear Lista de Chequeo
      </button>
    </div>
  )
}
