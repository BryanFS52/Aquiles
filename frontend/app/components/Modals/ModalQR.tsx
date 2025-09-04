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
            <div className="flex flex-col items-center">
                <div className="w-56 h-56 sm:w-72 sm:h-72 mb-4">
                    {data?.qrCodeBase64 ? (
                        <Image
                            src={`data:image/png;base64,${data.qrCodeBase64}`}
                            alt="QR Code"
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <BsQrCode className="w-full h-full text-gray-500" />
                    )}
                </div>
                <span className="text-xl sm:text-2xl font-medium font-inter mb-2">Duración del QR</span>
                <span className="text-xl sm:text-2xl font-medium font-inter mb-6">{formatTime(timer)}</span>
                <div className="flex gap-4">
                    <button
                        className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-600"
                        onClick={handleClose}
                    >
                        Cerrar
                    </button>
                    <button
                        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-600"
                        onClick={sendAttendanceEmail}
                        disabled={loading}
                    >
                        Enviar Correo
                    </button>
                </div>
                {error && <span className="text-red-500 mt-4">{error.message}</span>}
            </div>
        </Modal>
    );
};

export default ModalQR;
