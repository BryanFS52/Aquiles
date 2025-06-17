import { ArrowLeft, Users } from "lucide-react"

interface AttendanceHeaderProps {
    studySheet: any
}

export function AttendanceHeader({ studySheet }: AttendanceHeaderProps) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-4">
                        <button className="lg:hidden p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="bg-lightGreen dark:bg-blue-600 p-2 rounded-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Control de Asistencia</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {studySheet?.number || studySheet?.program || "Ficha de Estudio"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
