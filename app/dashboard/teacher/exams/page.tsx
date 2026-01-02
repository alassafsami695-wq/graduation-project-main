import { getTeacherExams } from '@/actions/teacher/get-exams';
import TeacherExamsClient from '@/components/lists/teacher/TeacherExamsClient';
import React from 'react';

export default async function page() {
    const teacherExams = await getTeacherExams();

    return (
        <div className="p-8 space-y-10">
            <div>
                <h2 className="text-4xl font-black italic">بنك <span className="text-primary">الأسئلة</span></h2>
                <p className="text-foreground-muted mt-2">إدارة وتنظيم أسئلة الاختبارات لجميع دوراتك الأكاديمية</p>
            </div>

            <TeacherExamsClient exams={teacherExams} />
        </div>
    );
}
