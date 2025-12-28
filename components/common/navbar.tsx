"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import UserDropdown from "@/components/ui/UserDropdown";
import CategoriesDropdown from "@/components/ui/CategoriesDropdown";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { ShoppingBag } from "lucide-react";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (query: string) => {
    router.push(`/courses/search?query=${query}`);
  };

  return (
    <header className="w-full border-b border-border h-20 bg-bg-primary rounded-none relative z-[100] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Right: navigation links */}
        <div className="flex items-center justify-end gap-2">
          {/* Desktop nav */}
          <nav aria-label="القائمة الرئيسية" className="hidden md:block">
            <ul className="flex items-center gap-2 text-sm font-medium">

              <li>
                <Link
                  href="/"
                  className="px-3 h-12 flex items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="px-3 h-12 flex items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  فرص العمل
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="px-3 h-12 flex items-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <CategoriesDropdown />
              </li>
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors duration-200"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((s) => !s)}
          >
            <span className="sr-only">فتح القائمة</span>
            {/* simple hamburger / close */}
            {mobileOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Center: search (absolutely centered so it's visually in the middle) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-lg px-4 hidden lg:block pointer-events-auto">
          <form
            role="search"
            className="w-full"
            onSubmit={(e) => handleSearch(e.target.search.value)}
          >
            <label htmlFor="nav-search" className="sr-only">
              ابحث
            </label>
            <div className="relative">
              <input
                id="nav-search"
                name="search"
                placeholder="ابحث هنا..."
                aria-label="ابحث"
                className="block w-full h-12 pl-12 pr-4 rounded-xl bg-bg-secondary/50 border border-border text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                dir="rtl"
                type="search"
                autoComplete="off"
              />

              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-foreground-muted"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-start gap-4">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Cart Button */}
          <CartButton />

          {/* User Profile Dropdown */}
          <UserDropdown />
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute right-4 top-full mt-2 w-56 bg-white border shadow-md rounded-md z-50"
        >
          <ul className="flex flex-col text-sm font-medium">
            <li>
              <Link href="/" className="block px-4 py-2 hover:bg-gray-50">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/news" className="block px-4 py-2 hover:bg-gray-50">
                الأخبار
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="block px-4 py-2 hover:bg-gray-50"
              >
                تواصل
              </Link>
            </li>
            <li>
              <Link href="/about" className="block px-4 py-2 hover:bg-gray-50">
                من نحن
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

// Separate component for the Cart Button to keep Navbar clean or just inline it
const CartButton = () => {
  const { items } = useCartStore();
  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
      aria-label="عرض سلة المشتريات"
    >
      <ShoppingBag className="w-6 h-6 text-foreground" />
      {items.length > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {items.length}
        </span>
      )}
    </Link>
  )
}

export default Navbar;
