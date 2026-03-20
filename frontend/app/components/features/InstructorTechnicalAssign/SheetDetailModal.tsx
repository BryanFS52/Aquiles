import React from 'react';
import { FaUsers, FaUserTie, FaGraduationCap, FaIdCard, FaTimes } from 'react-icons/fa';

interface Student {
    id: string;
    name: string;
    lastname: string;
}

interface Teacher {
    id?: string | null;
    collaborator?: {
        person?: {
            name?: string | null;
            lastname?: string | null;
        } | null;
    } | null;
}

interface Program {
    id: string;
    name: string;
    acronym?: string;
}

interface SheetDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    sheet: {
        number: number;
        program: Program;
        students: Student[];
        assignedTeacher?: Teacher | null;
    };
}

const SheetDetailModal: React.FC<SheetDetailModalProps> = ({ isOpen, onClose, sheet }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-[#5cb800] to-[#8fd400] dark:from-secondary dark:to-blue-900 p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-2xl">
                            <FaIdCard className="text-3xl" />
                        </div>
                        <div>
                            <p className="text-emerald-100 text-xs uppercase tracking-wider font-bold">Detalle de ficha</p>
                            <h2 className="text-2xl font-black italic">#{sheet.number}</h2>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Sección: Programa e Instructor */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
                            <FaGraduationCap className="text-gray-900 dark:text-white mt-1 text-xl" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Programa de Formación</p>
                                <p className="font-bold text-gray-800 dark:text-gray-100 leading-tight">
                                    {sheet.program.name}
                                    {sheet.program.acronym && (
                                        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-md">
                                            {sheet.program.acronym}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
                            <FaUserTie className="text-gray-900 dark:text-white mt-1 text-xl" />
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Instructor Líder</p>
                                <p className="font-bold text-gray-800 dark:text-gray-100">
                                    {sheet.assignedTeacher?.collaborator?.person?.name 
                                        ? `${sheet.assignedTeacher.collaborator.person.name} ${sheet.assignedTeacher.collaborator.person.lastname}`
                                        : 'Pendiente por asignar'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sección: Aprendices */}
                    <div>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <FaUsers className="text-gray-400" />
                                <span className="font-bold text-gray-700 dark:text-gray-200">Aprendices</span>
                            </div>
                            <span className="text-xs font-bold bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                                {sheet.students.length} Total
                            </span>
                        </div>
                        
                        <div className="max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {sheet.students.length > 0 ? (
                                <ul className="space-y-2">
                                    {sheet.students.map((student, idx) => (
                                        <li key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-slate-700">
                                            <span className="text-xs font-mono text-gray-400">{String(idx + 1).padStart(2, '0')}</span>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {student.name} {student.lastname}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center py-4 text-sm text-gray-400 italic">No hay aprendices registrados</p>
                            )}
                        </div>
                    </div>

                    {/* Botón de acción rápido */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl transition-all"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SheetDetailModal;
