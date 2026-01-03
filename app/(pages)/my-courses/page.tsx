import { getStudentCourses } from '@/actions/student/get-student-courses';
import PurchasedCoursesList from '@/components/lists/courses/PurchasedCoursesList';

export default async function page() {

    const wishlistData: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const studentCourses: any = await getStudentCourses();
    return <PurchasedCoursesList purchasedCourses={studentCourses?.courses || studentCourses || []} />
}
