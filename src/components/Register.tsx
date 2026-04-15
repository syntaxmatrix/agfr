"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterInput, VerifyCodeSchema } from "@/schemas/auth";
import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import Image from "next/image";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleContinue = async () => {
    const isEmailValid = await form.trigger("email");
    if (!isEmailValid) return;
    // Check email availability with backend
    try {
      const email = form.getValues("email");
      const res = await axios.get("/api/user/emailavailability", { params: { email } });
      const msg = res.data?.message || "";
      if (msg.includes("Already Registered")) {
        toast.error("Email already registered. Try login instead.");
        return;
      }
    } catch (err: unknown) {
      const m =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: unknown } } }).response?.data?.message === "string"
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to validate email";
      toast.error(m);
      return;
    }
    setStep(2);
  };

  const handleRegister = async (data: RegisterInput) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/user/register", {
        email: data.email,
        password: data.password,
      });
      toast.success("Verification Email Sent", {
        description: response.data.message,
      });
      setStep(3);
    } catch (error) {
      console.error("Error In Register", error);
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message: string })?.message ??
        "Registration Failed";
      toast.error("Registration Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async () => {
    const parsed = VerifyCodeSchema.safeParse({ verifyCode: otpCode });
    if (!parsed.success || otpCode.length !== 6) {
      toast.error("Invalid OTP", {
        description: "Please enter the 6-digit verification code.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/user/verifyemail", {
        securityCode: otpCode,
      });
      toast.success("Email Verified", {
        description: response.data.message,
      });
      router.replace("/login");
    } catch (error) {
      console.error("Error In Email Verification", error);
      const axiosError = error as AxiosError;
      const errorMessage =
        (axiosError.response?.data as { message: string })?.message ??
        "OTP verification failed";
      toast.error("Verification Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>

        <div className="header">
          <div className="flex flex-col text-left">
            <h1 className="text-2xl font-bold">Create an account</h1>
          </div>
          <a href="/login" className="text-sm font-medium text-primary hover:underline">
            Login
          </a>
        </div>

        {step === 1 && (
          <>
            <Field>
              <Button variant="outline" type="button" onClick={() => window.location.href = "/api/user/google"}>
                <Image src="/google.png" alt="Google" width={16} height={16} className="mr-2" />
                Register with Google
              </Button>
            </Field>

            <FieldSeparator>Or continue with</FieldSeparator>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <Input className="input" id="email" type="email" placeholder="m@example.com" required {...form.register("email")} />
              </div>
              {form.formState.errors.email?.message && (
                <FieldDescription className="text-red-500">
                  {form.formState.errors.email.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <Button className="btn-primary" type="button" onClick={handleContinue}>
                Continue
              </Button>
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <Input className="input" id="password" type="password" required {...form.register("password")} />
              </div>
              {form.formState.errors.password?.message && (
                <FieldDescription className="text-red-500">
                  {form.formState.errors.password.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <Input className="input" id="confirmPassword" type="password" required {...form.register("confirmPassword")} />
              </div>
              {form.formState.errors.confirmPassword?.message && (
                <FieldDescription className="text-red-500">
                  {form.formState.errors.confirmPassword.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <Button className="btn-primary" type="button" disabled={isSubmitting} onClick={form.handleSubmit(handleRegister)}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </Field>
          </>
        )}

        {step === 3 && (
<>
<InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
<Field>
  <Button className="btn-primary" type="button" disabled={isSubmitting || otpCode.length !== 6} onClick={handleVerifyEmail}>
    {isSubmitting ? "Verifying..." : "Verify OTP"}
  </Button>
</Field>
</>
        )}



      </FieldGroup>
    </form>
  );
}