// src/services/auth.service.ts
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/auth";

//Interfaces
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  nombreUsuario: string;
  email: string;
  contraseña: string;
  roles: number[];
  perfil: {
    avatar: string;
    nombre: string;
    appat: string;
    apmat: string;
    nacimiento: string;
    contacto: {
      telefonoPrincipal: string;
      telefonoSegundario: string;
      email: string;
    };
  };
}


// Funciones

export const registerRequest = async (data: RegisterDto) => {
  const response = await axios.post(`${API_URL}/registro`, data);

  return response.data;
};

export const loginRequest = async (data: LoginDto) => {
  const response = await axios.post(
    `${API_URL}/login`,
    data
  );

  return response.data;
};