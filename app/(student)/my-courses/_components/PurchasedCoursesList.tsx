"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Course } from "@/types/course.types";

interface PurchasedCoursesListProps {
    purchasedCourses: Course[];
}

export default function PurchasedCoursesList({ purchasedCourses }: PurchasedCoursesListProps) {

    console.log(purchasedCourses);
    if (!purchasedCourses || purchasedCourses.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-medium text-muted-foreground">لا توجد دورات مشتراة بعد</h3>
                <Button asChild className="mt-4" variant="outline">
                    <Link href="/courses">تصفح الدورات</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                دوراتي
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {purchasedCourses?.map((course) => (
                    <Card key={course.id} className="overflow-hidden bg-card hover:shadow-md transition-shadow duration-300 border-border">
                        <CardContent className="p-0">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Course Image */}


                                {/* Course Details */}
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-4">
                                            <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">
                                                <h3 className="text-lg font-bold line-clamp-2">{course.title}</h3>
                                            </Link>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {course.description}
                                        </p>

                                        {course.teacher && (
                                            <p className="text-xs text-muted-foreground">
                                                المعلم: <span className="font-medium text-foreground">{course.teacher.name}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            {course.course_duration && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{course.course_duration}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Button asChild size="sm" className="gap-2 rounded-lg">
                                            <Link href={`/courses/${course.id}`}>
                                                <PlayCircle className="w-4 h-4" />
                                                <span>ابدأ التعلم</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
