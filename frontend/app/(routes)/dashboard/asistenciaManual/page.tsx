"use client";

import React from 'react';
import { AsistenciaManualContainer } from '@/components/features/asistencia/attendanceManual';

const AttendanceManualPage: React.FC = () => {
    const isDarkMode = false;

    return <AsistenciaManualContainer isDarkMode={isDarkMode} />;
};

export default AttendanceManualPage;