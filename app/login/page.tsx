"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/Api/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import axios from "axios";

type LoginValues = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 1️⃣ الفاليديشن باستخدام Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // 2️⃣ إرسال البيانات وتخزين الـ Token في הـ Cookie
  const handleLogin = async (values: LoginValues) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await api.post("/auth/signin", values);
      console.log("LOGIN RESPONSE:", response.data); // 👈 طباعة البيانات للاختبار
      if (response.data.message === "success") {
        // حفظ الرمز سبعة أيام لأن اعتراض الطلبات يقرأه لإضافة ترويسة المصادقة
        Cookies.set("userToken", response.data.token, { expires: 7 });
        console.log("SAVED TOKEN IS:", Cookies.get("userToken"));
        router.push("/shop");
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setErrorMsg(message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F6] p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-[#E0DED4]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-[0.25em] text-[#2D4735]">
            V E L A
          </h1>
          <p className="text-sm text-[#46604e] mt-2 font-medium">Welcome back</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-[#2D4735] mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e] text-gray-800"
              placeholder="example@gmail.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-[#2D4735]">Password</label>
              <Link href="/forgot-password" className="text-xs text-[#46604e] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e] text-gray-800"
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#46604e] hover:bg-[#2D4735] text-white py-3 rounded-xl font-bold transition duration-200 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin text-white" size={20} /> : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signUp" className="text-[#2D4735] font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}