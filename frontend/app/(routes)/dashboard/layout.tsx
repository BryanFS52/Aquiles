// layout.tsx (servidor)
import { ToastContainer } from 'react-toastify';
import ClientLayoutWrapper from './ClientLayoutWrapper';
import 'react-toastify/dist/ReactToastify.css';

// Datos por defecto - serán reemplazados por el cliente con datos del localStorage
const initialUserData = {
  id: 0, // Se reemplazará en el cliente con los datos reales
  name: 'Usuario',
  email: 'usuario@example.com',
  role: 'aprendiz'
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <ToastContainer />
      <ClientLayoutWrapper initialUserData={initialUserData}>
        {children}
      </ClientLayoutWrapper>
    </>
  );
}