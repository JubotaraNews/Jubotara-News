import Link from "next/link";
import Image from "next/image";
import Container from "../common/Container.jsx";
import truncate from "@/utils/truncate";

const SpecialCategorySection = async ({
  title,
  firstNews = {},
  sideNews = [],
  slug,
}) => {
  // console.log("sportsNews", sportsNews)

  return (
    <Container>
      <div className=" bg-white dark:bg-[#121212] p-2 md:p-4 lg:p-6 border border-gray-300 dark:border-gray-700/70">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-1 md:pb-3 mb-2 md:mb-6 ">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-secondary"></div>
            <h2 className="text-xl md:text-2xl font-semibold text-secondary">
              {title}
            </h2>
          </div>
          <Link
            href={`/category/${slug}`}
            className="text-xl md:text-2xl font-semibold text-secondary  flex items-center gap-1 hover:underline"
          >
            আরও খবর
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Featured News Item */}
          <div className="lg:col-span-4 flex flex-col group">
            <Link
              href={`/news/${firstNews.slug}`}
              className="block relative h-64 w-full overflow-hidden"
            >
              <Image
                src={firstNews?.featured_image}
                alt={firstNews?.name}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
            <div className="mt-2 md:mt-3 space-y-1">
              <Link href={`/news/${firstNews?.slug}`}>
                <h3 className="text-gray-600 dark:text-gray-300 text-lg md:text-[22px] leading-6 md:leading-6.5 group-hover:text-primary font-semibold transition-colors">
                  {firstNews.name}
                </h3>
              </Link>
              {firstNews?.description && (
                <p className="text-gray-600 dark:text-gray-500 text-base md:text-xl leading-relaxed line-clamp-2">
                  {truncate(firstNews?.description)}
                </p>
              )}
            </div>
          </div>

          {/* Right: Small News Items in 2 Columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sideNews?.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="flex gap-2 p-2 md:gap-4 md:p-4 border border-slate-300 dark:border-slate-700 mb-0 hover:bg-[#eff3f6] dark:hover:bg-[#222222] transition-colors group h-fit"
                >
                  <div className="flex-1 space-y-1">
                    <h4 className="text-gray-600 dark:text-gray-300 text-lg md:text-[22px] leading-6 md:leading-6.5 group-hover:text-primary font-semibold transition-colors line-clamp-2">
                      {item?.name}
                    </h4>
                    <p className="text-base md:text-xl text-gray-500 line-clamp-1 leading-relaxed">
                      {truncate(item?.description)}
                    </p>
                  </div>
                  <div className="relative w-20 h-20 shrink-0 overflow-hidden">
                    <Image
                      src={item?.featured_image}
                      alt={item?.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SpecialCategorySection;
