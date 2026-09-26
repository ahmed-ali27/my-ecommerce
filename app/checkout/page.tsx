"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  CreditCard, 
  Banknote, 
  MapPin, 
  Phone, 
  Building, 
  Loader2, 
  ShieldCheck, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getCart } from "@/lib/cartSlice";
import api from "@/Api/api";
import axios from "axios";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { cartData } = useAppSelector((state) => state.cart);

  // 1️⃣ بيانات النموذج (Shipping Address)
  const [shippingAddress, setShippingAddress] = useState({
    details: "",
    phone: "",
    city: "",
  });

  // 2️⃣ طريقة الدفع والتحميل والأخطاء
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cartId = cartData?._id;

  // 3️⃣ معالجة الدخل في الـ Form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  // 4️⃣ تنفيذ عملية إنشاء الطلب (Checkout Process)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!cartId) {
      setErrorMessage("Cart ID not found. Please add items to your cart first.");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "online") {
        // 💳 أونلاين - Stripe Checkout Session
        // بناخد رابط الموقع الحالي تلقائياً (سواء localhost أو Production)
        const origin = window.location.origin;

        const res = await api.post(
          `/orders/checkout-session/${cartId}?url=${origin}`,
          { shippingAddress }
        );

        if (res.data.status === "success") {
          // تحويل المستخدم لصفحة دفع Stripe
          window.location.href = res.data.session.url;
        }
      } else {
        // 💵 كاش عند الاستلام - Cash Order
        const res = await api.post(`/orders/${cartId}`, { shippingAddress });

        if (res.data.status === "success") {
          // تحديث السلة وإعادة توجيهه لصفحة كل الطلبات
          dispatch(getCart());
          router.push("/allorders");
        }
      }
    } catch (err: unknown) {
      console.error(err);
      const message = axios.isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setErrorMessage(
        message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F6] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header الصفحة */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#46604e] hover:text-[#2d4735] transition"
          >
            <ArrowLeft size={18} />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold text-[#2d4735]">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Form بيانات الشحن وطريقة الدفع */}
          <div className="md:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* قسم بيانات العنوان */}
              <div className="bg-white p-6 rounded-2xl border border-[#E0DED4] shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#2d4735] flex items-center gap-2">
                  <MapPin size={20} className="text-[#46604e]" />
                  Shipping Address
                </h2>

                {/* Details */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Street Address / Details
                  </label>
                  <input
                    type="text"
                    name="details"
                    required
                    placeholder="e.g. 123 Main St, Apt 4B"
                    value={shippingAddress.details}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e]/50 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="01010700999"
                        value={shippingAddress.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e]/50 text-sm"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      City
                    </label>
                    <div className="relative">
                      <Building size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        name="city"
                        required
                        placeholder="Cairo"
                        value={shippingAddress.city}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0DED4] focus:outline-none focus:ring-2 focus:ring-[#46604e]/50 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* قسم اختيار طريقة الدفع */}
              <div className="bg-white p-6 rounded-2xl border border-[#E0DED4] shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#2d4735] flex items-center gap-2">
                  <CreditCard size={20} className="text-[#46604e]" />
                  Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Pay Online */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === "online"
                        ? "border-[#46604e] bg-[#46604e]/5 font-semibold text-[#2d4735]"
                        : "border-[#E0DED4] hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="accent-[#46604e]"
                    />
                    <CreditCard size={20} className="text-[#46604e]" />
                    <div className="text-sm">
                      <p className="font-bold">Pay Online</p>
                      <p className="text-xs text-gray-500">Visa / MasterCard / Stripe</p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      paymentMethod === "cash"
                        ? "border-[#46604e] bg-[#46604e]/5 font-semibold text-[#2d4735]"
                        : "border-[#E0DED4] hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="accent-[#46604e]"
                    />
                    <Banknote size={20} className="text-[#46604e]" />
                    <div className="text-sm">
                      <p className="font-bold">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when order arrives</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* إظهار أي خطأ في حال حدث أثناء الطلب */}
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              {/* زر إتمام الطلب */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#46604e] hover:bg-[#2d4735] text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    <span>
                      {paymentMethod === "online" ? "Proceed to Stripe Payment" : "Confirm Cash Order"}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ملخص السلة والتكلفة الإجمالية */}
          <div className="bg-white p-6 rounded-2xl border border-[#E0DED4] shadow-sm h-fit space-y-4">
            <h2 className="text-lg font-bold text-[#2d4735] border-b border-[#E0DED4] pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items Count</span>
                <span className="font-bold text-[#2d4735]">{cartData?.products?.length || 0}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold text-green-600">Free</span>
              </div>
              <div className="border-t border-[#E0DED4] pt-3 flex justify-between text-base font-extrabold text-[#2d4735]">
                <span>Total Amount</span>
                <span>{cartData?.totalCartPrice || 0} EGP</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}