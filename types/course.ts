export interface User {
    id: number;
    name: string;
    photo: string | null;
    email?: string | null;
    role_id?: number | null;
}

export interface Teacher {
    id: number;
    name: string;
    email: string;
    role_id: number;
    created_at: string;
    updated_at: string;
}

export interface Path {
    id: number;
    title: string;
}

export interface Comment {
    id: number;
    user_id: number;
    lesson_id: number;
    body: string;
    created_at: string;
    updated_at: string;
    user: User;
    parent_id?: number | null;
    replies?: Comment[];
    replies_count?: number;
}

export interface Lesson {
    id: number;
    course_id: number;
    title: string;
    order: number;
    video_url: string;
    content: string | null;
    comments: Comment[];
    created_at: string;
    updated_at: string;
}

export interface Question {
    id: number;
    lesson_id: number;
    type: 'mcq' | 'true_false';
    question: string;
    options: string[] | null;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    photo: string | null;
    price: number;
    course_duration: string;
    number_of_students: number;
    rating: number;
    is_enrolled: boolean;
    progress: number;
    teacher: Teacher;
    path: Path;
    lessons: Lesson[];
    created_at: string;
    updated_at: string;
}
