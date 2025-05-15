"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderAprendiz } from "@components/HeaderAprendiz";
import { Sidebaraprendiz } from "@components/SidebarAprendiz";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsPersonCircle } from "react-icons/bs";
import justificationService from "@services/justificationService";

import {
  FaCalendarDay,
  FaRegClock,
  FaRegListAlt,
} from "react-icons/fa";
import { IoPeople } from "react-icons/io5";

const sessions = {
  "1": {
    componentName: "Nombre del Componente",
    date: "01/09/2024",
    time: "10:00 AM",
    sheet: "Ficha 12345",
    instructors: ["Instructor 1", "Instructor 2"],
  },
};

export default function JustificacionAprendiz() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    justificationTypeId: { id: "" },
    numeroDocumento: "",
    nombreAprendiz: "",
    descripcion: "",
    justificacionFile: null,
    justificacionFileBase64: "",
    notificationId: "123456",
  });

  const fileInputRefPrev = useRef(null);
  const fileInputRefNew = useRef(null);

  const handleInputChange = (e, allowAlpha = false) => {
    const { name, value } = e.target;
    const cleanedValue = allowAlpha ? value.replace(/[^a-zA-Z\s]/g, "") : value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fileKey) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setFormData((prev) => ({
        ...prev,
        [fileKey]: file,
        [`${fileKey}Base64`]: base64,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.justificacionFile && formData.justificacionFile.size > 5 * 1024 * 1024) {
      toast.error("El archivo de justificación no puede ser mayor de 5 MB.");
      return;
    }
    try {
      const result = await justificationService.submitJustification(formData);
      if (result) {
        toast.success("Justificación enviada con éxito.");
        setShowForm(false);
        setFormData({
          tipoNovedad: "",
          numeroDocumento: "",
          nombreAprendiz: "",
          descripcion: "",
          justificacionFileBase64: "",
          firmaBase64: "",
        });
      } else {
        toast.error("Error al enviar la justificación.");
      }
    } catch (error) {
      toast.error("Error inesperado al enviar la justificación.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      tipoNovedad: "",
      numeroDocumento: "",
      nombreAprendiz: "",
      descripcion: "",
      justificacionFile: null,
      justificacionFileBase64: "",
      notificationId: "123456",
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <HeaderAprendiz />
        <div className="h-[90vh] p-6 bg-neutral-100 space-y-5">
          <h1 className="text-[#0e324d] text-3xl border-b-2 border-gray-400 w-fit mb-6 font-semibold">
            Justificación para el Aprendiz
          </h1>

          <AnimatePresence>
            {!showForm && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full lg:w-1/2 bg-white p-8 rounded-lg shadow-md"
              >
                <h2 className="text-[#0e324d] text-xl font-semibold mb-4">
                  Componente: {sessions["1"].componentName}
                </h2>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center">
                    <FaCalendarDay className="mr-3 text-[#0e324d]" />
                    Fecha: {sessions["1"].date}
                  </div>
                  <div className="flex items-center">
                    <FaRegClock className="mr-3 text-[#0e324d]" />
                    Hora: {sessions["1"].time}
                  </div>
                  <div className="flex items-center">
                    <FaRegListAlt className="mr-3 text-[#0e324d]" />
                    Ficha: {sessions["1"].sheet}
                  </div>
                  <div className="flex items-center">
                    <IoPeople className="mr-3 text-[#0e324d]" />
                    Instructores: {sessions["1"].instructors.join(", ")}
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full mt-6 py-2 rounded bg-[#0e324d] text-white hover:bg-[#01b001] transition-colors"
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
                className="w-full lg:w-1/2 bg-white p-8 rounded-lg shadow-md"
              >
                <h2 className="text-[#0e324d] text-xl font-semibold mb-6">
                  Formulario de Justificación
                </h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="flex flex-col">
                    <label>Número de Documento</label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={(e) => handleInputChange(e)}
                      className="h-10 border border-gray-300 rounded pl-3"
                      placeholder="123456789"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>Nombre Aprendiz</label>
                    <input
                      type="text"
                      name="nombreAprendiz"
                      value={formData.nombreAprendiz}
                      onChange={(e) => handleInputChange(e, true)}
                      className="h-10 border border-gray-300 rounded pl-3"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>Descripción</label>
                    <input
                      type="text"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => handleInputChange(e, true)}
                      className="h-10 border border-gray-300 rounded pl-3"
                      placeholder="Motivo de la justificación"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label>Tipo De Novedad</label>
                    <select
                      name="justificationType"
                      value={formData.justificationTypeId.id}
                      onChange={(e) => setFormData((prev) => ({ ...prev, justificationTypeId: { id: e.target.value }, }))}
                      className="h-10 border border-gray-300 rounded pl-3"
                    >
                      <option value="" disabled hidden>
                        Seleccione el tipo
                      </option>
                      <option value="1">Medica</option>
                      <option value="2">Calamidad</option>
                      <option value="3">Otro</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label>Justificación (Archivo)</label>
                    <button
                      type="button"
                      onClick={() => fileInputRefPrev.current.click()}
                      className="bg-[#0e324d] text-white h-10 rounded mt-1"
                    >
                      {formData.justificacionFile?.name || "Subir Archivo"}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRefPrev}
                      onChange={(e) => handleFileChange(e, "justificacionFile")}
                      className="hidden"
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0e324d] text-white rounded"
                    >
                      Enviar Justificación
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}