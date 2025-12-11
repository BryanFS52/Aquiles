"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { TEMPORAL_COORDINATOR_ID } from "@/temporaryCredential";
import { MdAddCircle } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import ModalFichas from "@components/Modals/modalFichas";
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";

const CrearFichasContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: studySheets, loading, error } = useSelector(
    (state: RootState) => state.studySheet
  );

  // 🔹 Manejo de modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="p-6 space-y-8">
      <PageTitle>Fichas Asignadas</PageTitle>

      {/* Modal de creación */}
      <ModalFichas
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Botón para abrir modal */}
      <div className="flex justify-start">
        <button
          onClick={handleOpenModal}
          className="px-6 py-3 flex items-center gap-2 bg-gradient-to-r from-primary to-lightGreen dark:from-secondary dark:to-darkBlue text-white rounded-lg font-medium hover:shadow-md hover:scale-105 transition-all duration-200"
        >
          <MdAddCircle className="w-5 h-5" />
          Añadir Ficha
        </button>
      </div>

      {/* Renderizado condicional */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando fichas...</p>
        </div>
      ) : error ? (
        <EmptyState
          message={`Error al cargar fichas: ${typeof error === "string" ? error : "Error desconocido"}`}
        />
      ) : studySheets.length === 0 ? (
        <EmptyState message="No hay fichas disponibles" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {studySheets.map((ficha: any) => (
            <div
              key={ficha.id}
              className="group relative bg-white dark:bg-shadowBlue rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-lightGray dark:border-grayText"
            >
              {/* Decoración */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-lightGreen/10 dark:from-secondary/10 dark:to-darkBlue/10 rounded-bl-full -z-0"></div>

              {/* Contenido */}
              <div className="relative p-6 z-10 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-grayText dark:text-white mb-1">
                    Ficha
                  </h3>
                  <p className="text-2xl font-bold text-primary dark:text-secondary">
                    {ficha.number || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-grayText dark:text-white mb-1">
                    Programa
                  </h3>
                  <p className="text-base font-medium text-darkGray dark:text-white line-clamp-2">
                    {ficha.trainingProject?.program?.name || "N/A"}
                  </p>
                </div>

                <a
                  href={`/dashboard/teamScrum/${ficha.id}`}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                >
                  Ver Teams Scrum
                  <FaArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CrearFichasContainer;
