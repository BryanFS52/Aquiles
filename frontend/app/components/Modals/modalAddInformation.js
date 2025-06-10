import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addProject, fetchProjectById } from '@services/projectService';

const allApprentices = [
  'Michael Felipe Laiton Chaparro',
  'Laura Gómez Rojas',
  'Santiago Torres Pérez',
  'Juliana Díaz Martínez',
  'Andrés Camilo Rodríguez',
];

const ModalAddInformation = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setProjectId(null); // limpiar al cerrar
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const [search, setSearch] = useState('');
  const [selectedApprentices, setSelectedApprentices] = useState([]);
  const [description, setDescription] = useState('');
  const [justification, setJustification] = useState('');
  const [objectives, setObjectives] = useState('');
  const [problem, setProblem] = useState('');
  const [isError, setIsError] = useState(false);

  // NUEVO: para guardar id del proyecto creado y mostrar modal detalle
  const [projectId, setProjectId] = useState(null);
  const [projectDetail, setProjectDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleToggleApprentice = (name) => {
    if (selectedApprentices.includes(name)) {
      setSelectedApprentices(selectedApprentices.filter((a) => a !== name));
    } else {
      setSelectedApprentices([...selectedApprentices, name]);
    }
  };

  const filteredApprentices = allApprentices.filter((a) =>
    a.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!description || !justification || !objectives || !problem) {
      setIsError(true);
      toast.error('¡No coinciden los campos!', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
        style: { backgroundColor: '#f44336', color: '#fff' },
      });
      return;
    }
    setIsError(false);

    const input = {
      problem,
      description,
      objectives,
      justification,
      members: selectedApprentices,
    };

    try {
      const response = await addProject(input);
      console.log('Respuesta de creación:', response);

      if (!response || !response.id) {
        throw new Error('No se pudo obtener el ID del proyecto creado');
      }

      toast.success(`Proyecto creado exitosamente`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
        style: { backgroundColor: '#4caf50', color: '#fff' },
      });
      onClose();
    } catch (error) {
      toast.error(`Error al crear proyecto: ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
        style: { backgroundColor: '#f44336', color: '#fff' },
      });
    }
  };


  // Traer detalles del proyecto al abrir modal detalle
  useEffect(() => {
    if (!showDetailModal || !projectId) return;

    setLoadingDetail(true);
    fetchProjectById(projectId)
      .then((data) => {
        setProjectDetail(data);
        setLoadingDetail(false);
      })
      .catch((err) => {
        setErrorDetail(err.message);
        setLoadingDetail(false);
      });
  }, [showDetailModal, projectId]);

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setProjectDetail(null);
    setProjectId(null);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-40 px-4 py-6">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-xl shadow-lg p-6 md:p-8 relative font-kiwi-marumaru overflow-auto">
            <h2 className="text-2xl text-center font-semibold text-darkBlue mb-6 px-2 md:px-0">
              Agregar <span className="text-shadowBlue">información</span> del Team
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold text-darkGray">Aprendices</label>
                <div className="border border-lightGray rounded-lg mt-2 shadow-sm flex flex-col h-60 md:h-[260px] overflow-hidden">
                  <input
                    type="text"
                    className="px-3 py-2 border-b border-lightGray text-sm outline-none"
                    placeholder="Filtrar aprendices..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-white">
                    {filteredApprentices.map((apprentice, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm px-2 py-1 border-b cursor-pointer hover:bg-lightGray rounded"
                        onClick={() => handleToggleApprentice(apprentice)}
                      >
                        <span>{apprentice}</span>
                        {selectedApprentices.includes(apprentice) && (
                          <span className="text-lightGreen text-lg">✓</span>
                        )}
                      </div>
                    ))}
                    {filteredApprentices.length === 0 && (
                      <p className="text-center text-sm text-darkGray">No hay coincidencias</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-darkGray">Aprendices seleccionados</label>
                <div className="bg-lightGray border border-lightGray rounded-lg mt-2 shadow-sm p-3 h-60 md:h-[260px] overflow-y-auto space-y-1 text-sm">
                  {selectedApprentices.length === 0 ? (
                    <p className="text-darkGray">Ningún aprendiz seleccionado</p>
                  ) : (
                    selectedApprentices.map((apprentice, index) => (
                      <div key={index}>{apprentice}</div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {[
                { label: 'Problemática', value: problem, setter: setProblem },
                { label: 'Descripción', value: description, setter: setDescription },
                { label: 'Objetivo', value: objectives, setter: setObjectives },
                { label: 'Justificación', value: justification, setter: setJustification },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="text-sm font-semibold text-darkGray">{label}</label>
                  <textarea
                    className={`mt-2 w-full min-h-[100px] md:min-h-[96px] p-3 border rounded-lg resize-y shadow-sm ${isError && !value ? 'border-red-500' : 'border-lightGray'
                      }`}
                    placeholder={`Escribe ${label.toLowerCase()}...`}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-end mt-8 gap-4 px-2 md:px-0">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-lightGray text-darkGray bg-lightGray rounded-lg hover:bg-darkGray hover:text-white transition font-medium w-full md:w-auto"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-2 bg-darkBlue text-white rounded-lg hover:bg-shadowBlue transition font-medium w-full md:w-auto"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle proyecto */}
      {showDetailModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 px-4 py-6">
          <div className="bg-white max-w-xl w-full rounded-lg shadow-lg p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Detalle del Proyecto</h3>

            {loadingDetail && <p>Cargando...</p>}
            {errorDetail && <p className="text-red-600">Error: {errorDetail}</p>}
            {projectDetail && (
              <div className="space-y-2">
                <p><strong>Nombre:</strong> {projectDetail.name}</p>
                <p><strong>Descripción:</strong> {projectDetail.description}</p>
                <p><strong>Problemática:</strong> {projectDetail.problem}</p>
                <p><strong>Objetivos:</strong> {projectDetail.objectives}</p>
                <p><strong>Justificación:</strong> {projectDetail.justification}</p>
                <p><strong>Miembros:</strong> {projectDetail.members?.join(', ')}</p>
              </div>
            )}

            <button
              onClick={closeDetailModal}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalAddInformation;