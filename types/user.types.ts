export interface Student {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role_id: number;
    status: string;
    is_verified: number;
    is_super_admin: boolean;
    created_at: string;
    updated_at: string;
    enrolled_courses_count: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    type: string;
    photo?: string | null;
    phone?: string | null;
    birth_date?: string | null;
    address?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Profile extends User {
    wallet?: {
        balance: number;
        account_number: string;
    };
}
