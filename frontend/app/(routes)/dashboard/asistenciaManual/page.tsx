"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { AsistenciaManualContainer } from '@/components/features/asistencia/attendanceManual';

const AttendanceManualPage: React.FC = () => {
    const searchParams = useSearchParams();
    const competenceId = searchParams.get('competenceId');
    const isDarkMode = false;

    return <AsistenciaManualContainer isDarkMode={isDarkMode} competenceId={competenceId} />;
};

export default AttendanceManualPage;