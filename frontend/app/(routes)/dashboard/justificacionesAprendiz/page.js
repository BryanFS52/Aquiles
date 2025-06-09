"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        if (Object.prototype.hasOwnProperty.call(result, 'success')) {
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
    <div className="w-full h-full">
      {/* Título de la página */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-black dark:text-white border-b-2 border-lightGray dark:border-shadowBlue pb-2 w-fit">
          Justificación para el Aprendiz
        </h1>
      </div>

      {/* Contenido principal */}
      <div className="space-y-6">
        <AnimatePresence>
          {!showForm && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl bg-white dark:bg-shadowBlue p-6 lg:p-8 rounded-xl shadow-sm border border-lightGray dark:border-darkGray"
            >
              <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">
                Componente: {sessions["1"].componentName}
              </h2>
              <div className="space-y-4 text-darkGray dark:text-lightGray">
                <div className="flex items-center">
                  <FaCalendarDay className="mr-3 text-darkBlue dark:text-darkBlue" />
                  <span><strong>Fecha:</strong> {sessions["1"].date}</span>
                </div>
                <div className="flex items-center">
                  <FaRegClock className="mr-3 text-darkBlue dark:text-darkBlue" />
                  <span><strong>Hora:</strong> {sessions["1"].time}</span>
                </div>
                <div className="flex items-center">
                  <FaRegListAlt className="mr-3 text-darkBlue dark:text-darkBlue" />
                  <span><strong>Ficha:</strong> {sessions["1"].sheet}</span>
                </div>
                <div className="flex items-center">
                  <IoPeople className="mr-3 text-darkBlue dark:text-darkBlue" />
                  <span><strong>Instructores:</strong> {sessions["1"].instructors.join(", ")}</span>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="w-full mt-8 py-3 px-6 rounded-lg bg-lightGreen text-black dark:text-white dark:bg-darkBlue transition-colors font-medium"
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
              className="w-full max-w-4xl bg-white dark:bg-shadowBlue p-6 lg:p-8 rounded-xl shadow-sm border border-lightGray dark:border-darkGray"
            >
              <h2 className="text-xl font-semibold mb-6 text-darkBlue dark:text-white">
                Formulario de Justificación
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-darkBlue dark:text-lightGray">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={(e) => handleInputChange(e)}
                      className="h-11 border border-lightGray dark:border-darkGray rounded-lg px-4 bg-white dark:bg-shadowBlue text-darkBlue dark:text-white focus:border-darkBlue dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-darkBlue dark:focus:ring-lightGreen"
                      placeholder="123456789"
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-darkBlue dark:text-lightGray">
                      Nombre Aprendiz *
                    </label>
                    <input
                      type="text"
                      name="nombreAprendiz"
                      value={formData.nombreAprendiz}
                      onChange={(e) => handleInputChange(e, true)}
                      className="h-11 border border-lightGray dark:border-darkGray rounded-lg px-4 bg-white dark:bg-shadowBlue text-darkBlue dark:text-white focus:border-darkBlue dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-darkBlue dark:focus:ring-lightGreen"
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-darkBlue dark:text-lightGray">
                    Descripción *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    className="min-h-24 border border-lightGray dark:border-darkGray rounded-lg p-4 bg-white dark:bg-shadowBlue text-darkBlue dark:text-white focus:border-darkBlue dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-darkBlue dark:focus:ring-lightGreen resize-vertical"
                    placeholder="Motivo de la justificación"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-darkBlue dark:text-lightGray">
                    Tipo De Novedad *
                  </label>
                  <select
                    name="justificationType"
                    value={formData.justificationTypeId.id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        justificationTypeId: { id: e.target.value },
                      }))
                    }
                    className="h-11 border border-lightGray dark:border-darkGray rounded-lg px-4 bg-white dark:bg-shadowBlue text-darkBlue dark:text-white focus:border-darkBlue dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-darkBlue dark:focus:ring-lightGreen"
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

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-darkBlue dark:text-lightGray">
                    Justificación (Archivo) *
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRefPrev.current?.click()}
                    className="bg-darkBlue dark:bg-lightGreen text-white h-11 rounded-lg hover:bg-lightGreen dark:hover:bg-darkGreen transition-colors font-medium"
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
                  <small className="text-darkGray dark:text-grayText">
                    Formatos permitidos: PDF, JPG, PNG (máx. 5MB)
                  </small>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-lightGray dark:border-darkGray">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-darkGray dark:bg-shadowBlue text-white rounded-lg hover:bg-darkBlue dark:hover:bg-lightGray dark:hover:text-darkBlue transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-darkBlue dark:bg-lightGreen text-white rounded-lg hover:bg-lightGreen dark:hover:bg-darkGreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
        theme="light"
        toastClassName="dark:!bg-shadowBlue dark:!text-white dark:!border dark:!border-darkGray"
      />
    </div>
  );
}