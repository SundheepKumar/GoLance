// src/api.js
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Request failed");
  }

  // Handle empty responses (e.g., 204 No Content)
  if (res.status === 204) return null;

  return res.json();
}
