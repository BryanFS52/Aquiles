"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface WelcomeHeroProps {
    userName?: string;
    userRole?: string;
    logoSrc?: string;
}

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
    trend?: string;
    trendUp?: boolean;
}

interface QuickActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    onClick?: () => void;
    href?: string;
}

// Componente Hero de Bienvenida
export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
    userName = "Usuario",
    userRole = "usuario",
    logoSrc = "/img/LogoAquilesWhite.png"
}) => {
    const getRoleWelcomeMessage = () => {
        switch (userRole?.toLowerCase()) {
            case "instructor":
                return "Bienvenido, Instructor";
            case "coordinador":
                return "Bienvenido, Coordinador";
            case "aprendiz":
                return "Bienvenido, Aprendiz";
            default:
                return "Bienvenido";
        }
    };

    const getRoleDescription = () => {
        switch (userRole?.toLowerCase()) {
            case "instructor":
                return "Gestiona tus clases, evalúa a los aprendices y supervisa el progreso académico";
            case "coordinador":
                return "Administra programas, coordina instructores y supervisa el rendimiento general";
            case "aprendiz":
                return "Accede a tus materiales de estudio, revisa tu progreso y mantente al día";
            default:
                return "Explora todas las funcionalidades disponibles para ti";
        }
    };

    return (
        <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
            {/* Animated Background Particles */}
            <div className="absolute inset-0">
                {/* Floating geometric shapes */}
                <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded rotate-45 animate-float-1"></div>
                <div className="absolute top-40 right-20 w-6 h-6 bg-secondary/15 rounded-full animate-float-2"></div>
                <div className="absolute bottom-32 left-20 w-3 h-3 bg-lightGreen/25 rounded rotate-45 animate-float-3"></div>
                <div className="absolute bottom-20 right-16 w-5 h-5 bg-darkBlue/20 rounded-full animate-float-4"></div>
                <div className="absolute top-60 left-1/3 w-2 h-2 bg-primary/30 rounded animate-float-5"></div>
                <div className="absolute bottom-60 right-1/3 w-4 h-4 bg-secondary/20 rounded rotate-45 animate-float-6"></div>
            </div>

            <div className="relative z-10 px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center">
                        {/* Spectacular Logo Animation */}
                        <div className="flex justify-center mb-12">
                            <div className="relative">
                                {/* Outer glowing ring */}
                                <div className="absolute -inset-8 border border-primary/30 rounded-full animate-pulse-ring-outer"></div>
                                {/* Middle ring */}
                                <div className="absolute -inset-6 border border-secondary/25 rounded-full animate-spin-elegant"></div>
                                {/* Inner ring */}
                                <div className="absolute -inset-4 border border-lightGreen/20 rounded-full animate-spin-reverse-elegant"></div>

                                {/* Main logo container */}
                                <div className="relative w-48 h-48 lg:w-56 lg:h-56 animate-breathe">
                                    {/* Orbit particles */}
                                    <div className="absolute inset-0 animate-orbit-1">
                                        <div className="absolute -top-2 left-1/2 w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 shadow-lg"></div>
                                    </div>
                                    <div className="absolute inset-0 animate-orbit-2">
                                        <div className="absolute top-1/2 -right-2 w-2 h-2 bg-secondary rounded-full transform -translate-y-1/2 shadow-lg"></div>
                                    </div>
                                    <div className="absolute inset-0 animate-orbit-3">
                                        <div className="absolute -bottom-2 left-1/2 w-2.5 h-2.5 bg-lightGreen rounded-full transform -translate-x-1/2 shadow-lg"></div>
                                    </div>
                                    <div className="absolute inset-0 animate-orbit-4">
                                        <div className="absolute top-1/2 -left-2 w-2 h-2 bg-darkBlue rounded-full transform -translate-y-1/2 shadow-lg"></div>
                                    </div>

                                    {/* Logo with stunning effects */}
                                    <div className="absolute inset-6 flex items-center justify-center">
                                        <div className="relative w-full h-full rounded-full overflow-hidden backdrop-blur-sm border-2 border-white/20 shadow-2xl animate-logo-glow">
                                            <div className="dark:hidden">
                                                <img
                                                    src={logoSrc}
                                                    alt="Aquiles Logo"
                                                    className="w-full h-full object-contain p-4 animate-logo-pulse"
                                                    style={{ filter: "invert(1) drop-shadow(0 0 20px rgba(57,143,15,0.3))" }}
                                                />
                                            </div>
                                            <div className="hidden dark:block">
                                                <img
                                                    src={logoSrc}
                                                    alt="Aquiles Logo"
                                                    className="w-full h-full object-contain p-4 animate-logo-pulse"
                                                    style={{ filter: "drop-shadow(0 0 20px rgba(57,143,15,0.3))" }}
                                                />
                                            </div>
                                            {/* Shimmer effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-cross"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Welcome Text with Animated Typography */}
                        <div className="space-y-6 animate-fade-in-up">
                            <h1 className="text-5xl lg:text-7xl font-inter font-black text-gray-900 dark:text-white leading-tight animate-text-shimmer">
                                {getRoleWelcomeMessage()}
                            </h1>
                            <h2 className="text-3xl lg:text-4xl font-inter font-light text-primary animate-bounce-name">
                                {userName}
                            </h2>
                            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in-delayed">
                                {getRoleDescription()}
                            </p>
                        </div>

                        {/* Decorative elements */}
                        <div className="flex justify-center mt-12 space-x-4 animate-bounce-gentle">
                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse-dot"></div>
                            <div className="w-4 h-4 bg-secondary rounded-full animate-pulse-dot animation-delay-300"></div>
                            <div className="w-5 h-5 bg-lightGreen rounded-full animate-pulse-dot animation-delay-600"></div>
                            <div className="w-4 h-4 bg-darkBlue rounded-full animate-pulse-dot animation-delay-900"></div>
                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse-dot animation-delay-1200"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de Tarjeta de Estadísticas
export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
    trendUp = true
}) => {
    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && (
                    <div className={`text-sm font-medium ${trendUp ? 'text-lightGreen' : 'text-red-500'}`}>
                        {trendUp ? '+' : '-'}{trend}
                    </div>
                )}
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300">
                {value}
            </div>
            <div className="text-sm text-grayText dark:text-gray-300">
                {title}
            </div>
        </div>
    );
};

// Componente de Tarjeta de Acción Rápida
export const QuickActionCard: React.FC<QuickActionCardProps> = ({
    title,
    description,
    icon: Icon,
    color,
    onClick,
    href
}) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        } else if (href) {
            window.location.href = href;
        }
    };

    return (
        <div
            onClick={handleClick}
            className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 hover:border-primary/30"
        >
            <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-grayText dark:text-gray-300 mb-6">
                    {description}
                </p>
                <div className="flex items-center justify-center text-primary group-hover:text-lightGreen transition-colors duration-300">
                    <span className="mr-2">Acceder</span>
                    <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

// Componente de Sección de Actividad Reciente
export const RecentActivitySection: React.FC = () => {
    return (
        <div className="bg-gradient-to-r from-primary/10 via-lightGreen/10 to-secondary/10 rounded-2xl p-12 border-0 shadow-lg">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 text-primary">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Panel de Actividad Reciente
                </h3>
                <p className="text-grayText dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                    Próximamente tendrás acceso a un resumen completo de tu actividad reciente,
                    estadísticas detalladas y métricas de rendimiento.
                </p>
                <div className="flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-lightGreen/60 rounded-full animate-bounce animation-delay-300"></div>
                    <div className="w-3 h-3 bg-secondary/60 rounded-full animate-bounce animation-delay-600"></div>
                </div>
            </div>
        </div>
    );
};