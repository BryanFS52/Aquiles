"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { fetchStudySheets } from "@slice/olympo/studySheetSlice";
import { FaLayerGroup, FaUserTie, FaClipboardList, FaTimes } from "react-icons/fa";
// import { TeacherSelector } from "@components/features/InstructorAssignMultipleSheets/TeacherSelector"; // DESCOMENTAR para datos reales

// ========== DATOS QUEMADOS - INICIO ==========
// COMENTAR esta sección completa cuando uses datos reales
const HARDCODED_MODAL_TEACHERS = [
    { id: 1, name: "María José Rodríguez García", email: "maria.rodriguez@sena.edu.co" },
    { id: 2, name: "Carlos Andrés Martínez López", email: "carlos.martinez@sena.edu.co" },
    { id: 3, name: "Ana Patricia González Hernández", email: "ana.gonzalez@sena.edu.co" },
    { id: 4, name: "Luis Fernando Jiménez Castro", email: "luis.jimenez@sena.edu.co" },
    { id: 5, name: "Sandra Milena Torres Vargas", email: "sandra.torres@sena.edu.co" },
    { id: 6, name: "Diego Alejandro Ramírez Moreno", email: "diego.ramirez@sena.edu.co" },
    { id: 7, name: "Liliana Vargas Castillo", email: "liliana.vargas@sena.edu.co" },
    { id: 8, name: "Roberto Sánchez Pérez", email: "roberto.sanchez@sena.edu.co" },
    { id: 9, name: "Claudia Patricia Herrera Vega", email: "claudia.herrera@sena.edu.co" },
    { id: 10, name: "Javier Orlando Ruiz Gómez", email: "javier.ruiz@sena.edu.co" }
];

const HARDCODED_MODAL_SHEETS = [
    { id: 1, number: 2758990, program: "ADSO", students: 28, available: true },
    { id: 2, number: 2758991, program: "REDES", students: 32, available: true },
    { id: 3, number: 2758992, program: "DISEÑO", students: 25, available: true },
    { id: 4, number: 2758993, program: "MECOM", students: 30, available: true },
    { id: 5, number: 2758994, program: "CONTAFIN", students: 22, available: true },
    { id: 6, number: 2758995, program: "MULTIMEDIA", students: 27, available: true },
    { id: 7, number: 2758996, program: "SST", students: 31, available: true },
    { id: 8, number: 2758997, program: "LOGÍSTICA", students: 26, available: true },
    { id: 9, number: 2758998, program: "VIDEOJUEGOS", students: 29, available: true },
    { id: 10, number: 2758999, program: "MARKETING", students: 24, available: true }
];
// ========== DATOS QUEMADOS - FIN ==========

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
    const [selectedSheetIds, setSelectedSheetIds] = useState<number[]>([]);

    // ========== DATOS REALES - COMENTADO ==========
    // DESCOMENTAR estas líneas para usar datos reales
    // COMENTAR la sección "DATOS QUEMADOS ACTIVOS" de abajo

    // const { data: coordinations, loading: loadingCoordinations } = useSelector((state: RootState) => state.coordination);
    // const { data: studySheets, loading: loadingSheets } = useSelector((state: RootState) => state.studySheet);
    // const teachers = coordinations
    //     .flatMap(coord => coord.teachers || [])
    //     .filter((teacher): teacher is NonNullable<typeof teacher> => teacher !== null && teacher !== undefined);

    // ========== DATOS QUEMADOS ACTIVOS ==========
    // COMENTAR estas líneas cuando uses datos reales
    // DESCOMENTAR la sección "DATOS REALES" de arriba

    const teachers = HARDCODED_MODAL_TEACHERS;
    const studySheets = HARDCODED_MODAL_SHEETS;
    const loadingSheets = false;
    const loadingCoordinations = false;

    // ========== CARGA DE DATOS REALES - COMENTADO ==========
    // DESCOMENTAR este useEffect para usar datos reales

    // useEffect(() => {
    //     if (isOpen) {
    //         dispatch(fetchStudySheets({ page: 0, size: 100 }));
    //     }
    // }, [isOpen, dispatch]);

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
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden relative border border-gray-200 dark:border-gray-700">
                {/* Botón X para cerrar */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 hover:scale-110"
                    title="Cerrar"
                >
                    <FaTimes className="text-xl" />
                </button>

                <div className="bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-blue-900 p-6 text-white">
                    <h3 className="text-2xl font-bold flex items-center space-x-3">
                        <span>Nueva Asignación Múltiple</span>
                    </h3>
                    <p className="text-white/90 mt-1">Asigna múltiples fichas técnicas a un instructor</p>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-180px)] bg-white dark:bg-gray-800">
                    {/* Selector de Instructor */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <FaUserTie className="text-primary dark:text-blue-300 text-xl" />
                            <h4 className="text-lg font-semibold text-secondary dark:text-gray-100">
                                Seleccionar Instructor
                            </h4>
                        </div>

                        {/* ========== SELECTOR DATOS REALES - COMENTADO ========== */}
                        {/* DESCOMENTAR para usar datos reales con TeacherSelector */}
                        {/* COMENTAR el selector manual de abajo */}

                        {/* <TeacherSelector
                            teachers={teachers}
                            selectedTeacherId={selectedTeacherId}
                            onSelect={setSelectedTeacherId}
                        /> */}

                        {/* ========== SELECTOR DATOS QUEMADOS ACTIVO ========== */}
                        {/* COMENTAR esta sección cuando uses datos reales */}
                        {/* DESCOMENTAR el TeacherSelector de arriba */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                            {teachers.map((teacher) => (
                                <button
                                    key={teacher.id}
                                    onClick={() => setSelectedTeacherId(teacher.id)}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${selectedTeacherId === teacher.id
                                            ? 'border-primary bg-primary/10 dark:border-white/40 dark:bg-white/5'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-primary/50 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className={`font-semibold ${selectedTeacherId === teacher.id ? 'text-primary dark:text-white' : 'text-secondary dark:text-gray-100'}`}>
                                                {/* Para datos quemados: teacher.name */}
                                                {teacher.name}
                                                {/* Para datos reales: teacher.collaborator?.person?.name */}
                                                {/* {teacher.collaborator?.person?.name} {teacher.collaborator?.person?.lastname} */}
                                            </p>
                                            <p className="text-xs text-darkGray dark:text-gray-400 mt-1">
                                                {/* Para datos quemados: teacher.email */}
                                                {teacher.email}
                                                {/* Para datos reales: teacher.collaborator?.person?.email */}
                                                {/* {teacher.collaborator?.person?.email} */}
                                            </p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTeacherId === teacher.id ? 'bg-primary border-primary dark:bg-white dark:border-white' : 'border-gray-300 dark:border-gray-500'
                                            }`}>
                                            {selectedTeacherId === teacher.id && <span className="text-white dark:text-secondary text-xs">●</span>}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Selector de Fichas */}
                    {selectedTeacherId && (
                        <div>
                            <div className="flex items-center space-x-2 mb-3">
                                <FaClipboardList className="text-primary dark:text-blue-300 text-xl" />
                                <h4 className="text-lg font-semibold text-secondary dark:text-gray-100">
                                    Seleccionar Fichas Técnicas
                                </h4>
                                <span className="text-sm text-darkGray dark:text-gray-400">
                                    ({selectedSheetIds.length} seleccionadas)
                                </span>
                            </div>

                            {loadingSheets ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                                    <p className="mt-4 text-darkGray dark:text-gray-400">Cargando fichas...</p>
                                </div>
                            ) : studySheets.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                                    {studySheets.map((sheet) => {
                                        // ========== PARA DATOS QUEMADOS ========== 
                                        // COMENTAR estas líneas cuando uses datos reales
                                        const isSelected = selectedSheetIds.includes(sheet.id);
                                        const sheetNumber = sheet.number;
                                        const sheetProgram = sheet.program;
                                        const sheetStudents = sheet.students;
                                        const sheetId = sheet.id;

                                        // ========== PARA DATOS REALES - COMENTADO ==========
                                        // DESCOMENTAR estas líneas para datos reales
                                        // COMENTAR las líneas de "DATOS QUEMADOS" de arriba

                                        // const isSelected = sheet.id ? selectedSheetIds.includes(Number(sheet.id)) : false;
                                        // const sheetNumber = sheet.number || 'N/A';
                                        // const sheetProgram = sheet.trainingProject?.program?.name || 'Sin programa';
                                        // const sheetStudents = sheet.numberStudents || 0;
                                        // const sheetId = sheet.id ? Number(sheet.id) : 0;

                                        return (
                                            <button
                                                key={sheet.id}
                                                onClick={() => handleToggleSheet(sheetId)}
                                                className={`p-3 rounded-xl border-2 transition-all text-left ${isSelected
                                                        ? 'border-primary bg-primary/10 dark:border-white/40 dark:bg-white/5'
                                                        : 'border-gray-200 dark:border-gray-600 hover:border-primary/50 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className={`font-semibold ${isSelected ? 'text-primary dark:text-white' : 'text-secondary dark:text-gray-100'}`}>
                                                            Ficha {sheetNumber}
                                                        </p>
                                                        <p className="text-xs text-darkGray dark:text-gray-400 mt-1">
                                                            {sheetProgram}
                                                        </p>
                                                        <p className="text-xs text-darkGray dark:text-gray-400">
                                                            {sheetStudents} estudiantes
                                                        </p>
                                                    </div>
                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-primary border-primary dark:bg-white dark:border-white' : 'border-gray-300 dark:border-gray-500'
                                                        }`}>
                                                        {isSelected && <span className="text-white dark:text-secondary text-xs">✓</span>}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-darkGray dark:text-gray-400">
                                    <FaLayerGroup className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                                    <p>No hay fichas disponibles</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end space-x-3 bg-white dark:bg-gray-800">
                    <button
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${selectedTeacherId && selectedSheetIds.length > 0
                                ? 'bg-gradient-to-r from-primary to-lightGreen text-white hover:shadow-lg'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
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

/*
========== INSTRUCCIONES PARA ALTERNAR ENTRE DATOS QUEMADOS Y REALES ==========

ACTUALMENTE USANDO: DATOS QUEMADOS ✅

PARA CAMBIAR A DATOS REALES:

1. IMPORTACIONES:
- DESCOMENTAR: import { TeacherSelector } from "@components/features/InstructorAssignMultipleSheets/TeacherSelector";

2. DATOS QUEMADOS (COMENTAR TODA LA SECCIÓN):
- COMENTAR: const HARDCODED_MODAL_TEACHERS = [...];
- COMENTAR: const HARDCODED_MODAL_SHEETS = [...];

3. DATOS REALES (DESCOMENTAR):
- DESCOMENTAR: const { data: coordinations, loading: loadingCoordinations } = useSelector...
- DESCOMENTAR: const { data: studySheets, loading: loadingSheets } = useSelector...
- DESCOMENTAR: const teachers = coordinations.flatMap...
- COMENTAR: const teachers = HARDCODED_MODAL_TEACHERS;
- COMENTAR: const studySheets = HARDCODED_MODAL_SHEETS;
- COMENTAR: const loadingSheets = false;

4. USEEFFECT (DESCOMENTAR):
- DESCOMENTAR: useEffect(() => { if (isOpen) { dispatch(fetchStudySheets... } });

5. SELECTOR DE INSTRUCTORES:
- COMENTAR: Toda la sección del selector manual (grid con teachers.map)
- DESCOMENTAR: <TeacherSelector teachers={teachers} selectedTeacherId={selectedTeacherId} onSelect={setSelectedTeacherId} />

6. SELECTOR DE FICHAS:
- COMENTAR: Variables para datos quemados (const isSelected = selectedSheetIds.includes(sheet.id);)
- DESCOMENTAR: Variables para datos reales (const isSelected = sheet.id ? selectedSheetIds.includes(Number(sheet.id)) : false;)
- COMENTAR: {teacher.name} y {teacher.email}
- DESCOMENTAR: {teacher.collaborator?.person?.name} {teacher.collaborator?.person?.lastname}

PARA VOLVER A DATOS QUEMADOS:
- Hacer lo contrario: comentar las secciones reales y descomentar las de datos quemados

FUNCIONALIDADES ACTUALES CON DATOS QUEMADOS:
✅ Modal se abre correctamente
✅ 10 instructores para seleccionar
✅ 10 fichas técnicas para seleccionar  
✅ Selección múltiple funciona
✅ Botón "Asignar" se activa/desactiva
✅ Cierre de modal funciona
✅ Console.log muestra datos seleccionados
✅ Responsive design
✅ Animaciones y efectos hover
*/