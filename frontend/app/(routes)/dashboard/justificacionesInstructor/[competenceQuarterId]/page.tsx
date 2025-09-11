"use client";

import { useParams } from "next/navigation";
import { JustificacionesInstructorContainer } from "@/components/features/justifications/justficacionesInstructorContainer";

export default function JustificationInstructorPage() {
    const params = useParams();
    const competenceQuarterId = Number(params.competenceQuarterId);

    return <JustificacionesInstructorContainer competenceQuarterId={competenceQuarterId} />;
}
