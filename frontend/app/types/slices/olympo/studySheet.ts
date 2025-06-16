export interface StudySheetItem {
    id: string;
    number: string;
    numberStudents: number;
    startLective: string;
    endLective: string;
    state: string;

    offer: {
        id: string;
        name: string;
    } | null;

    journey: {
        id: string;
        name: string;
    } | null;

    quarter: {
        id: string;
        name: {
            number: string;
            extension: string;
        };
    } | null;

    trainingProject: {
        id: string;
        name: string;
    } | null;
}
