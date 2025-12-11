import React from 'react';

interface PageTitleProps {
    children: React.ReactNode;
    backUrl?: string; // URL opcional para navegación
    onBack?: () => void; // Función opcional para manejar la navegación
}

const PageTitle: React.FC<PageTitleProps> = ({ children, backUrl, onBack }) => {
    const handleBackClick = () => {
        if (onBack) {
            onBack();
        } else if (backUrl) {
            window.location.href = backUrl;
        }
    };

    const showBackButton = backUrl || onBack;

    return (
        <div className="group mb-6 sm:mb-8 -mx-2 sm:-mx-4 md:-mx-6 lg:-mx-6 xl:-mx-6 px-2 sm:px-4 md:px-6 lg:px-6 xl:px-6">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                {showBackButton ? (
                    <>
                        {/* Línea decorativa que se muestra por defecto en desktop */}
                        <div className="hidden md:block md:group-hover:hidden transition-all duration-300 w-1.5 h-10 sm:h-12 md:h-14 bg-gradient-to-b from-primary via-lightGreen to-primary dark:from-secondary dark:via-lightGreen dark:to-secondary rounded-full shadow-md"></div>
                        
                        {/* Botón en forma de flecha - visible en móvil, en hover en desktop */}
                        <button
                        onClick={handleBackClick}
                        className="block md:hidden md:group-hover:block relative w-8 sm:w-9 md:w-10 h-10 sm:h-12 md:h-14 transition-all duration-300 hover:scale-110 focus:outline-none flex-shrink-0"
                        aria-label="Volver"
                        >
                        <div className="absolute inset-0 flex items-center justify-start pl-0.5 sm:pl-1">
                            <div className="relative w-0 h-2 -scale-x-100">
                                {/* Punta superior */}
                                <div
                                className="absolute left-0 bottom-0 w-1 sm:w-1.5 h-7 sm:h-9 md:h-10 bg-gradient-to-r from-primary via-lightGreen to-primary dark:from-secondary dark:via-lightGreen dark:to-secondary shadow-sm rounded-full origin-bottom-left -rotate-45"
                                ></div>

                                {/* Punta inferior */}
                                <div
                                className="absolute left-0 top-0 w-1 sm:w-1.5 h-7 sm:h-9 md:h-10 bg-gradient-to-r from-primary via-lightGreen to-primary dark:from-secondary dark:via-lightGreen dark:to-secondary shadow-sm rounded-full origin-top-left rotate-45"
                                ></div>
                            </div>
                        </div>
                        </button>
                    </>
                ) : (
                    <div className="w-1 sm:w-1.5 h-10 sm:h-12 md:h-14 bg-gradient-to-b from-primary via-lightGreen to-primary dark:from-secondary dark:via-lightGreen dark:to-secondary rounded-full shadow-md flex-shrink-0"></div>
                )}
                <h1
                    className={`text-black dark:text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-inter font-semibold min-w-0 ${
                        showBackButton ? 'cursor-pointer' : ''
                    }`}
                    onClick={showBackButton ? handleBackClick : undefined}
                    role={showBackButton ? 'button' : undefined}
                >
                    {children}
                </h1>
            </div>
        </div>
    );
};

export default PageTitle;