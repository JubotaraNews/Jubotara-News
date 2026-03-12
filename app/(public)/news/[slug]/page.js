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
import {
  getNewsByCat,
  getSingleNews,
  getTrandingNews,
  getSettings,
} from "@/lib/localData";
import { formatBengaliDate } from "@/utils/formatDate";
import { FRONT_END_URL } from "@/utils/baseUrl";
import FacebookComments from "@/components/news/FacebookComments";
import { getMetaValueByMetaName } from "@/utils/metaHelpers";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const news = await getSingleNews(slug);

  if (!news || Object.keys(news).length === 0) {
    return {
      title: "সংবাদ পাওয়া যায়নি | বাংলা স্টার নিউজ",
    };
  }

  //  title/description
  const newsTitle = news?.meta_title || news?.name || news.title;
  const title = `${newsTitle} | যুবতারা নিউজ`;

  // Strip HTML and trim for description
  const plainDescription = (
    news.meta_description ||
    news.summary ||
    news.description ||
    ""
  )
    .replace(/<[^>]*>/g, "")
    .split("\n")[0]
    .slice(0, 160)
    .trim();

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
      "বাংলা স্টার নিউজ",
      "Bangla Star News",
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
      siteName: "বাংলা স্টার নিউজ",
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
      site: "@banglastar",
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

export default async function NewsDetailPage({ params }) {
  const trendingNews = await getTrandingNews();
  const { slug } = await params;

  const news = await getSingleNews(slug);
  if (!news) {
    notFound();
  }
  const settings = await getSettings();
  const googleNewsUrl =
    getMetaValueByMetaName(settings, "google_news_channle_link") || "#";
  const whatsappChannelUrl =
    getMetaValueByMetaName(settings, "whats_app_channle_link") || "#";

  let category;
  if (news?.categories) {
    category = news?.categories[0];
  }

  const reletedNews = await getNewsByCat(category?.slug, 5);

  // console.log("reletedNews details page", reletedNews,)

  const formattedPublishedDate = formatBengaliDate(news?.created_at);

  // Get current URL for sharing
  const fullUrl = `${FRONT_END_URL}/news/${slug}`;

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.name || news.title,
    image: [news.featured_image || ""],
    datePublished: news.created_at,
    dateModified: news.updated_at || news.created_at,
    author: [
      {
        "@type": "Person",
        name: "নিজস্ব প্রতিবেদক",
        url: FRONT_END_URL,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "বাংলা স্টার নিউজ",
      logo: {
        "@type": "ImageObject",
        url: `${FRONT_END_URL}/logo.png`,
      },
    },
    description: news.content
      ?.replace(/<[^>]*>/g, "")
      .slice(0, 160)
      .trim(),
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
      <div className="flex flex-col min-h-screen bg-[#eff3f6] print:hidden">
        {/* Add Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <main className="py-2">
          <Container className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Main Content */}
            <article className="lg:col-span-8 p-3 md:p-6 border border-slate-300 bg-white">
              <div className="space-y-6">
                {/* Category and Date */}
                <div className="flex items-center gap-4 text-base md:text-xl">
                  <span className="bg-primary text-white px-3 py-1 font-bold">
                    {category?.name}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-none md:leading-6">
                  {news?.name}
                </h1>

                {/* Author and Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-base md:text-xl font-bold text-gray-800">
                        নিজস্ব প্রতিবেদক
                      </p>
                      <span className="text-gray-500 font-medium">
                        {formattedPublishedDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShareButtons
                      title={news?.name || news?.title}
                      url={fullUrl}
                    />
                    <PrintButton />
                  </div>
                </div>

                {/* Main Image */}
                <div className="relative h-75 md:h-125 w-full overflow-hidden shadow-inner">
                  <Image
                    src={news?.featured_image}
                    alt={news?.name || "news image"}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div>
                  <div
                    className="text-base md:text-xl lg:md:text-[22px] text-gray-800 font-medium"
                    dangerouslySetInnerHTML={{
                      __html:
                        news.description || "<p>No content available.</p>",
                    }}
                  ></div>
                </div>
              </div>

              {/* Share and Tags */}
              <div className="pt-10 border-t border-slate-300 mt-10">
                <div className="bg-linear-to-r from-blue-50 to-gray-50 rounded-sm p-6 md:p-8 shadow-sm">
                  <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-6">
                    আপডেটেড খবর পেতে আমাদের সাথে যুক্ত থাকুন
                  </h3>

                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Google News */}
                    <Link
                      href={googleNewsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 bg-white hover:bg-blue-50 border border-slate-300 rounded-xl px-5 py-4 transition-all duration-300 hover:shadow-md group"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xl group-hover:scale-110 transition">
                        <FaGoogle />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800">
                          গুগল নিউজ চ্যানেল
                        </p>
                        <p className="text-sm text-gray-500">
                          ফলো করুন সর্বশেষ আপডেট পেতে
                        </p>
                      </div>
                    </Link>

                    {/* WhatsApp Channel */}
                    <Link
                      href={whatsappChannelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 bg-white hover:bg-green-50 border border-slate-300 rounded-xl px-5 py-4 transition-all duration-300 hover:shadow-md group"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-xl group-hover:scale-110 transition">
                        <FaWhatsapp />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-800">
                          হোয়াটসঅ্যাপ চ্যানেল
                        </p>
                        <p className="text-sm text-gray-500">
                          সরাসরি নোটিফিকেশন পেতে যুক্ত থাকুন
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Facebook Comments */}
              <FacebookComments url={fullUrl} />
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Ad Placeholder */}
              <div className="bg-gray-100 h-64 flex items-center justify-center border-2 border-dashed border-slate-300">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                  বিজ্ঞাপন / Advertisement
                </span>
              </div>
              {/* Latest News */}
              <div className="p-3 md:p-6  border border-slate-300 bg-white">
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
          slug={category?.slug}
        />
      </div>
    </>
  );
}
