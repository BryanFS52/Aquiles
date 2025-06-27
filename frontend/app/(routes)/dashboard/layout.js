// layout.js (servidor)
import { Inter } from 'next/font/google';
import ClientLayoutWrapper from './ClientLayoutWrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });
const user = {
  rol: 'instructor',
  nombre: 'Carlos Rodríguez',
  email: 'carlos.rodriguez@empresa.com',
  id: 2
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`bg-white text-black font-sans ${inter.className}`}>
        <ToastContainer />
        <ClientLayoutWrapper userContextValue={user}>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}