"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchStudySheetByTeacher } from "@slice/olympo/studySheetSlice";
import { AppDispatch } from "@/redux/store";
import { useLoader } from "@context/LoaderContext";
import { TEMPORAL_INSTRUCTOR_ID } from "@/temporaryCredential";

export interface CompetenceOption {
  id: string;
  name: string;
  studySheetNumber?: number;
  teacherStudySheetId?: string;
}

const useCompetences = (fichaNumber: string | null) => {
  const [competences, setCompetences] = useState<CompetenceOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const loadCompetences = async () => {
      if (!fichaNumber) return;
      showLoader();

      try {
        const result = await dispatch(
          fetchStudySheetByTeacher({ idTeacher: TEMPORAL_INSTRUCTOR_ID, page: 0, size: 20 })
        );

        if (fetchStudySheetByTeacher.fulfilled.match(result)) {
          const sheets = result.payload?.data || [];
          const filtered = sheets.filter((s: any) => s.number.toString() === fichaNumber);

          const list = filtered.flatMap((sheet: any) =>
            (sheet.teacherStudySheets || []).map((tss: any) => ({
              id: tss.competence?.id,
              name: tss.competence?.name,
              studySheetNumber: sheet.number,
              teacherStudySheetId: tss.id,
            }))
          );

          setCompetences(list.filter(c => c.id && c.name).sort((a, b) => a.name.localeCompare(b.name)));
        } else {
          setError("Error al cargar las competencias");
        }
      } catch (err) {
        console.error("Error cargando competencias:", err);
        setError("Error al cargar las competencias");
      } finally {
        hideLoader();
      }
    };

    loadCompetences();
  }, [dispatch, fichaNumber]);

  return { competences, error };
};

export default useCompetences;