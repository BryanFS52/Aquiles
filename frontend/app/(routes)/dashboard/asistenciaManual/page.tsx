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
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando asistencia manual...</p>
            </div>
        </div>}>
            <AttendanceManualContent />
        </Suspense>
    );
};

export default AttendanceManualPage;  