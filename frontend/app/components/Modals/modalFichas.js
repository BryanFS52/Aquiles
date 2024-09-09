"use client";

import React, { useState, useEffect } from 'react';

const ModalFichas = ({ isOpen, onClose, onCreate }) => {
  const [fichaData, setFichaData] = useState({ numero: '', programa: '' });
  const [inputError, setInputError] = useState({ numero: false, programa: false });

  useEffect(() => {
    if (!isOpen) {
      setFichaData({ numero: '', programa: '' });
      setInputError({ numero: false, programa: false });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFichaData({ ...fichaData, [name]: value });
    setInputError({ ...inputError, [name]: false }); 
  };

  const handleCreateFicha = () => {
    const errors = {
      numero: !fichaData.numero,
      programa: !fichaData.programa
    };

    setInputError(errors);

    if (!errors.numero && !errors.programa) {
      onCreate(fichaData); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-cyan-900 opacity-35"></div>
      <div className="relative md:w-2/6 h-[40%] max-w-3xl mx-auto my-12 bg-white rounded-lg shadow-lg">
        <div className="p-5 w-full h-full">
          <div className='flex justify-center items-center'>
            <h1 className="font-inter font-semibold text-2xl border-b-2 border-black flex">Nueva Ficha</h1>
          </div>
          <div className='flex flex-col justify-center items-center h-full w-full'>
            <div className='pb-4'>
              <p className="text-lg font-inter font-medium text-black-700">Número de Ficha</p>
              <div className={`rounded-lg border-solid border-2 text-custom-blue ${inputError.numero ? 'border-red-500' : 'border-gray-300'}`}>
                <input type="text" name="numero" placeholder="Número de ficha" value={fichaData.numero} onChange={handleInputChange} className={`${inputError.numero ? 'text-red-500' : 'text-black'}`}/>        
              </div>
              {inputError.numero && <p className="text-red-500 text-xs">Este campo es obligatorio.</p>}
            </div>
            <div className='pb-4'>
              <p className="text-lg font-inter font-medium text-black-700">Programa</p>
              <div className={`rounded-lg border-solid border-2 text-custom-blue ${inputError.programa ? 'border-red-500' : 'border-gray-300'}`}>
                <input type="text" name="programa" placeholder="Programa" value={fichaData.programa} onChange={handleInputChange} className={`${inputError.programa ? 'text-red-500' : 'text-black'}`} />        
              </div>
              {inputError.programa && <p className="text-red-500 text-xs">Este campo es obligatorio.</p>}
            </div>
            <div className='flex justify-end'>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800"onClick={handleCreateFicha}>Crear</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 ml-4"onClick={onClose}>Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ModalFichas;
