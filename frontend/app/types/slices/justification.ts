// Base types
export interface JustificationType {
    id: number
    name: string
}

export interface Justification {
    id: number
    documentNumber: string
    name: string
    description: string
    justificationFile: string
    justificationDate: string
    justificationHistory: string
    state: string
    notificationId?: number
    justificationType: JustificationType
}

// GraphQL Response types
export interface GraphQLResponse<T> {
    code: number
    message: string
    date?: string
    data?: T
}

export interface PaginatedResponse<T> extends GraphQLResponse<T[]> {
    totalPages: number
    totalItems: number
    currentPage: number
}

// Specific response types
export interface AllJustificationsResponse extends PaginatedResponse<Justification> { }

export interface JustificationByIdResponse extends GraphQLResponse<Justification> { }

export interface MutationResponse {
    code: number
    message: string
}

// Input types
export interface JustificationDto {
    documentNumber: string
    name: string
    description: string
    justificationFile: string
    justificationDate: string
    justificationHistory: string
    state: string
    notificationId?: number
    justificationTypeId: number
}



// Redux state types
export interface JustificationState {
    justifications: Justification[]
    currentJustification: Justification | null
    loading: boolean
    error: string | null
    currentPage: number
    totalPages: number
    totalItems: number
}

export const initialJustificationState: JustificationState = {
    justifications: [],
    currentJustification: null,
    loading: false,
    error: null,
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
}

// Action payload types
export interface FetchJustificationsPayload {
    page?: number
    size?: number
}

export interface FetchJustificationByIdPayload {
    id: number
}

export interface CreateJustificationPayload {
    justification: JustificationDto
}

export interface UpdateJustificationPayload {
    id: number
    justification: JustificationDto
}

export interface DeleteJustificationPayload {
    id: number
}

// Error types
export interface JustificationError {
    message: string
    code?: number
}
