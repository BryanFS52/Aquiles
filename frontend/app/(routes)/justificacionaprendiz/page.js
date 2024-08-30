"use client";

import React, { useRef, useState } from "react";
import { Header } from "../../components/header";
import { Sidebaraprendiz } from "../../components/sidebaraprendiz";
import { IoIosArrowDown } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify"; // Importa ToastContainer y toast
import "react-toastify/dist/ReactToastify.css"; // Importa el estilo para las notificaciones

export default function Justificacionaaprendiz() {

  // Opciones para los select 
  const [novedad, setNovedad] = useState (["Novedad 1", "Novedad 2"]);

  const fileInputRefPrev = useRef(null);
  const fileInputRefNew = useRef(null);

  // Estado inicial del formulario
  const initialFormData = {
    tipoNovedad: "",
    nombreAprendiz: "",
    numeroDocumento: "",
    nombrePrograma: "",
    numeroFicha: "",
    justificacionFile: null,
    firmaFile: null,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleUploadPrev = () => {
    fileInputRefPrev.current.click();
  };

  const handleUploadNew = () => {
    fileInputRefNew.current.click();
  };

  // Función para permitir solo números
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    // Filtra solo los caracteres numéricos
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData((prevData) => ({
      ...prevData,
      [name]: numericValue,
    }));
  };

  // Función para permitir solo letras
  const handleAlphaChange = (e) => {
    const { name, value } = e.target;
    // Filtra solo los caracteres alfabéticos
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
    const {
      tipoNovedad,
      nombreAprendiz,
      numeroDocumento,
      nombrePrograma,
      numeroFicha,
      justificacionFile,
      firmaFile,
    } = formData;

    if (
      !tipoNovedad ||
      !nombreAprendiz ||
      !numeroDocumento ||
      !nombrePrograma ||
      !numeroFicha ||
      !justificacionFile ||
      !firmaFile 
    ) {
      toast.error("Por favor, complete todos los campos."); // Muestra una notificación de error
      return;
    }

    // Aquí puedes enviar los datos a un backend o manejar la lógica de guardado
    console.log("Datos del formulario:", formData);
    toast.success("Datos guardados correctamente."); // Muestra una notificación de éxito
  };

  // Función para limpiar el formulario
  const handleCancel = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <Header />

        <div className="h-[90vh] overflow-y-scroll p-12 inline-block w-full">
          <h1 className="text-[#0e324d] text-2xl sm:text-3xl lg:text-4xl pb-3 border-b-2 border-gray-400 w-full sm:w-3/4 lg:w-1/2 mb-6 lg:mb-12 font-inter font-semibold">
            Cargar Justificación
          </h1>

          <div className="flex items-center justify-center bg-gray-100 py-12 w-3/4 ml-40">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
              <h2 className="text-[#0e324d] font-inter font-semibold text-xl sm:text-3xl text-center mb-10">
                Justifica Aquí tu Inasistencia
              </h2>
              <form className="space-y-6" onSubmit={handleSave}>
  <div className="grid grid-cols-2 gap-6">
    <div className="flex flex-col">
      <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
        Tipo de novedad
      </label>
      <div className="relative">
        <select
          name="tipoNovedad"
          value={formData.tipoNovedad}
          onChange={handleInputChange}
          className="h-10 block w-80 pl-3 pr-10 text-base text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300"
        >
          <option value="" disabled selected hidden className="text-gray-500">
            Seleccione el tipo de novedad
          </option>
          {novedad.map((novedad, index) => (
            <option key={index} value={novedad}>
              {novedad}
            </option>
          ))}
        </select>

                      <div className="absolute inset-y-0 right-0 flex items-center pr-24 pointer-events-none"></div>
                    </div>

                  </div>

                  <div className="flex flex-col">
                    <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                      Nombre del aprendiz
                    </label>
                    <input
                      type="text"
                      name="nombreAprendiz"
                      value={formData.nombreAprendiz}
                      onChange={handleAlphaChange} // Usa handleAlphaChange
                      className="h-10 block w-96 pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300"
                      placeholder="Escriba su nombre"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                      Número de documento
                    </label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={handleNumericChange} // Usa handleNumericChange
                      className="h-10 block w-80 pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300"
                      placeholder="Identificación"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                      Nombre del programa
                    </label>
                    <input
                      type="text"
                      name="nombrePrograma"
                      value={formData.nombrePrograma}
                      onChange={handleInputChange}
                      className="h-10 block w-96 pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300"
                      placeholder="Seleccione el programa"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                      Número de ficha
                    </label>
                    <input
                      type="text"
                      name="numeroFicha"
                      value={formData.numeroFicha}
                      onChange={handleNumericChange} // Usa handleNumericChange
                      className="h-10 block w-80 pl-3 pr-10 text-sm text-left font-inter rounded-lg bg-zinc-200 border-2 border-zinc-300 focus:outline-none focus:border-slate-300"
                      placeholder="Digite el número de ficha"
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                      Agregar Justificación
                    </span>
                    <button
                      type="button"
                      onClick={handleUploadPrev}
                      className="h-10 w-96 bg-gray-200 text-gray-700 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-slate-300"
                    >
                      Selecciona un archivo
                    </button>
                    <input
                      type="file"
                      ref={fileInputRefPrev}
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "justificacionFile")}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-inter font-semibold text-[#0e324d] text-sm sm:text-base">
                    Firma del aprendiz
                  </span>
                  <button
                    type="button"
                    onClick={handleUploadNew}
                    className="h-10 w-56 bg-gray-200 text-gray-700 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-slate-300"
                  >
                    Selecciona un archivo
                  </button>
                  <input
                    type="file"
                    ref={fileInputRefNew}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "firmaFile")}
                  />
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handleCancel} // Usa handleCancel para limpiar el formulario
                    className="h-10 w-32 bg-gray-300 text-gray-700 rounded-lg border-2 border-neutral-400 focus:outline-none focus:border-slate-300"
                  >
                    Limpiar
                  </button>
                  <button
                    type="submit"
                    className="h-10 w-32 bg-custom-blue text-white rounded-lg border-2 border-custom-blue focus:outline-none focus:border-slate-300"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
