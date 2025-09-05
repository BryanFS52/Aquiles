"use client";

import React, { useEffect, useState } from "react";
import { BsQrCode } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@redux/store";
import { generateQrCode } from "@redux/slices/generateQrSlice";
import Modal from "@components/UI/Modal";

interface ModalQRProps {
    isOpen: boolean;
    onClose: () => void;
}

const apprenticeEmail = "caceresgabriel305@gmail.com";

const ModalQR: React.FC<ModalQRProps> = ({ isOpen, onClose }) => {
    const [timer, setTimer] = useState(900);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector((state: RootState) => state.generateQr);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        dispatch(generateQrCode({}));
        setShowModal(true);
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push("/AprendicesList");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isOpen, dispatch, router]);

    const handleClose = () => {
        setShowModal(false);
        setTimeout(() => {
            onClose();
            setTimer(900);
        }, 300);
    };

    // Placeholder para integración GraphQL de envío de correo
    const sendAttendanceEmail = async () => {
        if (!data?.qrCodeBase64) {
            toast.error("No hay imagen QR generada.");
            return;
        }
        toast.info("Función de envío de correo por GraphQL pendiente de integración.");
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Código QR Para la Toma de Asistencia" size="md">
            <div className="flex flex-col items-center px-2 sm:px-0">
                {/* Espaciado más sutil para separar el botón de cerrar del título */}
                <div className="h-1 sm:h-2"></div>
                <div className="w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 mb-3 sm:mb-4 flex items-center justify-center">
                    {data?.qrCodeBase64 ? (
                        <Image
                            src={`data:image/png;base64,${data.qrCodeBase64}`}
                            alt="QR Code"
                            width={300}
                            height={300}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <BsQrCode className="w-24 h-24 sm:w-full sm:h-full text-gray-500" />
                    )}
                </div>
                <span className="text-base sm:text-xl font-medium font-inter mb-1 sm:mb-2 text-center">Duración del QR</span>
                <span className="text-lg sm:text-2xl font-medium font-inter mb-4 sm:mb-6 text-center">{formatTime(timer)}</span>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto justify-center mt-2">
                    <button
                        className="bg-red-500 text-white font-semibold px-3 py-2 rounded-xl hover:bg-red-600 w-full sm:w-auto"
                        onClick={handleClose}
                    >
                        Cerrar
                    </button>
                    <button
                        className="group relative bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-500/50 active:scale-95 flex items-center justify-center gap-2 min-w-[180px]"
                        onClick={sendAttendanceEmail}
                        disabled={loading}
                    >
                        Enviar Correo
                    </button>
                </div>
                {error && <span className="text-red-500 mt-4 text-center">{error.message}</span>}
            </div>
        </Modal>
    );
};

export default ModalQR;