"use client";

import { useParams } from "next/navigation";
import { TeamScrumContainer } from "@components/features/teamScrum";

export default function TeamScrumDetailsPage() {
    const params = useParams();
    const studySheetId = Number(params.studySheetId);

    return <TeamScrumContainer studySheetId={studySheetId} />;
}
