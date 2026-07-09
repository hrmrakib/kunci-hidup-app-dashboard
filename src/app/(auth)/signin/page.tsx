"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { saveToken } from "@/service/authService";
import { toast } from "sonner";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear old errors on new submit

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "v1/account/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      // 1. Handle HTTP error statuses (e.g., 400, 401, 500)
      if (!res.ok) {
        const errorData = await res.json();

        const errorMessage =
          errorData?.errors?.non_field_errors?.[0] ||
          errorData?.errors?.email?.[0] ||
          errorData?.message ||
          "An unexpected error occurred. Please try again.";

        toast.error(errorMessage);
        setErrors({ root: errorMessage });
        return; // Stop execution here
      }

      // 2. Handle successful response (res.ok is true)
      const data = await res.json();
      localStorage.setItem("access_token", data?.data?.tokens.access);
      localStorage.setItem("refresh_token", data?.data?.tokens.refresh);
      await saveToken(data?.data?.tokens.access);
      toast.success(data?.message || "Login successful!");
      router.push("/");
    } catch (error: any) {
      // This will now catch genuine network errors / server crashes
      console.error("Network or parsing error:", error);
      toast.error("Network error. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-orange-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-xl bg-white shadow-lg border-0'>
        <CardContent className='pb-8'>
          {/* Logo */}
          <div className='flex items-center justify-center text-center'>
            <Image src='/logo.png' alt='Logo' width={200} height={200} />
          </div>

          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>Sign in</h1>
            <p className='text-gray-600 text-sm leading-relaxed'>
              Enter your email address and password to access your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email Address */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-gray-700 font-medium'>
                Email Address
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='Enter your email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 h-11! bg-gray-50 border-gray-200 focus:bg-white ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-gray-700 font-medium'>
                Password
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? "text" : "password"}
                  placeholder='Min 6 character'
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 h-11! pr-10 bg-gray-50 border-gray-200 focus:bg-white ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-sm'>{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className='text-right'>
              <Link
                href='/forgot-password'
                className='text-[#FEAA39] text-sm hover:text-[#e68b15] transition-colors'
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full h-12 bg-[#FEAA39] hover:bg-[#e68b15] text-white font-medium py-3 rounded-lg transition-colors'
            >
              {isLoading ? "Signing In..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
