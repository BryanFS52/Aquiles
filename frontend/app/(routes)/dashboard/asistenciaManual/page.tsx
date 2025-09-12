"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AsistenciaManualContainer } from '@/components/features/asistencia/attendanceManual';

const AttendanceManualContent: React.FC = () => {
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

const AttendanceManualPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Cargando asistencia...</div>}>
      <AttendanceManualContent />
    </Suspense>
  );
};

export default AttendanceManualPage;