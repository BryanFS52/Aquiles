// app/(routes)/dashboard/layout.js
import ClientLayoutWrapper from './ClientLayoutWrapper';

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>
                <ClientLayoutWrapper>
                    {children}
                </ClientLayoutWrapper>
            </body>
        </html>
    );
}
