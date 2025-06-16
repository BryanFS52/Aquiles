'use client';

import React from 'react';
import { UserContext } from '@context/UserContext';
import { UserContextType } from '@context/UserContext'
import LayoutContent from './layoutComponent';


interface ClientLayoutWrapperProps {
    children: React.ReactNode;
    userContextValue: UserContextType;
}

const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = ({ children, userContextValue }) => {
    return (
        <UserContext.Provider value={userContextValue}>
            <LayoutContent>
                {children}
            </LayoutContent>
        </UserContext.Provider>
    );
};

export default ClientLayoutWrapper;