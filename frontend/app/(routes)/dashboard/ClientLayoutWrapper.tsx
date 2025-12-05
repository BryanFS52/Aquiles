'use client';

import React, { useState, useEffect } from 'react';
import { UserContext, User, UserContextType } from '../../context/UserContext';
import { RoleType } from '../../types/roles';
import LayoutContent from './layoutComponent';
import { clientLAN } from '@lib/apollo-client';
import { GET_STUDENT_LIST } from '@graphql/olympo/studentsGraph';
import { 
    TEMPORAL_APRENDIZ_ID, 
    TEMPORAL_INSTRUCTOR_ID, 
    TEMPORAL_COORDINATOR_ID 
} from '../../temporaryCredential';

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

    // Inicializar con datos del servidor para evitar hidratación
    const [user, setUser] = useState<User | null>(() => ({
        ...initialUserData,
        role: normalizeRole(initialUserData.role)
    }));

    const [isClientMounted, setIsClientMounted] = useState(false);

    // Función para obtener el ID del estudiante por su documento
    const fetchStudentIdByDocument = async (document: string): Promise<string | null> => {
        try {
            const { data } = await clientLAN.query({
                query: GET_STUDENT_LIST,
                fetchPolicy: 'network-only'
            });

            if (data?.allStudentList?.data) {
                const student = data.allStudentList.data.find(
                    (s: any) => s?.person?.document === document
                );
                return student?.id || null;
            }
            return null;
        } catch (error) {
            console.error('Error al obtener ID del estudiante:', error);
            return null;
        }
    };

    // Obtener ID temporal según el rol para desarrollo/pruebas
    const getTemporalIdByRole = (role: string): string => {
        const normalizedRole = role.toLowerCase();
        if (normalizedRole.includes('aprendiz')) return String(TEMPORAL_APRENDIZ_ID);
        if (normalizedRole.includes('instructor')) return String(TEMPORAL_INSTRUCTOR_ID);
        if (normalizedRole.includes('coordinador')) return String(TEMPORAL_COORDINATOR_ID);
        return '0';
    };

    // Cargar datos reales del usuario desde localStorage después del montaje del cliente
    useEffect(() => {
        const loadUserData = async () => {
            setIsClientMounted(true);
            
            // Intentar cargar datos del usuario desde localStorage
            try {
                let storedUserId = localStorage.getItem('userId');
                const storedUserName = localStorage.getItem('userName');
                const storedUserEmail = localStorage.getItem('userEmail');
                const storedUserRole = localStorage.getItem('userRole');
                const storedUserDocument = localStorage.getItem('userDocument');
                const storedSidebarRole = localStorage.getItem('sidebar-role');

                // Determinar el rol actual (prioridad: sidebar-role > userRole)
                const currentRole = storedSidebarRole || storedUserRole || 'aprendiz';

                // Si no tenemos el ID pero tenemos el documento y es un aprendiz, obtenerlo
                if (!storedUserId && storedUserDocument && currentRole.toLowerCase().includes('aprendiz')) {
                    storedUserId = await fetchStudentIdByDocument(storedUserDocument);
                    if (storedUserId) {
                        localStorage.setItem('userId', storedUserId);
                    }
                }

                // Si aún no tenemos ID, usar el ID temporal según el rol
                if (!storedUserId) {
                    storedUserId = getTemporalIdByRole(currentRole);
                    console.log(`🔧 Usando ID temporal para ${currentRole}:`, storedUserId);
                }

                // Configurar usuario con los datos disponibles
                setUser({
                    id: storedUserId,
                    name: storedUserName || 'Usuario',
                    email: storedUserEmail || 'usuario@example.com',
                    role: normalizeRole(currentRole),
                    documentNumber: storedUserDocument
                });
            } catch (error) {
                console.error('Error al cargar datos del usuario desde localStorage:', error);
            }
        };

        loadUserData();
    }, []);

    // Escuchar cambios en el rol del sidebar para actualizar el ID
    useEffect(() => {
        if (!isClientMounted) return;

        const handleRoleChange = (event?: CustomEvent) => {
            const sidebarRole = event?.detail?.role || localStorage.getItem('sidebar-role');
            
            if (sidebarRole && user) {
                const normalizedRole = normalizeRole(sidebarRole);
                
                // Si el rol cambió, actualizar el usuario con el nuevo ID temporal
                if (user.role !== normalizedRole) {
                    const newId = getTemporalIdByRole(sidebarRole);
                    console.log(`🔄 Cambio de rol detectado: ${user.role} → ${normalizedRole}, nuevo ID: ${newId}`);
                    
                    setUser(prevUser => prevUser ? {
                        ...prevUser,
                        id: newId,
                        role: normalizedRole
                    } : null);
                    
                    localStorage.setItem('userId', newId);
                }
            }
        };

        // Escuchar el evento personalizado de cambio de rol
        window.addEventListener('roleChanged', handleRoleChange as EventListener);

        // También escuchar cambios en localStorage desde otras ventanas/pestañas
        window.addEventListener('storage', () => handleRoleChange());

        return () => {
            window.removeEventListener('roleChanged', handleRoleChange as EventListener);
            window.removeEventListener('storage', () => handleRoleChange());
        };
    }, [isClientMounted, user]);

    const login = (userData: User) => {
        const normalizedUser = {
            ...userData,
            role: normalizeRole(userData.role),
        };
        setUser(normalizedUser);
        
        // Guardar en localStorage
        try {
            localStorage.setItem('userId', String(userData.id));
            localStorage.setItem('userName', userData.name);
            localStorage.setItem('userEmail', userData.email);
            localStorage.setItem('userRole', userData.role);
            if (userData.documentNumber) {
                localStorage.setItem('userDocument', userData.documentNumber);
            }
        } catch (error) {
            console.error('Error al guardar datos del usuario en localStorage:', error);
        }
    };

    const logout = () => {
        setUser(null);
        
        // Limpiar localStorage
        try {
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userDocument');
            localStorage.removeItem('userDocumentType');
            localStorage.removeItem('sidebar-role');
        } catch (error) {
            console.error('Error al limpiar datos del usuario en localStorage:', error);
        }
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
