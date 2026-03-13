import Link from 'next/link';
import Image from 'next/image';
import Container from '../common/Container.jsx';
import { getYoutubeThumbnail } from '@/utils/youtube';

const VideoSection = ({ videos = [] }) => {
    if (!videos || videos.length === 0) return null;

    return (
        <section className="bg-[#3F3E37] py-12 my-8">
            <Container>
                <div className="flex items-center justify-between border-b border-gray-700 pb-6 mb-8">

                    <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3 text-white">
                        <span className="w-1.5 h-8 bg-secondary"></span>
                        ভিডিও নিউজ
                    </h2>
                    <Link href="/video" className="text-xl md:text-2xl font-semibold text-gray-300 flex items-center gap-2 hover:text-red-500 transition-colors">
                        সবগুলো দেখুন
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {videos?.slice(0, 4).map((video) => {
                        const videoUrl = video.youtubeUrl || "";

                        return (
                            <Link key={video._id} href={`/video/${video._id}`} className="group block">
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
                                    <Image
                                        src={getYoutubeThumbnail(videoUrl)}
                                        alt={video.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                    />
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 bg-opacity-90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                            <svg className="w-6 h-6 md:w-8 md:h-8 text-white fill-current" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>

                                </div>
                                <div className="mt-4">
                                    <h3 className="mt-1 text-gray-100 text-lg md:text-xl font-semibold line-clamp-2 leading-snug  transition-colors">
                                        {video.title}
                                    </h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
};

export default VideoSection;
