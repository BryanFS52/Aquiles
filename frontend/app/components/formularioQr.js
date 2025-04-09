import React, { useState, useRef, useEffect } from 'react';
import { Header } from "@components/header"; 
import { IoPersonCircleOutline } from "react-icons/io5"; 
import { updateAttendanceState } from "@services/attendances";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const FormularioQr = () => {
    const [documentNumber, setDocumentNumber] = useState("");
    const [attendanceId] = useState(1); 
    const [loading, setLoading] = useState(false); 
    const [attendanceUpdated, setAttendanceUpdated] = useState(false);
    const [qrResult, setQrResult] = useState("");
    const webcamRef = useRef(null);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const currentDate = new Date().toISOString(); 
            const attendanceData = {
                attendance_id: attendanceId, 
                attendance_date: currentDate,
                documentNumber: qrResult || documentNumber,
                fk_stateAttendance: { stateAttendanceId: 2 }
            };
    
            await updateAttendanceState(attendanceData); 
    
            alert('Asistencia actualizada con éxito');
            setAttendanceUpdated(true);
    
            setDocumentNumber(""); 
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
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const img = new Image();
                    img.src = imageSrc;
    
                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0, img.width, img.height);
                        const imageData = ctx.getImageData(0, 0, img.width, img.height);
                        const code = jsQR(imageData.data, img.width, img.height);
    
                        if (code) {
                            setQrResult(code.data);
                        }
                    };
                }
            }
        }, 1000);
    
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-md mb-4">
                <Header />
            </div>

            <div className="text-center mb-8">
                <h1 className='text-custom-blue font-inter font-semibold text-xl'>¡Hora de tomar la asistencia aprendiz!</h1>
            </div>

            <div className="flex flex-col h-auto w-full max-w-md rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4">
                <div className="flex justify-center mb-4">
                    <span className="text-center text-base font-medium">Escanea tu código QR o ingresa manualmente</span>
                </div>
                
                <Webcam ref={webcamRef} screenshotFormat="image/png" className="mb-4 w-full rounded-lg border-2" />
                
                <div className="relative w-full mb-4">
                    <input 
                        type="text" 
                        value={qrResult || documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                        className="flex h-14 w-full rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4 pl-12" 
                        placeholder='Número de Documento'
                    />
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400">
                        <IoPersonCircleOutline />
                    </div>
                </div>

                <div className="text-center">
                    <button onClick={handleSubmit} className='font-inter bg-custom-blue border-2 border-custom-blue text-white rounded-lg w-full h-10 cursor-pointer' disabled={loading}>
                        {loading ? 'Cargando...' : 'Actualizar Asistencia'}
                    </button>
                </div>
                {attendanceUpdated && (
                    <div className="mt-4 text-center text-green-600">
                        <span className="text-2xl">✓</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormularioQr;
