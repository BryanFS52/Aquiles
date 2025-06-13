'use client';

import { createContext, useContext } from 'react';

// Interfaz para el usuario
interface User {
    id: string | number;
    name: string;
    email: string;
    role: string;
    documentType?: string;
    documentNumber?: string;
}

// Interfaz para el contexto
interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

// Crear el contexto con valor por defecto undefined
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook personalizado con verificación de contexto
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
};