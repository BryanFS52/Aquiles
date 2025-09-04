// layout.tsx (servidor)
import { ToastContainer } from 'react-toastify';
import ClientLayoutWrapper from './ClientLayoutWrapper';
import 'react-toastify/dist/ReactToastify.css';

const initialUserData = {
  id: 2,
  name: 'Carlos Rodríguez',
  email: 'carlos.rodriguez@empresa.com',
  role: 'instructor'
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