'use client'

import { useState, useEffect, AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";
import PageTitle from "@components/UI/pageTitle";
import { toast } from "react-toastify";
import EmptyState from "@components/UI/emptyState";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {fetchChecklists} from '@redux/slices/checklistSlice';
import { motion } from "framer-motion";
export const InstructorChecklistContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchChecklists({ page: 0, size: 5}));
  }, [dispatch]);

  /*function setFichaSeleccionada(ficha: string) {
    throw new Error("Function not implemented.");
  }

  function setGrupoSeleccionado(arg0: null) {
    throw new Error("Function not implemented.");
  }*/

  // 🔹 Datos estáticos
// 🔹 Datos estáticos
const data = {
  2835109: {
    grupos: {
      1: {
        aprendices: ["Ana", "Luis", "María", "Juan"],
        checklist: [
          { tarea: "Entrega de proyecto", estado: "Completado" },
          { tarea: "Documentación técnica", estado: "Pendiente" },
          { tarea: "Presentación oral", estado: "No entregado" },
        ],
      },
      2: {
        aprendices: ["Camila", "José", "Diana", "Pedro"],
        checklist: [
          { tarea: "Entrega de proyecto", estado: "Pendiente" },
          { tarea: "Documentación técnica", estado: "Completado" },
          { tarea: "Presentación oral", estado: "No entregado" },
        ],
      },
    },
  },
  2856210: {
    grupos: {
      1: {
        aprendices: ["Lucía", "Carlos", "Mateo", "Sofía"],
        checklist: [
          { tarea: "Entrega de proyecto", estado: "Completado" },
          { tarea: "Documentación técnica", estado: "Completado" },
          { tarea: "Presentación oral", estado: "Pendiente" },
        ],
      },
    },
  },
  2901321: {
    grupos: {
      3: {
        aprendices: ["Andrés", "Valentina", "Nicolás", "Laura"],
        checklist: [
          { tarea: "Entrega de proyecto", estado: "No entregado" },
          { tarea: "Documentación técnica", estado: "Pendiente" },
          { tarea: "Presentación oral", estado: "Pendiente" },
        ],
      },
    },
  },
};

// ✅ Tipar los estados correctamente
const [fichaSeleccionada, setFichaSeleccionada] = useState<string | null>(null);
const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(null);



  function setObservaciones(arg0: (prev: any) => any): void {
    throw new Error("Function not implemented.");
  }

return (
  <>
    <PageTitle>Listas de Chequeo - Instructor</PageTitle>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* 🔹 Columna 1: Fichas */}
      <motion.div
        key="fichas-list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-4 rounded-2xl shadow"
      >
        <h2 className="text-lg font-semibold mb-3 text-blue-700">Fichas Registradas</h2>
        <ul className="space-y-2">
          {Object.keys(data).map((ficha) => (
            <li
              key={ficha}
              onClick={() => {
                setFichaSeleccionada(ficha);
                setGrupoSeleccionado(null);
              }}
              className={`p-3 border rounded-lg hover:bg-blue-50 cursor-pointer ${
                fichaSeleccionada === ficha ? "bg-blue-100 font-medium" : ""
              }`}
            >
              Ficha {ficha}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* 🔹 Columna 2: Grupos */}
      <motion.div
        key="grupos-list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-4 rounded-2xl shadow"
      >
        <h2 className="text-lg font-semibold mb-3 text-green-700">
          {fichaSeleccionada
            ? `Grupos - Ficha ${fichaSeleccionada}`
            : "Selecciona una ficha"}
        </h2>

        {fichaSeleccionada ? (
          <ul className="space-y-2">
            {Object.keys(data[fichaSeleccionada].grupos).map((grupoId) => (
              <li
                key={grupoId}
                onClick={() => setGrupoSeleccionado(grupoId)}
                className={`p-3 border rounded-lg hover:bg-green-50 cursor-pointer ${
                  grupoSeleccionado === grupoId ? "bg-green-100 font-medium" : ""
                }`}
              >
                Grupo {grupoId} - Aprendices:{" "}
                {data[fichaSeleccionada].grupos[grupoId].aprendices.join(", ")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Selecciona una ficha primero.</p>
        )}
      </motion.div>

      {/* 🔹 Columna 3: Lista de Chequeo por Aprendiz */}
      <motion.div
        key="checklist"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-4 rounded-2xl shadow"
      >
        
        {fichaSeleccionada && grupoSeleccionado ? (
          <>
            <h2 className="text-lg font-semibold mb-3 text-purple-700">
              Lista de Chequeo - Grupo {grupoSeleccionado}
            </h2>

            <ul className="space-y-3">
              {data[fichaSeleccionada].grupos[grupoSeleccionado].aprendices.map(
                (aprendiz: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
                  <li
                    key={index}
                    className="p-3 border rounded-lg flex flex-col space-y-2"
                  >
                    <span className="font-medium text-gray-700">{aprendiz}</span>
                  
                    {/* Estado de cumplimiento */}
                    
                    <div className="flex items-center space-x-4">
                      
                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name={`cumplimiento-${index}`}
                          value="cumplio"
                          checked={
                            estados[`${fichaSeleccionada}-${grupoSeleccionado}-${index}`] ===
                            "cumplio"
                          }
                          onChange={() =>
                            setEstados((prev: any) => ({
                              ...prev,
                              [`${fichaSeleccionada}-${grupoSeleccionado}-${index}`]: "cumplio",
                            }))
                          }
                        />
                        <span className="text-green-700 text-sm">Cumplió</span>
                      </label>

                      <label className="flex items-center space-x-1">
                        <input
                          type="radio"
                          name={`cumplimiento-${index}`}
                          value="nocumplio"
                          checked={
                            estados[`${fichaSeleccionada}-${grupoSeleccionado}-${index}`] ===
                            "nocumplio"
                          }
                          onChange={() =>
                            setEstados((prev) => ({
                              ...prev,
                              [`${fichaSeleccionada}-${grupoSeleccionado}-${index}`]: "nocumplio",
                            }))
                          }
                        />
                        <span className="text-red-700 text-sm">No cumplió</span>
                      </label>
                    </div>

                    {/* Observaciones */}
                    <textarea
                      placeholder="Observaciones..."
                      className="w-full p-2 border rounded-lg text-sm"
                      value={
                        setObservaciones[`${fichaSeleccionada}-${grupoSeleccionado}-${index}`] || ""
                      }
                      onChange={(e) =>
                        setObservaciones((prev: any) => ({
                          ...prev,
                          [`${fichaSeleccionada}-${grupoSeleccionado}-${index}`]: e.target.value,
                        }))
                      }
                    />
                  </li>
                )
              )}
            </ul>

            <button className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Guardar Lista
            </button>
          </>
        ) : (
          <p className="text-gray-500">
            Selecciona una ficha y un grupo para ver los aprendices y evaluar su cumplimiento.
          </p>
        )}
      </motion.div>
    </div>
  </>
);
};