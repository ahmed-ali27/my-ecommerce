"use client";
import api from "@/Api/api";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Star, Heart, ShoppingCart, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // 👈 أضفنا useRouter هنا
import Cookies from "js-cookie"; // 👈 أضفنا js-cookie لقراءة التوكن

// 1️⃣ استيراد الـ Redux Hooks والـ Actions
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart } from "@/lib/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/lib/wishlistSlice";

type productsDetails = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageCover: string;
  images: string[];
  quantity: number;
  sold: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  category: { _id: string; name: string };
  brand?: { _id: string; name: string };
  subcategory?: { _id: string; name: string }[];
};

type ProductsApiResponse = {
  data: productsDetails[];
};

function ShopContent() {
  const [allProducts, setAllProducts] = useState<productsDetails[]>();

  const router = useRouter(); // 👈 تفعيل الـ Router

  // 2️⃣ إعداد الـ Redux
  const dispatch = useAppDispatch();
  const { wishlistIds } = useAppSelector((state) => state.wishlist);

  // حالات التحميل لكل منتج بشكل منفصل
  const [loadingCartId, setLoadingCartId] = useState<string | null>(null);
  const [loadingWishId, setLoadingWishId] = useState<string | null>(null);

  // قراءة الـ category والـ brand والـ search من الـ URL
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const brandId = searchParams.get("brand");
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    let endpoint = "/products";
    if (categoryId) {
      endpoint = `/products?category=${categoryId}`;
    } else if (brandId) {
      endpoint = `/products?brand=${brandId}`;
    }

    api
      .get<ProductsApiResponse>(endpoint)
      .then((res) => {
        setAllProducts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [categoryId, brandId]);

  // فلترة المنتجات بناءً على كلمة البحث
  const filteredProducts = allProducts?.filter((pro) =>
    pro.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // 🛒 دالة إضافة المنتج للسلة مع حماية الـ Auth
  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();

    // 🔴 فحص هل المستخدم مسجل دخول أم لا
    const token = Cookies.get("userToken");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoadingCartId(productId);
    await dispatch(addToCart(productId));
    setLoadingCartId(null);
  };

  // ❤️ دالة إضافة/حذف المنتج من المفضلة مع حماية الـ Auth
  const handleWishlistToggle = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();

    // 🔴 فحص هل المستخدم مسجل دخول أم لا
    const token = Cookies.get("userToken");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoadingWishId(productId);

    if (wishlistIds?.includes(productId)) {
      await dispatch(removeFromWishlist(productId));
    } else {
      await dispatch(addToWishlist(productId));
    }

    setLoadingWishId(null);
  };

  return (
    <div className="h-auto w-full mb-11 p-12">
      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center gap-5">
          {filteredProducts.map((pro) => {
            const isInWishlist = wishlistIds?.includes(pro._id);

            return (
              <div
                key={pro._id}
                className="bg-[#E0DED4] w-52.5 rounded-2xl hover:shadow-xl/30 transition duration-200 ease-in p-3 flex flex-col justify-between relative group"
              >
                {/* 3️⃣ زر المفضلة (القلب) */}
                <button
                  onClick={(e) => handleWishlistToggle(e, pro._id)}
                  disabled={loadingWishId === pro._id}
                  className="absolute top-4 right-4 z-10 p-1.5 bg-white/70 backdrop-blur-sm rounded-full hover:scale-110 transition cursor-pointer"
                  title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {loadingWishId === pro._id ? (
                    <Loader2 size={20} className="animate-spin text-[#46604e]" />
                  ) : (
                    <Heart
                      size={20}
                      className={
                        isInWishlist
                          ? "fill-red-500 text-red-500 transition-all duration-300"
                          : "text-[#46604e] hover:fill-red-500 transition-all duration-300"
                      }
                    />
                  )}
                </button>

                <Link href={`/detailsProducts/${pro._id}`}>
                  <div>
                    <div className="relative">
                      <Image
                        src={pro.imageCover}
                        width={220}
                        height={220}
                        alt={pro.title}
                        className="rounded-2xl w-full h-48 object-cover"
                      />
                    </div>

                    <div className="grid px-1 py-3 text-[#46604e] text-lg">
                      <p className="line-clamp-1 font-semibold">{pro.title}</p>
                      <p className="font-bold mt-1">{pro.price} EGP</p>
                      <div className="flex gap-1 justify-between items-center mt-1">
                        <span>{pro.ratingsAverage}</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={15} className="fill-[#46604e] text-[#46604e]" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* 4️⃣ زر Add To Cart */}
                <button
                  onClick={(e) => handleAddToCart(e, pro._id)}
                  disabled={loadingCartId === pro._id}
                  className="w-full mt-2 bg-[#46604e] hover:bg-[#2d4735] text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition duration-200 cursor-pointer disabled:opacity-70"
                >
                  {loadingCartId === pro._id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>Add To Cart</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : filteredProducts && filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#46604e] gap-4 text-center">
          <h2 className="text-2xl font-bold">
            {searchQuery
              ? `No products match "${searchQuery}" 🔍`
              : "There are currently no products in this section.🛒"}
          </h2>
          <p className="text-gray-600">
            You can browse other sections or view all products.
          </p>
          <Link
            href="/shop"
            className="bg-[#46604e] hover:bg-[#2d4735] text-white px-6 py-2.5 rounded-xl transition duration-200 mt-2"
          >
            View all products
          </Link>
        </div>
      ) : (
        <DotLottieReact src="/loading.lottie" />
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<DotLottieReact src="/loading.lottie" />}>
      <ShopContent />
    </Suspense>
  );
}