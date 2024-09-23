import React, { useState } from 'react';
import { Header } from "../components/header";
import { SlBookOpen } from "react-icons/sl";
import { CgFileDocument } from "react-icons/cg";
import { BsFillFilePersonFill } from "react-icons/bs";
import { IoPersonCircleOutline } from "react-icons/io5";
import { updateAttendance, createAttendance } from "../services/attendances"; 

const FormularioQr = () => {
    const [documentNumber, setDocumentNumber] = useState("");
    const [isUpdating, setIsUpdating] = useState(false); // Estado para saber si estamos actualizando

    const handleSubmit = async () => {
        try {
            const attendanceData = {
                documentNumber: documentNumber,
                attendance_state: 'PRESENTE', 
                attendance_date: new Date(),
            };

            if (isUpdating) {
                await updateAttendance(attendanceData); // Llama a updateAttendance si está en modo actualización
                alert('Asistencia actualizada con éxito');
            } else {
                await createAttendance(attendanceData); // Llama a createAttendance si está en modo creación
                alert('Asistencia registrada con éxito');
            }

            setDocumentNumber(""); 
        } catch (error) {
            console.error('Error al enviar asistencia:', error);
            alert('Error al registrar asistencia');
        }
    };

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
                    <span className="text-center text-base font-medium">Disfruta tu clase</span>
                </div>
                
                <div className="relative w-full mb-4">
                    <input type="text" className="flex h-14 w-full rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4 pl-12" placeholder='Componente (Default)' />
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400">
                        <SlBookOpen />
                    </div>
                </div>

                <div className="relative w-full mb-4">
                    <input type="text" className="flex h-14 w-full rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4 pl-12" placeholder='Ficha (Default)' />
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400">
                        <CgFileDocument />
                    </div>
                </div>

                <div className="relative w-full mb-4">
                    <input type="text" className="flex h-14 w-full rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4 pl-12" placeholder='Tipo de Documento' />
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400">
                        <BsFillFilePersonFill />
                    </div>
                </div>

                <div className="relative w-full mb-6">
                    <input
                        type="text"
                        value={documentNumber}
                        onChange={(e) => setDocumentNumber(e.target.value)}
                        className="flex h-14 w-full rounded-lg shadow-lg bg-white border-2 border-gray-300 p-4 pl-12"
                        placeholder='Numero de Documento'
                    />
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400">
                        <IoPersonCircleOutline />
                    </div>
                </div>

                <div className="text-center">
                    <button onClick={handleSubmit} className='font-inter bg-custom-blue border-2 border-custom-blue text-white rounded-lg w-full h-10 cursor-pointer'>
                        {isUpdating ? 'Actualizar Asistencia' : 'Enviar Asistencia'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormularioQr;
