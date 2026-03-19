"use client";

import { useState } from 'react';
// ⬇️ DESCOMENTAR ESTAS LÍNEAS PARA USAR DATOS REALES ⬇️
// import { useEffect } from 'react';
// import { useLoader } from '@context/LoaderContext';
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchPrograms } from '@redux/slices/olympo/programSlice';
// import type { AppDispatch, RootState } from '@redux/store';
// ⬆️ DESCOMENTAR ESTAS LÍNEAS PARA USAR DATOS REALES ⬆️

import PageTitle from '@components/UI/pageTitle';
import { Program } from '@graphql/generated';
import { SearchBar } from './SearchBar';
import { ProgramsGrid } from './ProgramsGrid';
import { Pagination } from './Pagination';
import Modal from '@components/UI/Modal';

// Constants
const ITEMS_PER_PAGE = 12;

// ⚠️  ELIMINAR ESTA SECCIÓN COMPLETA CUANDO USES DATOS REALES ⚠️
const MOCK_PROGRAMS: Program[] = [
  {
    id: '1',
    name: 'Tecnología en Desarrollo de Software',
    description: 'Programa enfocado en el desarrollo de aplicaciones web y móviles con tecnologías modernas.',
    state: true,
    coordination: {
      id: '1',
      name: 'Coordinación de Software',
      state: true
    },
    trainingLevel: {
      id: '1',
      name: 'Tecnólogo',
      state: true
    }
  },
  {
    id: '2',
    name: 'Técnico en Sistemas',
    description: 'Programa técnico para el soporte y mantenimiento de sistemas informáticos.',
    state: true,
    coordination: {
      id: '2',
      name: 'Coordinación de IT',
      state: true
    },
    trainingLevel: {
      id: '2',
      name: 'Técnico',
      state: true
    }
  },
  {
    id: '3',
    name: 'Ingeniería de Sistemas',
    description: 'Programa profesional en ingeniería de sistemas y desarrollo de software avanzado.',
    state: true,
    coordination: {
      id: '1',
      name: 'Coordinación de Software',
      state: true
    },
    trainingLevel: {
      id: '3',
      name: 'Profesional',
      state: true
    }
  },
  {
    id: '4',
    name: 'Análisis y Desarrollo de Software',
    description: 'Programa enfocado en análisis de requerimientos y arquitectura de software.',
    state: true,
    coordination: {
      id: '3',
      name: 'Coordinación de Análisis',
      state: true
    },
    trainingLevel: {
      id: '1',
      name: 'Tecnólogo',
      state: true
    }
  },
  {
    id: '5',
    name: 'Redes y Telecomunicaciones',
    description: 'Programa especializado en infraestructura de redes y comunicaciones.',
    state: true,
    coordination: {
      id: '4',
      name: 'Coordinación de Redes',
      state: true
    },
    trainingLevel: {
      id: '1',
      name: 'Tecnólogo',
      state: true
    }
  },
  {
    id: '6',
    name: 'Ciberseguridad',
    description: 'Programa especializado en seguridad informática y protección de datos.',
    state: false, // Programa inactivo para probar diferentes estados
    coordination: {
      id: '5',
      name: 'Coordinación de Seguridad',
      state: true
    },
    trainingLevel: {
      id: '2',
      name: 'Técnico',
      state: true
    }
  },
  {
    id: '7',
    name: 'Inteligencia Artificial',
    description: 'Programa de vanguardia en machine learning y desarrollo de IA.',
    state: true,
    coordination: {
      id: '6',
      name: 'Coordinación de IA',
      state: true
    },
    trainingLevel: {
      id: '3',
      name: 'Profesional',
      state: true
    }
  },
  {
    id: '8',
    name: 'DevOps y Cloud Computing',
    description: 'Programa especializado en integración continua y servicios en la nube.',
    state: true,
    coordination: {
      id: '7',
      name: 'Coordinación de Cloud',
      state: true
    },
    trainingLevel: {
      id: '1',
      name: 'Tecnólogo',
      state: true
    }
  },
  {
    id: '9',
    name: 'Marketing Digital',
    description: 'Programa enfocado en estrategias digitales y publicidad online.',
    state: true,
    coordination: {
      id: '8',
      name: 'Coordinación de Marketing',
      state: true
    },
    trainingLevel: {
      id: '2',
      name: 'Técnico',
      state: true
    }
  },
  {
    id: '10',
    name: 'Diseño Gráfico Digital',
    description: 'Programa de diseño visual y multimedia para medios digitales.',
    state: true,
    coordination: {
      id: '9',
      name: 'Coordinación de Diseño',
      state: true
    },
    trainingLevel: {
      id: '1',
      name: 'Tecnólogo',
      state: true
    }
  },
  {
    id: '11',
    name: 'Administración de Empresas',
    description: 'Programa de gestión empresarial y administración de recursos.',
    state: true,
    coordination: {
      id: '10',
      name: 'Coordinación Administrativa',
      state: true
    },
    trainingLevel: {
      id: '3',
      name: 'Profesional',
      state: true
    }
  },
  {
    id: '12',
    name: 'Contabilidad y Finanzas',
    description: 'Programa especializado en contabilidad empresarial y análisis financiero.',
    state: false,
    coordination: {
      id: '11',
      name: 'Coordinación Contable',
      state: true
    },
    trainingLevel: {
      id: '2',
      name: 'Técnico',
      state: true
    }
  },
  {
    id: '13',
    name: 'Enfermería',
    description: 'Programa de cuidado y atención integral de la salud.',
    state: true,
    coordination: {
      id: '12',
      name: 'Coordinación de Salud',
      state: true
    },
    trainingLevel: {
      id: '3',
      name: 'Profesional',
      state: true
    }
  },
  {
    id: '14',
    name: 'Gastronomía',
    description: 'Programa de artes culinarias y gestión gastronómica.',
    state: true,
    coordination: {
      id: '13',
      name: 'Coordinación Gastronómica',
      state: true
    },
    trainingLevel: {
      id: '1',
      name: 'Tecnólogo',
      state: true
    }
  },
  {
    id: '15',
    name: 'Mecánica Automotriz',
    description: 'Programa de diagnóstico y reparación de vehículos.',
    state: true,
    coordination: {
      id: '14',
      name: 'Coordinación Automotriz',
      state: true
    },
    trainingLevel: {
      id: '2',
      name: 'Técnico',
      state: true
    }
  },
  {
    id: '16',
    name: 'Energías Renovables',
    description: 'Programa de sistemas de energía solar y eólica.',
    state: true,
    coordination: {
      id: '15',
      name: 'Coordinación de Energías',
      state: true
    },
    trainingLevel: {
      id: '1',
      name: 'Tecnólogo',
      state: true
    }
  },
  {
    id: '17',
    name: 'Construcción Civil',
    description: 'Programa de edificaciones y obras de infraestructura.',
    state: true,
    coordination: {
      id: '16',
      name: 'Coordinación de Construcción',
      state: true
    },
    trainingLevel: {
      id: '2',
      name: 'Técnico',
      state: true
    }
  },
  {
    id: '18',
    name: 'Agricultura Sostenible',
    description: 'Programa de técnicas agrícolas ecológicas y sustentables.',
    state: false,
    coordination: {
      id: '17',
      name: 'Coordinación Agrícola',
      state: true
    },
    trainingLevel: {
      id: '1',
      name: 'Tecnólogo',
      state: true
    }
  },
  {
    id: '19',
    name: 'Psicología',
    description: 'Programa de estudio del comportamiento humano y procesos mentales.',
    state: true,
    coordination: {
      id: '18',
      name: 'Coordinación de Psicología',
      state: true
    },
    trainingLevel: {
      id: '3',
      name: 'Profesional',
      state: true
    }
  },
  {
    id: '20',
    name: 'Educación Infantil',
    description: 'Programa de formación para la enseñanza y cuidado de niños.',
    state: true,
    coordination: {
      id: '19',
      name: 'Coordinación de Educación',
      state: true
    },
    trainingLevel: {
      id: '2',
      name: 'Técnico',
      state: true
    }
  },
  {
    id: '21',
    name: 'Derecho',
    description: 'Programa de estudios jurídicos y formación legal.',
    state: true,
    coordination: {
      id: '20',
      name: 'Coordinación de Derecho',
      state: true
    },
    trainingLevel: {
      id: '3',
      name: 'Profesional',
      state: true
    }
  },
  {
    id: '22',
    name: 'Arquitectura',
    description: 'Programa de diseño arquitectónico y urbanismo.',
    state: true,
    coordination: {
      id: '21',
      name: 'Coordinación de Arquitectura',
      state: true
    },
  },
  {
    id: '23',
    name: 'Filosofía',
    description: 'Programa de estudio de la filosofía y pensamiento crítico.',
    state: true,
    coordination: {
      id: '22',
      name: 'Coordinación de Filosofía',
      state: true
    },
    trainingLevel: {
      id: '3',
      name: 'Profesional',
      state: true
    }
  },
  {
    id: '24',
    name: 'Historia',
    description: 'Programa de estudio de la historia mundial y regional.',
    state: true,
    coordination: {
      id: '23',
      name: 'Coordinación de Historia',
      state: true
    },
    trainingLevel: {
      id: '2',
      name: 'Técnico',
      state: true
    }
  },
  {
    id: '25',
    name: 'Literatura',
    description: 'Programa de estudio de la literatura clásica y contemporánea.',
    state: true,
    coordination: {
      id: '24',
      name: 'Coordinación de Literatura',
      state: true
    },
    trainingLevel: {
      id: '1',
      name: 'Tecnólogo',
      state: true
    }
  }
];
// 🎭 ============ FIN DE DATOS MOCK ============

const ProgramasCoordinadorContainer: React.FC = () => {
  // 🎭 ===== USANDO DATOS MOCK =====
  // ⚠️ ELIMINAR ESTAS LÍNEAS CUANDO USES DATOS REALES ⚠️
  const programs = MOCK_PROGRAMS;
  const loading = false;
  const error = null;
  
  // ⬇️ DESCOMENTAR ESTAS LÍNEAS PARA USAR DATOS REALES ⬇️
  // const dispatch = useDispatch<AppDispatch>();
  // const { data: programs, loading, error } = useSelector((state: RootState) => state.program);
  // const { showLoader, hideLoader } = useLoader();
  // ⬆️ DESCOMENTAR ESTAS LÍNEAS PARA USAR DATOS REALES ⬆️
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const normalizeText = (text: string): string =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  // ⬇️ DESCOMENTAR ESTE useEffect PARA USAR DATOS REALES ⬇️
  // useEffect(() => {
  //   const fetchProgramsData = async (): Promise<void> => {
  //     showLoader();
  //     try {
  //       await dispatch(fetchPrograms({ page: 0, size: 100 })).unwrap();
  //     } catch (err) {
  //       toast.error("No se pudieron cargar los programas.");
  //       console.error(err);
  //     } finally {
  //       hideLoader();
  //     }
  //   };

  //   fetchProgramsData();
  // }, [dispatch]);
  // ⬆️ DESCOMENTAR ESTE useEffect PARA USAR DATOS REALES ⬆️

  const normalizedSearchTerm = normalizeText(searchTerm);
  const filteredPrograms: Program[] = programs.filter((program: Program) => {
    if (!normalizedSearchTerm) return true;
    const normalizedProgramName = normalizeText(program.name || '');
    return normalizedProgramName.includes(normalizedSearchTerm);
  });

  const totalPages: number = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  const displayedPrograms: Program[] = filteredPrograms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a página 1 al buscar
  };

  const handleProgramClick = (program: Program): void => {
    setSelectedProgram(program);
  };

  const totalPrograms = filteredPrograms.length;
  const activePrograms = filteredPrograms.filter((program) => program.state).length;
  const inactivePrograms = totalPrograms - activePrograms;

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
      <PageTitle>Programas coordinación</PageTitle>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-shadowBlue p-4 sm:p-5 rounded-xl shadow-md border-l-4 border-primary dark:border-primary">
          <p className="text-xs sm:text-sm text-grayText dark:text-gray-300">Total programas</p>
          <p className="text-2xl font-bold text-secondary dark:text-white">{totalPrograms}</p>
        </div>
        <div className="bg-white dark:bg-shadowBlue p-4 sm:p-5 rounded-xl shadow-md border-l-4 border-lightGreen dark:border-lightGreen">
          <p className="text-xs sm:text-sm text-grayText dark:text-gray-300">Activos</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-500">{activePrograms}</p>
        </div>
        <div className="bg-white dark:bg-shadowBlue p-4 sm:p-5 rounded-xl shadow-md border-l-4 border-red-500 dark:border-red-500">
          <p className="text-xs sm:text-sm text-grayText dark:text-gray-300">Inactivos</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-500">{inactivePrograms}</p>
        </div>
      </div>

      {/* Campo de búsqueda */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        resultsCount={searchTerm ? filteredPrograms.length : undefined}
      />

      <ProgramsGrid
        programs={displayedPrograms}
        loading={loading}
        searchTerm={searchTerm}
        onProgramClick={handleProgramClick}
      />

      <Modal
        isOpen={selectedProgram !== null}
        onClose={() => setSelectedProgram(null)}
        title="Detalle del programa"
        size="xxl"
      >
        {selectedProgram && (
          <div className="space-y-4 sm:space-y-5">
            <div className="rounded-xl border border-lightGray dark:border-grayText p-4 sm:p-5 bg-white/70 dark:bg-shadowBlue/70">
              <p className="text-xs uppercase tracking-wide text-grayText dark:text-gray-300">Programa</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {selectedProgram.name || 'Programa sin nombre'}
              </h3>
              <p className="text-sm sm:text-base text-grayText dark:text-gray-200 mt-3 leading-relaxed">
                {selectedProgram.description || 'Sin descripción disponible'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl border border-lightGray dark:border-grayText p-4 bg-white/70 dark:bg-shadowBlue/70">
                <p className="text-xs uppercase tracking-wide text-grayText dark:text-gray-300">Coordinación</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mt-1">{selectedProgram.coordination?.name || 'Sin coordinación'}</p>
              </div>
              <div className="rounded-xl border border-lightGray dark:border-grayText p-4 bg-white/70 dark:bg-shadowBlue/70">
                <p className="text-xs uppercase tracking-wide text-grayText dark:text-gray-300">Nivel</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mt-1">{selectedProgram.trainingLevel?.name || 'Sin nivel'}</p>
              </div>
              <div className="rounded-xl border border-lightGray dark:border-grayText p-4 bg-white/70 dark:bg-shadowBlue/70">
                <p className="text-xs uppercase tracking-wide text-grayText dark:text-gray-300">Estado</p>
                <p className={`text-sm sm:text-base font-semibold mt-1 ${selectedProgram.state ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {selectedProgram.state ? 'Activo' : 'Inactivo'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default ProgramasCoordinadorContainer;

/*
🎭 ===== GUÍA RÁPIDA: ALTERNAR ENTRE MOCK Y DATOS REALES =====

📋 PARA USAR DATOS MOCK (DESARROLLO DE UI):
  ✅ Ya está configurado - los datos mock están activos
  ✅ Tienes 8 programas de ejemplo para probar tu diseño
  ✅ Incluye diferentes estados: activos/inactivos, diferentes coordinaciones

🔄 PARA CAMBIAR A DATOS REALES:

  1️⃣ ELIMINAR: Toda la sección "DATOS MOCK PARA DESARROLLO DE UI" (líneas ~16-120)
      - Borra desde "// 🎭 ========== DATOS MOCK" hasta "// 🎭 ============ FIN"
      
  2️⃣ DESCOMENTAR: Los imports al inicio del archivo
      - Descomenta: useEffect, useLoader, toast, useDispatch, useSelector, fetchPrograms, AppDispatch, RootState
      
  3️⃣ DESCOMENTAR: Las variables de Redux en el componente
      - Descomenta las líneas del dispatch y useSelector
      
  4️⃣ DESCOMENTAR: El useEffect completo
      - Descomenta todo el bloque del useEffect que hace el fetch
      
  5️⃣ ELIMINAR: Las variables mock en el componente
      - Elimina: const programs = MOCK_PROGRAMS; const loading = false; const error = null;

💡 TIPS:
  - Puedes mantener algunos datos mock como comentarios para pruebas futuras
  - Cambia loading = true para ver el skeleton/spinner
  - Modifica los datos mock para probar casos edge (listas vacías, errores, etc.)

🎯 RESULTADO:
  - ✅ Con mock: Desarrollo rápido de UI sin depender del backend
  - ✅ Con datos reales: Funcionalidad completa con servidor
  - ✅ Sin impacto: El JSX/renderizado no cambia en absoluto
*/