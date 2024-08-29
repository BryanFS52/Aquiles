// components/TableAttendance.js

import React from 'react';
import { useApprenticeContext } from '../contexts/ApprenticeContext';
import { GoSearch } from 'react-icons/go';
import { BsQrCode } from 'react-icons/bs';
import { FaEye } from 'react-icons/fa';
import { VscEye } from 'react-icons/vsc';
import { IoMdExit } from 'react-icons/io';
import ModalInfoficha from '../components/Modals/modalInfoficha';
import ModalQR from '../components/Modals/modalQR';

export const TableAttendance = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalQROpen, setModalQROpen] = useState(false);
    const { apprentices } = useApprenticeContext();

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

    return (
        <div className="w-11/12 h-auto rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 relative mb-4 p-4 ml-10 mt-10">
            {/* ...resto del componente */}
            <div className="container mx-auto">
                <div className="overflow-x-auto mt-4 bg-gray-100 mb-5">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 table-auto">
                        <thead className="bg-gray-50">
                            {/* ...encabezados */}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                            {apprentices.map((apprentice, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 border-2 border-gray-300 text-sm">{apprentice.documento}</td>
                                    <td className="px-2 border-2 border-gray-300 text-sm">{`${apprentice.nombreAprendiz} ${apprentice.apellidosAprendiz}`}</td>
                                    {/* Aquí puedes añadir celdas para los días de la semana */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
