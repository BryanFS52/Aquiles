import React, { useState } from 'react';

const ApprenticeModal = ({ isOpen, onClose, students }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filtrar estudiantes en base al término de búsqueda
  const filteredStudents = students.filter(apprentice =>
    `${apprentice.name} ${apprentice.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejador para cerrar el modal al hacer clic fuera del modal
  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-25"
      onClick={handleClickOutside}  // Detectar clics fuera del modal
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Información de Aprendices</h2>

        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar aprendiz por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />

        {filteredStudents && filteredStudents.length > 0 ? (
          <div className="space-y-4">
            {filteredStudents.map((apprentice) => (
              <ApprenticeCard key={apprentice.id} apprentice={apprentice} />
            ))}
          </div>
        ) : (
          <p>No hay aprendices disponibles.</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

const ApprenticeCard = ({ apprentice }) => {
  const statusColor = {
    'Activo': 'bg-green-500',
    'Inactivo': 'bg-red-500',
    'Graduado': 'bg-blue-500',
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <img
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${apprentice.name} ${apprentice.lastName}`}
              alt={`${apprentice.name} ${apprentice.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {apprentice.name} {apprentice.lastName}
          </h3>

          <p className="text-sm text-gray-500">Tipo: {apprentice.typeDocument}</p>
          <p className="text-sm text-gray-500">Documento: {apprentice.document}</p>
        </div>
        <span className={`text-white px-2 py-1 rounded ${statusColor[apprentice.status]}`}>
          {apprentice.status}
        </span>
      </div>
      <div className="mt-2">
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div>
          <dt className="font-medium">Email:</dt>
          <dd>{apprentice.email}</dd>
            <dt className="font-medium">Teléfono:</dt>
            <dd>{apprentice.phone}</dd>
          </div>
          <div>
          <dt className="font-medium">Tipo de Sangre:</dt>
          <dd>{apprentice.blood_type}</dd>
            <dt className="font-medium">Fecha Nacimiento:</dt>
            <dd>{apprentice.date_birth}</dd>
            
          </div>
          <div className="col-span-2">
            <dt className="font-medium">Curso:</dt>
            <dd>{apprentice.course}</dd>
          </div>
          <div className="col-span-2">
            <dt className="font-medium">Progreso:</dt>
            <dd className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#305b56] h-2.5 rounded-full"
                  style={{ width: `${apprentice.progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">{apprentice.progress}% completado</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ApprenticeModal;
