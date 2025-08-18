const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
}

export const login = async (data: LoginData) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {  // <--- /api/auth/login
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Error al iniciar sesión");
  return result.user;
};

export const register = async (data: RegisterData) => {
  const res = await fetch(`${API_URL}/api/auth/register`, { // <--- /api/auth/register
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Error en el registro");
  return result.user;
};