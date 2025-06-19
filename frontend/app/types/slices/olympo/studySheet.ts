export interface Person {
    id: string;
    document: string;
    name: string;
    lastname: string;
    email: string;
    phone: number;
}

export interface Student {
    id: string;
    person: Person;
}

export interface Program {
    id: String;
    name: String;
}

export interface StudySheetItem {
    id: string;
    number: string;
    numberStudents: number;
    startLective?: string;
    endLective?: string;
    state?: string;
    code?: string;
    message?: string;

    offer?: {
        id: string;
        name: string;
    } | null;

    journey?: {
        id: string;
        name: string;
    } | null;

    quarter: {
        id: string;
        name: {
            number: string;
            extension: string;
        };
    }[];


    trainingProject: {
        id: string;
        name: string;
        program: Program | null
    } | null;

    students: Student[];
}
