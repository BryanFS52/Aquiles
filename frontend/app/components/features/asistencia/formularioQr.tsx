"use client";

import React, { useState, useRef, useEffect } from 'react';
import { IoPersonCircleOutline, IoCalendarOutline, IoMailOutline, IoCheckmarkCircleOutline, IoTimeOutline } from "react-icons/io5";
import { BsQrCodeScan, BsCameraFill, BsShieldCheck } from "react-icons/bs";
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from "@redux/store";
import { toast } from 'react-toastify';
import { addAttendance } from "@redux/slices/attendanceSlice";
import Webcam from "react-webcam";
import jsQR from "jsqr";

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
    const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
    const webcamRef = useRef<Webcam>(null);

    // Obtener parámetros de la URL
    const sessionId = searchParams.get('sessionId');
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const studentId = searchParams.get('studentId');
    const competenceQuarterId = searchParams.get('competenceQuarterId');

    useEffect(() => {
        if (email) {
            setStudentEmail(decodeURIComponent(email));
        }
        
        if (studentId) {
            setIsScanning(false);
            setDocumentNumber(studentId);
            console.log('🎯 Datos obtenidos de la URL:', {
                studentId,
                email: email ? decodeURIComponent(email) : null,
                competenceQuarterId,
                sessionId
            });
        }
    }, [email, studentId, competenceQuarterId, sessionId]);

    const handleSubmit = async (): Promise<void> => {
        const studentIdToUse = studentId || qrResult || documentNumber;
        
        if (!studentIdToUse.trim()) {
            toast.error('Por favor ingresa tu número de documento o escanea el QR');
            return;
        }

        if (!sessionId) {
            toast.error('Sesión QR no válida');
            return;
        }

        try {
            const attendanceData = {
                attendanceDate: currentDate.toISOString().split('T')[0],
                studentId: parseInt(studentIdToUse),
                attendanceState: {
                    id: "2",
                    status: "Presente"
                },
                competenceQuarter: competenceQuarterId ? parseInt(competenceQuarterId) : 1
            };

            console.log('📝 Registrando asistencia con datos:', {
                studentId: studentIdToUse,
                competenceQuarterId: competenceQuarterId,
                sessionId: sessionId,
                email: studentEmail,
                fromUrl: !!studentId,
                attendanceData
            });

            const result = await dispatch(addAttendance(attendanceData));
            
            if (addAttendance.fulfilled.match(result)) {
                const messageBase = '¡Asistencia registrada exitosamente!';
                const studentInfo = studentEmail ? ` para ${studentEmail}` : '';
                toast.success(`${messageBase}${studentInfo}`);
                
                setAttendanceUpdated(true);
                setDocumentNumber('');
                setQrResult('');
                setIsScanning(false);
                
                setTimeout(() => {
                    window.close();
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
            <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
                {/* Partículas animadas de fondo */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Partículas grandes */}
                    <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full opacity-20 animate-float-gentle"></div>
                    <div className="absolute top-40 right-20 w-3 h-3 bg-lightGreen rounded-full opacity-30 animate-bounce-soft"></div>
                    <div className="absolute bottom-32 left-20 w-5 h-5 bg-secondary rounded-full opacity-15 animate-pulse-gentle"></div>
                    <div className="absolute top-60 left-1/3 w-2 h-2 bg-darkBlue rounded-full opacity-25 animate-spin-slow"></div>
                    <div className="absolute bottom-40 right-1/4 w-6 h-6 bg-primary/20 rounded-full opacity-40 animate-float-gentle"></div>
                    
                    {/* Partículas medianas */}
                    <div className="absolute top-1/4 right-10 w-3 h-3 bg-lightGreen/30 rounded-full animate-bounce-soft"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-secondary/20 rounded-full animate-pulse-gentle"></div>
                    <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-darkGreen rounded-full opacity-30 animate-float-gentle"></div>
                    <div className="absolute top-10 right-1/2 w-3 h-3 bg-primary/25 rounded-full animate-spin-slow"></div>
                    
                    {/* Partículas pequeñas */}
                    <div className="absolute top-1/3 left-10 w-1 h-1 bg-lightGreen rounded-full opacity-40 animate-pulse-gentle"></div>
                    <div className="absolute bottom-20 right-10 w-1 h-1 bg-secondary rounded-full opacity-35 animate-bounce-soft"></div>
                    <div className="absolute top-2/3 right-20 w-1 h-1 bg-primary rounded-full opacity-45 animate-float-gentle"></div>
                    <div className="absolute bottom-60 left-1/2 w-1 h-1 bg-darkBlue rounded-full opacity-30 animate-spin-slow"></div>
                    <div className="absolute top-80 left-20 w-1 h-1 bg-lightGreen rounded-full opacity-35 animate-pulse-gentle"></div>
                    
                    {/* Formas geométricas sutiles */}
                    <div className="absolute top-1/2 left-5 w-8 h-1 bg-primary/10 rounded-full animate-pulse-gentle"></div>
                    <div className="absolute bottom-1/3 right-5 w-1 h-8 bg-lightGreen/10 rounded-full animate-float-gentle"></div>
                    <div className="absolute top-20 right-1/4 w-6 h-1 bg-secondary/15 rounded-full animate-bounce-soft"></div>
                </div>
                
                <div className="relative w-full max-w-md mx-auto">
                    {/* Tarjeta principal */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center transform animate-fade-in-up">
                        {/* Icono de éxito */}
                        <div className="relative mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary to-lightGreen rounded-full flex items-center justify-center mx-auto shadow-lg animate-glow-pulse">
                                <IoCheckmarkCircleOutline className="text-white text-5xl" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-darkGreen rounded-full flex items-center justify-center">
                                <BsShieldCheck className="text-white text-sm" />
                            </div>
                        </div>

                        {/* Título */}
                        <h1 className="text-2xl font-bold text-secondary mb-2">
                            ¡Asistencia Registrada!
                        </h1>
                        <p className="text-darkGray mb-6">
                            Tu asistencia ha sido registrada exitosamente
                        </p>

                        {/* Información del registro */}
                        <div className="bg-gradient-to-r from-primary/5 to-lightGreen/5 rounded-2xl p-4 mb-6 border border-primary/10">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-darkGray font-medium">Estudiante ID:</span>
                                    <span className="text-secondary font-bold">{studentId || qrResult || documentNumber}</span>
                                </div>
                                
                                {studentEmail && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-darkGray font-medium">Email:</span>
                                        <span className="text-secondary font-semibold truncate ml-2">{studentEmail}</span>
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-darkGray font-medium">Fecha:</span>
                                    <span className="text-secondary font-semibold">{formattedDate}</span>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-darkGray font-medium">Hora:</span>
                                    <span className="text-secondary font-semibold">{formattedTime}</span>
                                </div>
                                
                                {competenceQuarterId && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-darkGray font-medium">Competencia:</span>
                                        <span className="text-secondary font-semibold">{competenceQuarterId}</span>
                                    </div>
                                )}
                            </div>
                            
                            {studentId && (
                                <div className="mt-4 p-3 bg-gradient-to-r from-lightGreen/10 to-primary/10 rounded-xl border border-lightGreen/20">
                                    <p className="text-sm text-darkGreen font-medium flex items-center justify-center">
                                        <IoMailOutline className="mr-2" />
                                        Asistencia automática vía email
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-center text-sm text-grayText">
                            <IoTimeOutline className="mr-2" />
                            Esta ventana se cerrará automáticamente...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Partículas animadas de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Partículas grandes */}
                <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full opacity-20 animate-float-gentle"></div>
                <div className="absolute top-40 right-20 w-3 h-3 bg-lightGreen rounded-full opacity-30 animate-bounce-soft"></div>
                <div className="absolute bottom-32 left-20 w-5 h-5 bg-secondary rounded-full opacity-15 animate-pulse-gentle"></div>
                <div className="absolute top-60 left-1/3 w-2 h-2 bg-darkBlue rounded-full opacity-25 animate-spin-slow"></div>
                <div className="absolute bottom-40 right-1/4 w-6 h-6 bg-primary/20 rounded-full opacity-40 animate-float-gentle"></div>
                <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-lightGreen/25 rounded-full opacity-35 animate-bounce-soft"></div>
                
                {/* Partículas medianas */}
                <div className="absolute top-1/4 right-10 w-3 h-3 bg-lightGreen/30 rounded-full animate-bounce-soft"></div>
                <div className="absolute bottom-1/4 left-1/4 w-4 h-4 bg-secondary/20 rounded-full animate-pulse-gentle"></div>
                <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-darkGreen rounded-full opacity-30 animate-float-gentle"></div>
                <div className="absolute top-10 right-1/2 w-3 h-3 bg-primary/25 rounded-full animate-spin-slow"></div>
                <div className="absolute bottom-60 left-10 w-4 h-4 bg-lightGreen/20 rounded-full animate-pulse-gentle"></div>
                
                {/* Partículas pequeñas */}
                <div className="absolute top-1/3 left-10 w-1 h-1 bg-lightGreen rounded-full opacity-40 animate-pulse-gentle"></div>
                <div className="absolute bottom-20 right-10 w-1 h-1 bg-secondary rounded-full opacity-35 animate-bounce-soft"></div>
                <div className="absolute top-2/3 right-20 w-1 h-1 bg-primary rounded-full opacity-45 animate-float-gentle"></div>
                <div className="absolute bottom-60 left-1/2 w-1 h-1 bg-darkBlue rounded-full opacity-30 animate-spin-slow"></div>
                <div className="absolute top-80 left-20 w-1 h-1 bg-lightGreen rounded-full opacity-35 animate-pulse-gentle"></div>
                <div className="absolute top-40 left-1/2 w-1 h-1 bg-secondary rounded-full opacity-40 animate-float-gentle"></div>
                
                {/* Formas geométricas sutiles */}
                <div className="absolute top-1/2 left-5 w-8 h-1 bg-primary/10 rounded-full animate-pulse-gentle"></div>
                <div className="absolute bottom-1/3 right-5 w-1 h-8 bg-lightGreen/10 rounded-full animate-float-gentle"></div>
                <div className="absolute top-20 right-1/4 w-6 h-1 bg-secondary/15 rounded-full animate-bounce-soft"></div>
                <div className="absolute bottom-20 left-1/3 w-1 h-6 bg-primary/12 rounded-full animate-spin-slow"></div>
                
                {/* Ondas sutiles */}
                <div className="absolute top-1/4 left-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent rounded-full animate-pulse-gentle"></div>
                <div className="absolute bottom-1/4 right-1/2 w-10 h-1 bg-gradient-to-r from-transparent via-lightGreen/10 to-transparent rounded-full animate-float-gentle"></div>
            </div>

            {/* Header con información de sesión */}
            <div className="relative z-10 pt-8 pb-4">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-secondary/90 backdrop-blur-md rounded-2xl p-4 border border-secondary/20 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-lightGreen rounded-xl flex items-center justify-center shadow-lg">
                                    <BsQrCodeScan className="text-white text-xl" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">Registro de Asistencia</h1>
                                    <p className="text-lightGray text-sm">{dayName}, {formattedDate}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">{formattedTime}</div>
                                <div className="text-sm text-lightGray">Hora actual</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-lg mx-auto">
                    {/* Tarjeta principal */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 p-8 transform animate-fade-in-up">
                        
                        {/* Icono y descripción */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-lightGreen rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <BsCameraFill className="text-white text-2xl" />
                            </div>
                            <h2 className="text-xl font-bold text-secondary mb-2">
                                {studentId ? 'Confirma tu Asistencia' : 'Registra tu Asistencia'}
                            </h2>
                            <p className="text-darkGray text-sm">
                                {studentId 
                                    ? 'Tu información ha sido pre-cargada desde el email' 
                                    : 'Escanea tu QR personal o ingresa tu documento manualmente'
                                }
                            </p>
                            
                            {studentId && (
                                <div className="mt-4 p-3 bg-gradient-to-r from-lightGreen/10 to-primary/10 rounded-xl border border-lightGreen/20">
                                    <p className="text-sm text-darkGreen font-medium flex items-center justify-center">
                                        <BsShieldCheck className="mr-2" />
                                        Estudiante identificado automáticamente
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Email del estudiante */}
                        {studentEmail && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-secondary mb-2">Email del estudiante</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={studentEmail}
                                        disabled
                                        className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-lightGreen/30 bg-lightGreen/5 text-darkGreen font-medium focus:outline-none"
                                        placeholder="Email del estudiante"
                                    />
                                    <IoMailOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lightGreen text-xl" />
                                </div>
                            </div>
                        )}

                        {/* Cámara QR - Solo mostrar si no tenemos studentId */}
                        {isScanning && !studentId && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-secondary mb-2">Escanea tu QR</label>
                                <div className="relative">
                                    <div className="relative overflow-hidden rounded-2xl border-4 border-dashed border-primary/30 bg-primary/5">
                                        <Webcam
                                            ref={webcamRef}
                                            screenshotFormat="image/png"
                                            className="w-full h-64 object-cover"
                                            videoConstraints={{
                                                width: 1280,
                                                height: 720,
                                                facingMode: cameraFacing === 'environment' ? { exact: "environment" } : "user"
                                            }}
                                            onUserMediaError={(error) => {
                                                console.error('Error accessing camera:', error);
                                                // Si la cámara trasera no está disponible, cambiar a frontal
                                                if (cameraFacing === 'environment') {
                                                    console.log('Switching to front camera...');
                                                    setCameraFacing('user');
                                                    toast.warning('Cámara trasera no disponible, usando cámara frontal');
                                                } else {
                                                    toast.error('No se pudo acceder a la cámara');
                                                }
                                            }}
                                        />
                                        {/* Marcos de escaneo */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="relative w-48 h-48 border-2 border-primary rounded-2xl">
                                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center text-sm text-primary mt-2 font-medium">
                                        Centra el código QR en el marco
                                    </p>
                                    
                                    {/* Botón para cambiar cámara */}
                                    <div className="flex justify-center mt-3">
                                        <button
                                            onClick={() => {
                                                setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
                                                toast.info(`Cambiando a cámara ${cameraFacing === 'environment' ? 'frontal' : 'trasera'}`);
                                            }}
                                            className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg text-sm font-medium hover:bg-secondary/20 transition-colors"
                                        >
                                            📷 Cambiar cámara ({cameraFacing === 'environment' ? 'Trasera' : 'Frontal'})
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Información del estudiante identificado automáticamente */}
                        {studentId && (
                            <div className="mb-6 p-6 bg-gradient-to-r from-primary/5 to-lightGreen/5 rounded-2xl border border-primary/10">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-lightGreen rounded-xl flex items-center justify-center">
                                        <IoPersonCircleOutline className="text-white text-2xl" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-secondary">Estudiante Identificado</p>
                                        <p className="text-sm text-darkGray">ID: {studentId}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    {studentEmail && (
                                        <div className="bg-white/50 rounded-lg p-3">
                                            <p className="text-sm text-darkGray">
                                                <strong>Email:</strong> {studentEmail}
                                            </p>
                                        </div>
                                    )}
                                    <div className="bg-white/50 rounded-lg p-3">
                                        <p className="text-sm text-darkGray">
                                            <strong>Fecha:</strong> {formattedDate}
                                        </p>
                                        <p className="text-sm text-darkGray">
                                            <strong>Hora:</strong> {formattedTime}
                                        </p>
                                        {competenceQuarterId && (
                                            <p className="text-sm text-darkGray">
                                                <strong>Competencia:</strong> {competenceQuarterId}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* QR Detectado */}
                        {qrResult && !studentId && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-lightGreen/10 to-primary/10 rounded-xl border border-lightGreen/20">
                                <div className="flex items-center space-x-3">
                                    <IoCheckmarkCircleOutline className="text-lightGreen text-2xl" />
                                    <div>
                                        <p className="font-semibold text-darkGreen">QR Detectado Exitosamente</p>
                                        <p className="text-sm text-darkGray">Documento: {qrResult}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Campo Número de Documento */}
                        {!studentId && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-secondary mb-2">Número de Documento</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={qrResult || documentNumber}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocumentNumber(e.target.value)}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-lightGray focus:border-primary focus:outline-none transition-colors bg-white"
                                        placeholder="Ingresa tu número de documento"
                                        disabled={!!qrResult}
                                    />
                                    <IoPersonCircleOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-grayText text-xl" />
                                </div>
                            </div>
                        )}

                        {/* Campo Día */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-secondary mb-2">Día de la semana</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={dayName}
                                    disabled
                                    className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-lightGray bg-gray-50 text-darkGray"
                                    placeholder="Día"
                                />
                                <IoCalendarOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-grayText text-xl" />
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="space-y-3">
                            <button
                                onClick={handleSubmit}
                                disabled={loading || (!studentId && !qrResult && !documentNumber.trim())}
                                className={`w-full h-12 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                                    loading || (!studentId && !qrResult && !documentNumber.trim())
                                        ? 'bg-lightGray text-grayText cursor-not-allowed transform-none' 
                                        : studentId 
                                            ? 'bg-gradient-to-r from-lightGreen to-darkGreen text-white hover:shadow-xl'
                                            : 'bg-gradient-to-r from-primary to-lightGreen text-white hover:shadow-xl'
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Registrando...</span>
                                    </div>
                                ) : (
                                    studentId ? 'Confirmar Asistencia' : 'Registrar Asistencia'
                                )}
                            </button>
                            
                            {qrResult && !studentId && (
                                <button
                                    onClick={() => {
                                        setQrResult('');
                                        setIsScanning(true);
                                    }}
                                    className="w-full h-10 rounded-xl border-2 border-primary text-primary font-medium hover:bg-primary/5 transition-all"
                                >
                                    Escanear Otro QR
                                </button>
                            )}

                            {studentId && (
                                <div className="text-center">
                                    <p className="text-sm text-grayText flex items-center justify-center">
                                        <IoMailOutline className="mr-2" />
                                        Asistencia automática desde tu correo electrónico
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormularioQr;