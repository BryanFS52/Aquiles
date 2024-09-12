// ApprenticeContext.js
"use client";

import React, { createContext, useContext, useState } from 'react';

const ApprenticeContext = createContext();

export const useApprentices = () => useContext(ApprenticeContext);

export const ApprenticeProvider = ({ children }) => {
  const [apprentices, setApprentices] = useState([]);

  return (
    <ApprenticeContext.Provider value={{ apprentices, setApprentices }}>
      {children}
    </ApprenticeContext.Provider>
  );
};
