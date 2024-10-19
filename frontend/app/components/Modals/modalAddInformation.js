import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalAddinformation = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [selectedApprentices, setSelectedApprentices] = useState([
    'Michael Felipe Laiton Chaparro',
    'Michael Felipe Laiton Chaparro',
    'Michael Felipe Laiton Chaparro',
    'Michael Felipe Laiton Chaparro',
  ]);

  const [description, setDescription] = useState('');
  const [justification, setJustification] = useState('');
  const [objective, setObjective] = useState('');
  const [problem, setProblem] = useState('');
  const [isError, setIsError] = useState(false);

  const handleCreate = () => {
    if (!description || !justification || !objective || !problem) {
      setIsError(true);
      toast.error('¡No coinciden los campos!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: { backgroundColor: '#f44336', color: '#fff' },
      });
      return;
    }
   
    setIsError(false); 
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="fixed inset-0 bg-custom-blue opacity-50"></div>
        <div className="relative w-3/5 my-12 mx-auto bg-white rounded-lg shadow-xl border-2 border-gray-300 p-8">
          <h2 className="font-inter font-semibold text-2xl pb-3 border-b-2 border-gray-600 w-max mx-auto">Agregar información del Team</h2>

          <div className="grid grid-cols-5 gap-4 pt-12">
            <div className="col-span-2">
              <span className="font-inter font-semibold text-base">Aprendices</span>
              <div className="w-full h-[182%] bg-white rounded-lg shadow-xl border-2 border-gray-300 mt-2">
                <form className="pt-3 px-4">
                  <div className="relative">
                    <input type="search" className="block w-full h-8 pl-8 pr-4 text-sm text-gray-900 border border-gray-300 rounded-lg" placeholder="Filtrar aprendices"/>
                    <svg className="absolute left-2 top-2 w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                </form>

                <div className="pt-4 px-4 h-48 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
                    <tbody>
                      {selectedApprentices.map((apprentice, index) => (
                        <tr key={index}>
                          <td className="px-2 py-1 border-2 border-gray-300 text-sm">
                            {apprentice}
                          </td>
                          <td className="px-2 py-1 border-2 border-gray-300 text-green-500 font-semibold text-xl">✓</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-span-3 flex flex-col items-end mr-48">
              <span className="font-inter font-semibold text-base mr-20">Aprendices seleccionados</span>
              <div className="w-auto bg-neutral-200 rounded-lg shadow-xl border-2 border-gray-300 mt-2 p-4">
                {selectedApprentices.map((apprentice, index) => (
                  <div key={index} className="text-sm mb-1">
                    {apprentice}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 ml-10 pb-10 -mt-4">
            <div className={`flex flex-col items-start ml-96 ${isError && !problem ? 'border-red-500' : 'border-gray-300'}`}>
              <span className="font-inter font-semibold text-sm">Problematica</span>
              <div className={`w-72 h-24 bg-white rounded-lg shadow-xl mt-2 p-4 ${isError && !problem ? 'border-2 border-red-500' : 'border-2 border-gray-300'}`}>
                <textarea className="w-full h-full bg-transparent border-none outline-none resize-none" placeholder="Problematica" value={problem} onChange={(e) => setProblem(e.target.value)}/>
              </div>
            </div>

            <div className={`flex flex-col items-start ml-52 ${isError && !description ? 'border-red-500' : 'border-gray-300'}`}>
              <span className="font-inter font-semibold text-sm">Descripción</span>
              <div className={`w-72 h-24 bg-white rounded-lg shadow-xl mt-2 p-4 ${isError && !description ? 'border-2 border-red-500' : 'border-2 border-gray-300'}`}>
                <textarea className="w-full h-full bg-transparent border-none outline-none resize-none" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)}/>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 ml-10 pb-10 -mt-4">
            <div className={`flex flex-col items-start ml-96 ${isError && !objective ? 'border-red-500' : 'border-gray-300'}`}>
              <span className="font-inter font-semibold text-sm">Objetivo</span>
              <div className={`w-72 h-24 bg-white rounded-lg shadow-xl mt-2 p-4 ${isError && !objective ? 'border-2 border-red-500' : 'border-2 border-gray-300'}`}>
                <textarea className="w-full h-full bg-transparent border-none outline-none resize-none" placeholder="Objetivo" value={objective} onChange={(e) => setObjective(e.target.value)}/>
              </div>
            </div>

            <div className={`flex flex-col items-start ml-52 ${isError && !justification ? 'border-red-500' : 'border-gray-300'}`}>
              <span className="font-inter font-semibold text-sm">Justificación</span>
              <div className={`w-72 h-24 bg-white rounded-lg shadow-xl mt-2 p-4 ${isError && !justification ? 'border-2 border-red-500' : 'border-2 border-gray-300'}`}>
                <textarea className="w-full h-full bg-transparent border-none outline-none resize-none" placeholder="Justificación" value={justification} onChange={(e) => setJustification(e.target.value)}/>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button onClick={onClose} className="w-44 rounded-md px-6 border-2 border-neutral-400 bg-neutral-200 text-black transition-colors mr-96 font-inter font-medium text-xl ">
              Cancelar
            </button>

            <button onClick={handleCreate} className="w-44 rounded-md border-2 border-custom-blue transition-colors bg-custom-blue px-6 py-2 ml-10 text-white font-inter font-medium text-xl ">
              Crear
            </button>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default ModalAddinformation;