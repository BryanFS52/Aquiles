'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJustificationTypes } from '@slice/justificationTypeSlice';
import { fetchAttendancesByStudent } from '@slice/attendanceSlice';
import {
  fetchJustifications,
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
  generateFileName,
  FormDataState,
  fetchJustificationsByStudentId,
} from '@slice/justificationSlice';

import { AppDispatch, RootState } from '@/redux/store';
import { Attendance } from '@graphql/generated';
import PageTitle from '@components/UI/pageTitle';
import { AbsencesList } from './AbsencesList';
import { JustificationFormModal } from './JustificationFormModal';
import { JustificationsHistory } from './JustificationsHistory';
import { TEMPORAL_APRENDIZ_ID } from '@/temporaryCredential';

export const JustificationsContainer: React.FC = () => {
  const fileRef = useRef<File | null>(null);
  const base64Ref = useRef<string>('');
  const formRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Estado local para controlar la carga del modal
  const [shouldLoadModal, setShouldLoadModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const fileInputRefPrev = useRef<HTMLInputElement>(null);

  // Redux selectors
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
  
  // const para simplificar el uso del ID del estudiante
  TEMPORAL_APRENDIZ_ID;

  // Effects
  useEffect(() => {
    dispatch(fetchJustificationTypes({ page: 0, size: 10 }));
    dispatch(fetchAttendancesByStudent({ id: TEMPORAL_APRENDIZ_ID, stateId: 2 }));
    dispatch(fetchJustificationsByStudentId({ studentId: TEMPORAL_APRENDIZ_ID, page: 0, size: 10 }));
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

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ field: name as keyof FormDataState, value }));
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updateNumericField({ field: e.target.name, value: e.target.value })
    );
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateTextField({ field: e.target.name, value: e.target.value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      toast.error('Tipo de archivo no permitido. Solo PDF, JPG o PNG.');
      return;
    }

    if (file.size > maxSize) {
      toast.error('El archivo supera el tamaño máximo permitido (5MB).');
      return;
    }

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1].replace(/\s/g, '');
          resolve(base64);
        };
        reader.onerror = () => reject('Error al leer el archivo.');
        reader.readAsDataURL(file);
      });

      fileRef.current = file;
      base64Ref.current = base64;
      toast.success('Archivo procesado correctamente.');
    } catch (error) {
      toast.error(
        typeof error === 'string'
          ? error
          : 'Error inesperado al procesar el archivo.'
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(validateForm());

    if (form.validationErrors.length > 0) {
      form.validationErrors.forEach((error) => toast.error(error));
      return;
    }

    if (!base64Ref.current) {
      toast.error('Debes cargar un archivo antes de enviar.');
      return;
    }

    dispatch(setSubmitting(true));

    try {
      // Extraer studentId de la asistencia actual
      const studentId = currentAttendance?.student?.id;
      if (!studentId) {
        throw new Error("No se pudo obtener el ID del estudiante");
      }

      // Construir el input según el JustificationDto esperado por el backend
      const formDataWithFile = {
        studentId: parseInt(studentId.toString()),
        description: form.formData.descripcion,
        justificationFile: base64Ref.current,
        absenceDate: currentAttendance?.attendanceDate, // Usar la fecha de la asistencia
        justificationDate: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        state: false,
        attendance: {
          id: currentAttendance?.id,
          studentId: parseInt(studentId.toString()),
          attendanceDate: currentAttendance?.attendanceDate,
          competenceQuarter: currentAttendance?.competenceQuarter?.id || null,
          attendanceState: currentAttendance?.attendanceState ? {
            id: currentAttendance.attendanceState.id,
            status: currentAttendance.attendanceState.status
          } : null
        },
        justificationType: { 
          id: form.formData.justificationTypeId.id.toString()
        },
        // No incluir justificationStatus ya que se asigna automáticamente en el backend
      };

      // console.log("🚀 Enviando justificación con datos:", formDataWithFile);

      await dispatch(addJustification(formDataWithFile)).unwrap();

      toast.success('¡Tu justificación ha sido enviada exitosamente!');
      dispatch(fetchJustificationsByStudentId({ studentId: TEMPORAL_APRENDIZ_ID, page: 0, size: 10 }));
      dispatch(resetForm());
      fileRef.current = null;
      base64Ref.current = '';

      setTimeout(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (error: any) {
      // console.error('Error al enviar justificación:', error);
      const errorString = JSON.stringify(error);
      let toastMessage = 'Error inesperado al enviar la justificación.';

      if (
        errorString.includes('duplicate key value violates unique constraint')
      ) {
        toastMessage = 'Esta asistencia ya ha sido justificada.';
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
    base64Ref.current = '';
    setShouldLoadModal(false);
    toast.info('Formulario cancelado');

    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleShowForm = (attendanceId?: string) => {
    if (attendanceId && attendancesData) {
      const currentAttendance = attendancesData.find(
        (a) => a.id === attendanceId
      );

      if (currentAttendance) {
        const person = currentAttendance.student?.person;

        if (person?.document && person?.name && person?.lastname) {
          dispatch(
            updateFormField({
              field: 'numeroDocumento',
              value: person.document,
            })
          );
          dispatch(
            updateFormField({
              field: 'nombreAprendiz',
              value: `${person.name} ${person.lastname}`,
            })
          );
        }

        dispatch(
          updateFormField({ field: 'notificationId', value: attendanceId })
        );

        dispatch(setCurrentAttendance(currentAttendance));
        setTimeout(() => {
          dispatch(showForm());
          formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 10);
      } else {
        console.warn('No se encontró la asistencia con ID:', attendanceId);
      }
    }
  };

  const handleUpdateJustificationTypeId = (value: any) => {
    dispatch(updateJustificationTypeId(value));
  };

  const handleDownloadFile = (justificacion: any) => {
    if (justificacion.archivoAdjunto) {
      const mimeType = justificacion.archivoMime || 'application/octet-stream';
      const fileName = generateFileName(justificacion.id, mimeType);
      downloadBase64File(justificacion.archivoAdjunto, fileName, mimeType);
    }
  };

  // Loading states
  if (
    loadingJustificationTypes ||
    loadingAttendances ||
    loadingJustifications
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <span className="ml-4 text-xl font-semibold text-black dark:text-white">
          Cargando datos...
        </span>
      </div>
    );
  }

  if (errorJustificationTypes || errorAttendances) {
    return <p>Error cargando datos</p>;
  }

  const absences = attendancesData || [];

  return (
    <div className="h-auto">
      <div ref={topRef} className="mb-6">
        <PageTitle>Justificaciones</PageTitle>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" ref={formRef}>
        <AnimatePresence mode='sync'>
          {!form.showForm && !shouldLoadModal && (
            <motion.div
              key="absences-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <AbsencesList
                absences={absences}
                onShowForm={handleShowForm}
              />
            </motion.div>
          )}

          {form.showForm && shouldLoadModal && (
            <JustificationFormModal
              key="justification-form"
              form={form}
              justificationTypesData={justificationTypesData}
              loadingJustificationTypes={loadingJustificationTypes}
              loadingJustification={loadingJustification}
              onSave={handleSave}
              onCancel={handleCancel}
              onInputChange={handleInputChange}
              onTextInputChange={handleTextInputChange}
              onNumericInputChange={handleNumericInputChange}
              onFileChange={handleFileChange}
              onUpdateJustificationTypeId={handleUpdateJustificationTypeId}
              fileRef={fileRef}
              fileInputRefPrev={fileInputRefPrev}
              formRef={formRef}
            />
          )}

          <JustificationsHistory
            data={justificationsData}
            loading={loadingJustifications}
            onDownloadFile={handleDownloadFile}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JustificationsContainer;
