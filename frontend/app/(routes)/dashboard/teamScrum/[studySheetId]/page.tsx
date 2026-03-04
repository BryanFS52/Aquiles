"use client";

import { useParams } from "next/navigation";
import { TeamScrumContainer } from "@components/features/teamScrum";

const TeamScrumDetailsPage: React.FC = () => {
    const params = useParams();
    const studySheetId = Number(params.studySheetId);

    return <TeamScrumContainer studySheetId={studySheetId} />;
}

export default TeamScrumDetailsPage;