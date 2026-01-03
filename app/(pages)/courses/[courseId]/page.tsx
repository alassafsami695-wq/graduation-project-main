import React from 'react';
import { Course } from "@/types/course";
import { getCourseData } from '@/actions/public/lessons/get-course-lessons';
import CourseView from '@/components/lists/courses/CourseView';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        courseId: string;
    };
}

export default async function page({ params }: PageProps) {
    const { courseId: rawCourseId } = await params;
    const courseId = parseInt(rawCourseId);

    if (isNaN(courseId)) {
        notFound();
    }

    try {
        const course = await getCourseData(courseId);

        if (!course) {
            notFound();
        }

        return <CourseView course={course as any} />;
    } catch (error) {
        console.error("Error fetching course data:", error);
        notFound();
    }
}
