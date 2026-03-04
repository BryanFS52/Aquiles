"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { fetchStudySheets } from "@slice/olympo/studySheetSlice";
import { FaPlus, FaLayerGroup, FaUserTie, FaClipboardList, FaTimes } from "react-icons/fa";
import { TeacherSelector } from "@components/features/InstructorAssignMultipleSheets/TeacherSelector";

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
    const [selectedSheetIds, setSelectedSheetIds] = useState<number[]>([]);
    
    const { data: coordinations, loading: loadingCoordinations } = useSelector((state: RootState) => state.coordination);
    const { data: studySheets, loading: loadingSheets } = useSelector((state: RootState) => state.studySheet);

    const teachers = coordinations
        .flatMap(coord => coord.teachers || [])
        .filter((teacher): teacher is NonNullable<typeof teacher> => teacher !== null && teacher !== undefined);

    useEffect(() => {
        if (isOpen) {dispatch(fetchStudySheets({ page: 0, size: 100 }));}
    }, [isOpen, dispatch]);

    const handleToggleSheet = (sheetId: number) => {
        setSelectedSheetIds(prev => 
            prev.includes(sheetId)
                ? prev.filter(id => id !== sheetId)
                : [...prev, sheetId]
        );
    };

    const handleSubmitAssignment = () => {
        if (selectedTeacherId && selectedSheetIds.length > 0) {
            console.log('Asignando:', { teacherId: selectedTeacherId, sheetIds: selectedSheetIds });
            onSubmit();
            // Limpiar selección
            setSelectedTeacherId(null);
            setSelectedSheetIds([]);
        }
    };

    const handleClose = () => {
        // Limpiar selecciones al cerrar
        setSelectedTeacherId(null);
        setSelectedSheetIds([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden relative">
                {/* Botón X para cerrar */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 hover:scale-110"
                    title="Cerrar"
                >
                    <FaTimes className="text-xl" />
                </button>

                <div className="bg-gradient-to-r from-primary to-lightGreen p-6 text-white">
                    <h3 className="text-2xl font-bold flex items-center space-x-3">
                        <FaPlus className="text-xl" />
                        <span>Nueva Asignación Múltiple</span>
                    </h3>
                    <p className="text-white/90 mt-1">Asigna múltiples fichas técnicas a un instructor</p>
                </div>
                
                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                    {/* Selector de Instructor */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <FaUserTie className="text-primary text-xl" />
                            <h4 className="text-lg font-semibold text-secondary">
                                Seleccionar Instructor
                            </h4>
                        </div>
                        <TeacherSelector
                            teachers={teachers}
                            selectedTeacherId={selectedTeacherId}
                            onSelect={setSelectedTeacherId}
                        />
                    </div>

                    {/* Selector de Fichas */}
                    {selectedTeacherId && (
                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <FaClipboardList className="text-primary text-xl" />
                                <h4 className="text-lg font-semibold text-secondary">
                                    Seleccionar Fichas Técnicas
                                </h4>
                                <span className="text-sm text-darkGray">
                                    ({selectedSheetIds.length} seleccionadas)
                                </span>
                            </div>
                            
                            {loadingSheets ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                                    <p className="mt-4 text-darkGray">Cargando fichas...</p>
                                </div>
                            ) : studySheets.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                                    {studySheets.map((sheet) => {
                                        const isSelected = sheet.id ? selectedSheetIds.includes(Number(sheet.id)) : false;
                                        return (
                                            <button
                                                key={sheet.id}
                                                onClick={() => sheet.id && handleToggleSheet(Number(sheet.id))}
                                                className={`p-3 rounded-xl border-2 transition-all text-left ${
                                                    isSelected
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className={`font-semibold ${isSelected ? 'text-primary' : 'text-secondary'}`}>
                                                            {sheet.number || 'N/A'}
                                                        </p>
                                                        <p className="text-xs text-darkGray mt-1">
                                                            {sheet.trainingProject?.program?.name || 'Sin programa'}
                                                        </p>
                                                        <p className="text-xs text-darkGray">
                                                            {sheet.numberStudents || 0} estudiantes
                                                        </p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                                        isSelected ? 'bg-primary border-primary' : 'border-gray-300'
                                                    }`}>
                                                        {isSelected && <span className="text-white text-xs">✓</span>}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-darkGray">
                                    <FaLayerGroup className="mx-auto text-4xl text-gray-300 mb-3" />
                                    <p>No hay fichas disponibles</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 p-6 flex justify-end space-x-3">
                    <button
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                            selectedTeacherId && selectedSheetIds.length > 0
                                ? 'bg-gradient-to-r from-primary to-lightGreen text-white hover:shadow-lg'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={handleSubmitAssignment}
                        disabled={!selectedTeacherId || selectedSheetIds.length === 0}
                    >
                        Asignar {selectedSheetIds.length > 0 && `(${selectedSheetIds.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
};