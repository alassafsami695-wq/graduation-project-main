import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";
import { Footer, Navbar } from "@/components/common";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";

const almarai = Almarai({
  subsets: ["arabic"],
  variable: "--font-almarai",
  weight: ["300", "400", "700", "800"],
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
        className={`${almarai.variable} font-sans antialiased bg-bg-primary text-foreground transition-colors duration-300 min-h-screen flex flex-col`}
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
