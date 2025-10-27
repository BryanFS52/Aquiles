"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { fetchStudySheetsWithCoordinationId, addStudySheet } from "@slice/olympo/studySheetSlice";
import { TEMPORAL_COORDINATOR_ID } from "@/temporaryCredential";
import { MdAddCircle } from "react-icons/md";
import { FaArrowRight, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import ModalFichas from "@components/Modals/modalFichas";
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";

const CrearFichasContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Obtener datos de Redux
  const { data: studySheets, loading, error } = useSelector((state: RootState) => state.studySheet);

  // Cargar fichas cuando tengamos la coordinación
  useEffect(() => {
      dispatch(fetchStudySheetsWithCoordinationId({ 
        coordinationId: TEMPORAL_COORDINATOR_ID, 
        page: 0, 
        size: 10
      }));
  }, [dispatch]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateFicha = async (newFicha: any) => {
    try {
      await dispatch(addStudySheet(newFicha)).unwrap();
      toast.success('¡Nueva Ficha creada con éxito!');
      // Recargar la lista de fichas
      dispatch(fetchStudySheetsWithCoordinationId({ 
        coordinationId: TEMPORAL_COORDINATOR_ID, 
        page: 0, 
        size: 10 
      }));
      handleCloseModal();
    } catch (error) {
      console.error("Error al crear ficha:", error);
      toast.error('Error al crear ficha.');
    }
  };

  return (
    <div className="p-6">
      <PageTitle>Fichas Asignadas</PageTitle>

      {/* Modales */}
      <ModalFichas isOpen={isModalOpen} onClose={handleCloseModal} onCreate={handleCreateFicha} />

      <div className="mt-8">
        {/* Botón para crear nueva ficha */}
        <div className="mb-6">
          <button
            onClick={handleOpenModal}
            className="px-6 py-3 text-white bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 rounded-lg font-medium transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 inline-flex items-center gap-2"
          >
            <MdAddCircle className="w-5 h-5" />
            Añadir Ficha
          </button>
        </div>

        {/* Contenido */}
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="font-semibold text-red-800 dark:text-red-200">Error al cargar fichas:</p>
            <p className="text-red-600 dark:text-red-300 mt-2">
              {typeof error === 'string' ? error : error.message || 'Error desconocido'}
            </p>
          </div>
        ) : loading ? (
          <div className="bg-white dark:bg-shadowBlue rounded-xl p-12 text-center border border-lightGray dark:border-grayText">
            <div className="w-16 h-16 bg-lightGreen/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lightGreen"></div>
            </div>
            <h3 className="text-xl font-semibold text-darkGray dark:text-white mb-2">
              Cargando fichas...
            </h3>
            <p className="text-grayText dark:text-white">
              Por favor espera.
            </p>
          </div>
        ) : studySheets.length === 0 ? (
          <EmptyState
            message="No hay fichas disponibles"
            icon="/img/LogoAquilesWhite.png"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {studySheets.map((ficha: any) => (
              <div
                key={ficha.id}
                className="group relative bg-white dark:bg-shadowBlue rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-lightGray dark:border-grayText"
              >
                {/* Degradado decorativo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-lightGreen/10 dark:from-secondary/10 dark:to-darkBlue/10 rounded-bl-full -z-0"></div>

                {/* Contenido */}
                <div className="relative p-6 z-10">
                  {/* Info de la ficha */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-grayText dark:text-white mb-1">
                        Ficha
                      </h3>
                      <p className="text-2xl font-bold text-primary dark:text-secondary">
                        {ficha.number || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-grayText dark:text-white mb-1">
                        Programa
                      </h3>
                      <p className="text-base font-medium text-darkGray dark:text-white line-clamp-2">
                        {ficha.trainingProject?.program?.name || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Botón ir a Teams Scrum */}
                  <a
                    href={`/dashboard/teamScrum/${ficha.id}`}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-lightGreen hover:from-primary/90 hover:to-lightGreen/90 dark:from-secondary dark:to-darkBlue dark:hover:from-secondary/90 dark:hover:to-darkBlue/90 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md"
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
    </div>
  );
}

export default CrearFichasContainer;