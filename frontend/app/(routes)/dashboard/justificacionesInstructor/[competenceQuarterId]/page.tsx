"use client";

import { useParams, useSearchParams } from "next/navigation";
import { JustificacionesInstructorContainer } from "@/components/features/justifications/justficacionesInstructorContainer";

export default function JustificationInstructorPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const competenceQuarterId = Number(params.competenceQuarterId);
    const fichaNumber = searchParams.get('ficha');

    return <JustificacionesInstructorContainer 
        competenceQuarterId={competenceQuarterId} 
        fichaNumber={fichaNumber} 
    />;
}
