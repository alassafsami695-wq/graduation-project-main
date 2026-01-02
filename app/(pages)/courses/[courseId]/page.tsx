import React from 'react';
import { getCourseData } from '@/actions/public/lessons/get-course-lessons';
import CourseView from '@/components/lists/courses/CourseView';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        courseId: string;
    };
}

export default async function page({ params }: PageProps) {
    const courseId = parseInt(params.courseId);

    if (isNaN(courseId)) {
        notFound();
    }

    try {
        const course = await getCourseData(courseId);

        if (!course) {
            notFound();
        }

        return <CourseView course={course} />;
    } catch (error) {
        console.error("Error fetching course data:", error);
        notFound();
    }
}
