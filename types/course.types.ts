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
    lessons: any;
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    photo: string | null;
    price: number | string;
    course_duration: string;
    number_of_students: number;
    rating: number;
    sales_count?: number; // Optional as it might not be in all responses
    is_enrolled?: boolean;
    is_wishlisted?: boolean;
    progress?: number;
    teacher_id: number;
    path_id: number;
    teacher?: Teacher;
    path?: Path;
    created_at: string;
    updated_at: string;
}

export interface CourseWithExams extends Course {
    questions: any[]; // Or Question from lesson.types
}

export interface TeacherCourse extends Course {
    category?: any;
    students_count?: number;
    lessons_count?: number;
}
