"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getCart, removeCartItem, updateCartQuantity } from "@/lib/cartSlice";
import api from "@/Api/api";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { cartData, numOfCartItems, loading } = useAppSelector((state) => state.cart);

  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // 🔄 تعديل كمية المنتج
  const handleUpdateCount = async (productId: string, currentCount: number, newCount: number) => {
    if (newCount < 1) return;
    setUpdatingItemId(productId);
    await dispatch(updateCartQuantity({ productId, count: newCount }));
    setUpdatingItemId(null);
  };

  // 🗑️ حذف عنصر محدد
  const handleRemoveItem = async (productId: string) => {
    setUpdatingItemId(productId);
    await dispatch(removeCartItem(productId));
    setUpdatingItemId(null);
  };

  // 🧹 تفريغ السلة بالكامل
  const handleClearCart = async () => {
    setClearingCart(true);
    try {
      await api.delete("/cart");
      dispatch(getCart());
    } catch (err) {
      console.error(err);
    } finally {
      setClearingCart(false);
    }
  };

  const products = cartData?.products || [];
  const totalCartPrice = cartData?.totalCartPrice || 0;

  if (loading && !cartData) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex justify-center items-center bg-[#F9F9F6]">
        <Loader2 className="animate-spin text-[#2D4735]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F6] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2D4735] flex items-center gap-3">
              <ShoppingBag size={32} />
              Shopping Cart
            </h1>
            <p className="text-[#46604e] text-sm mt-1">
              You have <span className="font-bold">{numOfCartItems}</span> items in your cart
            </p>
          </div>

          {products.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={clearingCart}
              className="flex items-center gap-2 border border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              {clearingCart ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Clear Cart
            </button>
          )}
        </div>

        {products.length === 0 ? (
          // 🛒 حالة السلة فارغة
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E0DED4] shadow-sm max-w-md mx-auto my-12">
            <div className="w-20 h-20 bg-[#E0DED4]/50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#2D4735]">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-xl font-bold text-[#2D4735] mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 text-sm mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#46604e] hover:bg-[#2D4735] text-white px-6 py-3 rounded-xl font-bold transition"
            >
              Start Shopping
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          // 🛍️ قائمة المنتجات مع ملخص الحساب
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* قائمة العناصر */}
            <div className="lg:col-span-2 space-y-4">
              {products.map((item: any) => (
                <div
                  key={item._id || item.product._id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0DED4] shadow-sm flex flex-col sm:flex-row items-center gap-5 justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-20 h-20 bg-[#F9F9F6] rounded-xl flex-shrink-0 overflow-hidden border border-[#E0DED4]">
                      <Image
                        src={item.product.imageCover}
                        alt={item.product.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#2D4735] line-clamp-1 text-base">
                        {item.product.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.product.category?.name}
                      </p>
                      <p className="font-extrabold text-[#2D4735] text-sm mt-2">
                        {item.price} EGP
                      </p>
                    </div>
                  </div>

                  {/* التحكم بالكمية والحذف */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E0DED4]">
                    <div className="flex items-center border border-[#E0DED4] rounded-xl bg-[#F9F9F6]">
                      <button
                        onClick={() =>
                          handleUpdateCount(item.product._id, item.count, item.count - 1)
                        }
                        disabled={updatingItemId === item.product._id || item.count <= 1}
                        className="p-2 hover:text-[#2D4735] disabled:opacity-30 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 font-bold text-sm text-[#2D4735]">
                        {updatingItemId === item.product._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          item.count
                        )}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateCount(item.product._id, item.count, item.count + 1)
                        }
                        disabled={updatingItemId === item.product._id}
                        className="p-2 hover:text-[#2D4735] disabled:opacity-30 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <p className="font-extrabold text-[#2D4735] min-w-[80px] text-right">
                      {item.price * item.count} EGP
                    </p>

                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      disabled={updatingItemId === item.product._id}
                      className="text-gray-400 hover:text-red-500 transition p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ملخص الحساب Order Summary */}
            <div className="bg-white rounded-3xl p-6 border border-[#E0DED4] shadow-sm h-fit space-y-6">
              <h2 className="text-xl font-bold text-[#2D4735] border-b border-[#E0DED4] pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-[#46604e]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2D4735]">{totalCartPrice} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
                <div className="border-t border-[#E0DED4] pt-3 flex justify-between text-base font-extrabold text-[#2D4735]">
                  <span>Total</span>
                  <span>{totalCartPrice} EGP</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-[#46604e] hover:bg-[#2D4735] text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/shop"
                className="block text-center text-xs font-semibold text-[#46604e] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}