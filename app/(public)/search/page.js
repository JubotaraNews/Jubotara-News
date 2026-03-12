import { searchNews, getTrandingNews } from '@/lib/localData';
import Container from '@/components/common/Container';
import Link from 'next/link';
import Image from 'next/image';
import truncate from '@/utils/truncate';
import { FRONT_END_URL } from '@/utils/baseUrl';

const toBanglaNumber = (n) => {
    const banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n.toString().split('').map(digit => banglaNumbers[digit] || digit).join('');
};

export async function generateMetadata({ searchParams }) {
    const sParams = await searchParams;
    const query = sParams.q || '';
    const siteUrl = FRONT_END_URL;
    const title = `অনুসন্ধান: ${query} | বাংলা স্টার নিউজ`;
    const description = `বাংলা স্টার নিউজে "${query}" অনুসন্ধান করুন। ব্রেকিং নিউজ এবং সর্বশেষ সংবাদ।`;

    return {
        title,
        description,
        metadataBase: new URL(siteUrl),
        openGraph: {
            title,
            description,
            url: `${siteUrl}/search?q=${query}`,
            siteName: 'বাংলা স্টার নিউজ',
            locale: 'bn_BD',
            type: 'website',
        },
    };
}

export default async function SearchPage({ searchParams }) {
    const sParams = await searchParams;
    const query = sParams.q || '';
    const results = await searchNews(query);
    const trendingNews = await getTrandingNews();

    return (
        <div className="flex flex-col min-h-screen bg-[#eff3f6]">


            <main className="py-6 px-2">
                <Container>
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-3/4">
                            <div className="mb-4 p-6 bg-white/70 border border-gray-200 shadow-sm rounded-lg">
                                <h1 className="text-2xl md:text-3xl font-bold text-[#003366]">
                                    অনুসন্ধান ফলাফল: <span className="text-red-600">&quot;{query}&quot;</span>
                                </h1>
                                <p className="text-gray-500 mt-2 text-base md:text-xl font-medium">
                                    মোট <span className="text-red-600 font-bold">{toBanglaNumber(results.length)}</span> টি সংবাদ পাওয়া গেছে।
                                </p>
                            </div>

                            {results?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 md:gap-4">
                                    {results?.map((news) => (
                                        <Link
                                            key={news.id}
                                            href={`/news/${news.slug}`}
                                            className="flex gap-4 group bg-white/70 border border-gray-200 p-4 hover:bg-gray-50 transition-all rounded-lg shadow-sm"
                                        >
                                            <div className="flex-1">
                                                <h3 className="text-base md:text-xl font-bold text-gray-800 leading-tight group-hover:text-red-600
                                                 transition-colors line-clamp-2">
                                                    {news.name}
                                                </h3>
                                                <p className="text-base md:text-xl text-gray-500 mt-1 line-clamp-2">
                                                    {truncate(news?.description, 150)}
                                                </p>
                                            </div>
                                            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
                                                <Image
                                                    src={news?.featured_image || '/placeholder.png'}
                                                    alt={news?.name}
                                                    fill
                                                    className="object-cover rounded-md"
                                                />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white p-12 text-center shadow-sm rounded-lg border border-gray-200">
                                    <div className="text-7xl mb-6">🔍</div>
                                    <h2 className="text-2xl font-bold text-gray-800">কোনো ফলাফল পাওয়া যায়নি!</h2>
                                    <p className="text-gray-500 mt-3 text-lg">অনুগ্রহ করে ভিন্ন কিছু দিয়ে অনুসন্ধান করুন।</p>
                                    <Link href="/" className="mt-8 inline-block bg-[#003366] text-white px-8 py-3 rounded-full font-bold hover:bg-[#002244] transition-all">
                                        হোমে ফিরে যান
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="lg:w-1/4">
                            <div className="sticky top-6">
                                <h2 className="text-xl md:text-2xl font-bold text-red-600 border-b-2 border-red-600 pb-2 mb-6">
                                    ট্রেন্ডিং সংবাদ
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {trendingNews?.slice(0, 5).map((news) => (
                                        <Link key={news.id} href={`/news/${news.slug}`} className="flex gap-3 group border-b border-gray-100 pb-4 last:border-0">
                                            <div className="flex-1">
                                                <h4 className="text-base md:text-xl font-bold text-gray-600 leading-tight group-hover:text-red-600
                                                 transition-colors line-clamp-2">
                                                    {news.name}
                                                </h4>
                                            </div>
                                            <div className="relative w-16 h-16 flex-shrink-0">
                                                <Image
                                                    src={news.featured_image || news.image}
                                                    alt={news.name}
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
