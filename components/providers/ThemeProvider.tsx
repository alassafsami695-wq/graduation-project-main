"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme";

interface ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const { theme } = useThemeStore();

    useEffect(() => {
        // Update the HTML class when theme changes
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.remove("light");
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
            root.classList.add("light");
        }
    }, [theme]);

    // Handle system preference and initial hydration
    useEffect(() => {
        // Check if user has a stored preference, if not use system preference
        const stored = localStorage.getItem("theme-storage");
        if (!stored) {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            useThemeStore.getState().setTheme(prefersDark ? "dark" : "light");
        }
    }, []);

    return <>{children}</>;
}
