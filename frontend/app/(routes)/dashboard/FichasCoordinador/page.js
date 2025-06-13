'use client'

import { useRouter } from 'next/navigation'

// Card reutilizable
const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-500/40 shadow-xl rounded-xl p-6 w-full md:w-[400px] lg:w-[450px] flex flex-col justify-between ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children }) => (
  <div className="mb-4 border-b pb-2 border-gray-200 dark:border-gray-600">
    {children}
  </div>
)

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
    {children}
  </h2>
)

const CardContent = ({ children }) => (
  <div className="text-gray-700 dark:text-gray-300">
    {children}
  </div>
)

const Button = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 bg-lightGreen text-white rounded-lg dark:bg-darkBlue w-full ${className}`}
  >
    {children}
  </button>
)

const FichasCoordinator = () => {
  const router = useRouter()

  const handleInstructorAsignacion = () => {
    router.push('/InstructorTechnicalAssign')
  }

  const handleMultipleAsignacion = () => {
    router.push('/InstructorAssignMultipleSheets')
  }

  return (
    <>
      <h1 className="text-black dark:text-white drop-shadow-lg text-3xl lg:text-4xl pb-3 border-b-2 border-gray-300 dark:border-gray-600 w-full sm:w-3/4 lg:w-1/2 font-inter font-semibold transition-colors duration-300 mb-8">
        Asignación de Instructores
      </h1>

      <div className="flex flex-col md:flex-row flex-wrap gap-y-12 gap-x-8 items-stretch">


        <Card>
          <div className="flex flex-col flex-1 justify-between h-full">
            <div>
              <CardHeader>
                <CardTitle>Asignación de Instructor Técnico</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Asigne un instructor técnico a una ficha específica.</p>
              </CardContent>
            </div>
            <Button onClick={handleInstructorAsignacion} className="mt-6">Asignar</Button>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col flex-1 justify-between h-full">
            <div>
              <CardHeader>
                <CardTitle>Asignación de Instructor a Múltiples Fichas</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Asigne un instructor a varias fichas simultáneamente.</p>
              </CardContent>
            </div>
            <Button onClick={handleMultipleAsignacion} className="mt-6">Asignar</Button>
          </div>
        </Card>
      </div>
    </>
  )
}

export default FichasCoordinator
