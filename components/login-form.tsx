"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { useLogin } from "@/hooks/useLogin";

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { login, loading, error, success } = useLogin(); //Fetch al endpoint login

  //creacion de las variables para la data (estados)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // guardado de la data cada que hay un cambio
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  //enviar la peticion (asincrono)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            Inicia Sesión
          </h1>

          <p className="text-sm text-balance text-muted-foreground">
            Completa los campos para ingresar a la plataforma
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="email">
            Correo Electrónico
          </FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="ejemplo@gmail.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="bg-background"
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">
              Contraseña
            </FieldLabel>
          </div>

          <Input
            id="password"
            type="password"
            placeholder="*******"
            required
            minLength={8}
            value={formData.password}
            onChange={handleChange}
            className="bg-background"
          />
        </Field>


        {/* Mensaje al finalizar la peticion */}
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-green-500">
            Inicio de sesión exitoso.
          </p>
        )}

        <Field>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Ingresando..."
              : "Iniciar Sesión"}
          </Button>
        </Field>

        <FieldDescription className="text-center">
          ¿Aún no tienes cuenta?

          <Link
            href="/registro"
            className="underline underline-offset-4 ml-3"
          >
            Crear cuenta
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}