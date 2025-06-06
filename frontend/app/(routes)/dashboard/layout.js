// layout.js (servidor)
import ClientLayoutWrapper from './ClientLayoutWrapper';

export default function RootLayout({ children }) {
    const user = {
        rol: 'instructor',
        nombre: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@empresa.com',
        id: 2
    };

    return (
        <html lang="es">
            <body>
                <ClientLayoutWrapper user={user}>
                    {children}
                </ClientLayoutWrapper>
            </body>
        </html>
    );
}
