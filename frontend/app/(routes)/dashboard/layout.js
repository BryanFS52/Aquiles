// app/(routes)/dashboard/layout.js
'use client';
import { UserContext } from '@/context/UserContext';
import LayoutContent from './layoutComponent';

export default function RootLayout({ children }) {
    // Simulación de diferentes usuarios
    const users = {
        instructor: {
            rol: 'instructor',
            nombre: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@empresa.com',
            id: 2
        },
        aprendiz: {
            rol: 'aprendiz',
            nombre: 'Ana García',
            email: 'ana.garcia@empresa.com',
            id: 3,
            ficha: 'FICHA-001'
        },
        coordinador: {
            rol: 'coordinador',
            nombre: 'María Pérez',
            email: 'maria.perez@empresa.com',
            id: 1
        },
    };

    const currentRole = 'coordinador';
    const user = users[currentRole];

    return (
        <html lang="es">
            <body>
                <UserContext.Provider value={user}>
                    <LayoutContent>
                        {children}
                    </LayoutContent>
                </UserContext.Provider>
            </body>
        </html>
    );
}