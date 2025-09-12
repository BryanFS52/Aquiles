'use client';

import React, { useEffect, useState } from 'react';
import { FichasCoordinadorContainer } from '@/components/features/fichasCoordinador';

const FichasCoordinator: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detectar modo oscuro
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return <FichasCoordinadorContainer isDarkMode={isDarkMode} />;
};

export default FichasCoordinator;