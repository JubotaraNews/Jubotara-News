import Link from "next/link";
import Image from "next/image";

const MediumCard = ({ news }) => {
  if (!news) return null;

  return (
    <div className="flex flex-col gap-3 group news-card-hover bg-white p-2 shadow-sm">
      <Link
        href={`/news/${news.slug}`}
        className="relative h-48 w-full overflow-hidden"
      >
        <Image
          src={news.image}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          placeholder="blur"
          blurDataURL={news.blurDataURL}
        />
      </Link>
      <div className="space-y-1">
        <span className="text-primary text-xs font-bold uppercase">
          {news.category}
        </span>
        <Link href={`/news/${news.slug}`}>
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {news.title}
          </h3>
        </Link>
        <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
          <span>{news.time}</span>
          <span>•</span>
          <span>{news.author}</span>
        </div>
      </div>
    </div>
  );
};

export default MediumCard;
