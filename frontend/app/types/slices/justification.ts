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
}
