
"use client";
import api from "@/Api/api";
import Discount from "@/app/_components/discount/page";
import StarRating from "@/app/_components/starRating/page";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RefreshCw,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function DetailsProducts() {
  const params = useParams();
  const id = params.id;

  const [productDetails, setProductDetails] = useState<any>(null);
  const [handelNumber, setHandelNumber] = useState<number>(1);
  // state لتحديد الصورة المعروضة حالياً
  const [selectedImage, setSelectedImage] = useState<string>("");

  function getSpecificProducts() {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProductDetails(res.data.data);
        console.log(res.data.data);
        
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handelNumButton(amount: number) {
    setHandelNumber((prev) => Math.max(1, prev + amount));
   
  }

  useEffect(() => {
    if (id) {
      getSpecificProducts();
    }
  }, [id]);

  // الصورة الحالية (إما المحددة أو الغلاف الافتراضي)
  const currentImage = selectedImage || productDetails?.imageCover;

  return (
    <section className="bg-[#FAF9F5] min-h-screen py-8 px-4 sm:px-8 lg:px-16 text-[#2D4735]">
      <div className="max-w-7xl mx-auto">
        {/* ================= 1. BREADCRUMBS ================= */}
        <nav className="text-xs sm:text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          /
          <span className="capitalize">
            {productDetails?.category?.name || "Products"}
          </span>{" "}
          /
          <span className="font-semibold text-[#2D4735]">
            {productDetails?.title}
          </span>
        </nav>

        {productDetails ? (
          <>
            {/* ================= 2. MAIN PRODUCT SECTION ================= */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start mb-16">
              {/* ----- الجزء الأيسر: معرض الصور ----- */}
              <div className="flex flex-col gap-4">
                {/* الصورة الرئيسية */}
                <div className="w-full h-87.5 sm:h-112.5 bg-[#EFECE6] rounded-2xl overflow-hidden flex items-center justify-center p-6 border border-gray-200/50 relative shadow-sm">
                  <Image
                    src={currentImage}
                    alt={productDetails?.title || "Product"}
                    fill
                    className="object-contain p-4 mix-blend-multiply transition-all duration-300"
                    priority
                  />
                </div>

                {/* معرض الصور المصغرة (Thumbnails) */}
                <div className="grid grid-cols-4 gap-3">
                  {productDetails?.images?.map((img: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`h-20 sm:h-24 rounded-xl border-2 overflow-hidden bg-[#EFECE6] relative p-1 transition-all ${
                        currentImage === img
                          ? "border-[#2D4735] scale-105 shadow-sm"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`thumbnail-${index}`}
                        fill
                        className="object-cover rounded-lg mix-blend-multiply"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* ----- الجزء الأيمن: تفاصيل المنتج ----- */}
              <div className="flex flex-col gap-5">
                {/* اسم البراند والعنوان */}
                <div>
                  <h3 className="text-lg font-bold tracking-widest text-[#2D4735] uppercase mb-1">
                    {productDetails?.brand?.name || "V E L A"}
                  </h3>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
                    {productDetails?.title}
                  </h1>
                </div>

                {/* التقييم بالنجوم */}
                <div className="flex items-center gap-3">
                  <StarRating rating={productDetails?.ratingsAverage} />
                  <span className="font-semibold text-sm">
                    {productDetails?.ratingsAverage}
                  </span>
                  <span className="text-gray-400 text-xs">
                    ({productDetails?.ratingsQuantity || 0} reviews)
                  </span>
                </div>

                {/* الأسعار والخصم */}
                <div className="flex items-center gap-4 py-2 border-y border-gray-200/80">
                  {productDetails?.priceAfterDiscount && (
                    <del className="text-gray-400 text-lg font-medium">
                      {productDetails?.price} EGP
                    </del>
                  )}
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {productDetails?.priceAfterDiscount ||
                      productDetails?.price}{" "}
                    EGP
                  </p>
                  <Discount
                    price={productDetails?.price}
                    priceAfterDiscount={productDetails?.priceAfterDiscount}
                  />
                </div>

                {/* الوصف */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {productDetails?.description}
                </p>

                {/* المميزات السريعة (Badges) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2 text-xs text-gray-700"> 
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-gray-200/80">
                    <Truck className="w-4 h-4 text-[#2D4735]" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-gray-200/80">
                    <RefreshCw className="w-4 h-4 text-[#2D4735]" />
                    <span>Easy Returns</span>
                  </div>
                </div>

                {/* قسم الكمية وأزرار الشراء */}
                <div className="flex flex-col gap-3 pt-2">
                  <span className="text-xs font-semibold text-gray-500">
                    Quantity
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* عداد الكمية (- 1 +) */}
                    <div className="flex items-center justify-between border border-gray-300 rounded-xl px-4 py-2 bg-white w-32 shadow-sm">
                      <button
                        onClick={() =>{ handelNumButton(-1);toast.error("Product delete")}}
                        className="text-gray-600 hover:text-black transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-sm">
                        {handelNumber}
                      </span>
                      <button
                        onClick={() => {handelNumButton(1);toast.success("Product added.")}}
                        className="text-gray-600 hover:text-black transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* زر أضف للسلة */}
                    <button className="flex-1 min-w-45 flex items-center justify-center gap-2 bg-[#2D4735] hover:bg-[#213527] text-white font-medium py-3 px-6 rounded-xl transition-all shadow-sm active:scale-[0.98]">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>

                    {/* زر المفضلة */}
                    <button className="p-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 hover:text-red-500 rounded-xl transition shadow-sm">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= 3. CUSTOMER REVIEWS SECTION ================= */}
            <section className="pt-10 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Customer Reviews
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* كارت ملخص التقييمات الأيسر */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex items-center  h-25">
                  <div className="text-4xl font-extrabold text-gray-900 mb-1">
                    {productDetails?.ratingsAverage || "0.0"}
                  </div>
                  <div className="mb-2 ">
                    <StarRating rating={productDetails?.ratingsAverage} />
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    ({productDetails?.ratingsQuantity || 0} reviews)
                  </p>

                </div>

                {/* قائمة المراجعات */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productDetails?.reviews?.length > 0 ? (
                    productDetails.reviews
                      .slice(0, 10)
                      .map((rev: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#2D4735]/10 text-[#2D4735] font-bold flex items-center justify-center text-xs">
                                  {rev?.user?.name
                                    ? rev.user.name[0].toUpperCase()
                                    : "U"}
                                </div>
                                <span className="text-sm font-semibold text-gray-800">
                                  {rev?.user?.name || "User"}
                                </span>
                              </div>
                              <StarRating rating={rev.rating} />
                            </div>

                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                              {rev.review || "منتج ممتاز وخامة عالية الجودة."}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-[#2D4735] font-medium pt-2 border-t border-gray-100">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                            Purchase
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="col-span-2 text-center py-10 bg-white rounded-2xl border border-gray-200 text-gray-400 text-sm">
                      لا توجد مراجعات متاحة لهذا المنتج حالياً.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <DotLottieReact src="/loading.lottie" className="w-40 h-40" />
          </div>
        )}
      </div>
    </section>
  );
}
