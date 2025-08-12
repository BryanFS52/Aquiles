'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { addChecklist } from '@services/checkListService'

export default function CrearListaChequeo({ isOpen, onClose, onCreate, editingData = null, isEditing = false }) {
  const [trimestre, setTrimestre] = useState('')
  const [componente, setComponente] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [items, setItems] = useState([{ indicador: '' }])
  const [isModalOpen, setIsOpen] = useState(false)

  // Efecto para cargar datos de edición
  useEffect(() => {
    console.log("Modal useEffect triggered:", { isOpen, isEditing, editingData }); // Debug log
    
    if (isOpen && isEditing && editingData) {
      console.log("Modal received editingData:", editingData) // Debug log
      console.log("Modal editingData type:", typeof editingData) // Debug log
      
      // Cargar datos existentes para edición (SIEMPRE, incluso si ya hay datos)
      console.log("Loading/reloading data from editingData..."); // Debug log
      
      setTrimestre(editingData.trimester?.toString() || '')
      setComponente(editingData.component || '')
      setObservaciones(editingData.remarks || '')
      
      console.log("Loading items from editingData:", editingData.items) // Debug log
      
      // Cargar indicadores existentes si están disponibles
      if (editingData.items && editingData.items.length > 0) {
        const loadedItems = editingData.items.map(item => ({
          id: item.id, // ← Preservar el ID del item existente
          indicador: item.indicator || ''
        }))
        console.log("Mapped items for modal:", loadedItems) // Debug log
        console.log("🔍 DETAILED INDICATORS BEING LOADED:"); // Debug log
        loadedItems.forEach((item, index) => {
          console.log(`  Indicator ${index + 1}: id=${item.id}, indicator="${item.indicador}"`); // Debug log
        });
        setItems(loadedItems)
        console.log("✅ Items loaded into modal form"); // Debug log
      } else {
        console.log("No items found, setting default item") // Debug log
        setItems([{ indicador: '' }])
      }
    } else if (isOpen && !isEditing) {
      // Solo limpiar formulario para nueva creación cuando el modal se abre por primera vez
      console.log("Clearing form for new creation") // Debug log
      setTrimestre('')
      setComponente('')
      setObservaciones('')
      setItems([{ indicador: '' }])
    }
  }, [isEditing, editingData, isOpen]) // Reaccionar a cambios en editingData

  const handleSubmit = async (e) => {
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
        component: componente,
        associatedJuries: [],
        items: items.map((item, index) => ({
          ...(item.id && { id: item.id }), // ← Incluir ID si existe (modo edición)
          code: `IND-${index + 1}`,
          indicator: item.indicador,
          active: true
        }))
      }

      console.log('Modal submitting checklist data:', newChecklist); // Debug log
      console.log('Is editing mode:', isEditing); // Debug log
      console.log('🚀 DETAILED INDICATORS BEING SENT:'); // Debug log
      newChecklist.items.forEach((item, index) => {
        console.log(`  Item ${index + 1}: id=${item.id || 'NEW'}, code="${item.code}", indicator="${item.indicator}", active=${item.active}`); // Debug log
      });

      if (onCreate) {
        // Usar la función onCreate que viene del componente padre (que maneja la creación automática de evaluación)
        await onCreate(newChecklist)
        
        if (isEditing) {
          // En modo edición, NO limpiar el formulario - mantener los datos
          console.log('Update completed successfully, keeping form data...'); // Debug log
          
          // Cerrar modal después de actualización
          if (onClose) {
            console.log('Closing modal after successful update...'); // Debug log
            onClose()
          }
        } else {
          // En modo creación, sí limpiar el formulario
          console.log('Creation completed successfully, resetting form...'); // Debug log
          resetForm()
          
          if (onClose) {
            console.log('Closing modal after successful creation...'); // Debug log
            onClose()
          }
        }
      } else {
        // Fallback: crear solo el checklist sin evaluación automática
        await addChecklist(newChecklist)
        toast.success('Lista de chequeo creada exitosamente.')
        toast.warning('Nota: No se pudo crear la evaluación automática. Contacte al coordinador.')
        
        resetForm()
        if (onClose) onClose()
      }
    } catch (error) {
      console.error('Error in modal:', error)
      toast.error(isEditing ? 'Error al actualizar la lista de chequeo' : 'Error al crear la lista de chequeo')
    }
  }

  const handleIndicadorChange = (index, value) => {
    const newItems = [...items]
    newItems[index].indicador = value
    setItems(newItems)
  }

  const handleAddIndicador = () => {
    setItems([...items, { indicador: '' }]) // ← Nuevos items no tienen ID
  }

  const handleRemoveIndicador = (index) => {
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
              💡 <strong>Nota:</strong> {isEditing ? 
                'Los cambios se guardarán automáticamente. Puede cerrar este modal cuando termine.' : 
                'Se creará automáticamente una evaluación vinculada a esta lista. El instructor podrá completarla desde su vista.'
              }
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
            onClick={() => {
              console.log('Cancel button clicked, resetting form...'); // Debug log
              resetForm()
              onClose()
            }}
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
