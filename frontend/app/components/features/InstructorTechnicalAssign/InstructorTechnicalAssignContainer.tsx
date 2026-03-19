"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { FaUsers } from "react-icons/fa";
import { toast } from 'react-toastify';
import { fetchCoordinationByColaborator } from '@slice/olympo/coordinationSlice';
import { TEMPORAL_COORDINATOR_ID } from '@/temporaryCredential';
import PageTitle from '@/components/UI/pageTitle';
import StatsCards from './StatsCards';
import SheetCard from './SheetCard';

// ========== DATOS QUEMADOS - INICIO ==========
// Estos datos son de ejemplo para pruebas y desarrollo
// BORRAR ESTA SECCIÓN cuando quieras usar datos reales

const HARDCODED_STUDY_SHEETS = [
  {
    id: "1",
    number: 2758963,
    numberStudents: 28,
    startLective: "2024-01-15",
    endLective: "2024-12-15",
    state: true,
    journey: {
      id: "1",
      name: "Diurna",
      startTime: "07:00",
      endTime: "15:00"
    },
    offer: {
      id: "1",
      program: {
        id: "1",
        name: "Tecnología en Análisis y Desarrollo de Software",
        acronym: "ADSO"
      }
    },
    trainingProject: {
      id: "1",
      title: "Sistema de Gestión Académica"
    }
  },
  {
    id: "2",
    number: 2758964,
    numberStudents: 32,
    startLective: "2024-02-01",
    endLective: "2024-12-20",
    state: true,
    journey: {
      id: "2",
      name: "Nocturna",
      startTime: "18:00",
      endTime: "22:00"
    },
    offer: {
      id: "2",
      program: {
        id: "2",
        name: "Tecnología en Redes de Computadores",
        acronym: "REDES"
      }
    },
    trainingProject: {
      id: "2",
      title: "Infraestructura de Red Empresarial"
    }
  },
  {
    id: "3",
    number: 2758965,
    numberStudents: 25,
    startLective: "2024-01-20",
    endLective: "2024-12-10",
    state: true,
    journey: {
      id: "1",
      name: "Diurna",
      startTime: "07:00",
      endTime: "15:00"
    },
    offer: {
      id: "3",
      program: {
        id: "3",
        name: "Tecnología en Gestión Empresarial",
        acronym: "GESTION"
      }
    },
    trainingProject: {
      id: "3",
      title: "Plan de Negocio Digital"
    }
  },
  {
    id: "4",
    number: 2758966,
    numberStudents: 30,
    startLective: "2024-03-01",
    endLective: "2025-01-15",
    state: true,
    journey: {
      id: "3",
      name: "Fines de Semana",
      startTime: "07:00",
      endTime: "17:00"
    },
    offer: {
      id: "4",
      program: {
        id: "4",
        name: "Tecnología en Diseño Gráfico",
        acronym: "DISEÑO"
      }
    },
    trainingProject: {
      id: "4",
      title: "Campaña Publicitaria Integral"
    }
  },
  {
    id: "5",
    number: 2758967,
    numberStudents: 35,
    startLective: "2024-02-15",
    endLective: "2024-12-22",
    state: true,
    journey: {
      id: "1",
      name: "Diurna",
      startTime: "07:00",
      endTime: "15:00"
    },
    offer: {
      id: "5",
      program: {
        id: "5",
        name: "Tecnología en Mantenimiento de Equipos de Cómputo",
        acronym: "MECOM"
      }
    },
    trainingProject: {
      id: "5",
      title: "Centro de Servicios Técnicos"
    }
  },
  {
    id: "6",
    number: 2758968,
    numberStudents: 22,
    startLective: "2024-01-10",
    endLective: "2024-11-30",
    state: true,
    journey: {
      id: "2",
      name: "Nocturna",
      startTime: "18:00",
      endTime: "22:00"
    },
    offer: {
      id: "6",
      program: {
        id: "6",
        name: "Tecnología en Contabilidad y Finanzas",
        acronym: "CONTAFIN"
      }
    },
    trainingProject: {
      id: "6",
      title: "Sistema Contable para MIPYMES"
    }
  },
  {
    id: "7",
    number: 2758969,
    numberStudents: 27,
    startLective: "2024-03-15",
    endLective: "2025-02-10",
    state: true,
    journey: {
      id: "4",
      name: "Mixta",
      startTime: "14:00",
      endTime: "18:00"
    },
    offer: {
      id: "7",
      program: {
        id: "7",
        name: "Tecnología en Producción Multimedia",
        acronym: "MULTIMEDIA"
      }
    },
    trainingProject: {
      id: "7",
      title: "Plataforma de Contenido Digital"
    }
  },
  {
    id: "8",
    number: 2758970,
    numberStudents: 31,
    startLective: "2024-01-25",
    endLective: "2024-12-18",
    state: true,
    journey: {
      id: "1",
      name: "Diurna",
      startTime: "07:00",
      endTime: "15:00"
    },
    offer: {
      id: "8",
      program: {
        id: "8",
        name: "Tecnología en Seguridad y Salud en el Trabajo",
        acronym: "SST"
      }
    },
    trainingProject: {
      id: "8",
      title: "Sistema de Gestión de SST Empresarial"
    }
  },
  {
    id: "9",
    number: 2758971,
    numberStudents: 26,
    startLective: "2024-04-01",
    endLective: "2025-03-20",
    state: true,
    journey: {
      id: "3",
      name: "Fines de Semana",
      startTime: "07:00",
      endTime: "17:00"
    },
    offer: {
      id: "9",
      program: {
        id: "9",
        name: "Tecnología en Gestión Logística",
        acronym: "LOGISTICA"
      }
    },
    trainingProject: {
      id: "9",
      title: "Optimización de Cadena de Suministro"
    }
  },
  {
    id: "10",
    number: 2758972,
    numberStudents: 29,
    startLective: "2024-02-20",
    endLective: "2024-12-25",
    state: true,
    journey: {
      id: "2",
      name: "Nocturna",
      startTime: "18:00",
      endTime: "22:00"
    },
    offer: {
      id: "10",
      program: {
        id: "10",
        name: "Tecnología en Desarrollo de Videojuegos",
        acronym: "VIDEOJUEGOS"
      }
    },
    trainingProject: {
      id: "10",
      title: "Videojuego Educativo Interactivo"
    }
  },
  {
    id: "11",
    number: 2758973,
    numberStudents: 33,
    startLective: "2024-01-30",
    endLective: "2024-12-12",
    state: true,
    journey: {
      id: "4",
      name: "Mixta",
      startTime: "14:00",
      endTime: "18:00"
    },
    offer: {
      id: "11",
      program: {
        id: "11",
        name: "Tecnología en Automática Industrial",
        acronym: "AUTOMATICA"
      }
    },
    trainingProject: {
      id: "11",
      title: "Sistema de Control Automatizado"
    }
  },
  {
    id: "12",
    number: 2758974,
    numberStudents: 24,
    startLective: "2024-03-10",
    endLective: "2025-01-25",
    state: true,
    journey: {
      id: "1",
      name: "Diurna",
      startTime: "07:00",
      endTime: "15:00"
    },
    offer: {
      id: "12",
      program: {
        id: "12",
        name: "Tecnología en Marketing Digital",
        acronym: "MARKETING"
      }
    },
    trainingProject: {
      id: "12",
      title: "Estrategia Digital para Emprendimientos"
    }
  },
  {
    id: "13",
    number: 2758975,
    numberStudents: 27,
    startLective: "2024-02-05",
    endLective: "2024-12-20",
    state: true,
    journey: {
      id: "2",
      name: "Nocturna",
      startTime: "18:00",
      endTime: "22:00"
    },
    offer: {
      id: "13",
      program: {
        id: "13",
        name: "Tecnología en Gestión de Proyectos",
        acronym: "PROYECTOS"
      }
    },
    trainingProject: {
      id: "13",
      title: "Gestión de Proyecto de Innovación Tecnológica"
    }
  }
];

const HARDCODED_TEACHERS = [
  {
    id: "teacher1",
    totalHours: 40,
    state: true,
    collaborator: {
      person: {
        name: "María José",
        lastname: "Rodríguez García",
        documentNumber: "12345678",
        email: "maria.rodriguez@sena.edu.co"
      }
    }
  },
  {
    id: "teacher2",
    totalHours: 30,
    state: true,
    collaborator: {
      person: {
        name: "Carlos Andrés",
        lastname: "Martínez López",
        documentNumber: "87654321",
        email: "carlos.martinez@sena.edu.co"
      }
    }
  },
  {
    id: "teacher3",
    totalHours: 35,
    state: true,
    collaborator: {
      person: {
        name: "Ana Patricia",
        lastname: "González Hernández",
        documentNumber: "11223344",
        email: "ana.gonzalez@sena.edu.co"
      }
    }
  },
  {
    id: "teacher4",
    totalHours: 25,
    state: true,
    collaborator: {
      person: {
        name: "Luis Fernando",
        lastname: "Jiménez Castro",
        documentNumber: "44332211",
        email: "luis.jimenez@sena.edu.co"
      }
    }
  },
  {
    id: "teacher5",
    totalHours: 40,
    state: true,
    collaborator: {
      person: {
        name: "Sandra Milena",
        lastname: "Torres Vargas",
        documentNumber: "55667788",
        email: "sandra.torres@sena.edu.co"
      }
    }
  },
  {
    id: "teacher6",
    totalHours: 38,
    state: true,
    collaborator: {
      person: {
        name: "Diego Alejandro",
        lastname: "Ramírez Moreno",
        documentNumber: "99887766",
        email: "diego.ramirez@sena.edu.co"
      }
    }
  },
  {
    id: "teacher7",
    totalHours: 42,
    state: true,
    collaborator: {
      person: {
        name: "Liliana",
        lastname: "Vargas Castillo",
        documentNumber: "33445566",
        email: "liliana.vargas@sena.edu.co"
      }
    }
  },
  {
    id: "teacher8",
    totalHours: 36,
    state: true,
    collaborator: {
      person: {
        name: "Roberto",
        lastname: "Sánchez Pérez",
        documentNumber: "77889900",
        email: "roberto.sanchez@sena.edu.co"
      }
    }
  },
  {
    id: "teacher9",
    totalHours: 28,
    state: true,
    collaborator: {
      person: {
        name: "Claudia Patricia",
        lastname: "Herrera Vega",
        documentNumber: "22334455",
        email: "claudia.herrera@sena.edu.co"
      }
    }
  },
  {
    id: "teacher10",
    totalHours: 44,
    state: true,
    collaborator: {
      person: {
        name: "Javier Orlando",
        lastname: "Ruiz Gómez",
        documentNumber: "66778899",
        email: "javier.ruiz@sena.edu.co"
      }
    }
  },
  {
    id: "teacher11",
    totalHours: 32,
    state: true,
    collaborator: {
      person: {
        name: "Paola Andrea",
        lastname: "Morales Díaz",
        documentNumber: "11335577",
        email: "paola.morales@sena.edu.co"
      }
    }
  },
  {
    id: "teacher12",
    totalHours: 39,
    state: true,
    collaborator: {
      person: {
        name: "Fernando",
        lastname: "Castro Mendoza",
        documentNumber: "88990011",
        email: "fernando.castro@sena.edu.co"
      }
    }
  },
  {
    id: "teacher13",
    totalHours: 37,
    state: true,
    collaborator: {
      person: {
        name: "Adriana",
        lastname: "López Silva",
        documentNumber: "55443322",
        email: "adriana.lopez@sena.edu.co"
      }
    }
  },
  {
    id: "teacher14",
    totalHours: 41,
    state: true,
    collaborator: {
      person: {
        name: "Miguel Ángel",
        lastname: "Cárdenas Rojas",
        documentNumber: "99112233",
        email: "miguel.cardenas@sena.edu.co"
      }
    }
  },
  {
    id: "teacher15",
    totalHours: 33,
    state: true,
    collaborator: {
      person: {
        name: "Esperanza",
        lastname: "Quintero Aguilar",
        documentNumber: "44556677",
        email: "esperanza.quintero@sena.edu.co"
      }
    }
  }
];

const HARDCODED_COORDINATIONS = [
  {
    id: "coord1",
    name: "Coordinación Tecnologías de la Información",
    state: true,
    teachers: HARDCODED_TEACHERS,
    trainingCenter: {
      id: "center1",
      name: "Centro de Biotecnología Agropecuaria"
    }
  }
];

// Control para alternar entre datos quemados y reales
const USE_HARDCODED_DATA = true; // CAMBIAR a false para usar datos reales
// ========== DATOS QUEMADOS - FIN ==========

const InstructorTechnicalAssignContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [selectedInstructor, setSelectedInstructor] = useState<Record<string, string>>({});

  // ========== DATOS REALES - COMENTADO PARA PRUEBAS ==========
  // DESCOMENTAR estas líneas cuando quieras usar datos reales
  // COMENTAR las líneas de "DATOS QUEMADOS ACTIVOS" más abajo
  
  // // Obtener datos de Redux
  // const { data: studySheets, loading: loadingSheets } = useSelector((state: RootState) => state.studySheet);
  // const { data: coordinations, loading: loadingCoordinations } = useSelector((state: RootState) => state.coordination);

  // // Obtener instructores de las coordinaciones
  // const teachers = coordinations
  //   .flatMap(coord => coord.teachers || [])
  //   .filter((teacher): teacher is NonNullable<typeof teacher> => teacher !== null && teacher !== undefined);

  // ========== DATOS QUEMADOS ACTIVOS ==========
  // BORRAR estas líneas cuando quieras usar datos reales
  // DESCOMENTAR las líneas de "DATOS REALES" de arriba
  
  const studySheets = USE_HARDCODED_DATA ? HARDCODED_STUDY_SHEETS : [];
  const loadingSheets = false; // No hay loading con datos quemados
  const coordinations = USE_HARDCODED_DATA ? HARDCODED_COORDINATIONS : [];
  const loadingCoordinations = false; // No hay loading con datos quemados
  
  // Obtener instructores de las coordinaciones (funciona igual con datos quemados)
  const teachers = coordinations
    .flatMap(coord => coord.teachers || [])
    .filter((teacher): teacher is NonNullable<typeof teacher> => teacher !== null && teacher !== undefined);

  // ========== CARGAR DATOS REALES - COMENTADO PARA PRUEBAS ==========
  // DESCOMENTAR este useEffect cuando quieras usar datos reales
  
  // useEffect(() => {
  //   if (!USE_HARDCODED_DATA) {
  //     dispatch(fetchCoordinationByColaborator({
  //       collaboratorId: TEMPORAL_COORDINATOR_ID,
  //       page: 0,
  //       size: 100
  //     }));
  //   }
  // }, [dispatch]);

  // ========== LÓGICA DE NEGOCIO (Funciona igual con datos reales o quemados) ==========


  const handleAssignInstructor = (sheetId: string, teacherId: string) => {
    if (!teacherId) {
      toast.error("Selecciona un instructor primero");
      return;
    }

    const teacher = teachers.find(t => t.id === teacherId);

    if (!teacher) {
      toast.error("Instructor no encontrado");
      return;
    }

    // ========== LÓGICA DE ASIGNACIÓN REAL - COMENTADA PARA PRUEBAS ==========
    // DESCOMENTAR estas líneas cuando implementes la asignación real
    // Esta función debería hacer una mutación GraphQL para asignar el instructor
    
    // try {
    //   await dispatch(assignInstructorToSheet({
    //     sheetId,
    //     teacherId
    //   })).unwrap();
    //   toast.success(`Instructor ${teacher.collaborator?.person?.name} ${teacher.collaborator?.person?.lastname} asignado exitosamente`);
    // } catch (error) {
    //   toast.error("Error al asignar instructor");
    //   return;
    // }

    // ========== SIMULACIÓN CON DATOS QUEMADOS ==========
    // BORRAR esta línea cuando implementes la asignación real
    toast.success(`Instructor ${teacher.collaborator?.person?.name} ${teacher.collaborator?.person?.lastname} asignado exitosamente a la ficha ${sheetId}`);

    // Limpiar selección (esta lógica se mantiene igual)
    setSelectedInstructor(prev => ({
      ...prev,
      [sheetId]: ""
    }));
  };

  // ========== ESTADÍSTICAS ==========
  const totalSheets = studySheets.length;
  
  // ========== ESTADÍSTICAS REALES - COMENTADAS PARA PRUEBAS ==========
  // DESCOMENTAR estas líneas cuando tengas la lógica real de instructores asignados
  // const sheetsWithInstructor = studySheets.filter(sheet =>
  //   sheet.teacherStudySheets && sheet.teacherStudySheets.length > 0
  // ).length;
  
  // ========== ESTADÍSTICAS CON DATOS QUEMADOS ==========
  // BORRAR estas líneas cuando implementes las estadísticas reales
  const sheetsWithInstructor = USE_HARDCODED_DATA ? 5 : 0; // Simula que 5 fichas tienen instructor
  const sheetsWithoutInstructor = totalSheets - sheetsWithInstructor;

  // ========== LOADING STATE ==========
  // Con datos quemados, loadingSheets y loadingCoordinations siempre son false
  // Con datos reales, esto mostraría el loading mientras se cargan los datos
  if (loadingSheets || loadingCoordinations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700 dark:text-white">Cargando datos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-2 sm:px-4 lg:px-0 py-4 sm:py-6">
      <PageTitle onBack={() => router.back()}>Asignación técnica de instructores</PageTitle>

      {/* ========== ESTADÍSTICAS ========== */}
      {/* Este componente funciona igual con datos reales o quemados */}
      <StatsCards
        totalSheets={totalSheets}
        sheetsWithInstructor={sheetsWithInstructor}
        sheetsWithoutInstructor={sheetsWithoutInstructor}
      />

      {/* ========== GRID DE FICHAS ========== */}
      {/* Este mapeo funciona igual con datos reales o quemados */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {studySheets.map((sheet) => (
          <SheetCard
            key={sheet.id}
            sheet={sheet}
            teachers={teachers}
            selectedInstructor={selectedInstructor[sheet.id!] || ""}
            onSelectInstructor={(instructorId) =>
              setSelectedInstructor((prev) => ({
                ...prev,
                [sheet.id!]: instructorId,
              }))
            }
            onAssignInstructor={() => handleAssignInstructor(sheet.id!, selectedInstructor[sheet.id!])}
          />
        ))}
      </div>

      {/* ========== EMPTY STATE ========== */}
      {/* Este estado vacío funciona igual con datos reales o quemados */}
      {studySheets.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-white dark:bg-shadowBlue rounded-xl p-6 sm:p-12 border border-gray-200 dark:border-gray-700">
            <FaUsers className="text-4xl sm:text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-white mb-2">
              No hay fichas disponibles
            </h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
              No se encontraron fichas para asignar instructores.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorTechnicalAssignContainer;

/* 
========== INSTRUCCIONES PARA ALTERNAR ENTRE DATOS QUEMADOS Y REALES ==========

PARA USAR DATOS NORMALES (reales):

1. CAMBIAR la constante USE_HARDCODED_DATA:
  - Cambiar: const USE_HARDCODED_DATA = true;
  - Por: const USE_HARDCODED_DATA = false;

2. BORRAR toda la sección "DATOS QUEMADOS" (líneas con los arrays HARDCODED_STUDY_SHEETS, 
  HARDCODED_TEACHERS, HARDCODED_COORDINATIONS y la constante USE_HARDCODED_DATA)

3. DESCOMENTAR las líneas marcadas "DATOS REALES":
  - Las líneas de useSelector para obtener studySheets y coordinations
  - El useEffect para cargar datos con fetchCoordinationByColaborator
  - Las líneas de estadísticas reales (sheetsWithInstructor calculado)

4. DESCOMENTAR y completar la lógica de asignación real:
  - En handleAssignInstructor, descomentar el bloque try/catch
  - Implementar la acción assignInstructorToSheet en Redux
  - BORRAR la línea de toast de simulación

5. COMENTAR O BORRAR las líneas marcadas "DATOS QUEMADOS ACTIVOS":
  - Las variables studySheets, loadingSheets, etc. que usan datos hardcoded
  - Las estadísticas simuladas

NOTA: Los componentes StatsCards y SheetCard funcionan igual con ambos tipos de datos,
      no necesitan modificación.

PARA VOLVER A DATOS QUEMADOS: Simplemente cambia USE_HARDCODED_DATA a true y 
revierte los cambios anteriores.
*/
