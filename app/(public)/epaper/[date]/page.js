import Container from "@/components/common/Container";
import EPaperViewer from "@/components/epaper/EPaperViewer";
import { getSingleEPaperEdition } from "@/lib/localData";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { date } = await params;
  return {
    title: `${date} - ই-পেপার | যুবতারা নিউজ`,
    description: `যুবতারা নিউজের ${date} তারিখের ডিজিটাল সংস্করণ পড়ুন।`,
  };
}

export default async function EPaperDetailPage({ params }) {
  const { date } = await params;
  const response = await getSingleEPaperEdition(date);
  const edition = response?.data;

  if (!edition) {
    const availableDates = response?.availableDates || [];
    return (
      <div className="min-h-screen bg-[#eff3f6] py-12">
        <Container>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">ই-পেপার পাওয়া যায়নি</h1>
            <p className="text-gray-500 mb-8">দুঃখিত, {date} তারিখের কোনো ই-পেপার সংস্করণ খুঁজে পাওয়া যায়নি।</p>
            
            {availableDates.length > 0 && (
              <div className="mt-8 border-t pt-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4">অন্যান্য তারিখের ই-পেপার পড়ুন:</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {availableDates.map(d => (
                    <Link 
                      key={d} 
                      href={`/epaper/${d}`}
                      className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold hover:bg-red-600 hover:text-white transition"
                    >
                      {new Date(d).toLocaleDateString("bn-BD", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8">
              <Link href="/epaper" className="text-blue-600 font-bold hover:underline">
                আর্কাইভে ফিরে যান
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const formattedDate = new Date(edition.date).toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });

  return (
    <div className="min-h-screen bg-[#eff3f6] py-8">
      <Container>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6 mb-8">
          <div>
             <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
               ই-পেপার: {formattedDate}
             </h1>
             <Link href="/epaper" className="text-red-600 hover:text-red-700 font-bold text-sm mt-2 inline-block">
               ← আর্কাইভ দেখুন
             </Link>
          </div>
          
          <div className="bg-white p-2 rounded-lg border shadow-sm flex items-center gap-3">
             <span className="text-sm font-bold text-gray-500 px-2 uppercase">অন্যান্য তারিখ:</span>
             <Link href="/epaper" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded font-bold text-xs transition">
                আর্কাইভ নির্বাচন করুন
             </Link>
          </div>
        </div>

        {/* Viewer Component */}
        <EPaperViewer edition={edition} />

        {/* Sharing/Actions Footer */}
        <div className="mt-12 bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
            <h3 className="font-bold text-gray-900 mb-2">এই সংস্করণটি ভালো লেগেছে?</h3>
            <p className="text-gray-500 mb-6">আমাদের ডিজিটাল ই-পেপার বন্ধুদের সাথে শেয়ার করুন।</p>
            <div className="flex justify-center gap-4">
                <button className="bg-[#1877F2] text-white px-6 py-2 rounded-full font-bold hover:brightness-110 transition shadow-md">
                   ফেসবুকে শেয়ার করুন
                </button>
            </div>
        </div>
      </Container>
    </div>
  );
}
