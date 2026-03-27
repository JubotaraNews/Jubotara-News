import React from "react";
import Container from "@/components/common/Container";
import { getSettings } from "@/lib/localData";
import Image from "next/image";

export const metadata = {
  title: "আমাদের সম্পর্কে | যুবতারা নিউজ",
  description: "যুবতারা নিউজ - বাংলাদেশের অন্যতম নির্ভরযোগ্য অনলাইন সংবাদ মাধ্যম।",
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <main className="py-12 bg-[#eff3f6] min-h-screen">
      <Container>
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#003366]">
                আমাদের সম্পর্কে
              </h1>
              <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            </div>

            {settings.site_logo && (
              <div className="flex justify-center">
                <div className="relative w-64 h-24">
                  <Image
                    src={settings.site_logo}
                    alt="যুবতারা নিউজ"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-xl font-medium text-gray-900">
                যুবতারা নিউজ - সত্যের সন্ধানে আমরা অবিচল।
              </p>
              
              <div className="whitespace-pre-line text-lg">
                {settings.about_text || 
                  "যুবতারা নিউজ বাংলাদেশের অন্যতম নির্ভরযোগ্য অনলাইন সংবাদ মাধ্যম। আমরা বস্তুনিষ্ঠ সংবাদ পরিবেশন এবং জনস্বার্থ সংশ্লিষ্ট তথ্য সবার আগে পৌছে দিতে প্রতিশ্রুতিবদ্ধ। জাতীয়, আন্তর্জাতিক, রাজনীতি, অর্থনীতি, খেলাধুলা ও বিনোদনের সবশেষ খবর সবার আগে পেতে আমাদের সাথেই থাকুন।"}
              </div>

              <div className="space-y-4 pt-6">
                <h2 className="text-2xl font-bold text-[#003366]">আমাদের লক্ষ্য</h2>
                <p>আমাদের লক্ষ্য হলো সঠিক ও নিরপেক্ষ সংবাদ পরিবেশনের মাধ্যমে সমাজের ইতিবাচক পরিবর্তনে ভূমিকা রাখা। আমরা বিশ্বাস করি তথ্য মানুষের অধিকার, আর সেই অধিকার নিশ্চিত করতে আমরা কাজ করে যাচ্ছি নিরন্তর।</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#003366]">কেন আমাদের বেছে নেবেন?</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>দ্রুত এবং নির্ভুল সংবাদ পরিবেশন।</li>
                  <li>নিরপেক্ষ ও বস্তুনিষ্ঠ বিশ্লেষণ।</li>
                  <li>সারাদেশের স্থানীয় সংবাদের বিশেষ গুরুত্ব।</li>
                  <li>ব্যবহারকারীবান্ধব ডিজিটাল প্ল্যাটফর্ম।</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
