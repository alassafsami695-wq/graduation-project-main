import React, { Suspense } from "react";
import FeaturesServer from "./FeaturesServer";

export default function Features() {
    return (
        <Suspense fallback={<FeaturesSkeleton />}>
            <FeaturesServer />
        </Suspense>
    );
}

const FeaturesSkeleton = () => {
    return (
        <section className="py-12">
            <div className="flex flex-col items-center text-center mb-16 space-y-4 animate-pulse">
                <div className="h-8 w-32 bg-border rounded-full" />
                <div className="h-12 w-64 bg-border rounded-xl" />
                <div className="h-6 w-96 bg-border rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[340px] rounded-[2.5rem] bg-bg-secondary border border-border animate-pulse flex flex-col justify-end p-8 space-y-4">
                        <div className="w-16 h-16 bg-border rounded-2xl" />
                        <div className="space-y-2">
                            <div className="h-8 w-3/4 bg-border rounded-lg" />
                            <div className="h-4 w-full bg-border rounded-md" />
                            <div className="h-4 w-5/6 bg-border rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
