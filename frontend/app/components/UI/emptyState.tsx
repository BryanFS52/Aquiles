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
                <div className="relative w-20 h-20 md:w-24 md:h-24 animate-pulse-gentle opacity-70">
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
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 to-transparent rounded-full animate-ping-soft opacity-40"></div>
                </div>

                {/* Texto elegante */}
                <p className="text-xl font-medium text-gray-500 dark:text-gray-300">{message}</p>

                {/* Línea decorativa o mini animación sutil */}
                <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-500/60 rounded-full animate-bounce-soft animation-delay-0"></div>
                    <div className="w-3 h-3 bg-gray-500/70 rounded-full animate-bounce-soft animation-delay-300"></div>
                    <div className="w-2 h-2 bg-slate-600/60 rounded-full animate-bounce-soft animation-delay-600"></div>
                </div>
            </div>
        </div>
    );
};

export default EmptyState;
