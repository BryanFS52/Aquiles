import React, { useEffect, useState } from 'react';
import { getRoles } from '../services/RoleService'; // Importa el servicio que creaste
import { Sidebar } from './Sidebar'; 
import { SidebarAprendiz } from './SidebarAprendiz';

const SidebarRole = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtener roles desde Mockoon (Olimpo simulado)
        const fetchRoles = async () => {
            const fetchedRoles = await getRoles();
            setRoles(fetchedRoles);
            setLoading(false);
        };

        fetchRoles();
    }, []);

    const renderSidebar = () => {
        if (loading) {
            return <div>Cargando...</div>;
        }

        // Lógica basada en los roles obtenidos
        const roleNames = roles.map(role => role.name); // Extraer los nombres de los roles

        if (roleNames.includes('instructor')) {
            return <Sidebar />;
        } else if (roleNames.includes('aprendiz')) {
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

export default SidebarRole; // Asegúrate de que se exporte por defecto
