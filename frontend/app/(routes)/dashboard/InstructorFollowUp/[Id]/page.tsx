"use client";

import { InstructorFollowUpContainer } from "@/components/features/InstructorFollowUp/InstructorFollowUpContainer";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {

    const params = useParams();
    const searchParams = useSearchParams();
    const competenceQuarterId = Number(params.Id);
    const fichaNumber = searchParams.get('ficha');

    return (
        <div>
            <InstructorFollowUpContainer 
            competenceQuarterId={competenceQuarterId} 
            fichaNumber={fichaNumber} 
        />
        </div>
    );
}
