"use client";

import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-shadowBlue via-darkBlue to-secondary backdrop-blur-md">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse top-1/4 left-1/4"></div>
                <div className="absolute w-80 h-80 bg-lightGreen/10 rounded-full blur-3xl animate-pulse top-3/4 right-1/4 animation-delay-2000"></div>
                <div className="absolute w-64 h-64 bg-darkGreen/10 rounded-full blur-3xl animate-pulse bottom-1/4 left-1/2 animation-delay-1000"></div>
            </div>

            {/* SENA Logo-inspired animation */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Main rotating rings with SENA colors */}
                <div className="relative w-40 h-40 mb-8">
                    {/* Outer ring - Primary green */}
                    <div className="absolute inset-0 border-4 border-transparent border-t-primary border-r-primary/70 rounded-full animate-spin shadow-lg shadow-primary/30"></div>

                    {/* Middle ring - Light green */}
                    <div className="absolute inset-3 border-4 border-transparent border-t-lightGreen border-l-lightGreen/70 rounded-full animate-spin animation-delay-500 [animation-direction:reverse] shadow-lg shadow-lightGreen/30"></div>

                    {/* Inner ring - Dark green */}
                    <div className="absolute inset-6 border-3 border-transparent border-t-darkGreen border-b-darkGreen/70 rounded-full animate-spin animation-delay-1000 shadow-lg shadow-darkGreen/30"></div>

                    {/* Center SENA-inspired orb */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary via-lightGreen to-darkGreen rounded-full animate-pulse shadow-2xl shadow-primary/50 relative overflow-hidden">
                            {/* Inner glow effect */}
                            <div className="absolute inset-2 bg-gradient-to-br from-primary-light to-lightGreen rounded-full animate-ping opacity-40"></div>

                            {/* SENA-style center dot */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-white rounded-full shadow-lg animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating institutional elements */}
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-lg shadow-primary/50 [animation-delay:-0.4s]"></div>
                    <div className="w-4 h-4 bg-lightGreen rounded-full animate-bounce shadow-lg shadow-lightGreen/50 [animation-delay:-0.2s]"></div>
                    <div className="w-5 h-5 bg-gradient-to-r from-primary to-lightGreen rounded-full animate-bounce shadow-lg shadow-primary/50"></div>
                    <div className="w-4 h-4 bg-darkGreen rounded-full animate-bounce shadow-lg shadow-darkGreen/50 [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-primary-light rounded-full animate-bounce shadow-lg shadow-primary/50 [animation-delay:-0.5s]"></div>
                </div>

                {/* SENA-themed loading text */}
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-lightGreen to-darkGreen bg-clip-text text-transparent animate-pulse mb-2 font-kiwi-marumaru">
                        SENA
                    </h2>
                    <p className="text-lightGray text-xl font-medium animate-pulse font-inter">
                        Cargando tu experiencia educativa...
                    </p>
                </div>

                {/* Institutional progress indicators */}
                <div className="flex space-x-2 mb-6">
                    <div className="w-16 h-2 bg-shadowBlue/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-lightGreen rounded-full animate-pulse transform origin-left scale-x-75 animation-delay-0"></div>
                    </div>
                    <div className="w-16 h-2 bg-shadowBlue/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-lightGreen to-darkGreen rounded-full animate-pulse transform origin-left scale-x-50 animation-delay-500"></div>
                    </div>
                    <div className="w-16 h-2 bg-shadowBlue/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-darkGreen to-primary rounded-full animate-pulse transform origin-left scale-x-25 animation-delay-1000"></div>
                    </div>
                </div>

                {/* Inspirational SENA message */}
                <div className="text-center">
                    <p className="text-grayText text-sm font-inter opacity-80 animate-pulse">
                        "Conocimiento en tecnología para todos"
                    </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-20 -left-20 w-32 h-32 border-2 border-primary/20 rounded-full animate-spin animation-delay-2000"></div>
                <div className="absolute -bottom-20 -right-20 w-24 h-24 border-2 border-lightGreen/20 rounded-full animate-spin [animation-direction:reverse] animation-delay-1500"></div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .animation-delay-0 {
                    animation-delay: 0s;
                }
                
                .animation-delay-500 {
                    animation-delay: 0.5s;
                }
                
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                
                .animation-delay-1500 {
                    animation-delay: 1.5s;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animate-spin {
                    animation: spin 3s linear infinite;
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                
                .animate-float {
                    animation: float 2.5s ease-in-out infinite;
                }
                
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .animate-shimmer {
                    animation: shimmer 2s ease-in-out infinite;
                }
                
                @keyframes scale-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                .animate-scale-pulse {
                    animation: scale-pulse 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Loader;