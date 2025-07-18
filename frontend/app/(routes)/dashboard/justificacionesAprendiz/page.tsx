"use client";

import { useRef, useEffect, ChangeEvent, FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoPeople } from "react-icons/io5";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '@context/UserContext';
import { fetchJustificationTypes } from '@slice/justificationTypeSlice';
import { fetchAttendancesByStudent } from '@slice/attendanceSlice';
import { fetchJustifications, generateFileName } from '@slice/justificationSlice';
import type { AppDispatch, RootState } from '@/redux/store'
import type { FormDataState } from '@slice/justificationSlice';
import { Attendance } from "@/graphql/generated";
import PageTitle from "@components/UI/pageTitle";
import JustificationFormComponent from '@components/features/justification/justificationForm';

import {
  showForm,
  resetForm,
  updateFormField,
  updateNumericField,
  updateTextField,
  updateJustificationTypeId,
  addJustification,
  validateForm,
  downloadBase64File,
  setSubmitting,
  setCurrentAttendance
} from '@slice/justificationSlice';
import {
  FaCalendarDay,
  FaRegListAlt,
  FaCheckCircle,
} from "react-icons/fa";
import JustificationsHistorical from "@/components/features/justification/justificationsHistorical";


// const sessions = {
//   "1": {
//     componentName: "Nombre del Componente",
//     date: "01/09/2024",
//     time: "10:00 AM",
//     sheet: "Ficha 12345",
//     instructors: ["Instructor 1", "Instructor 2"],
//   },
// };

export default function JustificacionAprendiz() {
  const fileRef = useRef<File | null>(null);
  const base64Ref = useRef<string>("");
  const formRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  // Estado local para controlar la carga del modal
  const [shouldLoadModal, setShouldLoadModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const fileInputRefPrev = useRef<HTMLInputElement>(null);

  const { data: justificationTypesData, loading: loadingJustificationTypes, error: errorJustificationTypes } =
    useSelector((state: RootState) => state.justificationType);
  const { data: attendancesData, loading: loadingAttendances, error: errorAttendances
  } = useSelector((state: RootState) => state.attendances.studentAttendances);
  const { transformedData: justificationsData, loading: loadingJustifications } =
    useSelector((state: RootState) => state.justification);
  const { loading: loadingJustification, error: errorJustification, form } =
    useSelector((state: RootState) => state.justification);
  const currentAttendance = useSelector(
    (state: RootState) => state.justification.form.currentAttendance
  );


  useEffect(() => {
    dispatch(fetchJustificationTypes({ page: 0, size: 10 }));
    dispatch(fetchAttendancesByStudent({ id: 2, stateId: 2 }));
    dispatch(fetchJustifications({ page: 0, size: 10 }));
  }, [dispatch]);

  // Efecto para sincronizar el estado local con el estado global
  useEffect(() => {
    if (form.showForm && !shouldLoadModal) {
      const timer = setTimeout(() => {
        setShouldLoadModal(true);
      }, 100);
      return () => clearTimeout(timer);
    } else if (!form.showForm && shouldLoadModal) {
      setShouldLoadModal(false);
    }
  }, [form.showForm, shouldLoadModal]);

  if (loadingJustificationTypes || loadingAttendances || loadingJustifications) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <span className="ml-4 text-xl font-semibold text-black dark:text-white">Cargando datos...</span>
      </div>
    );
  }
  if (errorJustificationTypes || errorAttendances) return <p>Error cargando datos</p>;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ field: name as keyof FormDataState, value }));
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
        description: form.formData.descripcion,
        justificationFile: base64Ref.current,
        justificationDate: new Date().toISOString().split('T')[0],
        justificationType: { id: form.formData.justificationTypeId.id },
        attendance: { id: currentAttendance?.id },
        state: false,
      };

      await dispatch(addJustification(formDataWithFile)).unwrap();

      toast.success("¡Tu justificación ha sido enviada exitosamente!");
      dispatch(fetchJustifications({ page: 0, size: 10 }));
      dispatch(resetForm());
      fileRef.current = null;
      base64Ref.current = "";

      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (error: any) {
      console.error("Error al enviar justificación:", error);
      const errorString = JSON.stringify(error);
      let toastMessage = "Error inesperado al enviar la justificación.";

      if (errorString.includes('duplicate key value violates unique constraint')) {
        toastMessage = "Esta asistencia ya ha sido justificada.";
      } else if (error?.message) {
        toastMessage = error.message;
      }
      toast.error(toastMessage);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  const handleCancel = () => {
    dispatch(resetForm());
    fileRef.current = null;
    base64Ref.current = "";
    setShouldLoadModal(false);
    toast.info("Formulario cancelado");

    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };


  const handleShowForm = (attendanceId?: string) => {
    console.log("🟡 handleShowForm llamado con ID:", attendanceId);
    if (attendanceId && attendancesData) {
      const currentAttendance = attendancesData.find((a) => a.id === attendanceId);
      console.log("📄 currentAttendance encontrada:", currentAttendance);

      if (currentAttendance) {
        const person = currentAttendance.student?.person;

        if (person?.document && person?.name && person?.lastname) {
          dispatch(updateFormField({ field: 'numeroDocumento', value: person.document }));
          dispatch(updateFormField({ field: 'nombreAprendiz', value: `${person.name} ${person.lastname}` }));
        }

        dispatch(updateFormField({ field: 'notificationId', value: attendanceId }));

        // 🔥 ESTO ES LO QUE FALTABA
        dispatch(setCurrentAttendance(currentAttendance));

        // Esperar a que Redux actualice el estado antes de mostrar el form
        setTimeout(() => {
          dispatch(showForm());
          formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 10);
      } else {
        console.warn("No se encontró la asistencia con ID:", attendanceId);
      }
    }
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadFile = (justificacion: any) => {
    if (justificacion.archivoAdjunto) {
      const mimeType = justificacion.archivoMime || "application/octet-stream";
      const fileName = generateFileName(justificacion.id, mimeType);
      downloadBase64File(justificacion.archivoAdjunto, fileName, mimeType);
    }
  };

  const absences = attendancesData || [];
  return (
    <div className="h-auto">
      <div ref={topRef} className="mb-6">
        <PageTitle>Justificaciones</PageTitle>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">

        <AnimatePresence mode="wait">
          {!form.showForm && !shouldLoadModal && (
            <motion.div
              key="absences-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500 p-3 rounded-full shadow-lg">
                  <IoPeople className="text-2xl text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Ausencias Registradas
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Gestiona tus justificaciones de ausencias
                  </p>
                </div>
              </div>

              {absences.length > 0 && (
                <div className="mb-6 ">
                  <div className="max-h-80 overflow-y-auto pr-2 space-y-4">
                    {absences.map((attendance: Attendance, index) => (
                      <motion.div
                        key={attendance.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group hover:shadow-md transition-all duration-300 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-red-500 p-2 rounded-lg shadow-md">
                              <FaCalendarDay className="text-white text-lg" />
                            </div>
                            <div className="ml-4">
                              <div className="font-semibold text-gray-800 text-lg">
                                {formatDate(attendance.attendanceDate ?? '')}
                              </div>
                              <div className="text-sm text-red-600 font-medium">
                                Estado: {attendance.attendanceState?.status || 'Ausente'}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleShowForm(attendance.id)}
                            className="bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <FaRegListAlt className="mr-2" />
                            Justificar
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              {absences.length === 0 && (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="mb-6"
                  >
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 rounded-full inline-block shadow-lg">
                      <FaCheckCircle className="text-6xl text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    ¡Excelente asistencia!
                  </h3>
                  <p className="text-gray-600 text-lg">
                    No tienes ausencias pendientes por justificar.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Continúa manteniendo tu buen récord de asistencia.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {form.showForm && shouldLoadModal && (
            <motion.div
              key="justification-form"
              ref={formRef}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100"
            >
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500 p-3 rounded-full shadow-lg">
                      <FaRegListAlt className="text-2xl text-white" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Formulario de Justificación
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Completa los datos para justificar tu ausencia
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200 hover:bg-gray-100 p-2 rounded-full"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-3">
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
            </motion.div>
          )}
          <div className="pl-2">
            <JustificationsHistorical
              data={justificationsData}
              loading={loadingJustifications}
              handleDownloadFile={handleDownloadFile}
            />
          </div>
        </AnimatePresence>
      </div>

    </div>
  );
}
