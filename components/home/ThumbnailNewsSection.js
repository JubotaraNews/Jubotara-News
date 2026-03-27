import Link from "next/link";
import Image from "next/image";
import Container from "../common/Container.jsx";
import truncate from "@/utils/truncate";

const ThumbnailNewsSection = ({ news = [], title, slug }) => {
  if (!news || news.length === 0) return null;

  return (
    <Container>
      <div className=" ">
        <div className="flex items-center justify-between   border-b border-gray-100 pb-4">
          <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3 text-secondary">
            <span className="w-2 h-8 bg-secondary"></span>
            {title}
          </h2>
          <Link
            href={`/category/${slug}`}
            className="text-xl md:text-2xl font-semibold text-secondary  flex items-center gap-1 hover:underline"
          >
            সবগুলো দেখুন
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {news?.slice(0, 4)?.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="group flex flex-col gap-1 md:gap-2 "
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={item?.featured_image}
                  alt={item?.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  placeholder="blur"
                  blurDataURL={item?.blurDataURL}
                />
              </div>
              <h3
                className="text-gray-600 text-lg md:text-[22px] leading-[24px] md:leading-[26px] group-hover:text-primary
                             font-semibold transition-colors line-clamp-1"
              >
                {item?.name}
              </h3>
              <p className="text-gray-500 text-base md:text-xl line-clamp-1 leading-relaxed ">
                {truncate(item?.description)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ThumbnailNewsSection;
