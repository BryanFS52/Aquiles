"use client";

import { useRef, useEffect, ChangeEvent, FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoPeople } from "react-icons/io5";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { fetchJustificationTypes } from '@slice/justificationTypeSlice';
import { fetchAttendancesByStudent } from '@slice/attendanceSlice';
import type { AppDispatch, RootState } from '@/redux/store'
import PageTitle from "@components/UI/pageTitle";
import JustificationFormComponent from '@/components/features/justification/justificationForm';

import {
  showForm,
  resetForm,
  updateFormField,
  updateNumericField,
  updateTextField,
  updateJustificationTypeId,
  processFile,
  addJustification,
  validateForm,
  setSubmitting,
} from '@slice/justificationSlice';
import type { FormDataState } from '@slice/justificationSlice';
import {
  FaCalendarDay,
  FaRegClock,
  FaRegListAlt,
} from "react-icons/fa";
import JustificationsHistorical from "@/components/features/justification/justificationsHistorical";


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
  const fileRef = useRef<File | null>(null);
  const base64Ref = useRef<string>("");

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRefPrev = useRef<HTMLInputElement>(null);

  const { data: justificationTypesData, loading: loadingJustificationTypes, error: errorJustificationTypes } =
    useSelector((state: RootState) => state.justificationType);
  const { data: attendancesData, loading: loadingAttendances, error: errorAttendances } =
    useSelector((state: RootState) => state.attendances);
  const { loading: loadingJustification, error: errorJustification, form } =
    useSelector((state: RootState) => state.justification);

  useEffect(() => {
    dispatch(fetchJustificationTypes({ page: 0, size: 10 }));
    dispatch(fetchAttendancesByStudent({ id: 1, stateId: 1 }));
    setLoading(false);
  }, [dispatch]);

  if (loadingJustificationTypes || loadingAttendances) return <p>Cargando...</p>;
  if (errorJustificationTypes || errorAttendances) return <p>Error cargando datos</p>;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ field: name as keyof FormDataState, value }));
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateFormField({ field: e.target.name as keyof FormDataState, value: e.target.value }));
  };

  const handleNumericInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(updateNumericField({ field: e.target.name, value: e.target.value }));
  };

  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTextField({ field: e.target.name, value: e.target.value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de archivo no permitido. Solo PDF, JPG o PNG.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("El archivo supera el tamaño máximo permitido (5MB).");
      return;
    }

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => reject("Error al leer el archivo.");
        reader.readAsDataURL(file);
      });

      fileRef.current = file;
      base64Ref.current = base64;
      toast.success("Archivo procesado correctamente.");
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Error inesperado al procesar el archivo.");
    }
  };


  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(validateForm());

    if (form.validationErrors.length > 0) {
      form.validationErrors.forEach(error => toast.error(error));
      return;
    }

    if (!base64Ref.current) {
      toast.error("Debes cargar un archivo antes de enviar.");
      return;
    }

    dispatch(setSubmitting(true));

    try {
      const formDataWithFile = {
        documentNumber: form.formData.numeroDocumento,
        name: form.formData.nombreAprendiz,
        description: form.formData.descripcion,
        justificationFile: base64Ref.current,
        justificationDate: new Date().toISOString(),
        state: true,
        justificationHistory: "",
        notificationId: form.formData.notificationId,
        justificationTypeId: { id: form.formData.justificationTypeId.id },
      };


      const result = await dispatch(addJustification(formDataWithFile)).unwrap();

      toast.success("¡Tu justificación ha sido enviada exitosamente!");
      dispatch(resetForm());
      fileRef.current = null;
      base64Ref.current = "";
    } catch (error: any) {
      console.error("Error al enviar justificación:", error);
      toast.error(error.message || "Error inesperado al enviar la justificación.");
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleCancel = () => {
    dispatch(resetForm());
    fileRef.current = null;
    base64Ref.current = "";
    toast.info("Formulario cancelado");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
        <span className="ml-3 text-black dark:text-white">Cargando justificaciones...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {/* Título de la página */}
      <div className="mb-6">
        <PageTitle>Justificaciones</PageTitle>
      </div>

      {/* Contenido principal */}
      <AnimatePresence>
        {form.showForm && (
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <div className="w-full lg:w-1/2">
              <JustificationFormComponent
                form={form}
                justificationTypesData={justificationTypesData}
                loadingJustificationTypes={loadingJustificationTypes}
                loadingJustification={loadingJustification}
                handleSave={handleSave}
                handleCancel={handleCancel}
                handleInputChange={handleInputChange}
                handleTextInputChange={handleTextInputChange}
                handleNumericInputChange={handleNumericInputChange}
                handleFileChange={handleFileChange}
                updateJustificationTypeId={(value) => dispatch(updateJustificationTypeId(value))}
                fileRef={fileRef}
                fileInputRefPrev={fileInputRefPrev}
              />
            </div>
            <div className="w-full lg:w-1/2">
              <JustificationsHistorical />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
