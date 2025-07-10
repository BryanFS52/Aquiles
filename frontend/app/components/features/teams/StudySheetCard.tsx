import React from 'react';
import { StudySheetItem, Student } from '@type/slices/olympo/studySheet';
import { FaBook, FaCalendarAlt, FaUsers, FaInfoCircle, FaEye } from 'react-icons/fa';
import Link from 'next/link';

interface StudySheetCardProps {
    studySheet: StudySheetItem;
}

const StudySheetCard: React.FC<StudySheetCardProps> = ({ studySheet }) => {
    const { number, startLective, endLective, journey, students, state } = studySheet;

    return (
        <div className="bg-white dark:bg-[#003044] rounded-2xl shadow-lg overflow-hidden p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <FaBook className="text-2xl text-[#40b003]" />
                    <h2 className="text-xl font-bold text-[#00324d] dark:text-white">Ficha: {number}</h2>
                </div>
                <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${state ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                >
                    {state ? 'Activa' : 'Inactiva'}
                </span>
            </div>

            <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-lg text-[#40b003]" />
                    <p>
                        <span className="font-semibold">Inicio:</span> {startLective ? new Date(startLective).toLocaleDateString() : 'N/A'}
                    </p>
                    <p>
                        <span className="font-semibold">Fin:</span> {endLective ? new Date(endLective).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <FaInfoCircle className="text-lg text-[#40b003]" />
                    <p>
                        <span className="font-semibold">Jornada:</span> {journey?.name ?? 'N/A'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <FaUsers className="text-lg text-[#40b003]" />
                    <p>
                        <span className="font-semibold">Estudiantes:</span> {students.length}
                    </p>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-end">
                <Link href={`/dashboard/teamScrum/${studySheet.id}`} passHref>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#40b003] rounded-lg hover:bg-[#2a7d02] transition-colors duration-300">
                        <FaEye />
                        Ver Teams Scrum
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default StudySheetCard;
