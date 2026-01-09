import { Suspense } from "react";
import Slides from "@/components/home/Slides";
import Features from "@/components/home/Features";
import BestSellingCourses from "@/components/home/best-selling-courses";

export default async function Home() {

  return (
    <div>
      <Suspense fallback={<div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-3xl" />}>
        <Slides />
      </Suspense>

      <Suspense fallback={<div className="h-96 w-full bg-slate-100 animate-pulse rounded-3xl" />}>
        <Features />
      </Suspense>

      <Suspense fallback={<div className="h-96 w-full bg-slate-100 animate-pulse rounded-3xl" />}>
        <BestSellingCourses />
      </Suspense>
    </div>
  );
}
