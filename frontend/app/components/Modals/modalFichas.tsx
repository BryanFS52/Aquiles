"use client";

import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaHashtag, FaGraduationCap } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchPrograms } from '@slice/olympo/programSlice';

interface ModalFichasProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalFichas: React.FC<ModalFichasProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [fichaData, setFichaData] = useState({ numero: '', programId: '' });
  const [inputError, setInputError] = useState({ numero: false, programId: false });

  const { data: programs, loading: loadingPrograms } = useSelector((state: RootState) => state.program);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchPrograms({ page: 0, size: 100 }));
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!isOpen) {
      setFichaData({ numero: '', programId: '' });
      setInputError({ numero: false, programId: false });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFichaData({ ...fichaData, [name]: value });
    setInputError({ ...inputError, [name]: false });
  };

  const handleCreateFicha = () => {
    const errors = {
      numero: !fichaData.numero,
      programId: !fichaData.programId
    };

    setInputError(errors);

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#002033] rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative">
        {/* Botón X para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 hover:scale-110"
          title="Cerrar"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-blue-900 p-6 text-white">
          <h3 className="text-2xl font-bold flex items-center space-x-3">
            <FaPlus className="text-xl" />
            <span>Nueva Ficha</span>
          </h3>
          <p className="text-white/90 mt-1">Crear una nueva ficha técnica</p>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Campo Número de Ficha */}
          <div>
            <label className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-300 font-semibold">
              <FaHashtag className="text-primary dark:text-secondary" />
              <span>Número de Ficha</span>
            </label>
            <input
              type="text"
              name="numero"
              placeholder="Ingresa el número de ficha"
              value={fichaData.numero}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${inputError.numero
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-600'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary dark:focus:border-secondary'
                }`}
            />
            {inputError.numero && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                Este campo es obligatorio
              </p>
            )}
          </div>

          {/* Campo Programa */}
          <div>
            <label className="flex items-center space-x-2 mb-2 text-gray-700 dark:text-gray-300 font-semibold">
              <FaGraduationCap className="text-primary dark:text-secondary" />
              <span>Programa</span>
            </label>
            {loadingPrograms ? (
              <div className="flex items-center justify-center py-3 text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary dark:border-secondary mr-2"></div>
                Cargando programas...
              </div>
            ) : (
              <div className="relative">
                <select
                  name="programId"
                  value={fichaData.programId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none appearance-none cursor-pointer ${inputError.programId
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-600 text-red-700 dark:text-red-400'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary dark:focus:border-secondary hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  style={{
                    backgroundImage: 'none',
                  }}
                >
                  <option value="" className="text-gray-500 dark:text-gray-400 rounded-lg py-2">Selecciona un programa</option>
                  {programs.map((program) => (
                    <option
                      key={program.id}
                      value={program.id || ''}
                      className="text-gray-900 dark:text-white bg-white dark:bg-gray-800 py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg my-1"
                    >
                      {program.name}
                    </option>
                  ))}
                </select>
                {/* Icono personalizado del select */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className={`w-5 h-5 transition-colors ${inputError.programId
                      ? 'text-red-500'
                      : 'text-gray-400 dark:text-gray-500'
                      }`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            )}
            {inputError.programId && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠</span>
                Este campo es obligatorio
              </p>
            )}
          </div>
        </div>

        {/* Footer con botones */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end space-x-3">
          <button
            onClick={handleCreateFicha}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-blue-900 text-white hover:shadow-lg transition-all"
          >
            Crear Ficha
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalFichas;
