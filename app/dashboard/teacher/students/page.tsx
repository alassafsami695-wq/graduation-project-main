import React from 'react';
import { getTeacherStudents } from '@/actions/teacher/get-students';
import TeacherStudentsClient from '@/components/lists/teacher/TeacherStudentsClient';

export default async function Page() {
    const studentsData = await getTeacherStudents();
    const students = Array.isArray(studentsData) ? studentsData : [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            <TeacherStudentsClient students={students} />
        </div>
    );
}
