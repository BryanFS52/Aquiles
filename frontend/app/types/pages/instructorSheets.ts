// Types/ficha.types.ts
export interface Student {
    id: number;
    name: string;
    attendance: 'Presente' | 'Ausente';
}

export interface Quarter {
    name: string;
}

export interface Program {
    name: string;
}

export interface FichaMock {
    number: string;
    quarter: Quarter;
    program: Program;
    students: Student[];
}

export interface FichaData extends FichaMock {
    numberStudents: number;
}

// Data
export const fichaMock: FichaMock = {
    number: "123456",
    quarter: { name: "Mañana" },
    program: { name: "Análisis y Desarrollo de Software" },
    students: [
        { id: 1, name: "Juan Pérez", attendance: "Presente" },
        { id: 2, name: "María López", attendance: "Ausente" },
        { id: 3, name: "Carlos Sánchez", attendance: "Presente" }
    ]
};