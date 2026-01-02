export interface Comment {
    id: number;
    user_id: number;
    user?: {
        id: number;
        name: string;
        photo: string | null;
    };
    lesson_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    is_teacher?: boolean;
}

export interface CreateCommentInput {
    lesson_id: number;
    content: string;
}
