"use client";

import Image from "next/image";
import React from "react";

type EmptyStateProps = {
    message?: string;
    icon?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
    message = "No se encontraron resultados.",
    icon = "/img/LogoAquilesWhite.png",
}) => {
    return (
        <div className="min-h-[60vh] flex items-center justify-center text-center bg-transparent">
            <div className="flex flex-col items-center space-y-6 px-4">
                {/* Icono o imagen sutil */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 animate-simple-pulse opacity-70">
                    <div className="dark:hidden">
                        <Image
                            src={icon}
                            alt="Empty Icon"
                            fill
                            style={{ objectFit: "contain", filter: "invert(1)" }}
                            priority
                        />
                    </div>
                    <div className="hidden dark:block">
                        <Image
                            src={icon}
                            alt="Empty Icon"
                            fill
                            style={{ objectFit: "contain" }}
                            priority
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-transparent rounded-full animate-simple-ping opacity-40"></div>
                </div>

                {/* Texto elegante */}
                <p className="text-xl font-medium text-gray-500 dark:text-dark-textSecondary">{message}</p>

                {/* Línea decorativa o mini animación sutil */}
                <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-500/60 rounded-full animate-simple-bounce"></div>
                    <div className="w-3 h-3 bg-gray-500/70 rounded-full animate-simple-bounce" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-2 h-2 bg-slate-600/60 rounded-full animate-simple-bounce" style={{ animationDelay: '0.6s' }}></div>
                </div>
            </div>

            <style jsx>{`
                @keyframes simple-pulse {
                    0%, 100% {
                        opacity: 0.7;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.02);
                    }
                }

                @keyframes simple-ping {
                    75%, 100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }

                @keyframes simple-bounce {
                    0%, 20%, 53%, 80%, 100% {
                        transform: translate3d(0, 0, 0);
                    }
                    40%, 43% {
                        transform: translate3d(0, -5px, 0);
                    }
                    70% {
                        transform: translate3d(0, -3px, 0);
                    }
                    90% {
                        transform: translate3d(0, -1px, 0);
                    }
                }

                .animate-simple-pulse {
                    animation: simple-pulse 3s ease-in-out infinite;
                }

                .animate-simple-ping {
                    animation: simple-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                .animate-simple-bounce {
                    animation: simple-bounce 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default EmptyState;
