"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/Api/api";
import {
  User,
  Key,
  Phone,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Heart,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");

  // حالات الرسائل والتحميل لتحديث البيانات
  const [dataSuccess, setDataSuccess] = useState<string>("");
  const [dataError, setDataError] = useState<string>("");
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  // حالات الرسائل والتحميل لتغير كلمة السر
  const [passSuccess, setPassSuccess] = useState<string>("");
  const [passError, setPassError] = useState<string>("");
  const [passLoading, setPassLoading] = useState<boolean>(false);

  // 1️⃣ نموذج تعديل البيانات الشخصية (Update Logged user data)
  const dataFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string()
        .matches(/^01[0125][0-9]{8}$/, "Please enter a valid Egyptian phone number")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      setDataLoading(true);
      setDataError("");
      setDataSuccess("");
      try {
        const response = await api.put("/users/updateMe", values);
        if (response.data.message === "success") {
          setDataSuccess("Profile information updated successfully!");
        }
      } catch (err: any) {
        setDataError(
          err.response?.data?.errors?.param
            ? `${err.response.data.errors.param}: ${err.response.data.errors.msg}`
            : err.response?.data?.message || "Failed to update profile data"
        );
      } finally {
        setDataLoading(false);
      }
    },
  });

  // 2️⃣ نموذج تغيير كلمة السر (Update Logged user password)
  const passFormik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      password: Yup.string()
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!\%*?&]{8,}$/,
          "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character"
        )
        .required("New password is required"),
      rePassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match")
        .required("Please confirm your new password"),
    }),
    onSubmit: async (values) => {
      setPassLoading(true);
      setPassError("");
      setPassSuccess("");
      try {
        const response = await api.put("/users/changeMyPassword", values);
        if (response.data.token) {
          setPassSuccess("Password changed successfully!");
          passFormik.resetForm();
        }
      } catch (err: any) {
        setPassError(
          err.response?.data?.message || "Failed to change password. Please verify current password."
        );
      } finally {
        setPassLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#F9F9F6] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#E0DED4] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#2D4735] text-white flex items-center justify-center text-3xl font-extrabold shadow-inner">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2D4735]">
                Account Settings
              </h1>
              <p className="text-sm text-[#46604e] mt-1 font-medium">
                Manage your profile information and security settings
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex gap-3 w-full sm:w-auto">
            <Link
              href="/cart"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#E0DED4]/50 hover:bg-[#E0DED4] text-[#2D4735] px-4 py-2.5 rounded-xl font-semibold text-sm transition duration-200"
            >
              <ShoppingBag size={18} />
              <span>Cart</span>
            </Link>
            <Link
              href="/wishlist"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#E0DED4]/50 hover:bg-[#E0DED4] text-[#2D4735] px-4 py-2.5 rounded-xl font-semibold text-sm transition duration-200"
            >
              <Heart size={18} />
              <span>Wishlist</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#E0DED4]/40 p-1.5 rounded-2xl border border-[#E0DED4]">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition duration-200 ${
              activeTab === "info"
                ? "bg-white text-[#2D4735] shadow-sm"
                : "text-[#46604e] hover:text-[#2D4735]"
            }`}
          >
            <User size={18} />
            Personal Details
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition duration-200 ${
              activeTab === "password"
                ? "bg-white text-[#2D4735] shadow-sm"
                : "text-[#46604e] hover:text-[#2D4735]"
            }`}
          >
            <ShieldCheck size={18} />
            Security & Password
          </button>
        </div>

        {/* Tab 1: Update Logged user data */}
        {activeTab === "info" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#E0DED4]">
            <h2 className="text-xl font-bold text-[#2D4735] mb-6 flex items-center gap-2">
              <User className="text-[#46604e]" size={22} />
              Update Personal Information
            </h2>

            {dataSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                <span>{dataSuccess}</span>
              </div>
            )}

            {dataError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                <span>{dataError}</span>
              </div>
            )}

            <form onSubmit={dataFormik.handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#2D4735] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={dataFormik.values.name}
                    onChange={dataFormik.handleChange}
                    onBlur={dataFormik.handleBlur}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e] text-gray-800"
                  />
                  <User className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                </div>
                {dataFormik.touched.name && dataFormik.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{dataFormik.errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2D4735] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={dataFormik.values.email}
                    onChange={dataFormik.handleChange}
                    onBlur={dataFormik.handleBlur}
                    placeholder="example@gmail.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e] text-gray-800"
                  />
                  <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                </div>
                {dataFormik.touched.email && dataFormik.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{dataFormik.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2D4735] mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={dataFormik.values.phone}
                    onChange={dataFormik.handleChange}
                    onBlur={dataFormik.handleBlur}
                    placeholder="01012345678"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e] text-gray-800"
                  />
                  <Phone className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                </div>
                {dataFormik.touched.phone && dataFormik.errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{dataFormik.errors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={dataLoading}
                className="w-full sm:w-auto bg-[#46604e] hover:bg-[#2D4735] text-white px-8 py-3 rounded-xl font-bold transition duration-200 flex items-center justify-center gap-2"
              >
                {dataLoading ? (
                  <Loader2 className="animate-spin text-white" size={20} />
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Update Logged user password */}
        {activeTab === "password" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#E0DED4]">
            <h2 className="text-xl font-bold text-[#2D4735] mb-6 flex items-center gap-2">
              <Key className="text-[#46604e]" size={22} />
              Change Password
            </h2>

            {passSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={passFormik.handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#2D4735] mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="currentPassword"
                    value={passFormik.values.currentPassword}
                    onChange={passFormik.handleChange}
                    onBlur={passFormik.handleBlur}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e] text-gray-800"
                  />
                  <Key className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                </div>
                {passFormik.touched.currentPassword && passFormik.errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {passFormik.errors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2D4735] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={passFormik.values.password}
                    onChange={passFormik.handleChange}
                    onBlur={passFormik.handleBlur}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e] text-gray-800"
                  />
                  <Key className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                </div>
                {passFormik.touched.password && passFormik.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{passFormik.errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2D4735] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="rePassword"
                    value={passFormik.values.rePassword}
                    onChange={passFormik.handleChange}
                    onBlur={passFormik.handleBlur}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e] text-gray-800"
                  />
                  <Key className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                </div>
                {passFormik.touched.rePassword && passFormik.errors.rePassword && (
                  <p className="text-red-500 text-xs mt-1">{passFormik.errors.rePassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="w-full sm:w-auto bg-[#46604e] hover:bg-[#2D4735] text-white px-8 py-3 rounded-xl font-bold transition duration-200 flex items-center justify-center gap-2"
              >
                {passLoading ? (
                  <Loader2 className="animate-spin text-white" size={20} />
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}