"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ArrowRight, Loader2, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getWishlist, removeFromWishlist, type WishlistProduct } from "@/lib/wishlistSlice";
import { addToCart } from "@/lib/cartSlice";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { wishlistData, loading } = useAppSelector((state) => state.wishlist);

  // حالات التحميل لكل منتج بشكل منفصل
  const [loadingCartId, setLoadingCartId] = useState<string | null>(null);
  const [loadingRemoveId, setLoadingRemoveId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  // 🛒 نقل المنتج للسلة وإزالته من المفضلة
  const handleAddToCart = async (productId: string) => {
    setLoadingCartId(productId);
    await dispatch(addToCart(productId));
    setLoadingCartId(null);
  };

  // 🗑️ حذف المنتج من المفضلة
  const handleRemove = async (productId: string) => {
    setLoadingRemoveId(productId);
    await dispatch(removeFromWishlist(productId));
    setLoadingRemoveId(null);
  };

  if (loading && wishlistData.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex justify-center items-center bg-[#F9F9F6]">
        <Loader2 className="animate-spin text-[#46604e]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F6] pt-24 pb-16 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header الصفحة */}
        <div className="mb-8 border-b border-[#E0DED4] pb-5 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-[#46604e] flex items-center gap-3">
              <Heart size={32} className="fill-red-500 text-red-500" />
              My Wishlist
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              You have <span className="font-bold text-[#46604e]">{wishlistData.length}</span> saved items
            </p>
          </div>
        </div>

        {wishlistData.length === 0 ? (
          /* ❤️ حالة المفضلة فارغة */
          <div className="flex flex-col items-center justify-center py-16 text-[#46604e] gap-4 text-center bg-white rounded-3xl border border-[#E0DED4] p-8 max-w-md mx-auto shadow-sm">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
              <Heart size={40} />
            </div>
            <h2 className="text-2xl font-bold">Your Wishlist is Empty</h2>
            <p className="text-gray-500 text-sm">
              Explore our products and save your favorite items to buy them later!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#46604e] hover:bg-[#2d4735] text-white px-6 py-3 rounded-xl font-medium transition duration-200 mt-2"
            >
              <span>Explore Shop</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          /* 🛍️ شبكة عرض منتجات المفضلة */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {wishlistData.map((pro: WishlistProduct) => (
              <div
                key={pro._id || pro.id}
                className="bg-[#E0DED4] w-full max-w-[240px] rounded-2xl hover:shadow-xl/30 transition duration-200 ease-in p-3 flex flex-col justify-between relative group"
              >
                {/* زر إزالة المنتجات من المفضلة */}
                <button
                  onClick={() => handleRemove(pro._id || pro.id!)}
                  disabled={loadingRemoveId === (pro._id || pro.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-red-50 hover:text-red-600 transition cursor-pointer shadow-sm"
                  title="Remove from wishlist"
                >
                  {loadingRemoveId === (pro._id || pro.id) ? (
                    <Loader2 size={18} className="animate-spin text-[#46604e]" />
                  ) : (
                    <Trash2 size={18} className="text-gray-500 hover:text-red-500 transition" />
                  )}
                </button>

                {/* التفاصيل والصورة */}
                <Link href={`/detailsProducts/${pro._id || pro.id}`}>
                  <div>
                    <div className="relative">
                      <Image
                        src={pro.imageCover}
                        width={220}
                        height={220}
                        alt={pro.title}
                        className="rounded-2xl w-full h-48 object-cover bg-white"
                      />
                    </div>

                    <div className="grid px-1 py-3 text-[#46604e] text-lg">
                      <p className="line-clamp-1 font-semibold">{pro.title}</p>
                      <p className="font-bold mt-1">{pro.price} EGP</p>
                      <div className="flex gap-1 justify-between items-center mt-1">
                        <span className="text-sm font-bold">{pro.ratingsAverage}</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className="fill-[#46604e] text-[#46604e]" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* زر إضافة المنتج للسلة */}
                <button
                  onClick={() => handleAddToCart(pro._id || pro.id!)}
                  disabled={loadingCartId === (pro._id || pro.id)}
                  className="w-full mt-2 bg-[#46604e] hover:bg-[#2d4735] text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition duration-200 cursor-pointer disabled:opacity-70"
                >
                  {loadingCartId === (pro._id || pro.id) ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Add To Cart</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}