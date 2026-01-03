import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  params?: Record<string, any>;
  headers?: HeadersInit;
};

function buildQuery(params?: Record<string, any>) {
  if (!params) return "";
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return q ? `?${q}` : "";
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const url = `${BASE_URL}${endpoint}`;

  const isFormData = options.body instanceof FormData;



  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Accept": "application/json",
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body:
      options.body && options.method !== "GET"
        ? isFormData
          ? options.body
          : JSON.stringify(options.body)
        : undefined,
    cache: "no-store", // server action safe
  });

  // 1. Get the content type to check if it's actually JSON
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const json = await res.json();

    if (!res.ok) {
      console.log(json);
      throw new Error(json?.message || `API Error: ${res.status}`);
    }
    return json.data ?? json;
  } else {
    // 2. If it's NOT JSON, get the text to see what the server sent
    const errorText = await res.text();
    console.error("Backend returned non-JSON response:", errorText);
    throw new Error(`Server returned HTML instead of JSON. Status: ${res.status}`);
  }

}
