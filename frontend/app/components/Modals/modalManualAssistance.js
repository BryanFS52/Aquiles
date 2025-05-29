import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Users, Save, X, Search, Calendar } from 'lucide-react';

const ModalManualAssistance = ({ isOpen, onClose, students = [] }) => {
    const [attendance, setAttendance] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filteredStudents, setFilteredStudents] = useState(students);

    const mockStudents = [
        { id: '1234567890', name: 'Michael Felipe Laiton Chaparro', program: 'Desarrollo de Aplicaciones Web II' },
        { id: '1234567891', name: 'Ana María García Rodríguez', program: 'Desarrollo de Aplicaciones Web II' },
        { id: '1234567892', name: 'Carlos Andrés Ruiz Méndez', program: 'Desarrollo de Aplicaciones Web II' },
        { id: '1234567893', name: 'Laura Sofía Martínez López', program: 'Desarrollo de Aplicaciones Web II' },
        { id: '1234567894', name: 'Diego Alejandro Vargas Cruz', program: 'Desarrollo de Aplicaciones Web II' },
        { id: '1234567895', name: 'Valentina Morales Jiménez', program: 'Desarrollo de Aplicaciones Web II' },
        { id: '1234567896', name: 'Juan Pablo Herrera Sánchez', program: 'Desarrollo de Aplicaciones Web II' },
        { id: '1234567897', name: 'Camila Andrea Pérez Rojas', program: 'Desarrollo de Aplicaciones Web II' }
    ];

    const studentsToUse = students.length > 0 ? students : mockStudents;

    useEffect(() => {
        if (isOpen) {
            const initialAttendance = {};
            studentsToUse.forEach(student => {
                initialAttendance[student.id] = student.attendance || 'presente';
            });
            setAttendance(initialAttendance);
        }
        // solo escuchar isOpen, no studentsToUse
    }, [isOpen]);


    useEffect(() => {
        const filtered = studentsToUse.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.includes(searchTerm)
        );
        setFilteredStudents(filtered);
    }, [searchTerm, studentsToUse]);

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleAttendanceChange = (studentId, value) => {
        console.log(`Cambiando estado de ${studentId} a ${value}`);
        setAttendance(prev => {
            const nuevo = { ...prev, [studentId]: value };
            console.log('Nuevo attendance:', nuevo);
            return nuevo;
        });
    };

    const handleSave = () => {
        console.log('Attendance to save:', attendance);
        console.log('Date:', selectedDate);
        onClose();
    };

    const getAttendanceStats = () => {
        const stats = { presente: 0, ausente: 0, justificado: 0, retardo: 0 };
        Object.values(attendance).forEach(status => {
            stats[status] = (stats[status] || 0) + 1;
        });
        return stats;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'presente': return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-lightGreen" />;
            case 'ausente': return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
            case 'justificado': return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-darkBlue" />;
            case 'retardo': return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-darkGreen" />;
            default: return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-darkGray" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'presente': return 'bg-lightGreen bg-opacity-20 text-lightGreen border-lightGreen border';
            case 'ausente': return 'bg-red-100 text-red-800 border-red-200 border';
            case 'justificado': return 'bg-darkBlue bg-opacity-20 text-darkBlue border-darkBlue border';
            case 'retardo': return 'bg-darkGreen bg-opacity-20 text-darkGreen border-darkGreen border';
            default: return 'bg-lightGray text-darkGray border border-lightGray';
        }
    };

    if (!isOpen) return null;

    const stats = getAttendanceStats();

    return (
        <div className="fixed inset-0 lg:inset-y-0 lg:left-64 lg:right-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[98vh] sm:max-h-[95vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-darkBlue text-white px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-t-xl sm:rounded-t-2xl">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-kiwi-maru">TOMA DE ASISTENCIA</h1>
                        <button
                            onClick={onClose}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors p-1.5 sm:p-2 rounded-full"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-darkBackground" />
                        </button>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="bg-lightGreen p-2 sm:p-3 rounded-full flex-shrink-0">
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-xl font-semibold">Registro Manual de Asistencia</h2>
                            <p className="text-lightGray mt-1 text-sm sm:text-base truncate font-inter">
                                Desarrollo de Aplicaciones Web II
                            </p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-lightGray">
                    <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative flex-1 lg:max-w-lg">
                            <Search className="absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-darkGray" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o documento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-lightGray rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-transparent text-sm sm:text-lg font-inter"
                            />
                        </div>
                        <div className="flex items-center space-x-3 sm:space-x-4 bg-darkBackground px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-darkGray flex-shrink-0" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border-0 bg-transparent text-darkGray font-medium focus:outline-none text-sm sm:text-base min-w-0 font-inter"
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                        <div className="bg-lightGreen bg-opacity-20 border border-lightGreen p-3 sm:p-4 rounded-lg sm:rounded-xl text-center">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-lightGreen">{stats.presente}</div>
                            <div className="text-xs sm:text-sm font-medium text-darkGreen mt-1">Presentes</div>
                        </div>
                        <div className="bg-red-100 border border-red-200 p-3 sm:p-4 rounded-lg sm:rounded-xl text-center">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600">{stats.ausente}</div>
                            <div className="text-xs sm:text-sm font-medium text-red-800 mt-1">Ausentes</div>
                        </div>
                        <div className="bg-darkBlue bg-opacity-20 border border-darkBlue p-3 sm:p-4 rounded-lg sm:rounded-xl text-center">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-darkBlue">{stats.justificado}</div>
                            <div className="text-xs sm:text-sm font-medium text-darkBlue mt-1">Justificados</div>
                        </div>
                        <div className="bg-darkGreen bg-opacity-20 border border-darkGreen p-3 sm:p-4 rounded-lg sm:rounded-xl text-center">
                            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-darkGreen">{stats.retardo}</div>
                            <div className="text-xs sm:text-sm font-medium text-darkGreen mt-1">Retardos</div>
                        </div>
                    </div>
                </div>

                {/* Student List */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-darkBackground">
                    <div className="space-y-2 sm:space-y-3">
                        {filteredStudents.map((student, index) => (
                            <div
                                key={student.id}
                                className="bg-white hover:bg-lightGray transition-colors rounded-lg sm:rounded-xl p-3 sm:p-4 border border-lightGray shadow-sm"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                                        <div className="bg-lightGreen text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-darkBlue text-sm sm:text-base truncate">{student.name}</h3>
                                            <p className="text-xs sm:text-sm text-darkGray truncate">Doc: {student.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                                        <div className="hidden sm:block">
                                            {getStatusIcon(attendance[student.id])}
                                        </div>
                                        <select
                                            value={attendance[student.id] || 'presente'}
                                            onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                                            className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border rounded-md sm:rounded-lg font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-lightGreen min-w-0 ${getStatusColor(attendance[student.id])}`}
                                        >
                                            <option value="presente">✓ Presente</option>
                                            <option value="ausente">✗ Ausente</option>
                                            <option value="justificado">J Justificado</option>
                                            <option value="retardo">R Retardo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredStudents.length === 0 && (
                        <div className="text-center py-8 sm:py-12 text-darkGray">
                            <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-lightGray" />
                            <p className="text-base sm:text-lg">No se encontraron aprendices</p>
                            <p className="text-xs sm:text-sm">Intenta con otro término de búsqueda</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-darkBackground px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-lightGray rounded-b-xl sm:rounded-b-2xl">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                        <div className="text-xs sm:text-sm text-darkGray order-2 sm:order-1 font-inter">
                            Total de aprendices: <span className="font-semibold text-darkBlue">{filteredStudents.length}</span>
                        </div>
                        <div className="flex space-x-2 sm:space-x-3 order-1 sm:order-2 w-full sm:w-auto">
                            <button
                                onClick={onClose}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 border border-lightGray text-darkGray rounded-lg hover:bg-lightGray transition-colors font-medium text-sm sm:text-base font-inter"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-lightGreen text-white rounded-lg hover:bg-darkGreen transition-colors font-medium text-sm sm:text-base flex items-center justify-center space-x-2 font-inter"
                            >
                                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>Guardar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalManualAssistance;