import Link from "next/link";
import Container from "../Container.jsx";

const BreakingNews = ({ news = [] }) => {
  if (!news || news.length === 0) return null;

  return (
    <div className="bg-[#eff3f6] dark:bg-gray-900 overflow-hidden">
      <Container className="flex items-center ">
        {/* Label */}
        <div className="flex items-center gap-2 bg-black dark:bg-olive-800 text-white px-3 my-1 py-0.5 text-xs font-black whitespace-nowrap z-10 text-[13px] sm:text-sm md:text-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 bg-primary"></span>
          </span>
          শীর্ষ সংবাদ
        </div>

        {/*  Content */}
        <div className="relative flex-1 overflow-hidden ml-4 text-[13px] sm:text-sm md:text-lg">
          <div className="flex animate-ticker whitespace-nowrap hover:pause">
            {news?.map((item, idx) => (
              <span
                key={item?.id}
                className="flex items-center font-medium text-gray-800 dark:text-gray-300"
              >
                <Link
                  href={`/news/${item?.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {item?.name}
                </Link>
                {idx !== news?.length - 1 && (
                  <span className="mx-6 text-primary">|</span>
                )}
              </span>
            ))}
            {/* Repeat for continuous scroll effect if list is short */}
            {news?.length < 5 &&
              news.map((item) => (
                <span
                  key={`repeat-${item.id}`}
                  className="flex items-center font-medium text-gray-900 dark:text-gray-100"
                >
                  <span className="mx-6 text-primary">|</span>
                  <Link
                    href={`/news/${item?.slug}`}
                    className="hover:text-primary transition-colors hover:font-semibold"
                  >
                    {item.name}
                  </Link>
                </span>
              ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BreakingNews;
