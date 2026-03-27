import React from "react";
import Container from "@/components/common/Container";
import { getSettings } from "@/lib/localData";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export const metadata = {
  title: "যোগাযোগ | যুবতারা নিউজ",
  description: "আমাদের সাথে যোগাযোগ করুন। আপনার মতামত ও পরামর্শ আমাদের জন্য গুরুত্বপূর্ণ।",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <main className="py-12 bg-[#eff3f6] min-h-screen">
      <Container>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Contact Info */}
            <div className="p-8 md:p-12 bg-[#003366] text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-extrabold">যোগাযোগ করুন</h1>
                <p className="text-blue-100 text-lg">আপনার যেকোনো জিজ্ঞাসা, মতামত বা অভিযোগ আমাদের জানাতে পারেন।</p>
              </div>

              <div className="space-y-6 pt-6">
                {settings.address && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-white/10 p-3 rounded-full">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">অফিস ঠিকানা</h3>
                      <p className="text-blue-100">{settings.address}</p>
                    </div>
                  </div>
                )}

                {settings.phone && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-white/10 p-3 rounded-full">
                      <FaPhone size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">ফোন করুন</h3>
                      <p className="text-blue-100">{settings.phone}</p>
                    </div>
                  </div>
                )}

                {settings.email && (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-white/10 p-3 rounded-full">
                      <FaEnvelope size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">ইমেইল করুন</h3>
                      <p className="text-blue-100">{settings.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form Placeholder */}
            <div className="p-8 md:p-12 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">আমাদের বার্তা পাঠান</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">আপনার নাম</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                      placeholder="নাম লিখুন"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">ইমেইল ঠিকানা</label>
                    <input 
                      type="email" 
                      className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                      placeholder="ইমেইল লিখুন"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">বিষয়</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                    placeholder="বিষয় লিখুন"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">বার্তা</label>
                  <textarea 
                    rows="4"
                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-[#003366] focus:border-transparent"
                    placeholder="আপনার বার্তা এখানে লিখুন..."
                  ></textarea>
                </div>
                <button className="w-full bg-red-600 text-white font-bold py-3 rounded-md hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
                  বার্তা পাঠান
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
