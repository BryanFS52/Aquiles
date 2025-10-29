'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RootState, AppDispatch } from '@redux/store'
import { 
  closeModal, 
  updateFormField, 
  submitNovelty, 
  processFile,
  clearError, 
  clearSubmitSuccess 
} from '@slice/themis/noveltySlice'

interface NoveltyModalProps {
  isOpen: boolean
  onClose: () => void
}

const NoveltyModal: React.FC<
  NoveltyModalProps
> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const dispatch = useDispatch<AppDispatch>()

  const { 
    loading, 
    error, 
    submitSuccess, 
    lastResponse, 
    formData, 
    modalOpen,
    selectedStudentAbsences 
  } = useSelector((state: RootState) => state.novelty)
  
  const { 
    filteredData: noveltyTypes, 
    loading: noveltyTypesLoading 
  } = useSelector((state: RootState) => state.noveltyType)

  const canReport = selectedStudentAbsences?.canReportDesertion ?? false
  const absenceCount = selectedStudentAbsences?.absenceCount ?? 0
  const studentName = selectedStudentAbsences?.studentName || 'Estudiante desconocido'
  const studentDocument = selectedStudentAbsences?.studentDocument || 'N/A'

  // useEffect
  useEffect(() => {
    if (!isOpen && modalOpen) {
      dispatch(closeModal())
    }
  }, [isOpen, modalOpen, dispatch])
  
  useEffect(() => {
    if (!formData.noveltyFiles) {
      setSelectedFile(null)
    }
  }, [formData.noveltyFiles])
  
  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'Error al enviar novedad'
      toast.error(errorMessage)
      dispatch(clearError())
    }
  }, [error, dispatch])

  useEffect(() => {
    if (submitSuccess && lastResponse) {
      toast.success(`Novedad enviada exitosamente. Código: ${lastResponse.code}`)
      dispatch(closeModal())
      dispatch(clearSubmitSuccess())
      onClose()
    }
  }, [submitSuccess, lastResponse, dispatch, onClose])

  // Handlers
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setSelectedFile(file)
        await dispatch(processFile(file)).unwrap()
      } catch (error) {
        toast.error('Error al procesar el archivo')
        console.error('Error processing file:', error)
        setSelectedFile(null)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    dispatch(updateFormField({ field: name as any, value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(submitNovelty()).unwrap()
    } catch (error) {
      console.error('Error submitting novelty:', error)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    dispatch(closeModal())
    onClose()
  }

  if (!isOpen || !modalOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Reportar Deserción de Estudiante</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* Información del estudiante */}
        <div className={`border rounded-lg p-4 mb-4 ${canReport ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex flex-col">
              <span className={`font-medium ${canReport ? 'text-green-600' : 'text-red-600'}`}>Nombre Completo:</span>
              <span className={`text-lg font-semibold ${canReport ? 'text-green-800' : 'text-red-800'}`}>{studentName}</span>
            </div>
            <div className="flex flex-col">
              <span className={`font-medium ${canReport ? 'text-green-600' : 'text-red-600'}`}>Documento:</span>
              <span className={`${canReport ? 'text-green-800' : 'text-red-800'}`}>{studentDocument}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Observación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Justificación *
            </label>
            <textarea
              name="justification"
              value={formData.justification}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Ingrese la justificación"
              required
              disabled={loading || !canReport}
            />
          </div>

          {/* Tipo de novedad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Novedad *
            </label>
            <select
              name="noveltyType"
              value={formData.noveltyType.id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading || noveltyTypesLoading || !canReport}
              title="Seleccione el tipo de novedad"
            >
              <option value="">
                {noveltyTypesLoading 
                  ? "Cargando tipos de novedad..." 
                  : "Seleccione un tipo de novedad"
                }
              </option>
              {noveltyTypes.map((noveltyType) => (
                <option key={noveltyType.id} value={noveltyType.id}>
                  {noveltyType.nameNovelty}
                </option>
              ))}
            </select>
            {noveltyTypes.length === 0 && !noveltyTypesLoading && (
              <p className="text-sm text-orange-600 mt-1">
                No se encontraron tipos de novedad relacionados con "Deserción"
              </p>
            )}
          </div>

          {/* Archivos de novedad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Archivos de Evidencia
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              disabled={loading || !canReport}
              title="Seleccione un archivo de evidencia"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                canReport 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={loading || !canReport}
            >
              {loading ? 'Enviando...' : canReport ? 'Reportar Deserción' : 'Insuficientes Ausencias'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoveltyModal;