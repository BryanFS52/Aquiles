'use client';

import { ReactNode } from 'react';
import { LoaderProvider } from '@context/LoaderContext';

interface LoadingProviderProps {
  children: ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  return (
    <LoaderProvider>
      {children}
    </LoaderProvider>
  );
}
