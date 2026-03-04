"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageTitle from "@components/UI/pageTitle";
import EmptyState from "@components/UI/emptyState";
import useCompetences from "./UseCompetence";
import CompetenceGrid from "./CompetenceGrid";

interface Props {
  title?: string;
  baseRoute: string; // ej. "/dashboard/justificacionesInstructor"
}

const CompetenceSelectorContainer: React.FC<Props> = ({
  title = "Seleccionar Competencia",
  baseRoute,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fichaNumber = searchParams.get("ficha");
  const { competences, error } = useCompetences(fichaNumber);

  const handleSelect = (competence: any) => {
    const competenceQuarterId = competence.teacherStudySheetId || competence.id;
    router.push(`${baseRoute}/${competenceQuarterId}?ficha=${competence.studySheetNumber}`);
  };

  if (!fichaNumber) return <EmptyState message="No se encontró ficha" />;
  if (error) return <EmptyState message={error} />;
  if (competences.length === 0)
    return <EmptyState message={`No hay competencias disponibles para la ficha ${fichaNumber}`} />;

  return (
    <div className="space-y-6 px-4 lg:px-0">
      <PageTitle onBack={() => router.back()}>
        {title} - Ficha {fichaNumber}
      </PageTitle>
      <CompetenceGrid competences={competences} onSelect={handleSelect} />
    </div>
  );
};

export default CompetenceSelectorContainer;
