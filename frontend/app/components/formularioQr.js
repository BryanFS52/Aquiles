'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Header } from "@components/UI/header";
import { IoPersonCircleOutline, IoCalendarOutline } from "react-icons/io5";
import Webcam from "react-webcam";
import jsQR from "jsqr";

// Función para obtener nombre del día en español
const getDayName = (date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[date.getDay()];
};

const FormularioQr = () => {
    const [documentNumber, setDocumentNumber] = useState('');
    const [attendanceId] = useState(1);
    const [loading, setLoading] = useState(false);
    const [attendanceUpdated, setAttendanceUpdated] = useState(false);
    const [qrResult, setQrResult] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const webcamRef = useRef(null);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const attendanceData = {
                attendance_id: attendanceId,
                attendance_date: currentDate.toISOString(),
                documentNumber: qrResult || documentNumber,
                fk_stateAttendance: { stateAttendanceId: 2 }
            };

            await updateAttendanceState(attendanceData);

            alert('Asistencia actualizada con éxito');
            setAttendanceUpdated(true);
            setDocumentNumber('');
            setQrResult('');
        } catch (error) {
            console.error('Error al enviar asistencia:', error);
            alert('Error al registrar asistencia');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                            }
                        }
                    };
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = currentDate.toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    const dayName = getDayName(currentDate);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header ahora ocupa todo el ancho */}
            <Header />

            <div className="flex flex-col items-center justify-center flex-1 p-6">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-custom-blue">¡Hora de tomar la asistencia aprendiz!</h1>
                </div>

                <div className="flex flex-col w-full max-w-md bg-white p-6 rounded-2xl shadow-2xl border border-gray-300">
                    <div className="text-center mb-6">
                        <span className="text-lg font-medium text-gray-700">Escanea tu QR o ingresa manualmente</span>
                    </div>

                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        className="w-full rounded-xl border-2 border-gray-300 mb-6"
                    />

                    {/* Campo Número de Documento */}
                    <div className="relative w-full mb-4">
                        <input
                            type="text"
                            value={qrResult || documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            className="flex h-14 w-full rounded-xl border-2 border-gray-300 px-12 shadow focus:outline-none focus:border-custom-blue"
                            placeholder="Número de Documento"
                        />
                        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-2xl">
                            <IoPersonCircleOutline />
                        </div>
                    </div>

                    {/* Campo Día */}
                    <div className="relative w-full mb-4">
                        <input
                            type="text"
                            value={dayName}
                            disabled
                            className="flex h-14 w-full rounded-xl border-2 border-gray-300 px-12 shadow bg-gray-100 text-gray-700"
                            placeholder="Día"
                        />
                        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-2xl">
                            <IoCalendarOutline />
                        </div>
                    </div>

                    {/* Campo Fecha */}
                    <div className="relative w-full mb-6">
                        <input
                            type="text"
                            value={formattedDate}
                            disabled
                            className="flex h-14 w-full rounded-xl border-2 border-gray-300 px-12 shadow bg-gray-100 text-gray-700"
                            placeholder="Fecha"
                        />
                        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 text-2xl">
                            <IoCalendarOutline />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full h-12 rounded-xl text-white font-semibold transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-custom-blue hover:bg-blue-700'
                            }`}
                    >
                        {loading ? 'Cargando...' : 'Actualizar Asistencia'}
                    </button>

                    {attendanceUpdated && (
                        <div className="mt-6 text-center">
                            <span className="text-green-600 text-3xl font-bold">✓</span>
                            <p className="text-green-600 mt-2">¡Asistencia registrada!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormularioQr;