import Image from "next/image";
import Container from "../common/Container.jsx";
import Link from "next/link";
import { getTrandingNews } from "@/lib/localData";
import truncate from "@/utils/truncate";

export default async function TrendingNews() {
  const featuredNews = await getTrandingNews();

  if (!featuredNews) return null;

  const featuredOthers = featuredNews.slice(1, 7);

  return (
    <Container className="">
      <div className="   ">
        <div className="grid md:grid-cols-3 gap-2 md:gap-4">
          {featuredOthers?.map((news, i) => (
            <div
              key={i}
              className="flex justify-between gap-2 border-b pb-4 cursor-pointer group"
            >
              {/* Text */}
              <div className="flex-1">
                <Link
                  href={`/news/${news?.slug}`}
                  className="text-gray-600 dark:text-gray-300 text-lg md:text-[22px] leading-6 md:leading-6.5
                 group-hover:text-primary font-semibold line-clamp-2 "
                >
                  {news?.name}
                </Link>
                <p className="text-gray-500 dark:text-gray-500 text-base md:text-xl mt-2 line-clamp-2 md:line-clamp-3">
                  {truncate(news?.description)}
                </p>
              </div>

              {/* Image Right Side */}
              <div className="w-30 h-25 lg:w-50 lg:h-37.5 relative shrink-0">
                <Image
                  src={news?.featured_image}
                  alt={news?.name}
                  fill
                  sizes="(max-width: 768px) 120px, 200px"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={news?.blurDataURL}
                />
              </div>
            </div>
          ))}
        </div>
        {/* <div className="grid md:grid-cols-4 gap-2 mt-4 ">
          {newsList?.slice(1,9)?.map((news, i) => (
            <div key={i} className="flex justify-between gap-4 border-b py-3 cursor-pointer group">
           
              
                  <div className="flex-1">
                    <h3 className="text-gray-950 text-base md:text-[22px]  group-hover:text-red-600 ">
                      {news.title}
                    </h3>

                  </div>

               
                  <div className="w-[150px] h-[90px] relative flex-shrink-0">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
           
          ))}
        </div> */}
      </div>
    </Container>
  );
}
