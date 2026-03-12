import Container from '@/components/common/Container';
import { getSingleVideoNews, getVideoNews } from '@/lib/localData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getYoutubeId, getYoutubeThumbnail } from '@/utils/youtube';
import { formatBengaliDate } from '@/utils/formatDate';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const video = await getSingleVideoNews(slug);
    if (!video || !video.id) return { title: 'Not Found' };

    return {
        title: `${video.name} | ভিডিও নিউজ | বাংলা স্টার নিউজ`,
        description: video.meta_description || video.name,
    };
}

export default async function VideoDetailPage({ params }) {
    const { slug } = await params;
    const video = await getSingleVideoNews(slug);

    if (!video || !video.id) {
        notFound();
    }

    const videoNewsResponse = await getVideoNews(1, 10);
    const relatedVideos = videoNewsResponse?.data?.filter(v => v.slug !== slug).slice(0, 6) || [];

    // Extract video URL from extra_fields
    const videoUrl = video.extra_fields?.find(f => f.meta_name === 'video_url')?.meta_value || "";
    const videoId = getYoutubeId(videoUrl);

    return (
        <div className="flex flex-col min-h-screen bg-[#eff3f6]">


            <main className="py-6">
                <Container className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-4 md:p-6 rounded-sm shadow-sm border border-slate-300">
                            {/* Video Player Section */}
                            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black mb-6">
                                {videoId ? (
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                        title={video.name}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-white">
                                        ভিডিও লোড করা সম্ভব হচ্ছে না
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded">
                                        {video.main_category?.name || "ভিডিও"}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        {formatBengaliDate(video.created_at)}
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                    {video.name}
                                </h1>
                            </div>
                        </div>

                        {/* Description Section */}
                        {video.description && (
                            <div className="mt-8 bg-white p-6 rounded-sm shadow-sm border border-slate-300">
                                <h2 className="text-xl font-bold mb-4 border-b pb-2">বিস্তারিত</h2>
                                <div
                                    className="text-gray-700 leading-relaxed text-lg prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: video.description }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Related Videos */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* Ad Space */}
                        <div className="bg-gray-100 h-80 rounded-sm flex items-center justify-center border-2 border-dashed border-gray-300">
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">বিজ্ঞাপন / Advertisement</span>
                        </div>
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-300">
                            <h2 className="text-xl font-bold mb-6 border-b-2 border-red-600 pb-2 flex items-center gap-2">
                                <span className="w-2 h-6 bg-red-600 inline-block"></span>
                                সম্পর্কিত ভিডিও
                            </h2>
                            <div className="space-y-6">
                                {relatedVideos.map((item) => {
                                    const relatedVideoUrl = item.extra_fields?.find(f => f.meta_name === 'video_url')?.meta_value || "";

                                    return (
                                        <Link key={item.id} href={`/video/${item.slug}`} className="group flex gap-4">
                                            <div className="relative w-32 md:w-36 aspect-video flex-shrink-0 overflow-hidden rounded bg-gray-100">
                                                <Image
                                                    src={getYoutubeThumbnail(relatedVideoUrl)}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-red-600 bg-opacity-80 rounded-full flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
                                                    {item.name}
                                                </h3>
                                                <span className="text-xs text-gray-500 mt-1">{formatBengaliDate(item.created_at)}</span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                            <Link href="/video" className="block w-full mt-8 py-3 text-center text-red-600 font-bold border-2 border-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                সব ভিডিও দেখুন
                            </Link>
                        </div>
                    </aside>
                </Container>
            </main>
        </div>
    );
}
