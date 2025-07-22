"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import Loader from '@/components/UI/loader';

interface LoaderContextType {
    showLoader: () => void;
    hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const loaderStartTime = React.useRef<number | null>(null);

    const showLoader = () => {
        loaderStartTime.current = Date.now();
        setLoading(true);
    };

    const hideLoader = () => {
        const startTime = loaderStartTime.current;
        if (startTime) {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = 1000 - elapsedTime;

            if (remainingTime > 0) {
                setTimeout(() => setLoading(false), remainingTime);
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader }}>
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
