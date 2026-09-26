import Image from "next/image";
import Link from "next/link";
import img_4 from "@/img-4.jpeg";
import img_5 from "@/img-5.jpeg";
import img_6 from "@/img-6.jpeg";
import img_7 from "@/img-7.jpeg";
import img_8 from "@/img-8.jpeg";
import img_9 from "@/img-9.jpeg";
import img_10 from "@/img-10.jpeg";
import {
  ArrowBigRightDash,
  Truck,
  Headset,
  ShieldCheck,
  Handbag,
  Users,
  Box,
  Globe,
  Star,
} from "lucide-react";

function About() {
  return (
    <section className="h-auto mb-11 max-w-[90%] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center bg-[#E0DED4] mt-2 rounded-2xl ">
        <div className="">
          <p className="text-[#2D4735] text-lg mb-4">
            About V E L A __________
          </p>
          <h1 className="text-[#2D4735] text-4xl  font-bold mb-4">
            Your All-in-One <br></br> Destination for Quality Products
          </h1>
          <p className="text-[#2D4735] mb-4 font-semibold">
            From electronics to fashion, home essentials to lifestyle<br></br>
            and more — everything you need, all in one place.
          </p>
          <Link
            href={"/"}
            className=" mb-4 flex gap-1 items-center  w-fit h-10 px-5 py-1 rounded text-white text-lg bg-[#46604E] hover:bg-[#2D4735] transition ease-in duration-200 "
          >
            Explore Category
            <ArrowBigRightDash size={22} />
          </Link>
          <p className="tracking-wide text-[#2D4735] mb-3">
            _________ GOOD PRODUCTS MOMENTS _________
          </p>
        </div>
        <div>
          <div className="flex gap-3">
            <Image
              src={img_4}
              alt={"logo"}
              className="w-50 h-40 rounded-2xl object-cover hover:shadow-xl/30 transition-shadow duration-200 ease-in"
            ></Image>
            <Image
              src={img_5}
              alt={"logo"}
              className="w-50 h-40 rounded-2xl object-cover hover:shadow-xl/30 transition-shadow duration-200 ease-in"
            ></Image>
            <Image
              src={img_6}
              alt={"logo"}
              className="w-50 h-40 rounded-2xl object-cover hover:shadow-xl/30 transition-shadow duration-200 ease-in"
            ></Image>
          </div>
          <div className="flex gap-3 py-2">
            <Image
              src={img_7}
              alt={"logo"}
              className="w-50 h-40 rounded-2xl object-cover hover:shadow-xl/30 transition-shadow duration-200 ease-in"
            ></Image>
            <Image
              src={img_8}
              alt={"logo"}
              className="w-50 h-40 rounded-2xl object-cover hover:shadow-xl/30 transition-shadow duration-200 ease-in"
            ></Image>
            <Image
              src={img_9}
              alt={"logo"}
              className="w-50 h-40 rounded-2xl object-cover hover:shadow-xl/30 transition-shadow duration-200 ease-in"
            ></Image>
          </div>
        </div>
      </div>
      <section className="py-6 h-auto mb-11 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center">
          <div>
            <p className="text-[#2D4735] font-bold mb-2">OUR STORY</p>
            <h1 className="text-[#2D4735] text-4xl  font-bold mb-4">
              A Little Shopping.<br></br> Lot Closer to Life
            </h1>
            <p className="text-[#2D4735] font-semibold mb-3.5">
              NOVA started with a simple idea: make great products<br></br>{" "}
              accessible to everyone. We bring together top brands<br></br> and
              everyday essentials in one converuent place, with a <br></br>
              shopping expervence that's easy, reliable, and made for you.
            </p>
          </div>
          <div className="flex items-center">
            <Image src={img_10} alt={"logo"} className=""></Image>
          </div>
        </div>
      </section>
      <section className="py-6 h-auto mb-11 ">
        <div className="grid grid-cols-1 lg:grid-cols-4  justify-items-center gap-3">
          <div className="bg-[#EFECE6] p-5 rounded-2xl flex items-center gap-4 shadow-sm w-74">
            <div className="w-12 h-12 rounded-full bg-[#DCD8CB] flex items-center justify-center shrink-0">
              <Handbag className="w-6 h-6 text-[#2D4735]" />
            </div>
            <div>
              <h3 className="text-[#2D4735] font-bold text-base mb-1">
                Wide Variety
              </h3>
              <p className="text-[#2D4735]/80 text-xs leading-relaxed">
                Explore thousands of products across multiple categories in one
                place.
              </p>
            </div>
          </div>
          <div className="bg-[#EFECE6] p-5 rounded-2xl flex items-center gap-4 shadow-sm w-74">
            <div className="w-12 h-12 rounded-full bg-[#DCD8CB] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#2D4735]" />
            </div>
            <div>
              <h3 className="text-[#2D4735] font-bold text-base mb-1">
                Guaranteed Quality
              </h3>
              <p className="text-[#2D4735]/80 text-xs leading-relaxed">
                We partner Nith trusted brands to ensure quality products yau
                can rely on.
              </p>
            </div>
          </div>
          <div className="bg-[#EFECE6] p-5 rounded-2xl flex items-center gap-4 shadow-sm w-74">
            <div className="w-12 h-12 rounded-full bg-[#DCD8CB] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-[#2D4735]" />
            </div>
            <div>
              <h3 className="text-[#2D4735] font-bold text-base mb-1">
                Fast Shipping
              </h3>
              <p className="text-[#2D4735]/80 text-xs leading-relaxed">
                Quick secure delivery r Lght to your doorstep, wherever you are.
              </p>
            </div>
          </div>
          <div className="bg-[#EFECE6] p-5 rounded-2xl flex items-center gap-4 shadow-sm w-74">
            <div className="w-12 h-12 rounded-full bg-[#DCD8CB] flex items-center justify-center shrink-0">
              <Headset className="w-6 h-6 text-[#2D4735]" />
            </div>
            <div>
              <h3 className="text-[#2D4735] font-bold text-base mb-1">
                24/7 Support
              </h3>
              <p className="text-[#2D4735]/80 text-xs leading-relaxed">
                Our deacated support team is always to help you anytime.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[#2D4735] text-white rounded-2xl py-6 px-4 sm:px-8 mt-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-white/20">
            {/* Item 1 */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[1.5] shrink-0" />
              <div className="flex flex-col">
                <h3 className="font-extrabold text-lg sm:text-xl leading-tight">
                  50k+
                </h3>
                <p className="text-xs sm:text-sm text-white/80">
                  Happy Shoppers
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <Box className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[1.5] shrink-0" />
              <div className="flex flex-col">
                <h3 className="font-extrabold text-lg sm:text-xl leading-tight">
                  100+
                </h3>
                <p className="text-xs sm:text-sm text-white/80">Categories</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-2 shrink-0" />
              <div className="flex flex-col">
                <h3 className="font-extrabold text-lg sm:text-xl leading-tight">
                  20+
                </h3>
                <p className="text-xs sm:text-sm text-white/80">
                  Brands You Love
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[1.5] shrink-0" />
              <div className="flex flex-col">
                <h3 className="font-extrabold text-lg sm:text-xl leading-tight">
                  4.8/5
                </h3>
                <p className="text-xs sm:text-sm text-white/80">
                  Average Rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
export default About;
