"use server";

import { apiFetch } from "@/lib/api";

import { Question, SubmitAnswer, QuizResult } from "@/types";

/**
 * Fetch questions for a specific lesson
 * Only accessible to enrolled students or course owner/admin
 */
export async function getLessonQuestions(lessonId: number): Promise<Question[]> {
    return apiFetch(`/lessons/${lessonId}/questions`, {
        method: "GET",
    });
}

/**
 * Submit student answers for lesson questions
 */
export async function submitLessonAnswers(
    lessonId: number,
    answers: SubmitAnswer[]
): Promise<QuizResult> {
    return apiFetch(`/lessons/${lessonId}/questions/submit`, {
        method: "POST",
        body: { answers },
    });
}
