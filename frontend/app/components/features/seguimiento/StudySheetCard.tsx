/**
 * StudySheetCard Component - Diseño Elegante y Profesional
 * Tarjeta con diseño limpio, moderno y sofisticado para el SENA
 */

import React from "react";
import Link from "next/link";
import {
    Calendar,
    Users,
    Clock,
    BookOpen,
    GraduationCap,
    MoveRight,
    Layers,
    Award
} from "lucide-react";

interface BaseStudySheet {
    id?: string | number;
    number?: string | number | null;
    state?: boolean | null;
    numberStudents?: number | null;
    startLective?: string | null;
    endLective?: string | null;
    trainingProject?: {
        program?: {
            name?: string | null;
        } | null;
    } | null;
    journey?: {
        name?: string | null;
    } | null;
    offer?: {
        name?: string | null;
    } | null;
    quarter?: Array<{
        name?: {
            number?: number | null;
            extension?: string | null;
        } | null;
    } | null> | null;
}

interface StudySheetCardProps {
    studySheet: BaseStudySheet;
    index: number;
    href: string;
}

const StudySheetCard: React.FC<StudySheetCardProps> = ({
    studySheet,
    index,
    href
}) => {
    const formatDate = (dateString?: string | null): string => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Fecha inválida";
        return date.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getCurrentQuarter = () => {
        if (!studySheet.quarter || studySheet.quarter.length === 0) {
            return "Sin trimestre";
        }
        const lastQuarter = [...studySheet.quarter]
            .filter(q => q?.name?.number !== undefined)
            .sort((a, b) => (b?.name?.number ?? 0) - (a?.name?.number ?? 0))[0];
        return `${lastQuarter?.name?.extension} ${lastQuarter?.name?.number}`;
    };

    return (
        <Link href={href} className="block h-full group">
            <article
                className="relative h-full bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(57,143,15,0.3)] dark:hover:shadow-[0_20px_60px_-15px_rgba(57,169,0,0.4)] hover:-translate-y-1 flex flex-col min-h-[500px]"
                style={{
                    animation: `fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`
                }}
            >
                {/* Barra lateral de color según estado */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${studySheet.state ? 'bg-gradient-to-b from-primary to-lightGreen' : 'bg-gradient-to-b from-gray-400 to-gray-600'} transition-all duration-300 group-hover:w-2`}></div>

                {/* Header minimalista */}
                <header className="relative px-6 pt-6 pb-5 border-b border-gray-100 dark:border-gray-700">
                    {/* Fondo sutil con patrón */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id={`pattern-${index}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <circle cx="20" cy="20" r="1" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#pattern-${index})`} />
                        </svg>
                    </div>

                    <div className="relative flex items-start justify-between gap-4 mb-4">
                        {/* Número de ficha - Diseño limpio */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-lightGreen dark:from-primary/80 dark:to-lightGreen/80 shadow-lg group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-110">
                                <GraduationCap className="w-6 h-6 text-white" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-grayText dark:text-gray-400 uppercase tracking-wider">Ficha</p>
                                <p className="text-2xl font-bold text-black dark:text-white leading-none">{studySheet.number}</p>
                            </div>
                        </div>

                        {/* Badge de estado - Discreto */}
                        <div className="flex items-center gap-2">
                            {studySheet.state ? (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-semibold text-green-700 dark:text-green-400">Activa</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Inactiva</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Programa - Tipografía elegante */}
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                            <Award className="w-4 h-4 text-primary dark:text-lightGreen" />
                            <span className="text-xs font-semibold text-grayText dark:text-gray-400 uppercase tracking-wider">Programa de Formación</span>
                        </div>
                        <h3 className="text-lg font-semibold text-black dark:text-white leading-snug line-clamp-2 group-hover:text-primary dark:group-hover:text-lightGreen transition-colors duration-300">
                            {studySheet.trainingProject?.program?.name ?? "No especificado"}
                        </h3>
                    </div>
                </header>

                {/* Body - Grid limpio y espacioso */}
                <div className="relative px-6 py-5 flex-1 space-y-4">
                    {/* Información principal */}
                    <div className="grid grid-cols-2 gap-3">
                        <DataCard
                            icon={<Clock className="w-4 h-4" />}
                            label="Jornada"
                            value={studySheet.journey?.name ?? "Sin jornada"}
                            gradient="from-blue-500 to-cyan-500"
                        />
                        <DataCard
                            icon={<BookOpen className="w-4 h-4" />}
                            label="Oferta"
                            value={studySheet.offer?.name ?? "Sin oferta"}
                            gradient="from-purple-500 to-pink-500"
                        />
                    </div>

                    <DataCard
                        icon={<Layers className="w-4 h-4" />}
                        label="Trimestre Actual"
                        value={getCurrentQuarter()}
                        gradient="from-orange-500 to-red-500"
                        fullWidth
                    />

                    {/* Timeline elegante */}
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-4 h-4 text-primary dark:text-lightGreen" />
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Período Lectivo</span>
                        </div>

                        <div className="relative">
                            {/* Línea de tiempo */}
                            <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400"></div>

                            <div className="relative grid grid-cols-2 gap-8">
                                <TimelinePoint
                                    label="Inicio"
                                    date={formatDate(studySheet.startLective)}
                                    color="green"
                                />
                                <TimelinePoint
                                    label="Finalización"
                                    date={formatDate(studySheet.endLective)}
                                    color="red"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer elegante */}
                <footer className="relative px-6 py-5 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/30 dark:to-gray-900/30 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    <div className="flex items-center justify-between">
                        {/* Contador de aprendices - Limpio */}
                        <div className="flex items-center gap-4">
                            <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-lightGreen/10 dark:from-primary/20 dark:to-lightGreen/20 border border-primary/20 dark:border-lightGreen/20 group-hover:border-primary dark:group-hover:border-lightGreen transition-all duration-300">
                                <Users className="w-6 h-6 text-primary dark:text-lightGreen" strokeWidth={2} />
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary dark:bg-lightGreen rounded-full flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white">{studySheet.numberStudents}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-grayText dark:text-gray-400 uppercase tracking-wider">Total</p>
                                <p className="text-sm font-bold text-black dark:text-white">Aprendices</p>
                            </div>
                        </div>

                        {/* CTA - Minimalista */}
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black dark:bg-white group-hover:bg-primary dark:group-hover:bg-lightGreen transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                            <span className="text-sm font-semibold text-white dark:text-black uppercase tracking-wide">Acceder</span>
                            <MoveRight className="w-5 h-5 text-white dark:text-black group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                        </div>
                    </div>
                </footer>

                {/* Efecto de hover sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-lightGreen/0 group-hover:from-primary/5 group-hover:to-lightGreen/5 transition-all duration-500 pointer-events-none"></div>
            </article>
        </Link>
    );
};

// Componente auxiliar para cards de datos
const DataCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    gradient: string;
    fullWidth?: boolean;
}> = ({ icon, label, value, gradient, fullWidth = false }) => (
    <div className={`${fullWidth ? 'col-span-2' : ''} group/card relative overflow-hidden bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-lightGreen/50 transition-all duration-300 hover:shadow-md`}>
        {/* Gradiente de fondo en hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover/card:opacity-5 transition-opacity duration-300`}></div>

        <div className="relative flex items-start gap-2.5">
            <div className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-sm group-hover/card:scale-110 transition-transform duration-300`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-grayText dark:text-gray-400 uppercase tracking-wider mb-0.5">
                    {label}
                </p>
                <p className="text-sm font-semibold text-black dark:text-white truncate">
                    {value}
                </p>
            </div>
        </div>
    </div>
);

// Componente auxiliar para puntos de timeline
const TimelinePoint: React.FC<{
    label: string;
    date: string;
    color: 'green' | 'red';
}> = ({ label, date, color }) => (
    <div className="relative flex flex-col items-center">
        <div className={`relative z-10 w-6 h-6 rounded-full border-4 ${color === 'green'
                ? 'bg-green-500 border-green-200 dark:border-green-800'
                : 'bg-red-500 border-red-200 dark:border-red-800'
            } shadow-lg`}>
            <div className={`absolute inset-0 rounded-full ${color === 'green' ? 'bg-green-500' : 'bg-red-500'
                } animate-ping opacity-20`}></div>
        </div>
        <div className="mt-3 text-center">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{label}</p>
            <p className={`text-sm font-bold ${color === 'green'
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-red-700 dark:text-red-400'
                }`}>
                {date}
            </p>
        </div>
    </div>
);

export default StudySheetCard;
