import { XCircle, Users } from "lucide-react"

export function LoadingState() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lightGreen dark:border-darkBlue"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando estudiantes...</p>
            </div>
        </div>
    )
}

export function ErrorState({ error }: { error: string }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Error al cargar datos</h2>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
        </div>
    )
}

export function EmptyStudentsState() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No hay estudiantes</h2>
                <p className="text-gray-600 dark:text-gray-400">No se encontraron estudiantes en esta ficha de estudio.</p>
            </div>
        </div>
    )
}
