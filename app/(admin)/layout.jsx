import localFont from "next/font/local";
import "../globals.css";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const solaimanLipi = localFont({
  src: "../../public/fonts/SolaimanLipi.ttf",
  variable: "--font-solaiman-lipi",
  display: "swap",
});

export const metadata = {
  title: "Admin Dashboard | Jubo Tara News",
  description: "Admin panel for Jubo Tara News",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="bn" className={`${solaimanLipi.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-[#eff3f6]">
          <AdminLayoutClient>
            {children}
          </AdminLayoutClient>
          <ToastContainer position="top-right" autoClose={3000} />
          <SpeedInsights />
      </body>
    </html>
  );
}
