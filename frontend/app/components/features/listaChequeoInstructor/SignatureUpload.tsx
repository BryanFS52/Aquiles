import React from 'react';
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import { SignatureUploadProps } from './types';

export const SignatureUpload: React.FC<SignatureUploadProps> = ({
  firmaAnterior,
  firmaNuevo,
  isFinalSaved,
  onFileUpload,
  setFirmaAnterior,
  setFirmaNuevo
}) => {
  return (
    <div className="mt-12 relative">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Firmas digitales
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Sube las firmas digitales de los instructores. Las firmas se guardarán automáticamente en la base de datos al subirlas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Instructor Técnico Anterior */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              Instructor técnico anterior
            </h4>
          </div>
          
          <label className={`flex flex-col items-center p-8 border-2 border-dashed rounded-lg w-full transition-all duration-300 group ${
            isFinalSaved
              ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-60'
              : 'border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#5cb800] dark:hover:border-shadowBlue hover:bg-gray-50 dark:hover:bg-gray-700/30'
          }`}>
            <UploadCloud className={`w-16 h-16 transition-colors duration-300 mb-4 ${
              isFinalSaved
                ? 'text-gray-300 dark:text-gray-600'
                : 'text-gray-400 group-hover:text-[#5cb800] dark:group-hover:text-shadowBlue'
            }`} />
            <span className={`font-medium text-lg text-center transition-colors duration-300 mb-2 ${
              isFinalSaved
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-700 dark:text-gray-300 group-hover:text-[#5cb800] dark:group-hover:text-shadowBlue'
            }`}>
              {isFinalSaved ? 'Lista guardada definitivamente' : 'Subir firma digital'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isFinalSaved ? 'Firmas bloqueadas' : 'Formatos: JPG, PNG, GIF'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileUpload(e, setFirmaAnterior)}
              disabled={isFinalSaved}
              className="hidden"
            />
          </label>
          
          {firmaAnterior && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-center">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                  <Image
                    src={firmaAnterior}
                    alt="Firma instructor anterior"
                    width={200}
                    height={120}
                    className="max-h-32 max-w-full object-contain rounded"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Firma guardada exitosamente
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card Instructor Técnico Nuevo */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">
              Instructor técnico nuevo
            </h4>
          </div>
          
          <label className={`flex flex-col items-center p-8 border-2 border-dashed rounded-lg w-full transition-all duration-300 group ${
            isFinalSaved
              ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed opacity-60'
              : 'border-gray-300 dark:border-gray-600 cursor-pointer hover:border-[#5cb800] dark:hover:border-shadowBlue hover:bg-gray-50 dark:hover:bg-gray-700/30'
          }`}>
            <UploadCloud className={`w-16 h-16 transition-colors duration-300 mb-4 ${
              isFinalSaved
                ? 'text-gray-300 dark:text-gray-600'
                : 'text-gray-400 group-hover:text-[#5cb800] dark:group-hover:text-shadowBlue'
            }`} />
            <span className={`font-medium text-lg text-center transition-colors duration-300 mb-2 ${
              isFinalSaved
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-gray-700 dark:text-gray-300 group-hover:text-[#5cb800] dark:group-hover:text-shadowBlue'
            }`}>
              {isFinalSaved ? 'Lista guardada definitivamente' : 'Subir firma digital'}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {isFinalSaved ? 'Firmas bloqueadas' : 'Formatos: JPG, PNG, GIF'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileUpload(e, setFirmaNuevo)}
              disabled={isFinalSaved}
              className="hidden"
            />
          </label>
          
          {firmaNuevo && (
            <div className="mt-6 space-y-3">
              <div className="flex justify-center">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                  <Image
                    src={firmaNuevo}
                    alt="Firma instructor nuevo"
                    width={200}
                    height={120}
                    className="max-h-32 max-w-full object-contain rounded"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Firma guardada exitosamente
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
