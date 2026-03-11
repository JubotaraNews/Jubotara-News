
import Link from 'next/link';
import Image from 'next/image';

const HorizontalCard = ({ news }) => {
    if (!news) return null;

    return (
        <div className="flex gap-4 group py-2 border-b border-gray-300 last:border-0 hover:bg-[#eff3f6] transition-colors px-2 rounded">
            <Link href={`/news/${news.slug}`} className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded">
                <Image
                    src={news?.featured_image}
                    alt={news?.name}
                    fill
                    className="object-cover"
                />
            </Link>
            <div className="flex-1 min-w-0">
                <Link href={`/news/${news.slug}`}>
                    <h4 className="text-base md:text-xl font-bold text-gray-700 leading-snug group-hover:text-primary 
                    transition-colors line-clamp-2">
                        {news?.name}
                    </h4>
                </Link>
                <div className="flex items-center gap-2 text-base md:text-xl text-gray-800 mt-1">
                    <span className="text-gray-600 ">{news?.categories[0]?.name}</span>
                    {/* <span>{formatBengaliDate(news?.created_at)}</span> */}
                </div>
            </div>
        </div>
    );
};

export default HorizontalCard;
