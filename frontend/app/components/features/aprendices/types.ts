import { Apprentice, NewApprentice } from '@/types/slices/aprendices';

export interface ApprenticeFormProps {
    newApprentice: NewApprentice;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface ApprenticesListProps {
    apprentices: Apprentice[];
    searchTerm: string;
    onSearchChange: (searchTerm: string) => void;
}
