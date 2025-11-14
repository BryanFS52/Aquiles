'use client';

import React, { useState, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import store, { AppDispatch, RootState } from '@redux/store';
import { loadAuthFromStorage } from '@redux/slices/cerberos/authSlice';
import { UserContext, User, UserContextType } from '../../context/UserContext';
import { RoleType } from '../../types/roles';
import LayoutContent from './layoutComponent';
import Loader from '@components/UI/Loader';

const CERBEROS_URL = process.env.NEXT_PUBLIC_CERBEROS_URL || "http://localhost:3001";
const AQUILES_URL = process.env.NEXT_PUBLIC_AQUILES_URL || "http://localhost:3000";

interface ClientLayoutWrapperProps {
    children: React.ReactNode;
    initialUserData: User;
}

// Componente interno que usa Redux
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, loading, user: authUser } = useSelector(
        (state: RootState) => state.auth
    );
    const [isChecking, setIsChecking] = useState(true);

    const normalizeRole = (role?: string): RoleType => {
        if (!role) return "aprendiz";
        const lower = role.toLowerCase();
        if (lower.includes("instructor")) return "instructor";
        if (lower.includes("coordinador")) return "coordinador";
        return "aprendiz";
    };

    // Convertir User de Cerberos a User del contexto
    const mapCerberosUserToContextUser = (cerberosUser: any): User => {
        const roleName = cerberosUser?.roles?.[0]?.name || "aprendiz";
        return {
            id: parseInt(cerberosUser?.id || "0"),
            name: `${cerberosUser?.person?.name || ""} ${cerberosUser?.person?.lastname || ""}`.trim(),
            email: cerberosUser?.person?.email || "",
            role: normalizeRole(roleName),
        };
    };

    const [user, setUser] = useState<User | null>(null);

    // Cargar autenticación al montar
    useEffect(() => {
        const loadAuth = async () => {
            try {
                await dispatch(loadAuthFromStorage()).unwrap();
            } catch (error) {
                // Si falla, redirigir a login
                const callbackUrl = `${AQUILES_URL}/auth/callback`;
                const loginUrl = `${CERBEROS_URL}/auth/login?project=aquiles&redirectUri=${encodeURIComponent(callbackUrl)}`;
                window.location.href = loginUrl;
            } finally {
                setIsChecking(false);
            }
        };

        loadAuth();
    }, [dispatch]);

    // Actualizar usuario cuando authUser cambie
    useEffect(() => {
        if (authUser) {
            const mappedUser = mapCerberosUserToContextUser(authUser);
            setUser(mappedUser);
        }
    }, [authUser]);

    const loginUser = (userData: User) => {
        setUser({
            ...userData,
            role: normalizeRole(userData.role),
        });
    };

    const logoutUser = () => {
        setUser(null);
    };

    const userContextValue: UserContextType = {
        user,
        setUser,
        isAuthenticated: !!user && isAuthenticated,
        role: user?.role as RoleType,
        login: loginUser,
        logout: logoutUser,
    };

    // Mostrar loader mientras verifica autenticación
    if (isChecking || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader />
                    <p className="mt-4 text-gray-600">Cargando sesión...</p>
                    <p className="mt-2 text-gray-500 text-sm">Por favor espera...</p>
                </div>
            </div>
        );
    }

    // Si no hay usuario, mostrar error
    if (!user || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader />
                    <p className="mt-4 text-gray-600">Redirigiendo a login...</p>
                </div>
            </div>
        );
    }

    return (
        <UserContext.Provider value={userContextValue}>
            <LayoutContent>
                {children}
            </LayoutContent>
        </UserContext.Provider>
    );
}

// Wrapper principal que provee el store
const ClientLayoutWrapper: React.FC<ClientLayoutWrapperProps> = ({ children, initialUserData }) => {
    return (
        <Provider store={store}>
            <AuthenticatedLayout>
                {children}
            </AuthenticatedLayout>
        </Provider>
    );
};

export default ClientLayoutWrapper;
