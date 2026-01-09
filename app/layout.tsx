import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "sonner";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibm-plex-arabic",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "الأكاديمية الإلكترونية | مستقبل التعليم",
  description: "منصة تعليمية متطورة مع دورات تفاعلية وميزات الذكاء الاصطناعي.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="sm:scroll-smooth">
      <body
        className={`${ibmPlexArabic.variable} font-sans antialiased bg-bg-primary text-foreground transition-colors duration-300 min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Toaster position="top-center" richColors />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
