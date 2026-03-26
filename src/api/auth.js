const BASE_URL = import.meta.env.VITE_API_URL + "/api/v2/users";

const refreshAccessToken = async () => {
  const res = await fetch(`${BASE_URL}/referesh-token`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Session expired");
  return res.json();
};

export const fetchWithRefresh = async (url, options = {}) => {
  let res = await fetch(url, { ...options, credentials: "include" });

  if (res.status === 401) {
    try {
      await refreshAccessToken();
      res = await fetch(url, { ...options, credentials: "include" });
    } catch {
      throw new Error("SESSION_EXPIRED"); // just throw, don't redirect here
    }
  }

  return res;
};

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("User already exists");
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Invalid username or password");
  return res.json();
};

export const logoutUser = async () => {
  const res = await fetchWithRefresh(`${BASE_URL}/logout`, { method: "POST" });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
};

export const getCurrentUser = async () => {
  const res = await fetchWithRefresh(`${BASE_URL}/current-user`);
  if (!res?.ok) throw new Error("Not authenticated");
  return res.json();
};