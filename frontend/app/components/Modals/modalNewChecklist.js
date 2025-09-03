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
  const [deletedItemIds, setDeletedItemIds] = useState([]) // ← Nuevo estado para rastrear items eliminados

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
      setDeletedItemIds([]) // ← Limpiar lista de eliminados al cargar datos de edición
      
      // ← Log específico para trimester y component
      console.log('🔍 MODAL: Setting form values from editingData:');
      console.log('  trimester from editingData:', editingData.trimester, '-> setting to:', editingData.trimester?.toString() || '');
      console.log('  component from editingData:', editingData.component, '-> setting to:', editingData.component || '');
      console.log('  remarks from editingData:', editingData.remarks, '-> setting to:', editingData.remarks || '');
      
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
      setDeletedItemIds([]) // ← Limpiar items eliminados
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
        associatedJuries: null, // ← Cambiar a null en lugar de array vacío
        items: items.map((item, index) => ({
          ...(item.id && { id: parseInt(item.id) }), // ← Convertir ID a número
          code: `IND-${index + 1}`,
          indicator: item.indicador,
          active: true
        })),
        // ← Agregar items eliminados para el backend (ya convertidos a números)
        ...(isEditing && deletedItemIds.length > 0 && { deletedItemIds })
      }

      console.log('Modal submitting checklist data:', newChecklist); // Debug log
      console.log('Is editing mode:', isEditing); // Debug log
      console.log('� MODAL: Current form state at submission:');
      console.log('  trimestre state:', trimestre, '(type:', typeof trimestre, ')');
      console.log('  componente state:', componente, '(type:', typeof componente, ')');
      console.log('  observaciones state:', observaciones, '(type:', typeof observaciones, ')');
      console.log('�🚀 DETAILED INDICATORS BEING SENT:'); // Debug log
      newChecklist.items.forEach((item, index) => {
        console.log(`  Item ${index + 1}: id=${item.id || 'NEW'}, code="${item.code}", indicator="${item.indicator}", active=${item.active}`); // Debug log
      });
      
      // ← Log de items eliminados
      if (isEditing && deletedItemIds.length > 0) {
        console.log('🗑️ DELETED ITEM IDs:', deletedItemIds); // Debug log
      }

      if (onCreate) {
        // Usar la función onCreate que viene del componente padre (que maneja la creación automática de evaluación)
        await onCreate(newChecklist)
        
        if (isEditing) {
          // En modo edición, NO limpiar el formulario - mantener los datos
          console.log('Update completed successfully, keeping form data...'); // Debug log
          
          // Limpiar lista de eliminados después de actualización exitosa
          setDeletedItemIds([])
          
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
    const itemToRemove = items[index]
    
    // Si el item tiene ID (es un item existente), agregarlo a la lista de eliminados
    if (itemToRemove.id && isEditing) {
      console.log(`🗑️ Marking item for deletion: ${itemToRemove.id}`); // Debug log
      // Convertir el ID a número para asegurar compatibilidad con el backend
      const numericId = parseInt(itemToRemove.id);
      if (!isNaN(numericId)) {
        setDeletedItemIds(prev => [...prev, numericId])
      } else {
        console.error('Invalid item ID for deletion:', itemToRemove.id);
      }
    }
    
    // Eliminar el item de la lista actual
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    
    console.log(`Item removed from index ${index}. Remaining items:`, newItems.length); // Debug log
  }

  const resetForm = () => {
    setTrimestre('')
    setComponente('')
    setObservaciones('')
    setItems([{ indicador: '' }])
    setDeletedItemIds([]) // ← Limpiar items eliminados
  }

  if (isOpen !== undefined) {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-3xl space-y-8 max-h-[90vh] overflow-y-auto border-2 border-lime-500/30 dark:border-shadowBlue/50">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue bg-clip-text text-transparent">
              {isEditing ? 'Editar Lista de Chequeo' : 'Crear Lista de Chequeo'}
            </h2>
          </div>
          
          <div className="bg-gradient-to-r from-lime-50 to-lime-100 dark:from-shadowBlue/10 dark:to-darkBlue/10 border-2 border-lime-200 dark:border-shadowBlue/30 rounded-xl p-4">
            <p className="text-lime-800 dark:text-lime-300 text-sm font-medium">
              💡 <strong>Nota:</strong> {isEditing ? 
                'Los cambios se guardarán automáticamente. Puede cerrar este modal cuando termine.' : 
                'Se creará automáticamente una evaluación vinculada a esta lista. El instructor podrá completarla desde su vista.'
              }
            </p>
            {/* ← Mostrar alerta si hay items para eliminar */}
            {isEditing && deletedItemIds.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-300 text-sm font-medium">
                  🗑️ <strong>Atención:</strong> Se eliminarán {deletedItemIds.length} indicador(es) existente(s) al guardar.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="trimestre" className="block text-sm font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wide">
                  Trimestre
                </label>
                <select
                  id="trimestre"
                  value={trimestre}
                  onChange={(e) => setTrimestre(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  <option value="">Selecciona un trimestre</option>
                  {[...Array(7)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{`${i + 1}° Trimestre`}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="componente" className="block text-sm font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wide">
                  Componente
                </label>
                <select
                  id="componente"
                  value={componente}
                  onChange={(e) => setComponente(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  <option value="">Selecciona un componente</option>
                  <option value="academico">Académico</option>
                  <option value="actitudinal">Actitudinal</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="observaciones" className="block text-sm font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wide">
                Competencia
              </label>
              <textarea
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Describe la competencia asociada a esta lista de chequeo..."
                className="w-full px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 text-darkBlue dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 h-28 resize-none font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wide">
                  Indicadores de Evaluación
                </h3>
                <button
                  type="button"
                  onClick={handleAddIndicador}
                  className="bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white px-4 py-2 rounded-xl hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm"
                >
                  + Agregar Indicador
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="bg-gradient-to-r from-lime-50/50 to-lime-100/50 dark:from-shadowBlue/5 dark:to-darkBlue/5 p-4 rounded-xl border border-lime-200/50 dark:border-shadowBlue/20">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <textarea
                        value={item.indicador}
                        onChange={(e) => handleIndicadorChange(index, e.target.value)}
                        placeholder={`Describe el indicador ${index + 1} de evaluación...`}
                        className="flex-1 px-4 py-3 border-2 border-lime-500/30 dark:border-shadowBlue/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-lime-600/30 dark:focus:ring-shadowBlue/30 focus:border-lime-600 dark:focus:border-shadowBlue bg-white dark:bg-gray-800 text-darkBlue dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 h-24 resize-none font-medium placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      />
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            console.log(`🗑️ Attempting to remove item at index ${index}:`, item); // Debug log
                            handleRemoveIndicador(index)
                          }}
                          className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold"
                          title="Eliminar indicador"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-lime-200 dark:border-shadowBlue/30">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-lime-600 to-lime-500 dark:from-shadowBlue dark:to-darkBlue text-white py-4 rounded-xl hover:from-lime-500 hover:to-lime-600 dark:hover:from-darkBlue dark:hover:to-shadowBlue transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-lg"
              >
                {isEditing ? '✓ Actualizar Lista de Chequeo' : '+ Crear Lista de Chequeo'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  console.log('Cancel button clicked, resetting form...'); // Debug log
                  resetForm()
                  onClose()
                }}
                className="sm:w-auto px-8 py-4 text-gray-600 dark:text-gray-400 hover:text-darkBlue dark:hover:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-lime-500 dark:hover:border-shadowBlue rounded-xl transition-all duration-300 font-semibold bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </form>
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
