import Container from "@/components/common/Container";
import { getEPaperEditions } from "@/lib/localData";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "ই-পেপার | যুবতারা নিউজ",
  description: "যুবতারা নিউজের ডিজিটাল প্রিন্ট সংস্করণ পড়ুন এখানে।",
};

export default async function EPaperArchive() {
  const response = await getEPaperEditions(1, 20);
  const editions = response?.data || [];

  return (
    <div className="min-h-screen bg-[#eff3f6] py-12">
      <Container>
        <div className="flex items-center justify-between border-b border-red-600 pb-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-secondary">
            <span className="w-2 h-10 bg-red-600"></span>
            ই-পেপার আর্কাইভ
          </h1>
        </div>

        {editions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {editions.map((edition) => (
              <Link
                key={edition._id}
                href={`/epaper/${new Date(edition.date).toISOString().split("T")[0]}`}
                className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] w-full bg-gray-200 overflow-hidden">
                  <Image
                    src={edition.thumbnail}
                    alt={`EPaper ${edition.date}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg">
                      পড়ুন
                    </span>
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {new Date(edition.date).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <p className="text-gray-500 mt-2 font-medium">
                    {edition.pages?.length || 0} টি পাতা
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-300">
            <p className="text-gray-500 text-xl font-medium">কোনো ই-পেপার এডিশন পাওয়া যায়নি।</p>
          </div>
        )}
      </Container>
    </div>
  );
}
