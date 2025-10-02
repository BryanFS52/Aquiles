"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import Loader from '@components/UI/Loader';

interface LoaderContextType {
    showLoader: () => void;
    hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const loaderStartTime = React.useRef<number | null>(null);

    const showLoader = useCallback(() => {
        loaderStartTime.current = Date.now();
        setLoading(true);
    }, []);

    const hideLoader = useCallback(() => {
        const startTime = loaderStartTime.current;
        if (startTime) {
            const elapsedTime = Date.now() - startTime;
            // Tiempo mínimo optimizado para navegación
            const minimumTime = 200; // Reducido para navegación más fluida
            const remainingTime = minimumTime - elapsedTime;

            if (remainingTime > 0) {
                setTimeout(() => setLoading(false), remainingTime);
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const contextValue = useMemo(() => ({
        showLoader,
        hideLoader
    }), [showLoader, hideLoader]);

    return (
        <LoaderContext.Provider value={contextValue}>
            {children}
            {loading && <Loader />}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (context === undefined) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};
