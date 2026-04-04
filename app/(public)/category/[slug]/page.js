import {
  getNews,
  getCategoryNews,
  getMenus,
  getSingleCategories,
} from "@/lib/localData";
import Container from "@/components/common/Container";
import Link from "next/link";
import Image from "next/image";
import truncate from "@/utils/truncate";
import { FRONT_END_URL } from "@/utils/baseUrl";
import { notFound } from "next/navigation";

const toBanglaNumber = (n) => {
  const banglaNumbers = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return n
    .toString()
    .split("")
    .map((digit) => banglaNumbers[digit] || digit)
    .join("");
};

const getCategoryTitle = (slug, category, menus, categoryNews = []) => {
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim();

  const categoryFromMenu = menus.find(
    (c) =>
      c.link === slug ||
      c.slug === slug ||
      c.slug === normalizedSlug ||
      c.label?.toLowerCase().trim().replace(/\s+/g, "-") === normalizedSlug,
  );

  const categoryFromNews = categoryNews[0]?.categories?.find((c) => {
    if (!c?.name) return false;
    const nameSlug = c.name.toLowerCase().trim().replace(/\s+/g, "-");
    return (
      c.slug === slug ||
      c.slug === normalizedSlug ||
      nameSlug === slug ||
      nameSlug === normalizedSlug
    );
  });

  const defaultName = decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (x) => x.toUpperCase());

  return (
    category?.name ||
    categoryFromMenu?.label ||
    categoryFromMenu?.name ||
    categoryFromNews?.name ||
    defaultName ||
    "বিভাগ"
  );
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getSingleCategories(slug);
  const menus = await getMenus();

  const categoryName = getCategoryTitle(slug, category, menus); // no news data yet

  const title = `${categoryName} | যুবতারা নিউজ`;
  const description = `${categoryName} বিভাগের সর্বশেষ সংবাদ, ব্রেকিং নিউজ এবং বিশেষ প্রতিবেদন দেখুন বাংলা স্টার নিউজে।`;
  const siteUrl = FRONT_END_URL;
  const pageUrl = `${siteUrl}/category/${slug}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "যুবতারা নিউজ",
      locale: "bn_BD",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@jubotaranews",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const revalidate = 300; // 5 minutes

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sParams = await searchParams;
  const currentPage = parseInt(sParams.page) || 1;
  const perPage = 10;

  const [category, menus, newsResponse, allNews] = await Promise.all([
    getSingleCategories(slug),
    getMenus(),
    getCategoryNews(slug, currentPage, perPage),
    getNews(15),
  ]);

  if (!category) {
    notFound();
  }

  const categoryNews = newsResponse?.data || [];
  const meta = newsResponse?.meta || {};
  const latestNews = allNews.slice(0, 7);

  const categoryName = getCategoryTitle(slug, category, menus, categoryNews);

  const featuredNews = categoryNews[0];
  const otherNews = categoryNews.slice(1);

  const subCategories = category?.child;
  const totalPages = meta.last_page || 1;

  // JSON-LD Breadcrumb
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "হোম",
        item: FRONT_END_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: `${FRONT_END_URL}/category/${slug}`,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#eff3f6] dark:bg-[#121212]">
      {/* Add Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="py-6 px-2">
        <Container>
          <div className="flex flex-col lg:flex-row gap-2 md:gap-6">
            <div className="lg:w-3/4">
              {/* Category Title */}
              <div className="mb-4">
                <div className="flex items-center gap-4  mb-4">
                  <h1 className="text-3xl font-bold text-[#003366] dark:text-gray-300">
                    {categoryName}
                  </h1>
                  <div className="flex-1 border-t border-gray-300 dark:border-gray-700 mt-2"></div>
                </div>

                {/* Sub-categories Bar */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {subCategories?.map((sub, i) => (
                    <Link
                      href={`/category/${sub?.slug}`}
                      key={i}
                      className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm md:text-base font-medium border border-gray-300 transition-colors"
                    >
                      {sub?.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Main Content */}
                <div className="w-full">
                  {featuredNews ? (
                    <div className="mb-2 md:mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 md:pb-4">
                      <Link
                        href={`/news/${featuredNews.slug}`}
                        className="flex flex-col md:flex-row gap-4"
                      >
                        <div className="md:w-1/2">
                          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-300 leading-tight hover:text-red-600 transition-colors mb-4">
                            {featuredNews.name}
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 text-base md:text-xl line-clamp-3 lg:line-clamp-6">
                            {truncate(featuredNews?.description, 1000)}
                          </p>
                        </div>
                        <div className="md:w-1/2 relative h-62.5 md:h-auto min-h-62.5 md:min-h-75">
                          <Image
                            src={featuredNews.featured_image}
                            alt={featuredNews.name}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover rounded-md"
                          />
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <p className="text-center text-sm md:text-base py-4 md:py-10">
                        No News Found{" "}
                      </p>
                    </>
                  )}

                  {/* News Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                    {otherNews?.map((news) => (
                      <Link
                        key={news.id}
                        href={`/news/${news.slug}`}
                        className="flex gap-3 group border border-gray-300 dark:border-gray-800/80 p-3 hover:bg-gray-50 dark:hover:bg-[#181818] transition-colors rounded-lg shadow-sm"
                      >
                        <div className="flex-1">
                          <h3
                            className="text-base md:text-xl font-bold text-gray-800 dark:text-gray-300 leading-snug group-hover:text-red-600 
                                                    transition-colors line-clamp-2"
                          >
                            {news.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-base md:text-xl line-clamp-1">
                            {truncate(news?.description)}
                          </p>
                        </div>
                        <div className="relative w-24 h-24 shrink-0">
                          <Image
                            src={news.featured_image}
                            alt={news.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                  {/* Pagination */}
                  {otherNews?.length > 0 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                      {currentPage > 1 && (
                        <Link
                          href={`/category/${slug}?page=${currentPage - 1}`}
                          className="px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-800/80 rounded hover:bg-gray-100 dark:hover:bg-[#181818] text-[#003366] dark:text-gray-300 font-bold"
                        >
                          পূর্ববর্তী
                        </Link>
                      )}

                      <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          // Show only first, last, and pages around current
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 2 &&
                              pageNum <= currentPage + 2)
                          ) {
                            return (
                              <Link
                                key={pageNum}
                                href={`/category/${slug}?page=${pageNum}`}
                                className={`w-10 h-10 flex items-center justify-center border rounded font-bold 
                                                                                                        text-base md:text-xl ${
                                                                                                          currentPage ===
                                                                                                          pageNum
                                                                                                            ? "bg-red-700 dark:bg-red-950 text-white border-red-700 dark:border-red-950"
                                                                                                            : "bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-800/80 hover:bg-gray-100 dark:hover:bg-[#181818]"
                                                                                                        }`}
                              >
                                {toBanglaNumber(pageNum)}
                              </Link>
                            );
                          }
                          // Show ellipsis
                          if (
                            (pageNum === currentPage - 3 && pageNum > 1) ||
                            (pageNum === currentPage + 3 &&
                              pageNum < totalPages)
                          ) {
                            return (
                              <span key={pageNum} className="px-2">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      {currentPage < totalPages && (
                        <Link
                          href={`/category/${slug}?page=${currentPage + 1}`}
                          className="px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-800/80 rounded hover:bg-gray-100 dark:hover:bg-[#181818] text-[#003366] dark:text-gray-300 font-bold"
                        >
                          পরবর্তী
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:w-1/4">
              <div className="sticky top-6">
                <h2 className="text-xl font-bold text-red-600 border-b-2 border-red-600 pb-1 mb-4">
                  সর্বশেষ
                </h2>
                <div className="flex flex-col gap-4">
                  {latestNews?.map((news) => (
                    <Link
                      key={news.id}
                      href={`/news/${news.slug}`}
                      className="flex gap-3 group border-b border-gray-200 dark:border-gray-700/70 pb-4 last:border-0"
                    >
                      <div className="flex-1">
                        <h4
                          className="text-base md:text-xl font-bold text-gray-800 dark:text-gray-300 leading-tight group-hover:text-red-600
                                                 transition-colors line-clamp-2"
                        >
                          {news?.name}
                        </h4>
                        <p className="text-base md:text-xl text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {truncate(news?.description)}
                        </p>
                      </div>
                      <div className="relative w-16 h-16 shrink-0">
                        <Image
                          src={news?.featured_image || news.image}
                          alt={news?.name || "news image"}
                          fill
                          className="object-cover rounded shadow-sm"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
