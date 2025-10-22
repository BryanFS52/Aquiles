"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@redux/store";
import { clearAttendanceSelection, fetchStudySheetByTeacher } from "@slice/olympo/studySheetSlice";
import { useLoader } from "@context/LoaderContext";
import { TEMPORAL_INSTRUCTOR_ID } from "@/temporaryCredential";
import PageTitle from "@components/UI/pageTitle";
import {
  StudySheetGrid
} from "@components/features/seguimiento";

/**
 * StudySheetsPage
 * Página principal del dashboard de seguimiento de fichas
 */
export default function StudySheetsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { showLoader, hideLoader } = useLoader();

  const { data, loading: studySheetLoading, error } = useSelector((state: any) => state.studySheet);
  const fichas = data || [];

  // Inicialización de datos
  useEffect(() => {
    dispatch(clearAttendanceSelection());
    dispatch(fetchStudySheetByTeacher({
      idTeacher: TEMPORAL_INSTRUCTOR_ID,
      page: 0,
      size: 50
    }));
  }, [dispatch]);

  // Manejo del loader global
  useEffect(() => {
    if (studySheetLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [studySheetLoading, showLoader, hideLoader]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[1600px] mx-auto">
        <PageTitle>Seguimiento de Fichas</PageTitle>

        {/* Grid de fichas */}
        <StudySheetGrid
          studySheets={fichas}
          loading={studySheetLoading}
          error={error}
          getHref={(sheet) => `/dashboard/InstructorFollowUp?ficha=${sheet.number}`}
        />
      </div>
    </div>
  );
}