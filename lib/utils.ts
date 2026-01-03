import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("https")) return path;
  return `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || "http://127.0.0.1:8000"}/storage/${path}`;
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
