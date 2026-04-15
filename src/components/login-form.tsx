"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Mail, Lock } from "lucide-react"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginInput } from "@/schemas/auth";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isSubmiting,setIsSubmitting] = useState(false);
  const router = useRouter();
  const { refresh } = useAuth();
  //zod
  const form = useForm<LoginInput>({
    resolver:zodResolver(LoginSchema),
    defaultValues :{
      email:"",
      password:"",
    }
  });
  const onSubmit = async(data:LoginInput) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/user/login",data); ///api/v1/user/login
      toast.success("You are Successfully Logged In",{
        description: response.data.message
      })
      try {
        // Refresh auth context so client knows user is authenticated
        await refresh();
      } catch (e) {
        console.warn("Failed to refresh auth context after login", e);
      }
      router.replace("/chats");
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error In Login",error)
      const axiosError = error as AxiosError;
      const errorMessage = (axiosError.response?.data as {message : string})?.message ?? "Logging Failed";
      toast.error("Logging In Failed",{
        description: errorMessage,
      });
      setIsSubmitting(false);
    }
  }
  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={form.handleSubmit(onSubmit)} {...props}>
      <FieldGroup>
        <div className="header">
          <div className="flex flex-col text-left">
            <h1 className="text-2xl font-bold">Login to your account</h1>
          </div>
          <Link href="/register" className="text-sm font-medium text-primary hover:underline">
            Sign Up
          </Link>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <Input className="input" id="email" type="email" placeholder="m@example.com" required {...form.register("email")} />
          </div>
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <Input className="input" id="password" type="password" required {...form.register("password")} />
          </div>
        </Field>
        <Field>
          <Button className="btn-primary" type="submit" disabled={isSubmiting}>
            {isSubmiting ? "Logging in..." : "Login"} 
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" onClick={() => window.location.href = "/api/user/google"}>
            <Image src="/google.png" alt="Google" width={16} height={16} />
            Login with Google
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
