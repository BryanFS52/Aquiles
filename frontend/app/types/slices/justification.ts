// Base types
export interface JustificationItem {
    id: number
    documentNumber: string
    name: string
    description: string
    justificationFile: string
    justificationDate: string
    justificationHistory: string
    state: string
    notificationId?: string
    justificationType?: {
        id: number;
        name: string;
    };
}
