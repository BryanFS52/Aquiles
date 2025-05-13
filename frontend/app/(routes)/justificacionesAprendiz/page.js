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

// Definición de la variable sessions
const sessions = {
  "1": {
    componentName: "Nombre del Componente",
    date: "01/09/2024",
    time: "10:00 AM",
    sheet: "Ficha 12345",
    instructors: ["Instructor 1", "Instructor 2"],
  },
};

export default function Component() {
  const [showForm, setShowForm] = useState(false);

  const fileInputRefPrev = useRef(null);
  const fileInputRefNew = useRef(null);

  const initialFormData = {
    numeroDocumento: "",
    nombreAprendiz: "",
    justificacionFile: null,
    firmaFile: null,
    firmaBase64: "", // Aquí almacenaremos la firma en base64
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleJustifyClick = () => setShowForm(true);

  const handleUploadPrev = () => fileInputRefPrev.current.click();

  const handleUploadNew = () => fileInputRefNew.current.click();

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    setFormData((prevData) => ({
      ...prevData,
      [name]: numericValue,
    }));
  };

  const handleAlphaChange = (e) => {
    const { name, value } = e.target;
    const alphaValue = value.replace(/[^a-zA-Z\s]/g, "");
    setFormData((prevData) => ({
      ...prevData,
      [name]: alphaValue,
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === "justificacionFile") {
      setFormData((prevData) => ({
        ...prevData,
        [fileType]: file,
      }));
    } else if (fileType === "firmaFile") {
      // Convertir la firma a base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          [fileType]: file,
          firmaBase64: reader.result.split(",")[1], // Tomamos solo la parte base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos


    // Validación de tipo de novedad


    // Validación de tamaño de archivo (justificaciónFile)
    if (formData.justificacionFile && formData.justificacionFile.size > 5 * 1024 * 1024) {
      toast.error("El archivo de justificación no puede ser mayor de 5 MB.");
      return;
    }

    // Si todo está bien, intentamos enviar el formulario
    try {
      console.log("Enviando justificación:", formData);
      const result = await justificationService.submitJustification(formData);

      if (result) {
        toast.success("Justificación enviada con éxito.");
        setShowForm(false);
      } else {
        toast.error("Hubo un error al enviar la justificación.");
      }
    } catch (error) {
      console.error("Error al enviar la justificación:", error);
      toast.error("Hubo un error al enviar la justificación.");
    }
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

          <AnimatePresence>
            {!showForm && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full lg:w-1/2 bg-white p-8 rounded-lg shadow-lg"
              >
                <h2 className="text-[#0e324d] font-inter font-semibold text-xl sm:text-2xl mb-6">
                  {`Componente: ${sessions["1"].componentName}`}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FaCalendarDay className="w-7 h-7 text-[#0e324d] mr-3" />
                    <span>{`Fecha: ${sessions["1"].date}`}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FaRegClock className="w-7 h-7 text-[#0e324d] mr-3" />
                    <span>{`Hora: ${sessions["1"].time}`}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FaRegListAlt className="w-7 h-7 text-[#0e324d] mr-3" />
                    <span>{`Ficha: ${sessions["1"].sheet}`}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <IoPeople className="w-7 h-7 text-[#0e324d] mr-3" />
                    <span>{`Instructor(es): ${sessions["1"].instructors.join(", ")}`}</span>
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
                      <label>Número de Documento</label>
                      <input
                        type="text"
                        name="numeroDocumento"
                        value={formData.numeroDocumento}
                        onChange={handleNumericChange}
                        className="h-10 block w-full pl-3 pr-10 text-sm"
                        placeholder="123456789"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label>Nombre Aprendiz</label>
                      <input
                        type="text"
                        name="nombreAprendiz"
                        value={formData.nombreAprendiz}
                        onChange={handleAlphaChange}
                        className="h-10 block w-full pl-3 pr-10 text-sm"
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label>Justificación (Archivo)</label>
                      <button
                        type="button"
                        onClick={handleUploadPrev}
                        className="bg-[#0e324d] text-white h-10 rounded-lg"
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

                    <div className="flex flex-col mt-4">
                      <label>Firma (Archivo)</label>
                      <button
                        type="button"
                        onClick={handleUploadNew}
                        className="bg-[#0e324d] text-white h-10 rounded-lg"
                      >
                        {formData.firmaFile?.name || "Subir Firma"}
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
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="px-4 py-2 bg-[#0e324d] text-white">
                      Guardar Justificación
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
