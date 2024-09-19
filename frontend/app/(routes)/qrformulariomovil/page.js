// "use client"

// import React from "react";
// import FormularioQr from "../../components/formularioQr";

// const QrFormularioMovil = () => {
//     return (
//         <div>
//             <FormularioQr />

//         </div>
//     )
// };
// export default QrFormularioMovil;

"use client";

import React, { useState, useEffect } from "react";
import FormularioQr from "../../components/formularioQr";
import { getAllApprentices } from "../../services/apprenticeService"; // Asegúrate de que la ruta sea correcta

const QrFormularioMovil = () => {
    const [apprentices, setApprentices] = useState([]);
    const [attendanceData, setAttendanceData] = useState(null);

    useEffect(() => {
        const fetchApprentices = async () => {
            try {
                const apprenticesData = await getAllApprentices();
                const updatedApprentices = apprenticesData.map(apprentice => ({
                    ...apprentice,
                    weeks: Array(4).fill(null).map(() => 
                        Array(7).fill(null).map((_, dayIndex) => 
                            (dayIndex === 5 || dayIndex === 6) ? '' : 'A'
                        )
                    ),
                }));
                setApprentices(updatedApprentices);
            } catch (error) {
                console.error('Error al obtener la lista de aprendices:', error);
            }
        };

        fetchApprentices();
    }, []);

    const updateAttendance = (documentNumber) => {
        const updatedApprentices = apprentices.map(apprentice => {
            if (apprentice.documentNumber === documentNumber) {
                const currentDay = new Date().getDay(); 
                const currentWeek = 0; 

                apprentice.weeks[currentWeek][currentDay] = '✓';
            }
            return apprentice;
        });

        setApprentices(updatedApprentices);
        setAttendanceData(documentNumber); // Guardar el número de documento en el estado
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Escanear QR
                </h1>
                {/* Pasamos la función updateAttendance como prop */}
                <FormularioQr updateAttendance={updateAttendance} />
            </div>
            {attendanceData && (
                <div className="mt-4 text-center">
                    {/* Mostrar un mensaje de éxito o cualquier lógica */}
                    <p className="text-lg text-green-600">
                        Asistencia registrada para el documento: {attendanceData}
                    </p>
                </div>
            )}
        </div>
    );
};

export default QrFormularioMovil;

