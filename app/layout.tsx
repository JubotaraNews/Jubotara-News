import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/provider/provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const solaimanLipi = localFont({
  src: "../public/fonts/SolaimanLipi.ttf",
  variable: "--font-solaiman-lipi",
  display: "swap",
  preload: true,
  weight: "400",
  style: "normal",
});

export const metadata = {
  title: "Jubo Tara News | সর্বশেষ সংবাদ ও ব্রেকিং নিউজ",
  description:
    "বাংলাদেশের অন্যতম নির্ভরযোগ্য অনলাইন সংবাদ মাধ্যম। সর্বশেষ জাতীয়, রাজনীতি, আন্তর্জাতিক, খেলাধুলা ও বিনোদন সংবাদ পেতে আমাদের সাথেই থাকুন।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${solaimanLipi.variable} font-sans`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          {children}
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
