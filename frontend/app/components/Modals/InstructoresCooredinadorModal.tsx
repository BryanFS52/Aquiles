'use client'

import React, { ReactNode } from "react"

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-[#0b1f33] p-6 rounded-lg shadow-xl max-w-md w-full">
            {children}
            <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#00324d] text-white rounded hover:bg-[#40b003] transition-colors"
            >
                Cerrar
            </button>
        </div>
    </div>
)

export default Modal;