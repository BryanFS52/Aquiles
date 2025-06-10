'use client';
import { UserContext } from '@context/userContext';
import LayoutContent from './layoutComponent';

export default function ClientLayoutWrapper({ children, user }) {
    return (
        <UserContext.Provider value={user}>
            <LayoutContent>
                {children}
            </LayoutContent>
        </UserContext.Provider>
    );
}
