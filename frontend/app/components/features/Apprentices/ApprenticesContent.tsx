'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@redux/store'
import { fetchStudentList } from '@slice/olympo/studentSlice'
import { mapStudentToApprentice } from '@/components/features/Apprentices/aprendices'
import { toast } from 'react-toastify'
import PageTitle from '@components/UI/pageTitle'
import ApprenticeForm from './ApprenticeForm'
import ApprenticeList from './ApprenticeList'

const ApprenticesContent = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { data: students, } = useSelector((state: RootState) => state.student)

  useEffect(() => {
    dispatch(fetchStudentList({}))
  }, [dispatch])
  
  const apprentices = students.map(mapStudentToApprentice)

  return (
    <>
      <PageTitle>Gestión de Aprendices</PageTitle>

      <div className="grid gap-6 md:grid-cols-2">
        <ApprenticeForm />
        <ApprenticeList apprentices={apprentices} />
      </div>
    </>
  )
}

export default ApprenticesContent