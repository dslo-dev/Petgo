// src/hooks/useRegister.ts
import { useState } from "react";
import { RegisterDto, registerRequest } from "@/services/auth.services";
import axios from "axios";

interface UseRegisterReturn {
  register: (data: RegisterDto) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useRegister = (): UseRegisterReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (data: RegisterDto) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await registerRequest(data);

      setSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "Error al registrar usuario"
        );
      } else {
        setError("Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
    success,
  };
};