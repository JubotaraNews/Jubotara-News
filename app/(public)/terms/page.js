import React from "react";
import Container from "@/components/common/Container";

export const metadata = {
  title: "ব্যবহারের শর্তাবলী | যুবতারা নিউজ",
  description: "যুবতারা নিউজ এর ব্যবহারের শর্তাবলী।",
};

export default function TermsPage() {
  return (
    <main className="py-12 bg-[#eff3f6] min-h-screen">
      <Container>
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#003366]">
                ব্যবহারের শর্তাবলী
              </h1>
              <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p>যুবতারা নিউজ ব্যবহারের জন্য আপনাকে স্বাগত জানাই। আমাদের ওয়েবসাইট ব্যবহারের মাধ্যমে আপনি এই শর্তাবলীর সাথে একমত বলে গণ্য হবেন। অনুগ্রহ করে শর্তাবলী মনোযোগ সহকারে পড়ুন।</p>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#003366]">১. মেধাস্বত্ব ও কপিরাইট</h2>
                <p>যুবতারা নিউজ প্রকাশিত সকল বিষয়বস্তু (খবর, ছবি, ভিডিও, লোগো ইত্যাদি) যুবতারা নিউজের নিজস্ব সম্পদ অথবা সংশ্লিষ্ট সংবাদ এজেন্সির সম্পদ। পূর্বানুমতি ছাড়া এই ওয়েবসাইটের কোনো বিষয়বস্তু অন্য কোথাও প্রকাশ বা ব্যবহার করা আইনত দণ্ডনীয় অপরাধ।</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#003366]">২. ব্যবহারকারীর আচরণ</h2>
                <p>আমাদের সাইটে মন্তব্য করার ক্ষেত্রে শালীনতা বজায় রাখতে হবে। কোনো প্রকার উস্কানিমূলক, মানহানিকর বা আইনবিরোধী মন্তব্য করা নিষিদ্ধ। যুবতারা নিউজ কর্তৃপক্ষ কোনো কারণ দর্শানো ছাড়াই যেকোনো মন্তব্য মুছে ফেলার অধিকার রাখে।</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#003366]">৩. তথ্যের নির্ভুলতা</h2>
                <p>আমরা সঠিক তথ্য পরিবেশনের চেষ্টা করি, তবে অনিচ্ছাকৃত কোনো ভুলের জন্য বা লিঙ্কের মাধ্যমে আসা তৃতীয় পক্ষের ওয়েবসাইটের কোনো তথ্যের জন্য যুবতারা নিউজ দায়ী থাকবে না।</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#003366]">৪. শর্তাবলী পরিবর্তন</h2>
                <p>যুবতারা নিউজ যেকোনো সময় এই শর্তাবলী পরিবর্তন বা পরিমার্জন করার অধিকার সংরক্ষণ করে। পরিবর্তনের পর ওয়েবসাইট ব্যবহার চালিয়ে গেলে তা নতুন শর্তাবলীর সাথে আপনার সম্মতির বহিঃপ্রকাশ হিসেবে গণ্য হবে।</p>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <p className="text-sm text-gray-500">সর্বশেষ আপডেট: ২৮ মার্চ, ২০২৬</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
