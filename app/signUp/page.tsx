"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/Api/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import axios from "axios";

type SignupValues = {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
};

export default function Signup() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // 1️⃣ الفاليديشن باستخدام Yup للبيانات المطلوبة
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(20, "Name must be at most 20 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required("Password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, "Please enter a valid Egyptian phone number")
      .required("Phone is required"),
  });

  // 2️⃣ إرسال البيانات للـ API
  const handleSignup = async (values: SignupValues) => {
    setLoading(true);
    setErrorMsg("");
    try {
      // إرسال الحقول التي يعتمد عليها مسار إنشاء الحساب كما هي
      const response = await api.post("/auth/signup", values);
      if (response.data.message === "success") {
        router.push("/login");
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setErrorMsg(message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    validationSchema,
    onSubmit: handleSignup,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F6] p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-[#E0DED4]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-[0.25em] text-[#2D4735]">
            V E L A
          </h1>
          <p className="text-sm text-[#46604e] mt-2 font-medium">Create your account</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-[#2D4735] mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e] text-gray-800"
              placeholder="John Doe"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

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

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-[#2D4735] mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e] text-gray-800"
              placeholder="01012345678"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-[#2D4735] mb-1">Password</label>
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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-semibold text-[#2D4735] mb-1">Confirm Password</label>
            <input
              type="password"
              name="rePassword"
              value={formik.values.rePassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e] text-gray-800"
              placeholder="••••••••"
            />
            {formik.touched.rePassword && formik.errors.rePassword && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.rePassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#46604e] hover:bg-[#2D4735] text-white py-3 rounded-xl font-bold transition duration-200 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin text-white" size={20} /> : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#2D4735] font-bold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}