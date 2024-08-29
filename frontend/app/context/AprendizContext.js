import React, { createContext, useState, useContext } from 'react';

const AprendizContext = createContext();

export function AprendizProvider({ children }) {
    const [aprendices, setAprendices] = useState([]);

    const addAprendiz = (aprendiz) => {
        setAprendices([...aprendices, aprendiz]);
    };

    return (
        <AprendizContext.Provider value={{ aprendiz: aprendices, addAprendiz }}>
            {children}
        </AprendizContext.Provider>
    );
}

export function useAprendiz() {
    return useContext(AprendizContext);
}
