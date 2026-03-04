import { StudySheet } from "@/graphql/generated";
import { BsPersonCircle } from "react-icons/bs";

interface AttendanceStatsProps {
    studySheetData?: StudySheet;
    onNavigate: (competenceId: string) => void;
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ studySheetData, onNavigate }) => {
    const students = (studySheetData?.studentStudySheets as any[])?.filter(
        (s: any) => {
            // Aceptar diferentes estados activos
            const stateName = s?.studentStudySheetState?.name;
            return stateName === "Activo" || stateName === "En formacion" || s?.state === "Activo";
        }
    ) || [];

    const activeStudents = students.length;
    
    const withdrawnStudents = (studySheetData?.studentStudySheets as any[])?.filter(
        (s: any) => s?.state !== "Activo"
    )?.length || 0;

    return (
        <div className="flex-1">
                    <div className="min-h-[4rem] sm:h-16 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-3 sm:p-4">
                        {/* Mobile: Stack vertically */}
                        <div className="flex flex-col space-y-3 sm:hidden">
                            {/* Numero de estudiantes */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <BsPersonCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Número de Estudiantes</span>
                                </div>
                                <span className="text-base font-semibold text-black dark:text-white">
                                    {studySheetData?.numberStudents || 0}
                                </span>
                            </div>

                            {/* Aprendices Activos */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <BsPersonCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Aprendices Activos</span>
                                </div>
                                <span className="text-base font-semibold text-black dark:text-white">
                                    {activeStudents || 0}
                                </span>
                            </div>

                            {/* Aprendices Retirados */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <BsPersonCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">Aprendices Retirados</span>
                                </div>
                                <span className="text-base font-semibold text-black dark:text-white">
                                    {withdrawnStudents}
                                </span>
                            </div>
                        </div>

                        {/* Tablet and Desktop: Horizontal layout */}
                        <div className="hidden sm:flex flex-col md:flex-row items-center justify-center md:justify-around h-full space-y-2 md:space-y-0">
                            {/* Numero de estudiantes */}
                            <div className="flex items-center space-x-2 lg:space-x-3">
                                <BsPersonCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <span className="text-base lg:text-lg font-semibold text-black dark:text-white">
                                    {studySheetData?.numberStudents || 0}
                                </span>
                                <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 hidden lg:block">
                                    Número de Estudiantes
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-300 lg:hidden">
                                    Total
                                </span>
                            </div>

                            {/* Separador vertical */}
                            <div className="hidden md:block w-px h-6 lg:h-8 bg-gray-300 dark:bg-gray-600"></div>

                            {/* Aprendices Activos */}
                            <div className="flex items-center space-x-2 lg:space-x-3">
                                <BsPersonCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <span className="text-base lg:text-lg font-semibold text-black dark:text-white">
                                    {activeStudents || 0}
                                </span>
                                <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 hidden lg:block">
                                    Aprendices Activos
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-300 lg:hidden">
                                    Activos
                                </span>
                            </div>

                            {/* Separador vertical */}
                            <div className="hidden md:block w-px h-6 lg:h-8 bg-gray-300 dark:bg-gray-600"></div>

                            {/* Aprendices Retirados */}
                            <div className="flex items-center space-x-2 lg:space-x-3">
                                <BsPersonCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <span className="text-base lg:text-lg font-semibold text-black dark:text-white">
                                    {withdrawnStudents}
                                </span>
                                <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 hidden lg:block">
                                    Aprendices Retirados
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-300 lg:hidden">
                                    Retirados
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
    );
}

export default AttendanceStats;