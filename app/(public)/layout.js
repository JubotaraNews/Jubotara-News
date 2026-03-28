import localFont from "next/font/local";
import "../globals.css";
import MobileBottomNav from "@/components/common/MobileBottomNav";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer";
import { Providers } from "@/provider/provider";
import { getNavbarItems } from "@/lib/localData";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const solaimanLipi = localFont({
  src: "../../public/fonts/SolaimanLipi.ttf",
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

export const revalidate = 300; // 5 minutes

export default async function PublicLayout({ children }) {
  const news_categories = await getNavbarItems();
  return (
    <html
      lang="bn"
      className={`${solaimanLipi.variable} font-sans`}
      suppressHydrationWarning
    >
      <body className="pb-16 md:pb-0 bg-[#eff3f6] dark:bg-[#121212] transition-colors duration-300">
        <Providers>
          <Header />
          {children}
          <MobileBottomNav news_categories={news_categories} />
          <Footer />
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
