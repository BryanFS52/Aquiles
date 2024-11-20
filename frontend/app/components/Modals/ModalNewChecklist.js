'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { createChecklist } from '../../services/checkListService'

export default function CrearListaChequeo() {
  const [isOpen, setIsOpen] = useState(false)
  const [trimestre, setTrimestre] = useState('')
  const [componente, setComponente] = useState('')
  const [items, setItems] = useState([{ indicador: '' }])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!trimestre || !componente || items.some(i => !i.indicador)) {
      toast.error('Por favor, complete todos los campos.')
      return
    }

    try {
      const newChecklist = {
        trimester: trimestre,
        component: componente,
        items: items.map(i => i.indicador)
      }

      await createChecklist(newChecklist)
      toast.success('Lista de chequeo creada exitosamente.')
      setIsOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error al crear la lista de chequeo:', error)
      toast.error('Error al crear la lista de chequeo. Por favor, intente de nuevo.')
    }
  }

  const handleIndicadorChange = (index, value) => {
    const newItems = [...items]
    newItems[index].indicador = value
    setItems(newItems)
  }

  const handleAddIndicador = () => {
    setItems([...items, { indicador: '' }])
  }

  const handleRemoveIndicador = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const resetForm = () => {
    setTrimestre('')
    setComponente('')
    setItems([{ indicador: '' }])
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#00324d] text-white px-4 py-2 rounded hover:bg-[#40b003] transition-colors"
      >
        Crear Lista de Chequeo
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-800">Crear Lista de Chequeo</h2>
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
                    <option value="1">Primer Trimestre</option>
                    <option value="2">Segundo Trimestre</option>
                    <option value="3">Tercer Trimestre</option>
                    <option value="4">Cuarto Trimestre</option>
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
                    <option value="administrativo">Administrativo</option>
                    <option value="financiero">Financiero</option>
                  </select>
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
              <button
                type="submit"
                className="w-full bg-[#00324d] text-white py-2 rounded hover:bg-[#40b003] transition-colors"
              >
                Crear Lista
              </button>
            </form>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-500 underline mt-4"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}