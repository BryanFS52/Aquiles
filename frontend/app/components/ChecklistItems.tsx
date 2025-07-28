'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_ITEM_STATUS } from '@graphql/checklistGraphSimple'
import { toast } from 'react-toastify'

interface Item {
  id: string
  code: string
  indicator: string
  active: boolean
}

interface ChecklistItemsProps {
  items: Item[]
  onItemUpdate?: () => void
}

export default function ChecklistItems({ items, onItemUpdate }: ChecklistItemsProps) {
  const [updateItemStatus] = useMutation(UPDATE_ITEM_STATUS)
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())

  const handleToggleItem = async (itemId: string, currentStatus: boolean) => {
    setLoadingItems(prev => new Set(prev).add(itemId))
    
    try {
      const { data } = await updateItemStatus({
        variables: {
          itemId: parseInt(itemId),
          active: !currentStatus
        }
      })

      if (data?.updateItemStatus?.code === "200") {
        toast.success(`Indicador ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`)
        if (onItemUpdate) {
          onItemUpdate()
        }
      } else {
        throw new Error(data?.updateItemStatus?.message || 'Error al actualizar el indicador')
      }
    } catch (error) {
      console.error('Error updating item status:', error)
      toast.error('Error al actualizar el estado del indicador')
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-500 text-center">No hay indicadores disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Indicadores</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-4 border rounded-lg transition-all duration-200 ${
              item.active 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {item.code}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    item.active 
                      ? 'text-green-700 bg-green-200' 
                      : 'text-gray-700 bg-gray-200'
                  }`}>
                    {item.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className={`text-sm ${
                  item.active ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {item.indicator}
                </p>
              </div>
              <div className="ml-4">
                <button
                  onClick={() => handleToggleItem(item.id, item.active)}
                  disabled={loadingItems.has(item.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    item.active
                      ? 'bg-green-600 focus:ring-green-500'
                      : 'bg-gray-200 focus:ring-gray-500'
                  } ${loadingItems.has(item.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      item.active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}