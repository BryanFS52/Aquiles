"use client";

import { useRef, useEffect, ChangeEvent, FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoPeople } from "react-icons/io5";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { useUser } from '@context/UserContext';
import { useLoader } from '@/context/LoaderContext';
import { fetchJustificationTypes } from '@slice/justificationTypeSlice';
import { fetchAllJustificationStatuses } from '@/redux/slices/justificationStatusSlice';
import { fetchAttendancesByStudent } from '@slice/attendanceSlice';
import {
  fetchJustifications,
  generateFileName,
  formatErrorMessage,
} from "@slice/justificationSlice";

import { AppDispatch, RootState } from "@/redux/store";
import { FormDataState } from "@slice/justificationSlice";
import { Attendance } from "@graphql/generated";
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";
import JustificationFormComponent from "@components/features/justification/justificationForm";

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
  setCurrentAttendance,
} from "@slice/justificationSlice";
import { FaCalendarDay, FaRegListAlt, FaCheckCircle } from "react-icons/fa";
import JustificationsHistorical from "@/components/features/justification/justificationsHistorical";


export default function JustificacionAprendiz() {
  // ✅ TODOS LOS HOOKS DEBEN IR AL INICIO
  const fileRef = useRef<File | null>(null);
  const base64Ref = useRef<string>("");
  const formRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const fileInputRefPrev = useRef<HTMLInputElement>(null);

  const { user } = useUser();
  const { showLoader, hideLoader } = useLoader();
  
  const [shouldLoadModal, setShouldLoadModal] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Todos los useSelector al inicio
  const {
    data: justificationTypesData,
    loading: loadingJustificationTypes,
    error: errorJustificationTypes,
  } = useSelector((state: RootState) => state.justificationType);
  
  const {
    data: attendancesData,
    loading: loadingAttendances,
    error: errorAttendances,
  } = useSelector((state: RootState) => state.attendances.studentAttendances);
  
  const {
    transformedData: justificationsData,
    loading: loadingJustifications,
  } = useSelector((state: RootState) => state.justification);
  
  const {
    loading: loadingJustification,
    error: errorJustification,
    form,
  } = useSelector((state: RootState) => state.justification);
  
  const currentAttendance = useSelector(
    (state: RootState) => state.justification.form.currentAttendance
  );
  
  const originalJustificationsData = useSelector(
    (state: RootState) => state.justification.data
  );

  // Obtener los estados de justificación
  const { justificationStatuses } = useSelector(
    (state: RootState) => state.justificationStatus
  );

  // ✅ Todos los useEffect al inicio
  useEffect(() => {
    dispatch(fetchJustificationTypes({ page: 0, size: 10 }));
    dispatch(fetchAttendancesByStudent({ id: 2, stateId: 2 }));
    dispatch(fetchJustifications({ page: 0, size: 10 }));
    // Cargar los estados de justificación
    dispatch(fetchAllJustificationStatuses({ page: 0, size: 3 }));
  }, [dispatch]);

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

  useEffect(() => {
    if (justificationsData && attendancesData) {
      console.log("🐛 DEBUG - Justificaciones transformadas:", justificationsData);
      console.log("🐛 DEBUG - Asistencias:", attendancesData);
      console.log("🐛 DEBUG - Datos originales de justificaciones:", originalJustificationsData);
      
      // ✅ Verificar si la asistencia actual del formulario ya está justificada
      if (form.showForm && currentAttendance && originalJustificationsData) {
        const isCurrentJustified = originalJustificationsData.some(
          justification => justification.attendance?.id === currentAttendance.id
        );
        
        if (isCurrentJustified) {
          console.log("🔒 Ocultando formulario: asistencia ya justificada");
          dispatch(resetForm());
          fileRef.current = null;
          base64Ref.current = "";
          setShouldLoadModal(false);
          toast.info("Esta asistencia ya ha sido justificada.");
        }
      }
    }
  }, [justificationsData, attendancesData, originalJustificationsData, form.showForm, currentAttendance, dispatch]);

  // ✅ Definir todas las funciones después de los hooks
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUnexcusedAbsences = () => {
    if (!attendancesData || !originalJustificationsData) return attendancesData || [];
    
    console.log("📊 Justificaciones originales:", originalJustificationsData);
    console.log("📋 Datos de asistencias:", attendancesData);
    
    const justifiedAttendanceIds = new Set(
      originalJustificationsData
        .filter(justification => justification.attendance?.id)
        .map(justification => justification.attendance?.id?.toString())
        .filter(id => id !== undefined) as string[]
    );

    console.log("🔍 IDs de asistencias justificadas:", Array.from(justifiedAttendanceIds));

    const unexcusedAbsences = attendancesData.filter(attendance => {
      const isJustified = justifiedAttendanceIds.has(attendance.id);
      console.log(`📝 Asistencia ${attendance.id}: ${isJustified ? 'JUSTIFICADA' : 'NO JUSTIFICADA'}`);
      return !isJustified;
    });

    console.log("✅ Ausencias sin justificar:", unexcusedAbsences);
    return unexcusedAbsences;
  };

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

    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
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
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = () => reject("Error al leer el archivo.");
        reader.readAsDataURL(file);
      });

      fileRef.current = file;
      base64Ref.current = base64;
      toast.success("Archivo procesado correctamente.");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Error inesperado al procesar el archivo."
      );
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(validateForm());

    if (form.validationErrors.length > 0) {
      form.validationErrors.forEach((error) => toast.error(error));
      return;
    }

    if (!base64Ref.current) {
      toast.error("Debes cargar un archivo antes de enviar.");
      return;
    }

    if (!currentAttendance?.attendanceDate) {
      toast.error("No se pudo obtener la fecha de ausencia.");
      return;
    }

    // ✅ Verificar si la asistencia ya está justificada antes de enviar
    const isAlreadyJustified = originalJustificationsData?.some(
      justification => justification.attendance?.id === currentAttendance.id
    );

    if (isAlreadyJustified) {
      toast.error("Esta asistencia ya ha sido justificada anteriormente.");
      handleCancel(); // Ocultar formulario inmediatamente
      return;
    }

    dispatch(setSubmitting(true));

    try {
      const formDataWithFile = {
        description: form.formData.descripcion,
        justificationFile: base64Ref.current,
        absenceDate: currentAttendance.attendanceDate,
        justificationDate: new Date().toISOString().split('T')[0],
        justificationType: { id: form.formData.justificationTypeId.id },
        attendance: { id: currentAttendance.id },
        state: false,
      };

      console.log("📤 Enviando justificación:", formDataWithFile);

      await dispatch(addJustification(formDataWithFile)).unwrap();

      toast.success("¡Tu justificación ha sido enviada exitosamente!");
      
      // ✅ Actualizar datos y ocultar formulario inmediatamente después del éxito
      await Promise.all([
        dispatch(fetchJustifications({ page: 0, size: 10 })).unwrap(),
        dispatch(fetchAttendancesByStudent({ id: 2, stateId: 2 })).unwrap()
      ]);
      
      // ✅ Limpiar formulario y ocultarlo
      dispatch(resetForm());
      fileRef.current = null;
      base64Ref.current = "";
      setShouldLoadModal(false);

      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
      
    } catch (error: any) {
      console.error("Error al enviar justificación:", error);
      
      let toastMessage = "Error inesperado al enviar la justificación.";
      
      if (error?.message) {
        if (error.message.includes("duplicate") || error.message.includes("unique constraint")) {
          toastMessage = "Esta asistencia ya ha sido justificada. Actualizando datos...";
          
          // ✅ Actualizar datos y ocultar formulario cuando hay error de duplicado
          try {
            await Promise.all([
              dispatch(fetchJustifications({ page: 0, size: 10 })).unwrap(),
              dispatch(fetchAttendancesByStudent({ id: 2, stateId: 2 })).unwrap()
            ]);
          } catch (refreshError) {
            console.error("Error al actualizar datos:", refreshError);
          }
          
          // ✅ Ocultar formulario en caso de duplicado
          dispatch(resetForm());
          fileRef.current = null;
          base64Ref.current = "";
          setShouldLoadModal(false);
          
          setTimeout(() => {
            topRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 200);
        } else {
          toastMessage = error.message;
        }
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
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const handleShowForm = (attendanceId?: string) => {
    console.log("🟡 handleShowForm llamado con ID:", attendanceId);
    
    // ✅ Verificar si la asistencia ya está justificada antes de mostrar el formulario
    const isAlreadyJustified = originalJustificationsData?.some(
      justification => justification.attendance?.id === attendanceId
    );

    if (isAlreadyJustified) {
      toast.info("Esta asistencia ya ha sido justificada anteriormente.");
      return;
    }

    if (attendanceId && attendancesData) {
      const currentAttendance = attendancesData.find((a) => a.id === attendanceId);
      console.log("📄 currentAttendance encontrada:", currentAttendance);

      if (currentAttendance) {
        const person = currentAttendance.student?.person;

        if (person?.document && person?.name && person?.lastname) {
          dispatch(updateFormField({ field: "numeroDocumento", value: person.document }));
          dispatch(updateFormField({ field: "nombreAprendiz", value: `${person.name} ${person.lastname}` }));
        }

        dispatch(updateFormField({ field: "notificationId", value: attendanceId }));
        dispatch(setCurrentAttendance(currentAttendance));
        
        setTimeout(() => {
          dispatch(showForm());
          formRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 10);
      } else {
        console.warn("No se encontró la asistencia con ID:", attendanceId);
      }
    }
  };

  const handleDownloadFile = (justificacion: any) => {
    if (justificacion.archivoAdjunto) {
      const mimeType = justificacion.archivoMime || "application/octet-stream";
      const fileName = generateFileName(justificacion.id, mimeType);
      downloadBase64File(justificacion.archivoAdjunto, fileName, mimeType);
    }
  };

  // ✅ Calcular valores después de todas las funciones
  const absences = getUnexcusedAbsences();
  const errorMessage = formatErrorMessage(errorJustification || errorJustificationTypes || errorAttendances);

  // ✅ AHORA SÍ puedes hacer los returns condicionales
  if (loadingJustificationTypes || loadingAttendances || loadingJustifications) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <span className="ml-4 text-xl font-semibold text-black dark:text-white">
          Cargando datos...
        </span>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="h-auto">
        <div ref={topRef} className="mb-6">
          <PageTitle>Justificaciones</PageTitle>
        </div>
        <EmptyState message={errorMessage} />
      </div>
    );
  }

  return (
    <div className="h-auto">
      <div ref={topRef} className="mb-6">
        <PageTitle>Justificaciones</PageTitle>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {!form.showForm && !shouldLoadModal && (
            <motion.div
              key="absences-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-[#002033] rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center mb-6 ">
                <div className="bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500 p-3 rounded-full shadow-lg">
                  <IoPeople className="text-2xl text-white" />
                </div>
                <div className="ml-4 ">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Ausencias Registradas
                  </h2>
                  <p className="text-gray-600 text-sm dark:text-gray-400">
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
                        className="group hover:shadow-md transition-all duration-300 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 dark:bg-gradient-to-r dark:from-red-300 dark:to-orange-100 dark:border-red-800 rounded-xl relative overflow-hidden"
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
                                Estado:{" "}
                                {attendance.attendanceState?.status || "Ausente"}
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
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                    ¡Excelente asistencia!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {attendancesData && attendancesData.length > 0 
                      ? "Todas tus ausencias han sido justificadas."
                      : "No tienes ausencias pendientes por justificar."
                    }
                  </p>
                  <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
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
              className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800 dark:bg-[#002033] "
            >
              <div className="">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r dark:from-secondary dark:to-blue-900 from-primary to-lime-500 p-3 rounded-full shadow-lg">
                      <FaRegListAlt className="text-2xl text-white" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Formulario de Justificación
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Completa los datos para justificar tu ausencia
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 dark:hover:text-gray-100 hover:text-gray-600 text-2xl transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="">
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
                  updateJustificationTypeId={(value) =>
                    dispatch(updateJustificationTypeId(value))
                  }
                  fileRef={fileRef}
                  fileInputRefPrev={fileInputRefPrev}
                />
              </div>
            </motion.div>
          )}
          
          <motion.div
            key="justification-history"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800 dark:bg-[#002033] "
          >
            <div className="">
              <JustificationsHistorical
                data={justificationsData}
                loading={loadingJustifications}
                handleDownloadFile={handleDownloadFile}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
