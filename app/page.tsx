"use client";
import Image from "next/image";
import img_1 from "../img-1.jpeg";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import api from "../Api/api";
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
type categories = {
  _id: string;
  image: string;
  name: string;
};
export default function Home() {
  const [category, setCategory] = useState<categories[]>([]);
  const [brands, setBrands] = useState<categories[]>([]);
  // الفانكشن دي بتجيب ال 10 category

  function getAllCategories() {
    api
      .get(`/categories`)
      .then((res) => {
       
        setCategory(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // الفانكشن دي بتجيب البرندات اللي عندي
  function getAllBrans() {
    api
      .get(`/brands`)
      .then((res) => {
       
        setBrands(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    getAllCategories();
    getAllBrans();
  }, []);
  return (
    <>
      <section className=" h-[calc(100vh-64px)] w-full mb-11 relative ">
        <div>
          <Image
            src={img_1}
            alt={"logoHome"}
            className="w-full rounded-xl"
          ></Image>
          <div className="mobile absolute top-[50%] left-8 transform translate-y-[-50%] min-[768]:max-[1024px]:top-[17%]">
            <h2 className="text-[#46604e] tracking-wide text-lg mb-4 title-home1">
              EVERYTHING YOU NEED
            </h2>
            <h2 className="title-home2 text-[#46604e] text-6xl">
              More Style, <br></br>Less Hassle
            </h2>
            <p className="title-home3 text-[#46604e] mt-4 text-2xl font-semibold">
              Discover a world ot quality products
            </p>
            <Link
              href="/shop"
              className="btn-home flex items-center bg-[#46604E] hover:bg-[#2D4735]  transition ease-in duration-200 w-fit px-3 py-1.5 rounded-lg text-white gap-1.5 mt-8"
            >
              Shop Now <ArrowRight />{" "}
            </Link>
          </div>
        </div>
      </section>
      <section className="py-10 w-full ">
        <p className="mb-6 text-2xl text-[#2D4735] text-center">
          shop by category
        </p>

        {category.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-1 md:grid-cols-2 lg:grid-cols-5 justify-items-center gap-4 ">
            {category.map((cat) => (
              <Link
                href={`/shop?category=${cat._id}`}
                key={cat._id}
                className="bg-[#E0DED4] w-fit h-auto px-7 py-3 rounded-2xl hover:shadow-xl/30 transition duration-200 ease-in"
              >
                <div className="relative w-full  aspect-3/3 overflow-hidden ">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={220}
                    height={220}
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="py-2 text-lg text-[#2D4735]">{cat.name}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <DotLottieReact src="/loading.lottie" />
        )}
      </section>

      <section className="py-10 w-full">
        <div className="flex justify-between items-center px-8 mb-6">
          <h2 className="text-2xl text-[#2D4735] font-semibold">
            Shop by Brand
          </h2>
          <Link
            href="/shop"
            className="text-[#46604e] hover:underline font-medium text-sm flex items-center gap-1"
          >
            See All →
          </Link>
        </div>

        {brands.length > 0 ? (
          <div className="flex flex-wrap justify-center px-6 gap-4">
            {brands.slice(0, 10).map((brand) => (
              <Link href={`/shop?brand=${brand._id}`} key={brand._id}>
                <div className="bg-[#E0DED4] w-fit h-auto rounded-2xl hover:shadow-xl/30 transition duration-200 ease-in p-2 text-center">
                  <Image
                    src={brand.image}
                    width={100}
                    height={100}
                    alt={brand.name}
                    className="w-24 h-24 object-contain rounded-xl"
                  />
                  <h3 className="py-1 text-sm text-[#2D4735] font-medium line-clamp-1">
                    {brand.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <DotLottieReact src="/loading.lottie" />
        )}
      </section>
    </>
  );
}
