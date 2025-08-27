// api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Export base URL so other files can use it
export { API_BASE_URL };

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // ✅ Safe URL joining (removes extra or missing slashes)
  const url = `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  console.log("👉 Fetching:", url, options); // Debug log

  const response = await fetch(url, options);

  // Try to parse JSON (in case of error responses)
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("❌ API Error:", data || response.statusText);
    throw new Error(data?.message || `API error: ${response.status} ${response.statusText}`);
  }

  console.log("✅ API Response:", data);
  return data;
}
