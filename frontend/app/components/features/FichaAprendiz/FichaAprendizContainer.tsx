"use client";

import { useEffect } from "react";
import { useLoader } from "@context/LoaderContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { fetchStudySheetWithStudents, clearStudySheetState } from "@slice/olympo/studySheetSlice";
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";
import StatsGrid from "./StatsGrid";
import StudentsList from "./StudentsList";

const ApprenticeContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showLoader, hideLoader } = useLoader();
  const { data: studySheetData, dataForStudents, loading } = useSelector((state: RootState) => state.studySheet);

  const studySheet = studySheetData.length > 0 ? studySheetData[0] : null;
  const students = studySheet?.id ? dataForStudents[studySheet.id] || [] : [];

  useEffect(() => {
    // Limpiar estado anterior antes de cargar nueva ficha
    dispatch(clearStudySheetState());
    dispatch(fetchStudySheetWithStudents({ id: TEMPORAL_APRENDIZ_ID }));
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading, showLoader, hideLoader]);

  if (!loading && !studySheet) {
    return <EmptyState message="No se encontró la ficha ." />;
  }

  return (
    <div className="min-h-screen w-full px-0 sm:px-4 lg:px-8">
      <div className="space-y-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <PageTitle>Ficha y Aprendices</PageTitle>
          </div>
        </div>

        {/* Info Cards con paleta personalizada */}
        {studySheet && (
          <StatsGrid studySheet={studySheet} studentsCount={students.length} />
        )}

        {/* Sección de estudiantes con diseño mejorado */}
        <StudentsList students={students} />
      </div>
    </div>
  );
}

export default ApprenticeContainer;