import { getStudentCourses } from '@/actions/student/get-student-courses';
import PurchasedCoursesList from './_components/PurchasedCoursesList';

export default async function page() {

    const studentCourses = await getStudentCourses();
    return <PurchasedCoursesList purchasedCourses={studentCourses.courses} />
}
