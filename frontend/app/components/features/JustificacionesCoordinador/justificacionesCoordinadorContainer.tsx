"use client";

import React, { useState } from "react";
import InfoCard from "./InfoCard";
import JustificationCoordinatorModal from "../../Modals/JustificationCoordinatorModal";
import PageTitle from "@/components/UI/pageTitle";

// Datos quemados de fichas
const fichasData = [
  {
    id: "1",
    numeroFicha: "2558104",
    totalAprendices: 32,
    justificacionesPendientes: 8,
    justificacionesAprobadas: 45,
    justificacionesRechazadas: 3,
  },
  {
    id: "2",
    numeroFicha: "2558105",
    totalAprendices: 28,
    justificacionesPendientes: 5,
    justificacionesAprobadas: 38,
    justificacionesRechazadas: 2,
  },
  {
    id: "3",
    numeroFicha: "2558106",
    totalAprendices: 25,
    justificacionesPendientes: 12,
    justificacionesAprobadas: 52,
    justificacionesRechazadas: 7,
  },
  {
    id: "4",
    numeroFicha: "2558107",
    totalAprendices: 30,
    justificacionesPendientes: 3,
    justificacionesAprobadas: 41,
    justificacionesRechazadas: 1,
  },
];

const JustificacionesCoordinadorContainer: React.FC = () => {
  const [selectedFicha, setSelectedFicha] = useState<typeof fichasData[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFichaClick = (ficha: typeof fichasData[0]) => {
    setSelectedFicha(ficha);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFicha(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
          <PageTitle>Gestión de Justificaciones por Ficha</PageTitle>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {fichasData.map((ficha) => (
          <InfoCard
            key={ficha.id}
            ficha={ficha}
            onClick={() => handleFichaClick(ficha)}
          />
        ))}
      </div>

      {selectedFicha && (
        <JustificationCoordinatorModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          fichaData={selectedFicha}
        />
      )}
    </div>
  );
};

export default JustificacionesCoordinadorContainer;