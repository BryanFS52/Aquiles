// Types/ficha.types.ts
export interface Apprentice{
    name:string;
    lastName:string;
    email:string;
    documentType:'CC'|'TI'|'CE'|'';
    documentNumber:string;
    program:string;
    teamNumber:string;
}
//crear nuevo aprendiz
export type NewApprentice = Omit<Apprentice, 'id'>;
