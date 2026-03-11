import Container from '@/components/common/Container';
import { getVideoNews } from '@/lib/fetchData';
import Link from 'next/link';
import Image from 'next/image';
import { getYoutubeThumbnail } from '@/utils/youtube';
import { formatBengaliDate } from '@/utils/formatDate';

export const metadata = {
    title: 'ভিডিও নিউজ | বাংলা স্টার নিউজ',
    description: 'দেশের সর্বশেষ ভিডিও সংবাদ ও প্রতিবেদন',
};

const toBanglaNumber = (n) => {
    const banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n?.toString().split('').map(digit => banglaNumbers[digit] || digit).join('') || '০';
};

export default async function VideoListPage({ searchParams }) {
    const sParams = await searchParams;
    const currentPage = parseInt(sParams.page) || 1;
    const perPage = 12;

    const response = await getVideoNews(currentPage, perPage);
    const videoNews = response?.data || [];
    const meta = response?.meta || {};
    const totalPages = meta.last_page || 1;

    return (
        <div className="flex flex-col min-h-screen bg-[#eff3f6]">


            <main className="py-12">
                <Container>
                    <div className="flex items-center justify-between border-b border-red-600 pb-6 mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-secondary">
                            <span className="w-2 h-10 bg-red-600"></span>
                            ভিডিও নিউজ আর্কাইভ
                        </h1>
                        <span className="text-gray-500 text-base  lg:text-lg font-medium">{toBanglaNumber(meta.total || videoNews.length)} টি ভিডিও পাওয়া গেছে</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                        {videoNews.map((video) => {
                            // Extract video URL from extra_fields
                            const videoUrl = video.extra_fields?.find(f => f.meta_name === 'video_url')?.meta_value || "";

                            return (
                                <Link key={video.id} href={`/video/${video.slug}`} className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
                                        <Image
                                            src={getYoutubeThumbnail(videoUrl)}
                                            alt={video.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-red-600 bg-opacity-90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-red-600 text-xs font-bold uppercase tracking-wider">
                                                {video.main_category?.name || "ভিডিও"}
                                            </span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-400 text-xs font-medium">
                                                {formatBengaliDate(video.created_at)}
                                            </span>
                                        </div>
                                        <h3 className="text-gray-900 text-lg md:text-xl font-bold line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                                            {video.name}
                                        </h3>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center items-center gap-2">
                            {currentPage > 1 && (
                                <Link
                                    href={`/video?page=${currentPage - 1}`}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-[#003366] font-bold"
                                >
                                    পূর্ববর্তী
                                </Link>
                            )}

                            <div className="flex gap-1">
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
                                                href={`/video?page=${pageNum}`}
                                                className={`w-10 h-10 flex items-center justify-center border rounded font-bold ${currentPage === pageNum
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
                                        return <span key={pageNum} className="px-2">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            {currentPage < totalPages && (
                                <Link
                                    href={`/video?page=${currentPage + 1}`}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 text-[#003366] font-bold"
                                >
                                    পরবর্তী
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Empty State */}
                    {videoNews.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-xl border-2 border-dashed border-slate-300">
                            <p className="text-gray-500 text-xl font-medium">কোনো ভিডিও সংবাদ পাওয়া যায়নি।</p>
                        </div>
                    )}
                </Container>
            </main>


        </div>
    );
}
