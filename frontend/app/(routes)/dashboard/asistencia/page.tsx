"use client"

import React, { Suspense } from "react";
import AttendanceContainer from "@/components/features/asistencia/Attendance/AttendanceContainer"

const AttendancePage: React.FC = () => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Cargando asistencia...</p>
            </div>
        </div>}>
            <AttendanceContainer />
        </Suspense>
    );
};

export default AttendancePage;