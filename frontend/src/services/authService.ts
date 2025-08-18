export interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al iniciar sesión");
    }

    const result = await response.json();
    return result.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error desconocido");
    }
  }
};
