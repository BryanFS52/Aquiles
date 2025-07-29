'use client';

import React, { useState } from 'react';
import { UserContext, User, UserContextType } from '@context/UserContext';
import LayoutContent from './layoutComponent';

interface ClientLayoutWrapperProps {
    children: React.ReactNode;
    initialUserData: User;
}

const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = ({ children, initialUserData }) => {
    const [user, setUser] = useState<User | null>(initialUserData);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    const userContextValue: UserContextType = {
        user,
        setUser,
        isAuthenticated: user !== null,
        role: (user?.role as "Aprendiz" | "Instructor" | "Coordinador") || "Aprendiz",
        login,
        logout
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