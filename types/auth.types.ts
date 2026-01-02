export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    type: "student" | "teacher" | "user"; // Adjust based on your valid roles
}

export interface AuthResponse {
    user: any; // Ideally replace with User type
    token: string;
    message?: string;
    status: boolean;
}
