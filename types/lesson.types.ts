export interface Question {
    id: number;
    lesson_id: number;
    type: 'mcq' | 'true_false';
    question: string;
    options: string[] | null;
}

export interface SubmitAnswer {
    question_id: number;
    answer: string;
}

export interface QuizResult {
    correct: number;
    total: number;
    score: number;
    status: 'passed' | 'failed';
}

export interface Lesson {
    id: number;
    title: string;
    content: string; // or description? check usage
    video_url: string;
    course_id: number;
    created_at: string;
    updated_at: string;
    questions?: Question[];
    comments?: any[]; // Ref Comment type
}
