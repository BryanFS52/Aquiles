'use client'
import { useState, useEffect } from 'react'
import { Apprentice } from '@/components/features/Apprentices/aprendices'
import { toast } from 'react-toastify'
import PageTitle from '@components/UI/pageTitle'
import ApprenticeForm from './ApprenticeForm'
import ApprenticeList from './ApprenticeList'

const ApprenticesContent = () => {
  const [apprentices, setApprentices] = useState<Apprentice[]>([])

  useEffect(() => {
    const fetchApprentices = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/students')
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
    setApprentices(prev => [...prev, newApprentice])
  }

  return (
    <>
      <PageTitle>Gestión de Aprendices</PageTitle>

      <div className="grid gap-6 md:grid-cols-2">
        <ApprenticeForm onApprenticeCreated={handleApprenticeCreated} />
        <ApprenticeList apprentices={apprentices} />
      </div>
    </>
  )
}

export default ApprenticesContent