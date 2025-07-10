'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type Person = {
  id: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  blood_type?: string;
  date_birth: string;
  typeDocument?: string;
  document?: string;
  status?: 'Activo' | 'Inactivo' | 'Graduado';
  course?: string;
  progress?: number;
};

type Student = {
  person?: Person;
};

type ApprenticeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  students?: Student[];
};

export default function ApprenticeModal({ isOpen, onClose, students = [] }: ApprenticeModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setSearchTerm('');
  }, [isOpen]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  const filtered = students.filter(({ person }) => {
    const fullName = `${person?.name ?? ''} ${person?.lastname ?? ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div
      ref={overlayRef}
      onClick={handleClickOutside}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 m-0 p-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mt-0">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Información de Aprendices
        </h2>

        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(({ person }, i) => (
              person && <ApprenticeCard key={person.id || i} person={person} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300 mt-8">
            No hay aprendices disponibles.
          </p>
        )}

        <div className="mt-10 flex justify-center">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function ApprenticeCard({ person }: { person: Person }) {
  const statusColor = {
    Activo: 'bg-green-500',
    Inactivo: 'bg-red-500',
    Graduado: 'bg-blue-500',
  };

  return (
    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-md">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300 dark:border-gray-500">
          <Image
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${person.name} ${person.lastname}`}
            alt={`${person.name} ${person.lastname}`}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {person.name} {person.lastname}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {person.id}</p>
        </div>
        <span className={`text-white px-2 py-1 text-sm rounded ${statusColor[person.status ?? 'Activo']}`}>
          {person.status ?? 'Activo'}
        </span>
      </div>

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <Info label="Email" value={person.email} />
        <Info label="Teléfono" value={person.phone} />
        <Info label="Tipo de Sangre" value={person.blood_type} />
        <Info label="Nacimiento" value={new Date(person.date_birth).toLocaleDateString('es-CO')} />
        {person.typeDocument && <Info label="Tipo Documento" value={person.typeDocument} />}
        {person.document && <Info label="Documento" value={person.document} />}
        {person.course && <Info label="Curso" value={person.course} span />}
        {typeof person.progress === 'number' && (
          <div className="md:col-span-2">
            <dt className="font-medium text-gray-900 dark:text-white">Progreso</dt>
            <dd>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mt-1">
                <div
                  className="bg-teal-700 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${person.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                {person.progress}% completado
              </span>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

function Info({ label, value, span = false }: { label: string; value?: string; span?: boolean }) {
  if (!value) return null;
  return (
    <div className={span ? 'md:col-span-2' : ''}>
      <dt className="font-medium text-gray-900 dark:text-white">{label}</dt>
      <dd className="text-gray-700 dark:text-gray-300 break-words">{value}</dd>
    </div>
  );
}
