import React, { useEffect, useState } from 'react';
import { getAllApprentices } from "../services/apprenticeService";
import { GoSearch } from "react-icons/go";
import { BsQrCode } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import ModalInfoficha from "../components/Modals/modalInfoficha";
import ModalQR from "../components/Modals/modalQR";

const TablaApprentices = () => {
  const [apprentices, setApprentices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalQROpen, setModalQROpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Llamada al servicio para obtener todos los aprendices
    const fetchApprentices = async () => {
      try {
        const apprenticesData = await getAllApprentices();
        setApprentices(apprenticesData);
      } catch (error) {
        console.error('Error al obtener la lista de aprendices:', error);
      }
    };

    fetchApprentices();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenQRModal = () => {
    setModalQROpen(true);
  };

  const handleCloseQRModal = () => {
    setModalQROpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredApprentices = apprentices.filter((apprentice) =>
    apprentice.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-11/12 h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-10 mt-10">
      <div className="flex bg-white w-full h-14 items-center">
        <form className="w-auto h-7">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <GoSearch className="text-gray-400" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-7 block w-52 pl-10 pr-4 text-sm rounded-lg dark:bg-white border-2 border-slate-300 dark:placeholder-gray-400 dark:text-black focus:outline-none focus:border-slate-300"
              placeholder="Buscar aprendiz:"
            />
          </div>
        </form>

        <div className="mr-7 ml-auto flex space-x-4">
          <button
            type="button"
            className="text-white font-inter font-normal h-11 w-54 rounded-lg text-sm px-3 bg-custom-blue hover:bg-[#01b001] transition-colors duration-300 dark:focus:ring-custom-blue flex items-center mb-2 lg:mb-0"
            onClick={handleOpenQRModal}
          >
            Toma de Asistencia
            <BsQrCode className="w-4 h-4 ml-3" />
          </button>
          <ModalQR isOpen={modalQROpen} onClose={handleCloseQRModal} />
        </div>

        <div className="mr-10">
          <button
            type="button"
            className="text-white font-inter font-normal h-11 w-54 rounded-lg text-sm px-3 bg-custom-blue hover:bg-[#01b001] transition-colors duration-300 dark:focus:ring-custom-blue flex items-center mb-2 lg:mb-0"
            onClick={handleOpenModal}
          >
            Ver información de la ficha
            <FaEye className="w-5 h-5 ml-2" />
          </button>
          <ModalInfoficha isOpen={modalOpen} onClose={handleCloseModal} />
        </div>
      </div>

      {/* Tabla de lista de aprendices */}
      <div className="container mx-auto">
        <div className="overflow-x-auto mt-4 bg-gray-100 mb-5">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-10 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-2 border-gray-300">
                  Número de Documento
                </th>
                <th className="px-6 py-3 text-xs text-center text-gray-700 uppercase tracking-wider border-2 border-gray-300">
                  Nombre y Apellido
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {filteredApprentices.length > 0 ? (
                filteredApprentices.map((apprentice) => (
                  <tr key={apprentice.documentNumber}>
                    <td className="px-4 py-3 border-2 border-gray-300 text-sm">
                      {apprentice.documentNumber}
                    </td>
                    <td className="px-2 border-2 border-gray-300 text-sm">
                      {apprentice.name} {apprentice.lastName || ''}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    No hay aprendices registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablaApprentices;
