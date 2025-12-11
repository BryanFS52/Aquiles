export interface Apprentice {
  id?: number;
  name: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  program: string;
  email: string;
  teamNumber: string;
}

export interface NewApprentice {
  name: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  program: string;
  email: string;
  teamNumber: string;
}
