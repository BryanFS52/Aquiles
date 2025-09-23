"use client";

import { useParams, useSearchParams } from "next/navigation";
import { JustificacionesInstructorContainer } from "@/components/features/justifications/justficacionesInstructorContainer";

export default function JustificationInstructorPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const competenceQuarterId = Number(params.Id);
    const fichaNumber = searchParams.get('ficha');
    const learningOutcomeId = searchParams.get('learningOutcome');

    return <JustificacionesInstructorContainer 
        competenceQuarterId={competenceQuarterId} 
        fichaNumber={fichaNumber} 
        learningOutcomeId={learningOutcomeId}
    />;
}
