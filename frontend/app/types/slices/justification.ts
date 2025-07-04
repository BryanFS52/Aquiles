export interface JustificationItem {
    id: number;
    description: string;
    justificationFile: string;
    justificationDate: string;
    state: boolean;
    justificationType?: {
        id: number;
        name: string;
    };
}
