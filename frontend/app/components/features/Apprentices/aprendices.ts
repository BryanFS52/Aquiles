import { Student } from '@graphql/generated'

// Tipo para un aprendiz en la vista (simplificado)
export interface Apprentice {
  id?: string
  name?: string
  lastName?: string
  documentType?: string
  documentNumber?: string
  program?: string
  email?: string
  teamNumber?: string
}

// Tipo para crear un nuevo aprendiz
export interface NewApprentice {
  name: string
  lastName: string
  documentType: string
  documentNumber: string
  program: string
  email: string
  teamNumber: string
}

// Función helper para convertir Student (GraphQL) a Apprentice (Vista)
export const mapStudentToApprentice = (student: Student): Apprentice => {
  return {
    id: student.id ?? undefined,
    name: student.person?.name ?? '',
    lastName: student.person?.lastname ?? '',
    documentType: typeof student.person?.documentType === 'object'
      ? student.person?.documentType?.name ?? ''
      : student.person?.documentType ?? '',
    documentNumber: student.person?.document ?? '',
    program: student.studentStudySheets?.[0]?.studySheet?.offer?.name ?? '',
    email: student.person?.email ?? '',
    teamNumber: student.teamScrums?.[0]?.teamName ?? '',
  }
}
