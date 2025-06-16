export interface StudentItem {
    id: string;
    state: string;
    person: {
        id: string;
        document: string;
        name: string;
        lastname: string;
        phone?: string;
        email?: string;
        address?: string;
    };
    studySheets?: {
        id: string;
        number: string;
        state: string;
    }[];
}
