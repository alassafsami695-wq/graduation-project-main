export interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    redirectTo?: string;
    [key: string]: any;
}
