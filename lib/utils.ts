import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullUrl(path: string | null | undefined): string {
  if (!path) return "";

  // Fix double URL issue (backend prepending storage to absolute URLs)
  // Example: http://127.0.0.1:8000/storage/http://localhost:8000/courses/img.png
  const lastHttpInfo = path.lastIndexOf("http");
  if (lastHttpInfo > 0) {
    return path.substring(lastHttpInfo);
  }

  // If it's already an absolute URL, trust it as is
  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }

  // Ensure and clean relative path
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;

  // Only prepend storage if it's a relative path
  return `http://127.0.0.1:8000/storage/${cleanPath}`;
}

export function getValidVideoUrl(url: string | null | undefined): string {
  if (!url) return "";

  // Fix double URL issue (backend prepending storage to absolute URLs)
  const lastHttpInfo = url.lastIndexOf("http");
  let cleanUrl = url;
  if (lastHttpInfo > 0) {
    cleanUrl = url.substring(lastHttpInfo);
  } else {
    // Ensure it's a full URL (handles relative paths)
    cleanUrl = getFullUrl(url);
  }

  // Fix Youtube watch -> embed
  if (cleanUrl.includes("youtube.com/watch?v=")) {
    cleanUrl = cleanUrl.replace("watch?v=", "embed/");
  } else if (cleanUrl.includes("youtu.be/")) {
    cleanUrl = cleanUrl.replace("youtu.be/", "youtube.com/embed/");
  }

  return cleanUrl;
}
