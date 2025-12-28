export interface Career {
    id: number;
    title: string;
    description: string;
    salary: string;
    company_name: string;
    company_email: string;
    job_type: string;
    working_hours: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface CareersResponse {
    data: Career[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}
