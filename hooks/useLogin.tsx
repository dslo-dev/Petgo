// src/hooks/useLogin.ts
import { useState } from "react";
import axios from "axios";

import {
  LoginDto,
  loginRequest,
} from "@/services/auth.services";

interface UseLoginReturn {
  login: (data: LoginDto) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useLogin = (): UseLoginReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const login = async (data: LoginDto) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await loginRequest(data);

      // ejemplo:
      // localStorage.setItem("token", response.token);

      console.log(response);

      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Credenciales incorrectas"
        );
      } else {
        setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
    success,
  };
};