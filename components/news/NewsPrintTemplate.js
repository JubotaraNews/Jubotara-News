/* eslint-disable @next/next/no-img-element */

import { formatBengaliDate } from "@/utils/formatDate";

const NewsPrintTemplate = ({ news, category }) => {
  const formattedPublishedDate = formatBengaliDate(news?.created_at);

  return (
    <div className="hidden print:block w-full  text-black p-4 min-h-screen ">
      {/* Header / Logo */}
      <div className="flex flex-col items-center justify-center border-b-2 border-red-600 pb-6 mb-8 text-center">
        <img
          src="/images/logo.png"
          alt="Bangla Star News"
          className="h-16 mb-2 object-contain"
        />
        <p className="text-sm font-bold text-gray-700">
          উন্মোচনের লক্ষে, সত্যের পক্ষে
        </p>
        <p className="text-xs text-gray-500 lowercase">JubotaraNews.Com</p>
      </div>

      {/* News Title */}
      <h1 className="text-3xl font-bold mb-4 leading-tight">{news?.name}</h1>

      {/* Meta Info */}
      <div className="flex items-center justify-between border-y border-gray-300 py-3 mb-6">
        <div>
          <span className="font-bold text-gray-800">{news?.reporterInfo}</span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="text-gray-600">{category?.name}</span>
        </div>
        <div className="text-gray-600">{formattedPublishedDate}</div>
      </div>

      {/* Featured Image */}
      <div className="mb-8">
        <img
          src={news?.featured_image}
          alt={news?.name}
          className="w-full h-auto object-cover rounded-none"
          style={{ maxHeight: "450px" }}
        />
      </div>

      {/* News content */}
      <div className="news-content-print">
        <div
          className="text-lg leading-relaxed text-gray-900 whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: news.description || "<p>No content available.</p>",
          }}
        ></div>
      </div>

      {/* Print Footer */}
      <div className="mt-12 pt-4 border-t border-gray-200 text-xs text-gray-500 text-right">
        মুদ্রিত হয়েছে:{" "}
        {new Date().toLocaleDateString("bn-BD", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
};

export default NewsPrintTemplate;
