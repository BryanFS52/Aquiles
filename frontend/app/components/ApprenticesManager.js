import React, { useState, useEffect } from 'react';
import FormularioRegistro from '../components/FormularioRegistro';
import TablaApprentices from './TablaApprentices';
import { getAllApprentices } from "../services/apprenticeService";

const ApprenticesManager = () => {
  const [apprentices, setApprentices] = useState([]);

  useEffect(() => {
    const fetchApprentices = async () => {
      try {
        const apprenticesData = await getAllApprentices();
        const updatedApprentices = apprenticesData.map(apprentice => ({
          ...apprentice,
          weeks: Array(4).fill(null).map(() => Array(7).fill('A')), 
        }));
        setApprentices(updatedApprentices);
      } catch (error) {
        console.error('Error al obtener la lista de aprendices:', error);
      }
    };

    fetchApprentices();
  }, []);

  const addApprentice = (newApprentice) => {
    setApprentices(prev => [...prev, newApprentice]);
  };

  return (
    <div>
      <FormularioRegistro addApprentice={addApprentice} />
      <TablaApprentices apprentices={apprentices} setApprentices={setApprentices} />
    </div>
  );
};

export default ApprenticesManager;
