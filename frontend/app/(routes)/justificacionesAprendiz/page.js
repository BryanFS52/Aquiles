"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@components/header";
import { Sidebaraprendiz } from "@components/SidebarAprendiz";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsPersonCircle } from "react-icons/bs";
import justificationService from "@services/justificationService";
import justificationTypeService from "@services/JustificationTypeService";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    justificationTypeId: { id: "" },
    numeroDocumento: "",
    nombreAprendiz: "",
    descripcion: "",
    justificacionFile: null,
    justificacionFileBase64: "",
    notificationId: "123456",
  });

  const [justificationTypes, setJustificationTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const fileInputRefPrev = useRef(null);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        setLoadingTypes(true);
        const typesResponse = await justificationTypeService.getAll(0, 50);

        // Verificar la estructura de la respuesta
        if (typesResponse && typesResponse.data && Array.isArray(typesResponse.data)) {
          setJustificationTypes(typesResponse.data);
        } else if (Array.isArray(typesResponse)) {
          setJustificationTypes(typesResponse);
        } else {
          console.warn("Respuesta inesperada del servicio de tipos:", typesResponse);
          setJustificationTypes([]);
          toast.warning("No se pudieron cargar todos los tipos de justificación");
        }
      } catch (error) {
        console.error("Error cargando tipos de justificación:", error);
        toast.error("Error cargando tipos de justificación. Por favor, recarga la página.");
        setJustificationTypes([]);
      } finally {
        setLoadingTypes(false);
      }
    };
    loadTypes();
  }, []);

  const handleInputChange = (e, allowAlpha = false) => {
    const { name, value } = e.target;
    const cleanedValue = allowAlpha ? value.replace(/[^a-zA-Z\s]/g, "") : value.replace(/[^0-9]/g, "");
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
  };

  const handleFileChange = (e, fileKey) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Solo se permiten archivos PDF, JPG o PNG');
      e.target.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo permitido: 5MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      setFormData((prev) => ({
        ...prev,
        [fileKey]: file,
        [`${fileKey}Base64`]: base64,
      }));
      toast.success(`Archivo ${file.name} cargado correctamente`);
    };
    reader.onerror = () => {
      toast.error('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  };

  // Validar campos del formulario
  const validateForm = () => {
    const errors = [];

    if (!formData.numeroDocumento.trim()) {
      errors.push("El número de documento es obligatorio");
    }

    if (!formData.nombreAprendiz.trim()) {
      errors.push("El nombre del aprendiz es obligatorio");
    }

    if (!formData.descripcion.trim()) {
      errors.push("La descripción es obligatoria");
    }

    if (!formData.justificationTypeId.id) {
      errors.push("Debe seleccionar un tipo de novedad");
    }

    if (!formData.justificacionFile) {
      errors.push("Debe adjuntar un archivo de justificación");
    }

    return errors;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validar formulario
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    // Verificar que el tipo de justificación existe
    const selectedType = justificationTypes.find((t) => t.id === formData.justificationTypeId.id);
    if (!selectedType) {
      toast.error("El tipo de justificación seleccionado no es válido.");
      return;
    }

    // Verificar tamaño del archivo otra vez
    if (formData.justificacionFile && formData.justificacionFile.size > 5 * 1024 * 1024) {
      toast.error("El archivo de justificación no puede ser mayor de 5 MB.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Enviando datos:", formData);

      const result = await justificationService.submitJustification(formData);

      console.log("Respuesta del servicio:", result);

      // Manejar diferentes tipos de respuesta
      if (result) {
        // Si la respuesta tiene una propiedad success explícita
        if (result.hasOwnProperty('success')) {
          if (result.success === true) {
            toast.success(result.message || "¡Tu justificación ha sido enviada exitosamente!");
            resetForm();
          } else {
            toast.error(result.message || "Error al enviar la justificación.");
          }
        }
        // Si la respuesta tiene un status code
        else if (result.status) {
          if (result.status >= 200 && result.status < 300) {
            toast.success(result.message || result.data?.message || "¡Tu justificación ha sido enviada exitosamente!");
            resetForm();
          } else {
            toast.error(result.message || result.data?.message || "Error al enviar la justificación.");
          }
        }
        // Si la respuesta indica éxito de otra manera
        else if (result.message && result.message.toLowerCase().includes('éxito')) {
          toast.success(result.message);
          resetForm();
        }
        // Si no hay indicadores claros de error, asumir éxito
        else if (!result.error && !result.message?.toLowerCase().includes('error')) {
          toast.success("¡Tu justificación ha sido enviada exitosamente!");
          resetForm();
        } else {
          toast.error(result.message || "Error al enviar la justificación.");
        }
      } else {
        toast.error("No se recibió respuesta del servidor.");
      }
    } catch (error) {
      console.error("Error al enviar justificación:", error);

      // Manejar diferentes tipos de errores
      if (error.response) {
        // Error de respuesta del servidor
        const errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          `Error del servidor: ${error.response.status}`;
        toast.error(errorMessage);
      } else if (error.request) {
        // Error de red
        toast.error("Error de conexión. Verifica tu conexión a internet.");
      } else {
        // Otro tipo de error
        toast.error(error.message || "Error inesperado al enviar la justificación.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      justificationTypeId: { id: "" },
      numeroDocumento: "",
      nombreAprendiz: "",
      descripcion: "",
      justificacionFile: null,
      justificacionFileBase64: "",
      notificationId: "123456",
    });
    // Limpiar el input de archivo
    if (fileInputRefPrev.current) {
      fileInputRefPrev.current.value = '';
    }
  };

  const handleCancel = () => {
    resetForm();
    toast.info("Formulario cancelado");
  };

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebaraprendiz />
      <div className="xl:col-span-5">
        <Header role="Aprendiz" />
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
                    <label className="mb-1 font-medium">Número de Documento *</label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={(e) => handleInputChange(e)}
                      className="h-10 border border-gray-300 rounded pl-3 focus:border-[#0e324d] focus:outline-none"
                      placeholder="123456789"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Nombre Aprendiz *</label>
                    <input
                      type="text"
                      name="nombreAprendiz"
                      value={formData.nombreAprendiz}
                      onChange={(e) => handleInputChange(e, true)}
                      className="h-10 border border-gray-300 rounded pl-3 focus:border-[#0e324d] focus:outline-none"
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Descripción *</label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                      className="min-h-20 border border-gray-300 rounded p-3 focus:border-[#0e324d] focus:outline-none resize-vertical"
                      placeholder="Motivo de la justificación"
                      required
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Tipo De Novedad *</label>
                    <select
                      name="justificationType"
                      value={formData.justificationTypeId.id}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          justificationTypeId: { id: e.target.value },
                        }))
                      }
                      className="h-10 border border-gray-300 rounded pl-3 focus:border-[#0e324d] focus:outline-none"
                      disabled={loadingTypes}
                      required
                    >
                      <option value="" disabled hidden>
                        {loadingTypes ? "Cargando tipos..." : "Seleccione el tipo"}
                      </option>
                      {justificationTypes.map(({ id, name }) => (
                        <option key={id} value={id}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Justificación (Archivo) *</label>
                    <button
                      type="button"
                      onClick={() => fileInputRefPrev.current?.click()}
                      className="bg-[#0e324d] text-white h-10 rounded mt-1 hover:bg-[#0a2738] transition-colors"
                    >
                      {formData.justificacionFile?.name || "📎 Subir Archivo"}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRefPrev}
                      onChange={(e) => handleFileChange(e, "justificacionFile")}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                    <small className="text-gray-500 mt-1">
                      Formatos permitidos: PDF, JPG, PNG (máx. 5MB)
                    </small>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#0e324d] text-white rounded hover:bg-[#0a2738] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Justificación"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}