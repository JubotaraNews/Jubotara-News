
import Link from 'next/link';
import Image from 'next/image';

const MainCard = ({ news }) => {
    if (!news) return null;

    return (
        <div className="relative group overflow-hidden rounded-lg shadow-md news-card-hover">
            <Link href={`/news/${news.slug}`}>
                <div className="relative h-[300px] md:h-[450px] w-full">
                    <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 p-6 w-full">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded mb-3 inline-block">
                            {news.category}
                        </span>
                        <h2 className="text-white text-2xl md:text-3xl font-bold leading-tight group-hover:text-red-400 transition-colors">
                            {news.title}
                        </h2>
                        <p className="text-gray-200 mt-2 text-sm line-clamp-2 md:line-clamp-none">
                            {news.reporterInfo}
                        </p>
                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-300">
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {news.time}
                            </span>
                            <span>{news.author}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default MainCard;
