import Container from "@/components/common/Container";
import ShareButtons from "@/components/news/ShareButtons";
import PrintButton from "@/components/news/PrintButton";
import NewsPrintTemplate from "@/components/news/NewsPrintTemplate";
import HorizontalCard from "@/components/news/HorizontalCard";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import ThumbnailNewsSection from "@/components/home/ThumbnailNewsSection";
import { FaGoogle, FaWhatsapp } from "react-icons/fa";
import truncate from "@/utils/truncate";
import {
  getRelatedNews,
  getSingleNews,
  getTrandingNews,
  getSettings,
  getCategoryByName,
} from "@/lib/localData";
import { formatBengaliDate } from "@/utils/formatDate";
import { FRONT_END_URL } from "@/utils/baseUrl";
import FacebookComments from "@/components/news/FacebookComments";
import { getMetaValueByMetaName } from "@/utils/metaHelpers";
import ReadingProgressBar from "@/components/common/ReadingProgressBar";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const news = await getSingleNews(slug);

  if (!news || Object.keys(news).length === 0) {
    return {
      title: "সংবাদ পাওয়া যায়নি | বাংলা স্টার নিউজ",
    };
  }

  //  title/description
  const newsTitle = news?.metaTitle || news?.name || news.headline;
  const title = `${newsTitle} | যুবতারা নিউজ`;

  // Strip HTML and trim for description
  const plainDescription =
    news.metaDescription ||
    truncate(news.content || news.reporterInfo || "", 160);

  const imageUrl = news?.featured_image || "";
  const siteUrl = FRONT_END_URL;
  const postUrl = `${siteUrl}/news/${slug}`;
  const categoryName = news?.categories?.[0]?.name || "সংবাদ";

  return {
    title,
    description: plainDescription,
    metadataBase: new URL(siteUrl),
    keywords: [
      categoryName,
      "বাংলাদেশ সংবাদ",
      "যুবতারা নিউজ",
      "Jubotara News",
      "সর্বশেষ খবর",
      ...newsTitle.split(" "),
    ].slice(0, 15),
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title,
      description: plainDescription,
      url: postUrl,
      siteName: "যুবতারা নিউজ",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: newsTitle,
            },
          ]
        : [],
      locale: "bn_BD",
      type: "article",
      publishedTime: news?.created_at,
      authors: ["নিজস্ব প্রতিবেদক"],
      section: categoryName,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: plainDescription,
      images: imageUrl ? [imageUrl] : [],
      site: "@jubotaranews",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: categoryName,
  };
}

export const revalidate = 600; // 10 minutes

export default async function NewsDetailPage({ params }) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "admin";
  const { slug } = await params;

  const [trendingNews, news, settings] = await Promise.all([
    getTrandingNews(),
    getSingleNews(slug),
    getSettings(),
  ]);

  if (!news) {
    notFound();
  }

  const displayName = isAdmin ? news.authorName || "অজানা" : "নিজস্ব প্রতিবেদক";

  const googleNewsUrl =
    getMetaValueByMetaName(settings, "google_news_channle_link") || "#";
  const whatsappChannelUrl =
    getMetaValueByMetaName(settings, "whats_app_channle_link") || "#";

  const categoryObj = await getCategoryByName(news.category);
  const categorySlug = categoryObj?.slug || "all";

  const reletedNews = await getRelatedNews(categorySlug, news._id, 6);

  const formattedPublishedDate = formatBengaliDate(news?.created_at);

  // Get current URL for sharing
  const fullUrl = `https://jubotaranews.com/news/${slug}`;

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.name || news.headline,
    image: [news.featured_image || ""],
    datePublished: news.created_at,
    dateModified: news.updated_at || news.created_at,
    author: [
      {
        "@type": "Person",
        name: displayName,
        url: FRONT_END_URL,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "যুবতারা নিউজ",
      logo: {
        "@type": "ImageObject",
        url: `${FRONT_END_URL}/logo.png`,
      },
    },
    description: truncate(news.content || news.reporterInfo || "", 160),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
  };

  return (
    <>
      {/* Dedicated Print Template - Only visible when printing */}
      <NewsPrintTemplate news={news} category={category} />

      {/* Screen UI - Hidden when printing */}
      <div className="flex flex-col min-h-screen bg-[#eff3f6] dark:bg-[#121212] print:hidden">
        {/* Reading Progress Bar */}
        <ReadingProgressBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <main className="py-2">
          <Container className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Content */}
            <article className="lg:col-span-8 p-3 md:p-6 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e1e1e]">
              <div className="space-y-6">
                {/* Category and Date */}
                <div className="flex items-center gap-4 text-base md:text-xl">
                  <span className="bg-primary text-white px-3 py-1 font-bold">
                    {category?.name}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-gray-50 leading-none md:leading-8">
                  {news?.name}
                </h1>

                {/* Author and Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 dark:border-gray-700 py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      {isAdmin && (
                        <p className="text-base md:text-xl font-bold text-gray-800 dark:text-gray-300">
                          {news.authorName || "অজানা"}
                        </p>
                      )}
                      <span className="text-gray-500 text-base font-medium">
                        {formattedPublishedDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShareButtons title={news?.name} url={fullUrl} />
                    <PrintButton />
                  </div>
                </div>

                {/* Main Image */}
                <div className="space-y-2">
                  <div className="relative h-75 md:h-125 w-full overflow-hidden shadow-inner border-3 border-slate-300 dark:border-slate-700">
                    <Image
                      src={news?.featured_image}
                      alt={news?.name || "news image"}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="object-cover"
                    />
                  </div>
                  {news.image_caption && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic border-l-2 border-primary pl-2">
                      {news.image_caption}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div>
                  {news.reporterInfo && (
                    <p className="text-md md:text-xl text-gray-750 dark:text-gray-400 mb-1 border-b dark:border-gray-700 border-gray-300 pb-2">
                      {news.reporterInfo}
                    </p>
                  )}
                  <div
                    className="text-base md:text-xl lg:md:text-[22px] text-gray-800 dark:text-gray-300 leading-relaxed font-medium whitespace-pre-line [&_p]:mb-4"
                    dangerouslySetInnerHTML={{
                      __html:
                        news.description || "<p>No content available.</p>",
                    }}
                  ></div>
                </div>
              </div>

              {/* Share and Tags */}
              <div className="pt-10 border-t border-slate-300 dark:border-slate-700 mt-10">
                <div className="bg-linear-to-r from-blue-50 dark:from-[#121212] to-gray-50 dark:to-gray-950/50 rounded-sm p-6 md:p-8 shadow-sm">
                  <h3 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-6">
                    আপডেটেড খবর পেতে আমাদের সাথে যুক্ত থাকুন
                  </h3>

                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Google News */}
                    <Link
                      href={googleNewsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 bg-white dark:bg-[#1e1e1e] hover:bg-blue-50 dark:hover:bg-[#181818] border border-slate-300 dark:border-slate-700 rounded-xl px-5 py-4 transition-all duration-300 hover:shadow-md group"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xl group-hover:scale-110 transition">
                        <FaGoogle />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800 dark:text-gray-300">
                          গুগল নিউজ চ্যানেল
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ফলো করুন সর্বশেষ আপডেট পেতে
                        </p>
                      </div>
                    </Link>

                    {/* WhatsApp Channel */}
                    <Link
                      href={whatsappChannelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 bg-white dark:bg-[#1e1e1e] hover:bg-green-50 hover:dark:bg-[#181818] border border-slate-300 dark:border-slate-700 rounded-xl px-5 py-4 transition-all duration-300 hover:shadow-md group"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xl group-hover:scale-110 transition">
                        <FaWhatsapp />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800 dark:text-gray-300">
                          হোয়াটসঅ্যাপ চ্যানেল
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          সরাসরি নোটিফিকেশন পেতে যুক্ত থাকুন
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Facebook Comments */}
              {/* <FacebookComments url={fullUrl} /> */}

              {/* Related News Section */}
              <div className="mt-12 pt-8 border-t border-slate-300 dark:border-slate-700">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-secondary">
                  <span className="w-2 h-8 bg-secondary"></span>
                  সম্পর্কিত খবর
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reletedNews?.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.slug}`}
                      className="group flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0"
                    >
                      <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={item.featured_image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {formatBengaliDate(item.created_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Ad Placeholder */}
              <div className="bg-gray-100 dark:bg-[#1e1e1e] h-64 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                  বিজ্ঞাপন / Advertisement
                </span>
              </div>
              {/* Latest News */}
              <div className="p-3 md:p-6  border border-slate-300 bg-white dark:bg-[#1e1e1e] dark:border-slate-700">
                <h2 className="text-xl font-bold mb-6 border-b-2 border-primary pb-2 flex items-center gap-2">
                  <span className="w-2 h-6 bg-primary inline-block"></span>
                  ট্রেন্ডিং সংবাদ
                </h2>
                <div className="space-y-2">
                  {trendingNews?.slice(0, 11)?.map((item) => (
                    <HorizontalCard key={item.id} news={item} />
                  ))}
                </div>
              </div>
            </aside>
          </Container>
        </main>
        <ThumbnailNewsSection
          title={"আরও খবর"}
          news={reletedNews}
          slug={categorySlug}
        />
      </div>
    </>
  );
}
