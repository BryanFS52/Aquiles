"use client";

import React, { useState, useEffect } from "react";
import FormularioQr from "../../components/formularioQr";
import { getAllApprentices } from "../../services/apprenticeService";

const QrFormularioMovil = () => {
    const [apprentices, setApprentices] = useState([]);

    useEffect(() => {
        const fetchApprentices = async () => {
            try {
                const apprenticesData = await getAllApprentices();
                setApprentices(apprenticesData);
            } catch (error) {
                console.error('Error al obtener la lista de aprendices:', error);
            }
        };

        fetchApprentices();
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Escanear QR
                </h1>
                <FormularioQr />
            </div>
        </div>
    );
};

export default QrFormularioMovil;
