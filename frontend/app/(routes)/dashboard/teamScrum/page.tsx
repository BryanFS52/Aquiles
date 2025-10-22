"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@redux/store";
import { fetchStudySheetByTeacherIdWithTeamScrum } from "@slice/olympo/studySheetSlice";
import { useLoader } from "@context/LoaderContext";
import PageTitle from "@components/UI/pageTitle";
import { StudySheetGrid } from "@components/features/seguimiento";

export default function StudySheetsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: studySheets, loading: studySheetLoading, error } = useSelector((state: RootState) => state.studySheet);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    dispatch(fetchStudySheetByTeacherIdWithTeamScrum({ idTeacher: 1, page: 0, size: 5 }));
  }, [dispatch]);

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
        <PageTitle>Teams Scrum</PageTitle>

        <StudySheetGrid
          studySheets={studySheets || []}
          loading={studySheetLoading}
          error={typeof error === 'string' ? error : error?.message || null}
          getHref={(sheet) => `/dashboard/teamScrum/${sheet.id}`}
        />
      </div>
    </div>
  );
}