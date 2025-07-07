export interface JustificationItem {
    id: number;
    description: string;
    justificationFile: string;
    justificationDate: string;
    state: string;
    justificationType?: {
        id: number;
        name: string;
    };
    attendance: {
        student: {
            id: number;
            person: {
                name: string;
                lastname: string;
                document: string;
            };
            studySheet?: {
                number: number;
                program?: {
                    name: string;
                };
            };
        };
    };
}
