export interface ProgramItem {
    id: string;
    name: string;
    description: string;
    state: string;
    coordination: {
        id: string;
        name: string;
    } | null;
    trainingLevel: {
        id: string;
        name: string;
    } | null;
}