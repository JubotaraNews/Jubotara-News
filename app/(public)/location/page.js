
import { getNews, getNewsByLocation, getDivisions, getDistricts } from '@/lib/localData';
import Container from '@/components/common/Container';
import Link from 'next/link';
import Image from 'next/image';
import truncate from '@/utils/truncate';
import { FRONT_END_URL } from '@/utils/baseUrl';

const toBanglaNumber = (n) => {
    const banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n?.toString().split('').map(digit => banglaNumbers[digit] || digit).join('');
};

export async function generateMetadata({ searchParams }) {
    const sParams = await searchParams;
    const divisionId = sParams.division_id;
    const districtId = sParams.district_id;

    let locationName = 'সারাদেশ';

    if (divisionId) {
        const divisions = await getDivisions();
        const division = divisions.find(d => d.id.toString() === divisionId.toString());
        if (division) {
            locationName = division.bn_name || division.name;
        }
    }

    if (districtId) {
        const districts = await getDistricts(divisionId);
        const district = districts.find(d => d.id.toString() === districtId.toString());
        if (district) {
            locationName = district.bn_name || district.name;
        }
    }

    const title = `${locationName} এর খবর | বাংলা স্টার নিউজ`;
    const description = `${locationName} এর সর্বশেষ সংবাদ, ব্রেকিং নিউজ এবং বিশেষ প্রতিবেদন দেখুন বাংলা স্টার নিউজে।`;
    const siteUrl = FRONT_END_URL;

    return {
        title,
        description,
        metadataBase: new URL(siteUrl),
    };
}

export default async function LocationNewsPage({ searchParams }) {
    const sParams = await searchParams;
    const divisionId = sParams.division_id;
    const districtId = sParams.district_id;
    const currentPage = parseInt(sParams.page) || 1;
    const perPage = 12;

    const newsResponse = await getNewsByLocation(divisionId, districtId, currentPage, perPage);
    const locationNews = newsResponse?.data || [];
    const meta = newsResponse?.meta || {};
    const totalPages = meta.last_page || 1;

    // Get location names for UI
    let divisionName = '';
    let districtName = '';

    if (divisionId) {
        const divisions = await getDivisions();
        const division = divisions.find(d => d.id.toString() === divisionId.toString());
        divisionName = division?.bn_name || division?.name || '';
    }

    if (districtId) {
        const districts = await getDistricts(divisionId);
        const district = districts.find(d => d.id.toString() === districtId.toString());
        districtName = district?.bn_name || district?.name || '';
    }

    const displayTitle = districtName || divisionName || 'সারাদেশ';

    // Fetch latest news for sidebar
    const allNews = await getNews(15);
    const latestNews = allNews.slice(0, 7);

    const featuredNews = locationNews[0];
    const otherNews = locationNews.slice(1);

    return (
        <div className="flex flex-col min-h-screen bg-[#eff3f6]">
            <main className="py-6 px-2">
                <Container>
                    <div className="flex flex-col lg:flex-row gap-2 md:gap-6">
                        <div className="lg:w-3/4">
                            {/* Title */}
                            <div className="mb-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <h1 className="text-3xl font-bold text-[#003366]">
                                        {displayTitle}
                                    </h1>
                                    <div className="flex-1 border-t border-gray-300 mt-2"></div>
                                </div>
                                {divisionName && districtName && (
                                    <div className="text-gray-600 font-medium text-base md:text-lg">
                                        {districtName}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                {/* Main Content */}
                                <div className="w-full">
                                    {featuredNews ? (
                                        <div className="mb-6 border-b border-gray-300 pb-6">
                                            <Link href={`/news/${featuredNews.slug}`} className="flex flex-col md:flex-row gap-6 group">
                                                <div className="md:w-1/2">
                                                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight group-hover:text-red-600 transition-colors mb-4">
                                                        {featuredNews.name}
                                                    </h2>
                                                    <p className="text-gray-600 text-base md:text-xl line-clamp-4">
                                                        {truncate(featuredNews?.description || '', 300)}
                                                    </p>
                                                </div>
                                                <div className="md:w-1/2 relative h-[250px] md:h-[350px]">
                                                    <Image
                                                        src={featuredNews.featured_image}
                                                        alt={featuredNews.name}
                                                        fill
                                                        priority
                                                        className="object-cover rounded-md shadow-md"
                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
                                            <p className="text-xl text-gray-500 font-medium">এই স্থানে কোনো সংবাদ পাওয়া যায়নি</p>
                                        </div>
                                    )}

                                    {/* News Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {otherNews?.map((news) => (
                                            <Link key={news.id} href={`/news/${news.slug}`} className="flex flex-col group bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-all rounded-lg">
                                                <div className="relative aspect-video">
                                                    <Image
                                                        src={news.featured_image}
                                                        alt={news.name}
                                                        fill
                                                        className="object-cover transition-transform group-hover:scale-105 duration-300"
                                                    />
                                                </div>
                                                <div className="p-4 flex flex-col flex-1">
                                                    <h3 className="text-lg md:text-xl font-bold text-gray-800 leading-snug group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                                                        {news.name}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm md:text-base line-clamp-2 mt-auto">
                                                        {truncate(news?.description || '', 100)}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {locationNews.length > 0 && totalPages > 1 && (
                                        <div className="mt-12 flex justify-center items-center gap-2">
                                            {currentPage > 1 && (
                                                <Link
                                                    href={`/location?division_id=${divisionId || ''}&district_id=${districtId || ''}&page=${currentPage - 1}`}
                                                    className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-[#003366] font-bold transition-colors"
                                                >
                                                    পূর্ববর্তী
                                                </Link>
                                            )}

                                            <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
                                                {[...Array(totalPages)].map((_, i) => {
                                                    const pageNum = i + 1;
                                                    if (
                                                        pageNum === 1 ||
                                                        pageNum === totalPages ||
                                                        (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
                                                    ) {
                                                        return (
                                                            <Link
                                                                key={pageNum}
                                                                href={`/location?division_id=${divisionId || ''}&district_id=${districtId || ''}&page=${pageNum}`}
                                                                className={`w-10 h-10 flex-shrink-0 flex items-center justify-center border rounded font-bold text-base md:text-lg ${currentPage === pageNum
                                                                    ? 'bg-red-700 text-white border-red-700'
                                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                                                    }`}
                                                            >
                                                                {toBanglaNumber(pageNum)}
                                                            </Link>
                                                        );
                                                    }
                                                    if (
                                                        (pageNum === currentPage - 3 && pageNum > 1) ||
                                                        (pageNum === currentPage + 3 && pageNum < totalPages)
                                                    ) {
                                                        return <span key={pageNum} className="px-2 self-center">...</span>;
                                                    }
                                                    return null;
                                                })}
                                            </div>

                                            {currentPage < totalPages && (
                                                <Link
                                                    href={`/location?division_id=${divisionId || ''}&district_id=${districtId || ''}&page=${currentPage + 1}`}
                                                    className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-[#003366] font-bold transition-colors"
                                                >
                                                    পরবর্তী
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/4">
                            <div className="sticky top-6">
                                <h2 className="text-xl md:text-2xl font-bold text-red-600 border-b-2 border-red-600 pb-1 mb-4">
                                    সর্বশেষ
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {latestNews?.map((news) => (
                                        <Link key={news.id} href={`/news/${news.slug}`} className="flex gap-3 group border-b border-gray-200 pb-4 last:border-0 hover:bg-gray-50 p-2 rounded transition-colors">
                                            <div className="flex-1">
                                                <h4 className="text-base md:text-xl font-bold text-gray-800 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                                                    {news?.name}
                                                </h4>
                                                <p className="text-sm md:text-base text-gray-500 mt-1 line-clamp-1">
                                                    {truncate(news?.description || '')}
                                                </p>
                                            </div>
                                            <div className="relative w-16 h-16 flex-shrink-0">
                                                <Image
                                                    src={news?.featured_image}
                                                    alt={news?.name}
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
