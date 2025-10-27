import { StudySheet } from "@/graphql/generated";

interface AttendanceSheetProps {
    studySheetData?: StudySheet;
    onNavigate: (competenceId: string) => void;
}

const AttendanceSheet: React.FC<AttendanceSheetProps> = ({ studySheetData, onNavigate }) => {
    return (
        <div className="w-full xl:w-auto xl:flex-shrink-0">
            <div className="min-h-[4rem] sm:h-16 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 flex items-center justify-center">
                <span className="font-inter font-medium text-base sm:text-lg text-black dark:text-white text-center leading-tight">
                    {studySheetData?.trainingProject?.program?.name ?? "Sin programa"}
                </span>
            </div>
        </div>
    );
}

export default AttendanceSheet;