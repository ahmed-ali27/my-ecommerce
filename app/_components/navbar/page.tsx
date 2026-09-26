"use client";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  Package,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getCart } from "@/lib/cartSlice";
import { getWishlist } from "@/lib/wishlistSlice";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Navbar() {
  const dispatch = useAppDispatch();
  const { numOfCartItems } = useAppSelector((state) => state.cart);
  const { wishlistData } = useAppSelector((state) => state.wishlist);
  const pathName = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔄 الفحص التلقائي لحالة تسجيل الدخول عند تحميل الصفحة أو التنقل بين الصفحات
  useEffect(() => {
    const token = Cookies.get("userToken");
    // يتغير الرمز خارج React، لذلك نزامن الحالة والعدادات عند كل انتقال
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!token);
    dispatch(getCart());
    dispatch(getWishlist());
  }, [dispatch, pathName]);

  // 🚪 دالة تسجيل الخروج
  const handleLogout = () => {
    Cookies.remove("userToken");
    setIsLoggedIn(false);
    setIsOpen(false);
    router.push("/login");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== "") {
      router.push(`/shop?search=${encodeURIComponent(value)}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <nav className="Logo z-50 fixed top-0 right-0 left-0 bg-[#E0DED4] text-[#2D4735]">
      <div className="mx-auto flex gap-3 items-center justify-between px-5 h-16 max-w-[90%]">
        <h3>V E L A</h3>

        {/* الروابط - تختفي في الموبايل والتابلت */}
        <div className="Links hidden lg:block">
          <ul className="flex items-center gap-3">
            <li>
              <Link href="/" className={pathName == "/" ? "isActive" : ""}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className={pathName == "/shop" ? "isActive" : ""}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={pathName == "/about" ? "isActive" : ""}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={pathName == "/contact" ? "isActive" : ""}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* السيرش - تختفي في الموبايل والتابلت، ظاهرة دايماً في الديسكتوب */}
        <div className="Search hidden lg:flex items-center">
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="outline-0 rounded-l-xl px-3 py-1 bg-[#EFF2F0]"
            placeholder=" Searching For EveryThing"
          />
          <label
            className="bg-[#46604E] hover:bg-[#2D4735] transition ease-in duration-200 px-2 py-1 rounded-r-2xl cursor-pointer"
            htmlFor="search"
          >
            <Search className="text-white" />
          </label>
        </div>

        {/* أزرار Auth - ديسكتوب (تتغير حسب حالة اللوجين) */}
        <div className="hidden lg:flex gap-3 items-center">
          {isLoggedIn ? (
            <>
              <Link href="/profile">
                <button className="flex gap-1 items-center bg-[#2D4735] hover:bg-[#46604E] transition ease-in duration-200 text-white px-3 py-1 rounded-xl">
                  Profile <User size={19} />
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="flex gap-1 items-center border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition ease-in duration-200 px-3 py-1 rounded-xl font-medium"
              >
                Logout <LogOut size={19} />
              </button>
            </>
          ) : (
            <>
              <Link href="/signUp">
                <button className="flex gap-1 items-center bg-[#46604E] hover:bg-[#2D4735] transition ease-in duration-200 text-white px-2 py-1 rounded-xl">
                  SignUp <User size={19} />
                </button>
              </Link>
              <Link href="/login">
                <button className="flex gap-1 items-center border-2 border-[#46604E] px-2 py-1 rounded-xl hover:text-white hover:bg-[#46604E] transition ease-in duration-200">
                  Login <LogIn size={19} />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* أيقونات الكارت والويش ليست - ظاهرة دايماً في كل الشاشات */}
        <div className="Icons flex gap-3">
          <Link href="/cart">
            <div className="relative">
              <ShoppingCart
                className="bg-[#46604E] hover:bg-[#2D4735] transition ease-in duration-200 text-white rounded-full p-1"
                size={32}
              />
              {numOfCartItems > 0 && (
                <span className="absolute -top-3 left-5 bg-[#46604E] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {numOfCartItems}
                </span>
              )}
            </div>
          </Link>
          <Link href="/wishlist">
            <div className="relative">
              <Heart
                className="bg-[#46604E] hover:bg-[#2D4735] transition ease-in duration-200 text-white rounded-full p-1"
                size={32}
              />
              {wishlistData && wishlistData.length > 0 && (
                <span className="absolute -top-3 left-5 bg-[#46604E] text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {wishlistData.length}
                </span>
              )}
            </div>
          </Link>
          <Link href="/allorders">
            <div className="relative flex items-center gap-1">
              <Package
                className="bg-[#46604E] hover:bg-[#2D4735] transition ease-in duration-200 text-white rounded-full p-1"
                size={32}
              />
            </div>
          </Link>
        </div>

        {/* زرار الهامبرجر للموبايل والتابلت */}
        <button
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* الـ Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* الـ Sidebar - موبايل */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-[#E0DED4] z-50 
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5 flex flex-col gap-4">
          <button
            onClick={() => setIsOpen(false)}
            className="self-end hover:bg-red-500 hover:text-white duration-200 ease-in rounded-sm"
          >
            <X size={24} />
          </button>

          <ul className="flex flex-col gap-4 *:hover:bg-[#46604E] transition *:duration-200 *:ease-in *:pl-3 *:py-1 *:rounded-md *:hover:text-white">
            <li>
              <Link href="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop" onClick={() => setIsOpen(false)}>
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>

          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="outline-0 rounded-l-xl px-2 py-1 bg-[#EFF2F0] flex-1"
              placeholder="Search"
            />
            <label className="bg-[#46604E] px-2 py-1 rounded-r-2xl">
              <Search className="text-white" />
            </label>
          </div>

          {/* أزرار Auth - موبايل (تتغير حسب حالة اللوجين) */}
          <div className="flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <button className="w-full flex gap-1 items-center justify-center bg-[#2D4735] text-white px-2 py-1 rounded-xl">
                    Profile <User size={19} />
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex gap-1 items-center justify-center border-2 border-red-600 text-red-600 px-2 py-1 rounded-xl hover:bg-red-600 hover:text-white transition duration-200 font-medium"
                >
                  Logout <LogOut size={19} />
                </button>
              </>
            ) : (
              <>
                <Link href="/signUp" onClick={() => setIsOpen(false)}>
                  <button className="w-full flex gap-1 items-center justify-center bg-[#46604E] text-white px-2 py-1 rounded-xl">
                    SignUp <User size={19} />
                  </button>
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full flex gap-1 items-center justify-center border-2 border-[#46604E] px-2 py-1 rounded-xl">
                    Login <LogIn size={19} />
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
