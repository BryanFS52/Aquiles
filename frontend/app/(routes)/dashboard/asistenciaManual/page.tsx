"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { AsistenciaManualContainer } from '@/components/features/asistencia/attendanceManual';

const AttendanceManualPage: React.FC = () => {
    const searchParams = useSearchParams();
    const competenceId = searchParams.get('competenceId');
    const studySheetId = searchParams.get('studySheetId');
    const isDarkMode = false;

    return (
        <AsistenciaManualContainer 
          isDarkMode={isDarkMode} 
          competenceId={competenceId}
          studySheetId={studySheetId}
        />
    );
};

export default AttendanceManualPage;  