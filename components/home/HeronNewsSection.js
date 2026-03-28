import Link from "next/link";
import Image from "next/image";
import Container from "../common/Container.jsx";
import LocationSearch from "./LocationSearch";
import { getTrandingNews } from "@/lib/localData";
import truncate from "@/utils/truncate";

const HeronNewsSection = async () => {
  const featuredNews = await getTrandingNews();
  const featuredNewsFirst = featuredNews?.[0];

  if (!featuredNewsFirst) return null;

  const newsCategories = featuredNewsFirst?.categories || [];

  return (
    <Container className=" ">
      <div className="border-t border-slate-300 pb-3"></div>
      {/* Top Featured Story */}
      <div className="px-2 md:px-3 lg:px-3 py-2 pb-4 border-r-2 border-l-4 border-l-secondary border-gray-300 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Text Side */}
          <div className="md:col-span-4 lg:col-span-5 flex flex-col justify-between ">
            <div className="">
              <Link
                href={`/news/${featuredNewsFirst?.slug}`}
                // href={`/news/${featuredNewsFirst?.id}`}

                className="group"
              >
                <h1
                  className="text-2xl md:text-3xl xl:text-5xl  text-gray-950 dark:text-gray-300 leading-[1.15]
                             group-hover:text-primary transition-colors"
                >
                  {featuredNewsFirst?.name}
                </h1>
              </Link>
              <p
                className="text-gray-600 dark:text-gray-500  text-base md:text-2xl leading-relaxed mt-2 md:mt-3 line-clamp-3 md:line-clamp-5
 "
              >
                {truncate(featuredNewsFirst?.description, 700)}
              </p>
              {/* <div className="flex items-center gap-4 text-sm text-gray-500 font-bold uppercase">
                            <span className="text-primary">{mainNews.category}</span>
                            <span>{mainNews.time}</span>
                        </div> */}
            </div>
            <div className="flex flex-wrap gap-2 pt-4 lg:pt-10 text-base md:text-xl">
              {newsCategories?.map((cat) => (
                <div
                  key={cat.id}
                  className="px-3 py-1 bg-gray-200 dark:bg-[#333]  font-bold text-gray-600 dark:text-gray-300"
                >
                  {cat?.name}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-5">
            <Link
              href={`/news/${featuredNewsFirst?.slug}`}
              className="block relative h-62.5 md:h-full w-full overflow-hidden"
            >
              <Image
                src={featuredNewsFirst?.featured_image}
                alt={featuredNewsFirst?.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </Link>
          </div>

          {/* Search Side */}
          <div className="md:col-span-3 lg:col-span-2">
            <LocationSearch />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HeronNewsSection;
