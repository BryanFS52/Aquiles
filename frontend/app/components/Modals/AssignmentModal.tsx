"use client";

import React from "react";
import { FaPlus, FaLayerGroup } from "react-icons/fa";

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-lightGreen p-6 text-white">
                    <h3 className="text-2xl font-bold flex items-center space-x-3">
                        <FaPlus className="text-xl" />
                        <span>Nueva Asignación Múltiple</span>
                    </h3>
                    <p className="text-white/90 mt-1">Asigna múltiples fichas técnicas a un instructor</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="text-center py-12 text-darkGray">
                        <FaLayerGroup className="mx-auto text-6xl text-primary/20 mb-4" />
                        <p className="text-lg mb-2">Formulario de asignación múltiple</p>
                        <p className="text-sm">Aquí iría el formulario completo para la asignación</p>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            className="px-6 py-3 border border-gray-300 text-darkGray rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-primary to-lightGreen text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                            onClick={onSubmit}
                        >
                            Asignar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};