'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IoPersonCircleOutline, IoCalendarOutline, IoMailOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { BsQrCodeScan, BsCameraFill } from "react-icons/bs";
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Webcam from "react-webcam";
import jsQR from "jsqr";
import type { RootState, AppDispatch } from "@redux/store";
import { addAttendance } from "@redux/slices/attendanceSlice";

// Interfaces
interface AttendanceData {
    attendanceDate: string;
    studentId: number;
    attendanceState: {
        id: string;
        status: string;
    };
    competenceQuarter: number;
}

// Función para obtener nombre del día en español
const getDayName = (date: Date): string => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
};

const FormularioQr: React.FC = () => {
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.attendances);
    
    const [documentNumber, setDocumentNumber] = useState<string>('');
    const [attendanceUpdated, setAttendanceUpdated] = useState<boolean>(false);
    const [qrResult, setQrResult] = useState<string>('');
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [studentEmail, setStudentEmail] = useState<string>('');
    const [isScanning, setIsScanning] = useState<boolean>(true);
    const webcamRef = useRef<Webcam>(null);

    // Obtener parámetros de la URL
    const sessionId = searchParams.get('sessionId');
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (email) {
            setStudentEmail(decodeURIComponent(email));
        }
    }, [email]);

    const handleSubmit = async (): Promise<void> => {
        const documentToUse = qrResult || documentNumber;
        
        if (!documentToUse.trim()) {
            toast.error('Por favor ingresa tu número de documento o escanea el QR');
            return;
        }

        if (!sessionId) {
            toast.error('Sesión QR no válida');
            return;
        }

        try {
            const attendanceData = {
                attendanceDate: currentDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
                studentId: parseInt(documentToUse),
                attendanceState: {
                    id: "2",
                    status: "Presente"
                },
                competenceQuarter: 1 // ID de competencia por defecto
            };

            const result = await dispatch(addAttendance(attendanceData));
            
            if (addAttendance.fulfilled.match(result)) {
                toast.success('¡Asistencia registrada exitosamente!');
                setAttendanceUpdated(true);
                setDocumentNumber('');
                setQrResult('');
                setIsScanning(false);
                
                // Redirigir después de 3 segundos
                setTimeout(() => {
                    window.close(); // Cerrar ventana si fue abierta desde email
                }, 3000);
            } else {
                toast.error('Error al registrar asistencia');
                console.error('Error details:', result.payload);
            }
        } catch (error) {
            console.error('Error al enviar asistencia:', error);
            toast.error('Error inesperado al registrar asistencia');
        }
    };

    useEffect(() => {
        if (!isScanning) return;
        
        const interval = setInterval(() => {
            if (webcamRef.current) {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    img.src = imageSrc;

                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx?.drawImage(img, 0, 0, img.width, img.height);
                        const imageData = ctx?.getImageData(0, 0, img.width, img.height);
                        if (imageData) {
                            const code = jsQR(imageData.data, img.width, img.height);
                            if (code) {
                                setQrResult(code.data);
                                setIsScanning(false);
                                toast.success('¡QR detectado!');
                            }
                        }
                    };
                }
            }
        }, 500);

        return () => clearInterval(interval);
    }, [isScanning]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = currentDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const dayName = getDayName(currentDate);
    const formattedTime = currentDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });

    if (attendanceUpdated) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-100">
                <div className="flex flex-col items-center justify-center flex-1 p-6">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-200 max-w-md w-full text-center">
                        <div className="mb-6">
                            <IoCheckmarkCircleOutline className="text-green-500 text-8xl mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-green-700 mb-2">¡Asistencia Registrada!</h1>
                            <p className="text-green-600">Tu asistencia ha sido registrada exitosamente</p>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-xl mb-4">
                            <p className="text-sm text-green-700">
                                <strong>Documento:</strong> {qrResult || documentNumber}
                            </p>
                            <p className="text-sm text-green-700">
                                <strong>Fecha:</strong> {formattedDate}
                            </p>
                            <p className="text-sm text-green-700">
                                <strong>Hora:</strong> {formattedTime}
                            </p>
                        </div>
                        
                        <p className="text-sm text-gray-500">Esta ventana se cerrará automáticamente...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <BsQrCodeScan className="text-blue-600 text-3xl" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Registro de Asistencia</h1>
                                <p className="text-sm text-gray-600">{dayName}, {formattedDate}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{formattedTime}</div>
                            <div className="text-sm text-gray-500">Hora actual</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 p-6">
                <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
                    <div className="text-center mb-8">
                        <BsCameraFill className="text-blue-500 text-4xl mx-auto mb-3" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Registra tu Asistencia</h2>
                        <p className="text-gray-600">Escanea tu QR personal o ingresa tu documento manualmente</p>
                    </div>

                    {/* Email del estudiante */}
                    {studentEmail && (
                        <div className="relative w-full mb-6">
                            <input
                                type="email"
                                value={studentEmail}
                                disabled
                                className="flex h-14 w-full rounded-xl border-2 border-green-200 px-12 shadow-sm bg-green-50 text-green-700 font-medium"
                                placeholder="Email del estudiante"
                            />
                            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-green-500 text-2xl">
                                <IoMailOutline />
                            </div>
                        </div>
                    )}

                    {/* Cámara QR */}
                    {isScanning && (
                        <div className="relative mb-6">
                            <div className="relative overflow-hidden rounded-xl border-4 border-dashed border-blue-300 bg-blue-50">
                                <Webcam
                                    ref={webcamRef}
                                    screenshotFormat="image/png"
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 border-2 border-blue-500 rounded-xl pointer-events-none">
                                    <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-blue-500"></div>
                                    <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-blue-500"></div>
                                    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-blue-500"></div>
                                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-blue-500"></div>
                                </div>
                            </div>
                            <p className="text-center text-sm text-blue-600 mt-2">Apunta el QR hacia la cámara</p>
                        </div>
                    )}

                    {/* QR Detectado */}
                    {qrResult && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                            <div className="flex items-center space-x-3">
                                <IoCheckmarkCircleOutline className="text-green-500 text-2xl" />
                                <div>
                                    <p className="text-green-700 font-semibold">QR Detectado</p>
                                    <p className="text-green-600 text-sm">Documento: {qrResult}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Campo Número de Documento */}
                    <div className="relative w-full mb-6">
                        <input
                            type="text"
                            value={qrResult || documentNumber}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocumentNumber(e.target.value)}
                            className="flex h-14 w-full rounded-xl border-2 border-gray-300 px-12 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            placeholder="Número de Documento"
                            disabled={!!qrResult}
                        />
                        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-2xl">
                            <IoPersonCircleOutline />
                        </div>
                    </div>

                    {/* Campo Día */}
                    <div className="relative w-full mb-6">
                        <input
                            type="text"
                            value={dayName}
                            disabled
                            className="flex h-14 w-full rounded-xl border-2 border-gray-200 px-12 shadow-sm bg-gray-50 text-gray-700"
                            placeholder="Día"
                        />
                        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-2xl">
                            <IoCalendarOutline />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || (!qrResult && !documentNumber.trim())}
                            className={`w-full h-14 rounded-xl text-white font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                                loading || (!qrResult && !documentNumber.trim())
                                    ? 'bg-gray-400 cursor-not-allowed transform-none' 
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-200'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Registrando...</span>
                                </div>
                            ) : (
                                'Registrar Asistencia'
                            )}
                        </button>
                        
                        {qrResult && (
                            <button
                                onClick={() => {
                                    setQrResult('');
                                    setIsScanning(true);
                                }}
                                className="w-full h-12 rounded-xl border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-all"
                            >
                                Escanear Otro QR
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormularioQr;