'use client'
import { useState, useEffect } from 'react'
import { Apprentice } from '@/components/features/Apprentices/aprendices'
import { toast } from 'react-toastify'
import PageTitle from '@components/UI/pageTitle'
import ApprenticeForm from './ApprenticeForm'
import ApprenticeList from './ApprenticeList'

// ===== Toggle rápido =====
const USE_SERVICE = false // Modo local (sin servicio)
// const USE_SERVICE = true // Modo servicio (backend)
const LOCAL_STORAGE_KEY = 'apprentices_local_data'

const ApprenticesContent = () => {
  const [apprentices, setApprentices] = useState<Apprentice[]>([])

  useEffect(() => {
    const fetchApprentices = async () => {
      // ===== MODO LOCAL =====
      if (!USE_SERVICE) {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (localData) {
          setApprentices(JSON.parse(localData))
        } else {
          setApprentices([])
        }
        return
      }

      // ===== MODO SERVICIO =====
      try {
        const response = await fetch('http://localhost:8080/api/students')
        const data = await response.json()
        setApprentices(data)
      } catch (error) {
        console.error('Error al obtener los aprendices:', error)
        toast.error("No se pudieron cargar los aprendices. Por favor, intente de nuevo más tarde.")
      }
    }

    fetchApprentices()
  }, [])

  const handleApprenticeCreated = (newApprentice: Apprentice) => {
    setApprentices(prev => {
      const updated = [...prev, newApprentice]
      if (!USE_SERVICE) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      }
      return updated
    })
  }

  return (
    <>
      <PageTitle>Gestión de aprendices</PageTitle>

      <div className="grid gap-6 md:grid-cols-2">
        <ApprenticeForm onApprenticeCreated={handleApprenticeCreated} />
        <ApprenticeList apprentices={apprentices} />
      </div>
    </>
  )
}

export default ApprenticesContent