// api.js
export async function apiFetch(url, options = {}) {
  const token = sessionStorage.getItem("token"); // JWT from sessionStorage

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // send JWT
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "API request failed");
  }

  return res.json();
}
