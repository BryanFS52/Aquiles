// En AppSidebar.js
import React, { useEffect, useState } from 'react';
import { getRoles } from '../services/RoleService'; // Importa el servicio que creaste
import { Sidebar } from '../components/Sidebar'; 
import { SidebarAprendiz } from '../components/SidebarAprendiz';

const AppSidebar = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtener roles desde Mockoon (Olimpo simulado)
        const fetchRoles = async () => {
            const roles = await getRoles();
            setRoles(roles);
            setLoading(false);
        };

        fetchRoles();
    }, []);

    const renderSidebar = () => {
        if (loading) {
            return <div>Cargando...</div>;
        }

        // Lógica basada en los roles obtenidos
        if (roles.includes('instructor')) {
            return <Sidebar />;
        } else if (roles.includes('aprendiz')) {
            return <SidebarAprendiz />;
        } else {
            return <div>Rol no reconocido</div>;
        }
    };

    return (
        <div>
            {renderSidebar()}
        </div>
    );
};

export default AppSidebar; // Asegúrate de que se exporte por defecto
