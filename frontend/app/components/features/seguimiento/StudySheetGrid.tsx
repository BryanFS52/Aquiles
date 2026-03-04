import React from "react";
import StudySheetCard from "./StudySheetCard";
import EmptyState from "@components/UI/emptyState";
import { Loader2 } from "lucide-react";

interface StudySheetGridProps {
    studySheets: any[];
    loading?: boolean;
    error?: string | null;
    getHref: (studySheet: any) => string;
}

const StudySheetGrid: React.FC<StudySheetGridProps> = ({
    studySheets,
    loading = false,
    error = null,
    getHref
}) => {
    // Estado de carga
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-primary dark:text-lightGreen animate-spin" />
                    <p className="text-sm text-grayText dark:text-dark-textSecondary font-medium">
                        Cargando fichas de estudio...
                    </p>
                </div>
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <EmptyState
                message={
                    typeof error === "string"
                        ? `Error al cargar las fichas: ${error}`
                        : "Error desconocido al cargar las fichas."
                }
            />
        );
    }

    // Estado vacío
    if (!studySheets || studySheets.length === 0) {
        return (
            <EmptyState message="No se encontraron fichas disponibles." />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 pb-8">
            {studySheets.map((studySheet, index) => (
                <StudySheetCard
                    key={studySheet.id || index}
                    studySheet={studySheet}
                    index={index}
                    href={getHref(studySheet)}
                />
            ))}
        </div>
    );
};

export default StudySheetGrid;
