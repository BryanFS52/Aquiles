'use client'

import React, { ReactNode } from "react"
import { FaTimes } from "react-icons/fa"

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white dark:bg-shadowBlue p-4 sm:p-6 rounded-xl shadow-xl max-w-md w-full border border-lightGray dark:border-grayText relative">
            {/* Botón cerrar X en la esquina */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-lightGray/50 dark:hover:bg-grayText/20 transition-colors text-grayText dark:text-white hover:text-primary dark:hover:text-secondary"
                aria-label="Cerrar modal"
            >
                <FaTimes className="text-lg sm:text-xl" />
            </button>
            
            {/* Contenido del modal con padding para evitar overlap con el botón X */}
            <div className="pr-8 sm:pr-10">
                {children}
            </div>
        </div>
    </div>
)

export default Modal;