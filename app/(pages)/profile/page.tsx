"use client";

import React, { useEffect } from "react";
import ProfileClient from "@/components/profile/ProfileClient";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    console.log(user);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null; // Or a loading spinner
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            <ProfileClient initialData={user} />
        </div>
    );
}
