
import Link from 'next/link';
import Image from 'next/image';
import Container from '../common/Container.jsx';
import truncate from '@/utils/truncate';

const CountryWideSection = ({ title, featureNews, gridNews = [], slug }) => {
    if (!featureNews) return null;

    return (
        <Container >
            <div className="p-2 md:p-4  lg:p-6 border border-gray-300  ">

                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-slate-300 pb-1 md:pb-3 mb-2 md:mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-secondary"></div>
                        <h2 className="text-xl md:text-2xl font-semibold text-secondary">{title}</h2>
                    </div>
                    <Link href={`/category/${slug}`} className="text-xl md:text-2xl font-semibold text-secondary  flex items-center gap-1 hover:underline">
                        আরও খবর
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </Link>
                </div>

                {/* Featured Big Story */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 md:gap-6 lg:gap-8 mb-6 md:mb-10  border-b border-gray-50">
                    <div className="md:col-span-6">
                        <Link href={`/news/${featureNews.slug}`} className="block relative h-[250px] md:h-[350px] w-full overflow-hidden">
                            <Image
                                src={featureNews?.featured_image}
                                alt={featureNews?.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </Link>
                    </div>
                    <div className="md:col-span-6 flex flex-col justify-between">
                        <div>
                            <Link href={`/news/${featureNews.slug}`} className="group">
                                <h3 className="text-gray-600 text-lg md:text-[22px] leading-[24px] md:leading-[26px] group-hover:text-primary font-semibold transition-colors mb-1 md:mb-2">
                                    {featureNews?.name}
                                </h3>
                            </Link>
                            <p className="text-gray-600 text-base md:text-xl leading-relaxed line-clamp-2 md:line-clamp-6">

                                {truncate(featureNews?.description)}
                            </p>
                        </div>
                        {/* <div className=" text-base md:text-xl font-semibold text-gray-700 uppercase tracking-wider mt-2 md:mt-0">
                            {featureNews.date} | {featureNews.time}
                        </div> */}
                    </div>
                </div>

                {/* Bottom Grid of 4 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {gridNews.slice(0, 4).map((news) => (
                        <Link key={news.id} href={`/news/${news.slug}`} className="group ">
                            <div className="relative h-44 w-full mb-2 overflow-hidden bg-gray-100">
                                <Image
                                    src={news?.featured_image}
                                    alt={news?.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <h4 className="text-gray-600 text-lg md:text-[22px] leading-[24px] md:leading-[26px] group-hover:text-primary font-semibold transition-colors line-clamp-2">
                                {news?.name}
                            </h4>
                            <p className="text-gray-500 text-base md:text-xl line-clamp-2 leading-relaxed mt-1">

                                {truncate(news?.description)}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default CountryWideSection;
