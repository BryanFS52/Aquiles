"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import JustificacionesInstructorContainer from "@/components/features/justifications/justficacionesInstructorContainer";

const JustificationInstructorPage: React.FC = () => {
  const params = useParams<{ Id: string }>();
  const searchParams = useSearchParams();

  const competenceQuarterId = Number(params.Id);
  const fichaNumber = searchParams.get("ficha");
  return <JustificacionesInstructorContainer competenceQuarterId={competenceQuarterId} fichaNumber={fichaNumber} />;
}

export default JustificationInstructorPage;