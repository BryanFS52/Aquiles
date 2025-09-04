'use client';

import React, { useState } from 'react';
import { UserContext, User, UserContextType } from '@context/UserContext';
import { RoleType } from '@/types/roles';
import LayoutContent from './layoutComponent';

interface ClientLayoutWrapperProps {
    children: React.ReactNode;
    initialUserData: User;
}

const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = ({ children, initialUserData }) => {
    const normalizeRole = (role?: string): RoleType => {
        if (!role) return "aprendiz";
        const lower = role.toLowerCase();
        if (lower.includes("instructor")) return "instructor";
        if (lower.includes("coordinador")) return "coordinador";
        return "aprendiz";
    };

    // Inicializa el role desde localStorage si existe, si no usa el del servidor
    const getInitialUser = (): User => {
        if (typeof window !== 'undefined') {
            const storedRole = localStorage.getItem('sidebar-role');
            if (storedRole === 'instructor' || storedRole === 'aprendiz' || storedRole === 'coordinador') {
                return { ...initialUserData, role: storedRole };
            }
        }
        return { ...initialUserData, role: normalizeRole(initialUserData.role) };
    };

    const [user, setUser] = useState<User | null>(getInitialUser());

    const login = (userData: User) => {
        setUser({
            ...userData,
            role: normalizeRole(userData.role),
        });
    };

    const logout = () => {
        setUser(null);
    };

    const userContextValue: UserContextType = {
        user,
        setUser,
        isAuthenticated: user !== null,
        role: user?.role as RoleType,
        login,
        logout,
    };

    return (
        <UserContext.Provider value={userContextValue}>
            <LayoutContent>
                {children}
            </LayoutContent>
        </UserContext.Provider>
    );
};

export default ClientLayoutWrapper;
