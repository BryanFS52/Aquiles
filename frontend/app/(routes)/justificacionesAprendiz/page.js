  "use client";

  import React, { useRef, useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { HeaderAprendiz } from "../../components/HeaderAprendiz";
  import { Sidebaraprendiz } from "../../components/SidebarAprendiz";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import { BsPersonCircle } from "react-icons/bs";
  import { FaUsers, FaCalendarDay, FaRegClock, FaGraduationCap, FaRegListAlt } from "react-icons/fa"; // Iconos
  import { IoPeople } from "react-icons/io5";

  export default function Component() {
    const [showForm, setShowForm] = useState(false);
    const [novedad] = useState(["Calamidad Domestica", "Certificado Médico", "Previo Aviso"]);
    const [justificaciones] = useState([
      { tipo: "Calamidad Domestica", fecha: "17/08/2024", archivo: "Justificacion.pdf", estado: "Aceptada" },
      { tipo: "Certificado Médico", fecha: "25/08/2024", archivo: "Justificacion2.pdf", estado: "Pendiente" },
      { tipo: "Previo Aviso", fecha: "29/08/2024", archivo: "Justificacion3.pdf", estado: "Rechazada" },
    ]);

    const fileInputRefPrev = useRef(null);
    const fileInputRefNew = useRef(null);

    const initialFormData = {
      centroFormacion: "",
      numeroFicha: "",
      numeroDocumento: "",
      nombreAprendiz: "",
      tipoNovedad: "",
      nombreComponente: "",
      justificacionFile: null,
      firmaFile: null,
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleJustifyClick = () => {
      setShowForm(true);
    };

    const handleUploadPrev = () => {
      fileInputRefPrev.current.click();
    };

    const handleUploadNew = () => {
      fileInputRefNew.current.click();
    };

    const handleNumericChange = (e) => {
      const { name, value } = e.target;
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
    };

    const handleAlphaChange = (e) => {
      const { name, value } = e.target;
      const alphaValue = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData((prevData) => ({
        ...prevData,
        [name]: alphaValue,
      }));
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleFileChange = (e, fileType) => {
      setFormData((prevData) => ({
        ...prevData,
        [fileType]: e.target.files[0],
      }));
    };

    const handleSave = (e) => {
      e.preventDefault();
      if (Object.values(formData).some(value => !value)) {
        toast.error("Por favor, complete todos los campos.");
        return;
      }
      console.log("Datos del formulario:", formData);
      toast.success("Datos guardados correctamente.");
      setShowForm(false);
    };

    const handleCancel = () => {
      setFormData(initialFormData);
      setShowForm(false);
    };

    return (
      <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
        <Sidebaraprendiz />
        <div className="xl:col-span-5">
          <HeaderAprendiz />
          <div className="h-[90vh] p-4 md:p-8 lg:p-12 w-full bg-neutral-100 space-y-5">
            <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-4 font-inter font-semibold">
              Justificación para el Aprendiz
            </h1>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="flex-1 bg-white p-4 rounded-lg shadow-lg border-2 border-green-500">
                <div className="flex items-center">
                  <BsPersonCircle className="w-7 h-7 text-gray-500 mr-3" />
                  <h1 className="text-custom-blue font-semibold text-lg font-inter mr-3">10</h1>
                  <span className="font-inter text-sm">Justificaciones Aceptadas</span>
                </div>
              </div>
              <div className="flex-1 bg-white p-4 rounded-lg shadow-lg border-2 border-yellow-500">
                <div className="flex items-center">
                  <BsPersonCircle className="w-7 h-7 text-gray-500 mr-3" />
                  <h1 className="text-custom-blue font-semibold text-lg font-inter mr-3">8</h1>
                  <span className="font-inter text-sm">Justificaciones Pendientes</span>
                </div>
              </div>
              <div className="flex-1 bg-white p-4 rounded-lg shadow-lg border-2 border-red-500">
                <div className="flex items-center">
                  <BsPersonCircle className="w-7 h-7 text-gray-500 mr-3" />
                  <h1 className="text-custom-blue font-semibold text-lg font-inter mr-3">14</h1>
                  <span className="font-inter text-sm">Justificaciones Rechazadas</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 pl-0">
              <div className="flex flex-col lg:flex-row">
              <AnimatePresence>
              {!showForm && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full lg:w-1/2 bg-white p-8 rounded-lg shadow-lg"
                >
                  <h2 className="text-[#0e324d] font-inter font-semibold text-xl sm:text-2xl mb-6">
                    {`Componente: ${sessions["1"].componentName}`} {/* Nombre del componente */}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <FaCalendarDay className="w-7 h-7 text-[#0e324d] mr-3 hover:text-[#01b001] transition-colors duration-300" />
                      <span>{`Fecha: ${sessions["1"].date}`}</span> {/* Fecha de la justificación */}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                    <FaRegClock className="w-7 h-7 text-[#0e324d] mr-3 hover:text-[#01b001] transition-colors duration-300" />
                      <span>{`Hora: ${sessions["1"].time}`}</span> {/* Hora de la justificación */}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                    <FaRegListAlt className="w-7 h-7 text-[#0e324d] mr-3 hover:text-[#01b001] transition-colors duration-300" />
                      <span>{`Ficha: ${sessions["1"].sheet}`}</span> {/* Ficha */}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                    <IoPeople className="w-7 h-7 text-[#0e324d] mr-3 hover:text-[#01b001] transition-colors duration-300" />
                      <span>{`Instructor(es): ${sessions["1"].instructors.join(", ")}`}</span> {/* Instructores */}
                    </div>
                  </div>
                  <button
                    onClick={handleJustifyClick}
                    className="w-full mt-6 py-2 rounded bg-[#0e324d] text-white hover:bg-[#01b001] transition-colors duration-300"
                  >
                    Justificar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
                <AnimatePresence>
                  {showForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      transition={{ duration: 0.5 }}
                      className="w-full lg:w-1/2 bg-white p-8 rounded-lg shadow-lg"
                    >
                      <h2 className="text-[#0e324d] font-inter font-semibold text-xl sm:text-2xl mb-6">
                        Formulario de Justificación
                      </h2>
                      <form onSubmit={handleSave}>
                        <div className="space-y-4">
                          <div className="flex flex-col">
                            <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                              Número de Documento
                            </label>
                            <input
                              type="text"
                              name="numeroDocumento"
                              value={formData.numeroDocumento}
                              onChange={handleNumericChange}
                              className="h-10 block w-full pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300"
                              placeholder="123456789"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                              Nombre Aprendiz
                            </label>
                            <input
                              type="text"
                              name="nombreAprendiz"
                              value={formData.nombreAprendiz}
                              onChange={handleAlphaChange}
                              className="h-10 block w-full pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300"
                              placeholder="Juan Pérez"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                              Tipo de Novedad
                            </label>
                            <select
                              name="tipoNovedad"
                              value={formData.tipoNovedad}
                              onChange={handleInputChange}
                              className="h-10 block w-full pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300"
                            >
                              <option value="" disabled>
                                Selecciona una novedad
                              </option>
                              {novedad.map((nov, index) => (
                                <option key={index} value={nov}>
                                  {nov}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex flex-col">
                            <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                              Componente
                            </label>
                            <input
                              type="text"
                              name="nombreComponente"
                              value={sessions["1"].componentName} // Nombre del componente del JSON
                              readOnly
                              className="h-10 block w-full pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                              Justificación (Archivo)
                            </label>
                            <button
                              type="button"
                              onClick={handleUploadPrev}
                              className="bg-[#0e324d] hover:bg-[#01b001] transition-colors duration-300 text-white h-10 rounded-lg"
                            >
                              {formData.justificacionFile ? formData.justificacionFile.name : "Subir Archivo"}
                            </button>
                            <input
                              type="file"
                              ref={fileInputRefPrev}
                              onChange={(e) => handleFileChange(e, "justificacionFile")}
                              className="hidden"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                              Firma (Archivo)
                            </label>
                            <button
                              type="button"
                              onClick={handleUploadNew}
                              className="bg-[#0e324d] hover:bg-[#01b001] transition-colors duration-300 text-white h-10 rounded-lg"
                            >
                              {formData.firmaFile ? formData.firmaFile.name : "Subir Archivo"}
                            </button>
                            <input
                              type="file"
                              ref={fileInputRefNew}
                              onChange={(e) => handleFileChange(e, "firmaFile")}
                              className="hidden"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between mt-6">
                          <button type="button" onClick={handleCancel} className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600">
                            Cancelar
                          </button>
                          <button type="submit" className="px-4 py-2 rounded bg-[#0e324d] text-white hover:bg-[#01b001] transition-colors duration-300">
                            Guardar Justificación
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                  {/* Contenedor Derecho: Mis Justificaciones */}
                <div className="bg-white p-8 rounded-lg shadow-lg lg:w-1/2 w-full mt-4 lg:mt-0 lg:ml-4">
                  <h2 className="text-[#0e324d] font-inter font-semibold text-xl sm:text-2xl mb-6">
                    Mis Justificaciones
                  </h2>
                  {/* Contenedor con scroll horizontal */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-2 text-left">Tipo de Novedad</th>
                          <th className="p-2 text-left">Fecha de Justificación</th>
                          <th className="p-2 text-left">Archivo</th>
                          <th className="p-2 text-left">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {justificaciones.map((justificacion, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                            <td className="p-2">{justificacion.tipo}</td>
                            <td className="p-2">{justificacion.fecha}</td>
                            <td className="p-2">{justificacion.archivo}</td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  justificacion.estado === "Aceptada"
                                    ? "bg-green-200 text-green-800"
                                    : justificacion.estado === "Pendiente"
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-red-200 text-red-800"
                                }`}
                              >
                                {justificacion.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div> 
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }
