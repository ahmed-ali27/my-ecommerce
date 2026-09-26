"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { Package, CheckCircle2, Clock, CreditCard, Banknote, ArrowRight, Loader2 } from "lucide-react";
import api from "@/Api/api";

type OrderProduct = {
  imageCover: string;
  title: string;
};

type OrderItem = {
  _id: string;
  product: OrderProduct;
  count: number;
  price: number;
};

type Order = {
  _id?: string;
  id?: string;
  createdAt: string;
  paymentMethodType?: string;
  isPaid?: boolean;
  isDelivered?: boolean;
  cartItems?: OrderItem[];
  totalOrderPrice: number;
};

// 🛠️ دالة بسيطة لاستخراج userId من الـ JWT Token من غير مكتبات خارجية
function getUserIdFromToken(token: string): string | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload) as { id?: string };
    return payload.id || null;
  } catch {
    return null;
  }
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // جلب كل الطلبات الخاصة بالمستخدم
  const getUserOrders = async () => {
    const token = Cookies.get("userToken");

    if (!token) {
      setLoading(false);
      return;
    }

    const userId = getUserIdFromToken(token);

    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get<Order[]>(`/orders/user/${userId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // تتم قراءة الرمز من ملف الارتباط عند فتح الصفحة لتحديد إن كان يلزم إرسال الطلب
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getUserOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex justify-center items-center bg-[#F9F9F6]">
        <Loader2 className="animate-spin text-[#46604e]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F6] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 border-b border-[#E0DED4] pb-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2d4735] flex items-center gap-3">
              <Package size={32} className="text-[#46604e]" />
              My Orders
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Track and view your recent purchases
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          /* 📦 حالة عدم وجود طلبات */
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E0DED4] shadow-sm max-w-md mx-auto my-12">
            <div className="w-20 h-20 bg-[#E0DED4]/50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2d4735]">
              <Package size={40} />
            </div>
            <h2 className="text-xl font-bold text-[#2d4735] mb-2">No Orders Found</h2>
            <p className="text-gray-500 text-sm mb-6">
              You haven&apos;t placed any orders yet. Start shopping now!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#46604e] hover:bg-[#2d4735] text-white px-6 py-3 rounded-xl font-bold transition"
            >
              <span>Browse Products</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* 🛍️ قائمة الطلبات السابقة */
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id || order.id}
                className="bg-white rounded-2xl border border-[#E0DED4] shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-[#E0DED4]/30 p-4 sm:p-5 border-b border-[#E0DED4] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Order ID</span>
                    <p className="text-sm font-bold text-[#2d4735]">#{order.id || order._id}</p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Date</span>
                    <p className="text-sm font-semibold text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Payment</span>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-[#2d4735] mt-0.5">
                      {order.paymentMethodType === "card" ? (
                        <>
                          <CreditCard size={16} className="text-[#46604e]" />
                          <span>Online (Card)</span>
                        </>
                      ) : (
                        <>
                          <Banknote size={16} className="text-[#46604e]" />
                          <span>Cash on Delivery</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Badges لحالة الشحن والدفع */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
                        order.isDelivered
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "In Transit"}
                    </span>
                  </div>
                </div>

                {/* قائمة منتجات هذا الطلب */}
                <div className="p-4 sm:p-5 divide-y divide-[#E0DED4]">
                  {order.cartItems?.map((item) => (
                    <div
                      key={item._id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-[#F9F9F6] rounded-xl overflow-hidden border border-[#E0DED4] flex-shrink-0">
                          <Image
                            src={item.product?.imageCover}
                            alt={item.product?.title || "Product"}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#2d4735] text-sm line-clamp-1">
                            {item.product?.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Qty: <span className="font-semibold text-[#2d4735]">{item.count}</span> × {item.price} EGP
                          </p>
                        </div>
                      </div>

                      <p className="font-extrabold text-[#2d4735] text-sm">
                        {item.price * item.count} EGP
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer الطلب */}
                <div className="bg-[#F9F9F6] p-4 border-t border-[#E0DED4] flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500">Total Price</span>
                  <span className="text-lg font-black text-[#2d4735]">
                    {order.totalOrderPrice} EGP
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}