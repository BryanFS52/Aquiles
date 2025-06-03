'use client';

import { Sidebar } from "@components/Sidebar";
import { Header } from "@components/header";
import { useUser } from "@context/UserContext";

export default function LayoutContent({ children }) {
    const user = useUser(); // extrae el usuario del contexto

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#001829] transition-colors duration-300">
            <div className="grid grid-cols-1 xl:grid-cols-6 min-h-screen">
                {/* Sidebar con estilos adaptados */}
                <div className="xl:col-span-1">
                    <Sidebar role={user?.rol} />
                </div>

                {/* Contenido principal */}
                <div className="xl:col-span-5 relative flex flex-col min-h-screen">
                    {/* Header fijo con estilos mejorados */}
                    <div className="sticky top-0 w-full z-40 bg-white/95 dark:bg-[#002033]/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
                        <Header user={user} />
                    </div>

                    {/* Área de contenido principal */}
                    <main className="flex-1 p-4 xl:p-6 bg-gray-50 dark:bg-[#001829] transition-colors duration-300">
                        <div className="max-w-full mx-auto">
                            <div className="bg-white dark:bg-[#002033] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-8rem)] p-6 transition-colors duration-300">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}