"use client";

import { useRef, useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoPeople } from "react-icons/io5";
import { toast } from "react-toastify";
import PageTitle from "@components/UI/pageTitle";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store'
import { fetchJustificationTypes } from '@slice/justificationTypeSlice';
import { fetchAttendancesByStudent } from '@slice/attendanceSlice'
import { addJustification } from '@slice/justificationSlice';
import {
  FaCalendarDay,
  FaRegClock,
  FaRegListAlt,
} from "react-icons/fa";

interface JustificationType {
  id: string;
  name: string;
}

interface FormDataState {
  justificationTypeId: { id: string };
  numeroDocumento: string;
  nombreAprendiz: string;
  descripcion: string;
  justificacionFile: File | null;
  justificacionFileBase64: string;
  notificationId: string;
}

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
  const dispatch = useDispatch<AppDispatch>();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: justificationTypesData, loading: loadingJustificationTypes, error: errorJustificationTypes } =
    useSelector((state: RootState) => state.justificationType);
  const { data: attendancesData, loading: loadingAttendances, error: errorAttendances } =
    useSelector((state: RootState) => state.attendances);
  const { loading: loadingJustification, error: errorJustification } =
    useSelector((state: RootState) => state.justification);

  const [formData, setFormData] = useState<FormDataState>({
    justificationTypeId: { id: "" },
    numeroDocumento: "",
    nombreAprendiz: "",
    descripcion: "",
    justificacionFile: null,
    justificacionFileBase64: "",
    notificationId: "123456",
  });

  const fileInputRefPrev = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchJustificationTypes({ page: 0, size: 10 }));
    dispatch(fetchAttendancesByStudent({ id: 1, stateId: 2 }))
  }, [dispatch]);

  if (loadingJustificationTypes || loadingAttendances) return <p>Cargando...</p>;
  if (errorJustificationTypes || errorAttendances) return <p>Error cargando datos</p>;

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    allowAlpha = false
  ) => {
    const { name, value } = e.target;
    let cleanedValue = value;
    if (name === "numeroDocumento") {
      cleanedValue = value.replace(/[^0-9]/g, "");
    } else if (allowAlpha && name === "nombreAprendiz") {
      cleanedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
    }
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileKey: string) => {
    const file = e.target.files?.[0];
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
      const base64 = (reader.result as string).split(",")[1];
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

  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.numeroDocumento.trim()) errors.push("El número de documento es obligatorio");
    if (!formData.nombreAprendiz.trim()) errors.push("El nombre del aprendiz es obligatorio");
    if (!formData.descripcion.trim()) errors.push("La descripción es obligatoria");
    if (!formData.justificationTypeId.id) errors.push("Debe seleccionar un tipo de novedad");
    if (!formData.justificacionFile) errors.push("Debe adjuntar un archivo de justificación");
    return errors;
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    const selectedType = justificationTypesData?.find((t: JustificationType) => t.id === formData.justificationTypeId.id);
    if (!selectedType) {
      toast.error("El tipo de justificación seleccionado no es válido.");
      return;
    }

    if (formData.justificacionFile && formData.justificacionFile.size > 5 * 1024 * 1024) {
      toast.error("El archivo de justificación no puede ser mayor de 5 MB.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(addJustification(formData)).unwrap();

      toast.success("¡Tu justificación ha sido enviada exitosamente!");
      resetForm();
    } catch (error: any) {
      console.error("Error al enviar justificación:", error);

      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Error inesperado al enviar la justificación.");
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
        <PageTitle>Justificaciones</PageTitle>
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
                  <FaCalendarDay className="mr-3 text-black dark:text-white" />
                  <span><strong>Fecha:</strong> {sessions["1"].date}</span>
                </div>
                <div className="flex items-center">
                  <FaRegClock className="mr-3 text-black dark:text-white" />
                  <span><strong>Hora:</strong> {sessions["1"].time}</span>
                </div>
                <div className="flex items-center">
                  <FaRegListAlt className="mr-3 text-black dark:text-white" />
                  <span><strong>Ficha:</strong> {sessions["1"].sheet}</span>
                </div>
                <div className="flex items-center">
                  <IoPeople className="mr-3 text-black dark:text-white" />
                  <span><strong>Instructores:</strong> {sessions["1"].instructors.join(", ")}</span>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="w-full mt-8 py-3 px-6 rounded-lg bg-lightGreen text-black dark:text-white dark:bg-black transition-colors font-medium"
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
              <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">
                Formulario de Justificación
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-black dark:text-lightGray">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={handleInputChange}
                      className="h-11 border border-lightGray dark:border-darkGray rounded-lg px-4 bg-white dark:bg-shadowBlue text-darkBlue dark:text-white focus:border-darkBlue dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-darkBlue dark:focus:ring-lightGreen"
                      placeholder="123456789"
                      required
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-black dark:text-lightGray">
                      Nombre Aprendiz *
                    </label>
                    <input
                      type="text"
                      name="nombreAprendiz"
                      value={formData.nombreAprendiz}
                      onChange={(e) => handleInputChange(e, true)}
                      className="h-11 border border-lightGray dark:border-darkGray rounded-lg px-4 bg-white dark:bg-shadowBlue text-black dark:text-white focus:border-black dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-lightGreen"
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black dark:text-lightGray">
                    Descripción *
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    className="min-h-24 border border-lightGray dark:border-darkGray rounded-lg p-4 bg-white dark:bg-shadowBlue text-black dark:text-white focus:border-black dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-lightGreen resize-vertical"
                    placeholder="Motivo de la justificación"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label
                    htmlFor="justificationTypeSelect"
                    className="text-sm font-medium text-darkBlue dark:text-lightGray"
                  >
                    Tipo De Novedad *
                  </label>
                  <select
                    id="justificationTypeSelect"
                    name="justificationType"
                    aria-label="Tipo De Novedad"
                    value={formData.justificationTypeId.id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        justificationTypeId: { id: e.target.value },
                      }))
                    }
                    className="h-11 border border-lightGray dark:border-darkGray rounded-lg px-4 bg-white dark:bg-shadowBlue text-black dark:text-white focus:border-black dark:focus:border-lightGreen focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-lightGreen"
                    disabled={loadingJustificationTypes}
                    required
                  >
                    <option value="" disabled hidden>
                      {loadingJustificationTypes ? "Cargando tipos..." : "Seleccione el tipo"}
                    </option>
                    {justificationTypesData?.map(({ id, name }: JustificationType) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-black dark:text-lightGray">
                    Justificación (Archivo) *
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRefPrev.current?.click()}
                    className="bg-black dark:bg-lightGreen text-white h-11 rounded-lg hover:bg-lightGreen dark:hover:bg-darkGreen transition-colors font-medium"
                  >
                    {formData.justificacionFile?.name || "📎 Subir Archivo"}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRefPrev}
                    onChange={(e) => handleFileChange(e, "justificacionFile")}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    placeholder="Adjuntar archivo de justificación"
                    title="Adjuntar archivo de justificación"
                  />
                  <small className="text-darkGray dark:text-grayText">
                    Formatos permitidos: PDF, JPG, PNG (máx. 5MB)
                  </small>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-lightGray dark:border-darkGray">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-darkGray dark:bg-shadowBlue text-white rounded-lg hover:bg-black dark:hover:bg-lightGray dark:hover:text-black transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-black dark:bg-lightGreen text-white rounded-lg hover:bg-lightGreen dark:hover:bg-darkGreen transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    disabled={isSubmitting || loadingJustification}
                  >
                    {isSubmitting || loadingJustification ? "Enviando..." : "Enviar Justificación"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}