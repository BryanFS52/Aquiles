"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AsistenciaManualContainer } from '@/components/features/asistencia/attendanceManual';

const AttendanceManualContent: React.FC = () => {
    const searchParams = useSearchParams();
    const competenceId = searchParams.get('competenceId');
    const isDarkMode = false;

    return (
        <AsistenciaManualContainer 
          isDarkMode={isDarkMode} 
          competenceId={competenceId} 
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