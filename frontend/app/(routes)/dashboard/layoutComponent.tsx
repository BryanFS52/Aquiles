'use client';

import React from 'react';
import { Sidebar } from "@components/UI/sidebar";
import { Header } from "@components/UI/header";
import { useUser } from "@context/UserContext";
import { Provider } from "react-redux";
import store from '@/redux/store';

interface LayoutContentProps {
    children: React.ReactNode;
}


const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
    const user = useUser();
    return (
        <Provider store={store}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                {/* Layout principal */}
                <div className="flex min-h-screen">
                    {/* Sidebar */}
                    <aside className="
                    w-0 lg:w-[300px] 
                    flex-shrink-0 
                    bg-transparent 
                    transition-all duration-300
                    ">
                        <Sidebar role={user?.user?.role ?? 'instructor'} />

                    </aside>

                    {/* Contenido principal */}
                    <section className="
                    flex-1 
                    flex flex-col 
                    min-h-screen 
                    w-full 
                    lg:w-[calc(100%-300px)]
                    min-w-0
                    ">
                        {/* Header -  */}
                        <div className="
                        w-full 
                        flex-shrink-0
                        lg:pl-0
                        ">
                            <Header role={user?.role ?? "Instructor"} />
                        </div>

                        {/* Área de contenido principal */}
                        <main className="
                        flex-1 
                        p-3 sm:p-4 lg:p-6 xl:p-8
                        bg-gray-50 dark:bg-gray-900
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
        </Provider>
    );
};

export default LayoutContent;