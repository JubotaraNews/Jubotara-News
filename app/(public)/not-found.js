import Link from "next/link";
import Container from "@/components/common/Container";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#eff3f6]">
      <Container>
        <div className="text-center space-y-6 py-20">
          <h1 className="text-9xl font-extrabold text-[#003366] opacity-20">
            ৪০৪
          </h1>
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto">
              দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি খুঁজে পাওয়া যায়নি অথবা স্থানান্তরিত হয়েছে।
            </p>
          </div>
          <div className="pt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors shadow-lg"
            >
              হোমে ফিরে যান
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
