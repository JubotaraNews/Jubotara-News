import localFont from "next/font/local";
import "../globals.css";
import { Providers } from "@/provider/provider";
import { SpeedInsights } from "@vercel/speed-insights/next";

const solaimanLipi = localFont({
  src: "../../public/fonts/SolaimanLipi.ttf",
  variable: "--font-solaiman-lipi",
  display: "swap",
});

export const metadata = {
  title: "Authentication | Jubo Tara News",
  description: "Login or Register to Jubo Tara News",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="bn" className={`${solaimanLipi.variable} font-sans`} suppressHydrationWarning>
      <body className="bg-white">
        <Providers>
          {children}
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
