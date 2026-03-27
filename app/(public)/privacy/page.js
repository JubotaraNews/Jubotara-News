import React from "react";
import Container from "@/components/common/Container";

export const metadata = {
  title: "গোপনীয়তা নীতি | যুবতারা নিউজ",
  description: "যুবতারা নিউজ এর গোপনীয়তা নীতি।",
};

export default function PrivacyPage() {
  return (
    <main className="py-12 bg-[#eff3f6] min-h-screen">
      <Container>
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#003366]">
                গোপনীয়তা নীতি
              </h1>
              <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p>যুবতারা নিউজ আমাদের পাঠকদের গোপনীয়তাকে অত্যন্ত গুরুত্ব সহকারে বিবেচনা করে। এই গোপনীয়তা নীতি নথিতে আমরা আপনার কাছ থেকে যে ধরণের ব্যক্তিগত তথ্য সংগ্রহ করি এবং আমরা কীভাবে তা ব্যবহার করি তা বর্ণিত হয়েছে।</p>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#003366]">১. তথ্য সংগ্রহ</h2>
                <p>আমরা যখন আপনি আমাদের ওয়েবসাইটে নিবন্ধন করেন, কোনো খবর মন্তব্য করেন বা আমাদের নিউজলেটারে সাবস্ক্রাইব করেন তখন আমরা আপনার নাম, ইমেইল ঠিকানা এবং অন্যান্য প্রয়োজনীয় তথ্য সংগ্রহ করতে পারি।</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#003366]">২. তথ্যের ব্যবহার</h2>
                <p>সংগৃহীত তথ্য আমরা নিম্নলিখিত উপায়ে ব্যবহার করতে পারি:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>আপনার অভিজ্ঞতা উন্নত করতে।</li>
                  <li>আমাদের ওয়েবসাইট আরও উন্নত করতে।</li>
                  <li>আপনাকে প্রয়োজনীয় আপডেট বা নিউজলেটার পাঠাতে।</li>
                  <li>আপনার সাথে যোগাযোগ করতে।</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#003366]">৩. কুকিজ</h2>
                <p>আমরা আমাদের সাইটে পাঠকদের অভিজ্ঞতা উন্নত করতে এবং সাইট ভিজিট বিশ্লেষণ করতে কুকিজ ব্যবহার করি। আপনি চাইলে আপনার ব্রাউজার সেটিংস থেকে কুকিজ বন্ধ করে দিতে পারেন।</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#003366]">৪. তথ্যের নিরাপত্তা</h2>
                <p>আমরা আপনার ব্যক্তিগত তথ্যের নিরাপত্তা নিশ্চিত করতে বিভিন্ন ধরণের নিরাপত্তা ব্যবস্থা গ্রহণ করি। আমরা কখনো আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি বা বিনিময় করি না।</p>
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
