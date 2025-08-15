import React, { useEffect } from "react";
import { X } from "lucide-react";
import { ModalProps, ModalSize } from "./types";

const sizeMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    xxl: "max-w-2xl",
    xxxl: "max-w-3xl",
};

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    size = "md",
    children,
    className = "",
}) => {
    // Por ahora usamos false como valor por defecto hasta implementar el contexto
    const isDarkMode = false;

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    let modalSize = sizeMap[size] || "max-w-lg";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center h-full p-4 transition-all duration-300 ease-out bg-black/60 backdrop-blur-xs">
            <div
                className={`w-full transform rounded-3xl shadow-2xl transition-all duration-500 ease-out ${isDarkMode
                    ? "border border-slate-700/50 bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 text-slate-100"
                    : "border border-gray-200/80 bg-gradient-to-br from-white via-white to-gray-50 text-gray-800"
                    } ${modalSize} animate-in slide-in-from-bottom-4 fade-in duration-300 hover:shadow-xl ${className}`}
            >
                {/* Header premium */}
                <div
                    className={`flex items-center justify-between p-6 pb-4 ${title ? "border-opacity-20 border-b" : ""} ${isDarkMode ? "border-slate-700/50" : "border-gray-200/60"}`}
                >
                    {title && (
                        <div className="flex items-center space-x-3">
                            <div
                                className={`h-8 w-1 rounded-full ${isDarkMode
                                    ? "bg-gradient-to-b from-[#00304D] to-[#005386]"
                                    : "bg-gradient-to-b from-lime-500 to-lime-600"
                                    } `}
                            />
                            <h2
                                className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-slate-100 drop-shadow-sm" : "text-gray-900"
                                    } `}
                            >
                                {title}
                            </h2>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className={`group relative rounded-xl p-2.5 transition-all duration-200 ${isDarkMode
                            ? "hover:bg-slate-700/70 hover:shadow-lg hover:shadow-slate-900/20 active:bg-slate-600/80"
                            : "hover:bg-gray-100/80 hover:shadow-lg hover:shadow-gray-900/10 active:bg-gray-200/60"
                            } hover:ring-opacity-20 transform ring-0 hover:scale-105 hover:ring-2 active:scale-95 ${isDarkMode ? "hover:ring-blue-400" : "hover:ring-lime-500"} `}
                        aria-label="Cerrar modal"
                    >
                        <X
                            className={`h-6 w-6 transition-all duration-200 ${isDarkMode
                                ? "text-slate-400 group-hover:text-slate-200"
                                : "text-gray-500 group-hover:text-gray-700"
                                } group-hover:rotate-90`}
                        />
                        {/* Efecto de hover sutil */}
                        <div
                            className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${isDarkMode
                                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                                : "bg-gradient-to-r from-lime-500/5 to-lime-500/5"
                                } `}
                        />
                    </button>
                </div>

                {/* Contenido con mejor spacing y efectos */}
                <div className={`px-6 pb-6 ${title ? "pt-4" : "pt-2"} relative`}>
                    {/* Contenido principal */}
                    <div className="relative z-10">{children}</div>

                    {/* Efecto de iluminación sutil en el fondo */}
                    <div
                        className={`absolute top-0 left-1/2 h-32 w-96 -translate-x-1/2 transform opacity-30 blur-3xl ${isDarkMode
                            ? "bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20"
                            : "bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-blue-400/10"
                            } `}
                    />
                </div>

                {/* Borde interior sutil para más elegancia */}
                <div
                    className={`pointer-events-none absolute inset-0 rounded-3xl ${isDarkMode
                        ? "ring-1 ring-white/10 ring-inset"
                        : "ring-1 ring-black/5 ring-inset"
                        } `}
                />
            </div>
        </div>
    );
};

export default Modal;
