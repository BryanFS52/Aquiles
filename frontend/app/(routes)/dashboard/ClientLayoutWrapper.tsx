'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { useRouter } from 'next/navigation';
import store from '@redux/store';
import { UserContext, User, UserContextType } from '../../context/UserContext';
import { RoleType } from '../../types/roles';
import LayoutContent from './layoutComponent';
import { useAuth } from '../../hooks/useAuth';
import Loader from '@components/UI/Loader';

interface ClientLayoutWrapperProps {
    children: React.ReactNode;
    initialUserData: User;
}

// Componente interno que usa Redux
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isAuthenticated, isLoading, user: authUser, checkAuth, login } = useAuth();
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
    const [isClientMounted, setIsClientMounted] = useState(false);

    // Verificar autenticación al montar
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                console.log("🔍 [Dashboard] Verificando autenticación...");
                
                // Primero verificar si hay datos en localStorage
                const storedAuth = localStorage.getItem("olympo_auth");
                
                if (storedAuth) {
                    console.log("📦 [Dashboard] Datos encontrados en localStorage");
                    try {
                        const parsed = JSON.parse(storedAuth);
                        console.log("✅ [Dashboard] Usuario:", parsed.user);
                        const mappedUser = mapCerberosUserToContextUser(parsed.user);
                        setUser(mappedUser);
                        setIsChecking(false);
                        setIsClientMounted(true);
                        console.log("🎉 [Dashboard] Usuario cargado exitosamente");
                        return;
                    } catch (parseError) {
                        console.error("❌ [Dashboard] Error parseando localStorage:", parseError);
                        localStorage.removeItem("olympo_auth");
                    }
                }
                
                console.log("⚠️ [Dashboard] No hay datos en localStorage, intentando checkAuth...");
                
                // Si no hay en localStorage, intentar cargar del store
                const authenticated = await checkAuth();
                
                if (!authenticated) {
                    console.log("❌ [Dashboard] No autenticado, redirigiendo a login...");
                    // No autenticado, redirigir a login
                    login();
                    return;
                }

                // Usuario autenticado, mapear datos
                if (authUser) {
                    console.log("✅ [Dashboard] Usuario autenticado desde store:", authUser);
                    const mappedUser = mapCerberosUserToContextUser(authUser);
                    setUser(mappedUser);
                }
            } catch (error) {
                console.error("❌ [Dashboard] Error verificando autenticación:", error);
                
                // Verificar una última vez si hay datos en localStorage antes de redirigir
                const storedAuth = localStorage.getItem("olympo_auth");
                if (storedAuth) {
                    console.log("💾 [Dashboard] Recuperando de localStorage después de error");
                    try {
                        const parsed = JSON.parse(storedAuth);
                        const mappedUser = mapCerberosUserToContextUser(parsed.user);
                        setUser(mappedUser);
                    } catch (err) {
                        console.error("❌ [Dashboard] Error final:", err);
                        login();
                    }
                } else {
                    console.log("🚪 [Dashboard] Sin datos, redirigiendo a login");
                    login();
                }
            } finally {
                setIsChecking(false);
                setIsClientMounted(true);
            }
        };

        verifyAuth();
    }, [checkAuth, login, authUser]);

    // Actualizar usuario cuando cambie authUser
    useEffect(() => {
        if (authUser && isAuthenticated) {
            const mappedUser = mapCerberosUserToContextUser(authUser);
            setUser(mappedUser);
        }
    }, [authUser, isAuthenticated]);

    // Cargar rol desde localStorage después del montaje del cliente
    useEffect(() => {
        if (!isClientMounted) return;
        
        const storedRole = localStorage.getItem('sidebar-role');
        if (storedRole === 'instructor' || storedRole === 'aprendiz' || storedRole === 'coordinador') {
            setUser(prevUser => prevUser ? { ...prevUser, role: storedRole } : null);
        }
    }, [isClientMounted]);

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
        isAuthenticated: user !== null && isAuthenticated,
        role: user?.role as RoleType,
        login: loginUser,
        logout: logoutUser,
    };

    // Mostrar loader mientras verifica autenticación
    if (isChecking || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader />
                    <p className="mt-4 text-gray-600">Verificando autenticación...</p>
                    <p className="mt-2 text-gray-500 text-sm">Cargando sesión...</p>
                </div>
            </div>
        );
    }

    // No mostrar nada si no está autenticado (ya redirigió)
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader />
                    <p className="mt-4 text-gray-600">Redirigiendo...</p>
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
