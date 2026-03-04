import React from "react";
import { FaCheck } from "react-icons/fa";
import { TbLetterJ, TbLetterR, TbLetterX } from "react-icons/tb";
import { StudySheet } from "@graphql/generated";

interface LegendItemProps {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

interface AttendanceFooterProps {
    studySheet?: StudySheet;
}

const LegendItem: React.FC<LegendItemProps> = ({ label, icon: Icon, color }) => (
    <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="relative">
            <div className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700" />
            <Icon className={`absolute inset-0 w-4 h-4 ${color} m-auto`} />
        </div>
    </div>
);

const AttendanceFooter: React.FC<AttendanceFooterProps> = ({ studySheet }) => {
    return (
        <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
            {/* Número de ficha */}
            <div className="lg:w-32">
                <div className="h-14 rounded-lg border border-gray-200 dark:border-gray-600  bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-black dark:text-white font-inter">
                        {studySheet?.number}
                    </span>
                </div>
            </div>

            {/* Leyenda de símbolos */}
            <div className="flex-1">
                <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <LegendItem label="Asistencia" icon={FaCheck} color="text-green-500" />
                        <LegendItem label="Retardo" icon={TbLetterR} color="text-yellow-500" />
                        <LegendItem label="Inasistencia" icon={TbLetterX} color="text-red-500" />
                        <LegendItem label="Justificación" icon={TbLetterJ} color="text-blue-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceFooter;