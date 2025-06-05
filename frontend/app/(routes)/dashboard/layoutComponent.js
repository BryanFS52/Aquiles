'use client';

import { Sidebar } from "@components/Sidebar";
import { Header } from "@components/header";
import { useUser } from "@context/UserContext";

export default function LayoutContent({ children }) {
    const user = useUser();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#001829] transition-colors duration-300">
            {/* Layout principal con flex para mejor control */}
            <div className="flex min-h-screen">
                {/* Sidebar - Ancho fijo y consistente */}
                <aside className="
                    w-0 lg:w-[300px] 
                    flex-shrink-0 
                    bg-transparent 
                    transition-all duration-300
                ">
                    <Sidebar role={user?.rol} />
                </aside>

                {/* Contenido principal - Ocupa el resto del espacio disponible */}
                <section className="
                    flex-1 
                    flex flex-col 
                    min-h-screen 
                    w-full 
                    lg:w-[calc(100%-300px)]
                    min-w-0
                ">
                    {/* Header - Perfectamente alineado con el contenido */}
                    <div className="
                        w-full 
                        flex-shrink-0
                        lg:pl-0
                    ">
                        <Header role={user?.rol} />
                    </div>

                    {/* Área de contenido principal */}
                    <main className="
                        flex-1 
                        p-3 sm:p-4 lg:p-6 xl:p-8
                        bg-gray-50 dark:bg-[#001829] 
                        transition-colors duration-300
                        min-w-0
                        overflow-x-hidden
                    ">
                        <div className="
                            w-full 
                            max-w-none
                            h-full
                        ">
                            <div className="
                                bg-white dark:bg-[#002033] 
                                rounded-xl 
                                shadow-sm 
                                border border-gray-200 dark:border-gray-700 
                                min-h-[calc(100vh-10rem)] lg:min-h-[calc(100vh-8rem)]
                                p-4 sm:p-6 lg:p-8
                                transition-all duration-300
                                w-full
                            ">
                                {children}
                            </div>
                        </div>
                    </main>
                </section>
            </div>
        </div>
    );
}