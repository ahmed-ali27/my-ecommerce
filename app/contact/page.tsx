"use client";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MoveRight,
  User,
  Hash,
  Tag,
  MessageSquare,
} from "lucide-react";

import Image from "next/image";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { useState } from "react";

type ContactFormValues = {
  name: string;
  email: string;
  order_number: string;
  subject: string;
  message: string;
};

const schema = Yup.object({
  name: Yup.string()
    .min(3, "The name must be at least 3 characters long.")
    .required("input your name please"),

  email: Yup.string()
    .email("The email address is incorrect.")
    .required("Please enter your email address."),

  order_number: Yup.string(),

  subject: Yup.string().required(
    "Please enter the subject of the message."
  ),

  message: Yup.string()
    .min(10, "The message is very short (at least 10 characters)")
    .required("Please write the message text."),
});

function Contact() {
  const [loading, setLoading] = useState(false);

  // Email Submit Function
  async function handleFormSubmit(
    values: ContactFormValues,
    actions: FormikHelpers<ContactFormValues>
  ) {
    setLoading(true);

    const toastId = toast.loading("Sending message...");

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          name: values.name,
          email: values.email,
          order_number: values.order_number,
          subject: values.subject,
          message: values.message,
        },
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        }
      );

      toast.success("Message sent successfully!", {
        id: toastId,
      });

      actions.resetForm();
    } catch (error) {
  if (error && typeof error === "object" && "text" in error) {
    console.error("EmailJS Error:", error.text);
  } else {
    console.error("EmailJS Error:", error);
  }

  toast.error("Failed to send message", {
    id: toastId,
  });
}
     finally {
      setLoading(false);
    }
  }

  // Formik
  const formik = useFormik<ContactFormValues>({
    initialValues: {
      name: "",
      email: "",
      order_number: "",
      subject: "",
      message: "",
    },

    validationSchema: schema,

    onSubmit: handleFormSubmit,
  });

  return (
    <section className="mb-11 h-auto">
      {/* Banner Image */}
      <div className="w-full mb-10">
        <Image
          src="/img-11.jpeg"
          alt="Contact Header"
          width={1200}
          height={400}
          priority
          className="w-full object-cover max-h-auto"
        />
      </div>

      {/* Main Responsive Grid Container */}
      <section className="w-[90%] max-w-300 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Form */}
        <form
          className="border px-5 py-8 w-full border-gray-300 rounded-2xl shadow-xl/30 bg-white"
          onSubmit={formik.handleSubmit}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#2D4735] shrink-0">
              <Mail className="w-6 h-6" />
            </div>

            <div>
              <h1 className="font-bold text-xl text-[#2D4735]">
                Send Us a Message
              </h1>

              <p className="text-sm text-gray-600">
                We usually reply within 24 hours.
              </p>
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name Input */}
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

              <input
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                type="text"
                className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2D4735] focus:ring-1 focus:ring-[#2D4735] transition ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#2D4735]"
                }`}
                placeholder="Full Name *"
              />

              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs mt-1 pl-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

              <input
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                type="email"
                className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2D4735] focus:ring-1 focus:ring-[#2D4735] transition ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#2D4735]"
                }`}
                placeholder="Email Address *"
              />

              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1 pl-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Order Number Input */}
            <div className="relative">
              <Hash className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

              <input
                name="order_number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.order_number}
                type="text"
                className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2D4735] focus:ring-1 focus:ring-[#2D4735] transition ${
                  formik.touched.order_number &&
                  formik.errors.order_number
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#2D4735]"
                }`}
                placeholder="Order Number (Optional)"
              />

              {formik.touched.order_number &&
                formik.errors.order_number && (
                  <p className="text-red-500 text-xs mt-1 pl-1">
                    {formik.errors.order_number}
                  </p>
                )}
            </div>

            {/* Subject Input */}
            <div className="relative">
              <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

              <input
                name="subject"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subject}
                type="text"
                className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2D4735] focus:ring-1 focus:ring-[#2D4735] transition ${
                  formik.touched.subject && formik.errors.subject
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#2D4735]"
                }`}
                placeholder="Subject *"
              />

              {formik.touched.subject && formik.errors.subject && (
                <p className="text-red-500 text-xs mt-1 pl-1">
                  {formik.errors.subject}
                </p>
              )}
            </div>

            {/* Message Input */}
            <div className="relative col-span-1 md:col-span-2">
              <MessageSquare className="w-5 h-5 text-gray-400 absolute left-3 top-3 pointer-events-none" />

              <textarea
                name="message"
                rows={4}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2D4735] focus:ring-1 focus:ring-[#2D4735] transition ${
                  formik.touched.message && formik.errors.message
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-[#2D4735]"
                }`}
                placeholder="Your Message *"
              ></textarea>

              {formik.touched.message && formik.errors.message && (
                <p className="text-red-500 text-xs mt-1 pl-1">
                  {formik.errors.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 w-full sm:w-auto flex items-center justify-center gap-3 bg-[#2D4735] hover:bg-[#1f3225] text-white px-8 py-3 rounded-xl transition duration-200 font-medium"
          >
            <Send className="w-4 h-4" />
            Send Message
            <MoveRight className="w-4 h-4" />
          </button>
        </form>

        {/* Right Side: Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* Card 1 */}
          <div className="border border-gray-300 p-5 rounded-2xl bg-white hover:shadow-md transition duration-200 flex flex-col justify-between gap-3">
            <div className="h-10 w-10 bg-[#EFECE6] rounded-full flex items-center justify-center text-[#2D4735]">
              <Mail className="w-5 h-5" />
            </div>

            <div>
              <h2 className="font-bold text-[#2D4735] mb-1">
                Email Support
              </h2>

              <p className="text-xs text-gray-600 mb-3">
                We're happy to help you anytime via email.
              </p>
            </div>

            <a
              href="mailto:vela23610@gmail.com?subject=Support Request"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D4735] hover:underline mt-auto"
            >
              <span>vela23610@gmail.com</span>
              <MoveRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2 */}
          <div className="border border-gray-300 p-5 rounded-2xl bg-white hover:shadow-md transition duration-200 flex flex-col justify-between gap-3">
            <div className="h-10 w-10 bg-[#EFECE6] rounded-full flex items-center justify-center text-[#2D4735]">
              <Phone className="w-5 h-5" />
            </div>

            <div>
              <h2 className="font-bold text-[#2D4735] mb-1">
                Phone / WhatsApp
              </h2>

              <p className="text-xs text-gray-600 mb-3">
                Call or message us for quick assistance.
              </p>
            </div>

            <a
              href="tel:+201012345678"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D4735] hover:underline mt-auto"
            >
              <span>+20 101 234 5678</span>
              <MoveRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3 */}
          <div className="border border-gray-300 p-5 rounded-2xl bg-white hover:shadow-md transition duration-200 flex flex-col justify-between gap-3">
            <div className="h-10 w-10 bg-[#EFECE6] rounded-full flex items-center justify-center text-[#2D4735]">
              <MapPin className="w-5 h-5" />
            </div>

            <div>
              <h2 className="font-bold text-[#2D4735] mb-1">
                Our HQ Location
              </h2>

              <p className="text-xs text-gray-600 mb-3">
                123 Business Road, Maadi, Cairo, Egypt.
              </p>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Cairo,Egypt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#2D4735] hover:underline mt-auto"
            >
              <span>View on Google Maps</span>
              <MoveRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4 */}
          <div className="border border-gray-300 p-5 rounded-2xl bg-white hover:shadow-md transition duration-200 flex flex-col justify-between gap-3">
            <div className="h-10 w-10 bg-[#EFECE6] rounded-full flex items-center justify-center text-[#2D4735]">
              <Clock className="w-5 h-5" />
            </div>

            <div>
              <h2 className="font-bold text-[#2D4735] mb-1">
                Working Hours
              </h2>

              <p className="text-xs text-gray-600">
                Sat - Thu: 9:00 AM - 10:00 PM <br />
                Fri: 2:00 PM - 10:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Contact;