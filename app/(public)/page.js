import React from "react";
import CountryWideSection from "@/components/home/CountryWideSection";
import SpecialCategorySection from "@/components/home/SpecialCategorySection";
import Container from "@/components/common/Container.jsx";
import PremiumCategoryBlock from "@/components/home/PremiumCategoryBlock.jsx";
import TrendingNewsSection from "@/components/home/TrendingNewsSection.jsx";
import ThumbnailNewsSection from "@/components/home/ThumbnailNewsSection";
import TrendingBar from "@/components/common/Header/TrendingBar";
import HeronNewsSection from "@/components/home/HeronNewsSection";
import VideoSection from "@/components/home/VideoSection";
import { getNewsByCat, getTrendingTags, getVideoNews } from "@/lib/localData";

export const revalidate = 60;

export default async function Home() {
  const [
    trendingTags,
    politicsNews,
    nationalNews,
    crimeNews,
    lifestyleNews,
    sportsNews,
    saraDeshNews,
    videoNewsResponse,
    internationalNews,
    entertainmentNews,
    economyNews,
    educationNews,
    arrestNews,
  ] = await Promise.all([
    getTrendingTags(),
    getNewsByCat("রাজনীতি", 7),
    getNewsByCat("জাতীয়", 10),
    getNewsByCat("অপরাধ", 10),
    getNewsByCat("জীবনযাপন", 10),
    getNewsByCat("খেলা", 7),
    getNewsByCat("সারাদেশ", 7),
    getVideoNews(1, 4),
    getNewsByCat("আন্তর্জাতিক", 10),
    getNewsByCat("বিনোদন", 10),
    getNewsByCat("অর্থনীতি", 10),
    getNewsByCat("শিক্ষা", 10),
    getNewsByCat("গ্রেপ্তার", 10),
  ]);

  const politicsFirstNews = politicsNews[0];
  const politicsSideNews = politicsNews.slice(1, 7);

  const nationalFirstNews = nationalNews[0];
  const nationalSideNews = nationalNews.slice(1, 7);

  const saradeshFirstNews = saraDeshNews[0];
  const saradeshSideNews = saraDeshNews.slice(1, 7);

  const videoNews = videoNewsResponse?.data || [];

  return (
    <div className=" min-h-screen">
      <Container>
        <div className="h-32 bg-gray-100 dark:bg-[#1e1e1e] border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center font-bold text-gray-400 dark:text-gray-500 mt-2">
          ADVERTISEMENT
        </div>
      </Container>

      <TrendingBar trendingTags={trendingTags} />

      <main className="pb-12 space-y-4">
        <HeronNewsSection />
        <TrendingNewsSection />

        <ThumbnailNewsSection
          title={"এক্সক্লুসিভ"}
          news={lifestyleNews}
          slug={"lifestyle"}
        />

        <SpecialCategorySection
          title="রাজনীতি"
          firstNews={politicsFirstNews}
          sideNews={politicsSideNews}
          slug={"রাজনীতি"}
        />

        <Container>
          <div className=" h-32 bg-gray-100 dark:bg-[#1e1e1e] border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center font-bold text-gray-400 dark:text-gray-500">
            ADVERTISEMENT
          </div>
        </Container>

        <CountryWideSection
          title="সারাদেশ"
          featureNews={saradeshFirstNews}
          gridNews={saradeshSideNews}
          slug={"সারাদেশ"}
        />

        <VideoSection videos={videoNews} />

        {nationalFirstNews && (
          <SpecialCategorySection
            title="জাতীয়"
            firstNews={nationalFirstNews}
            sideNews={nationalSideNews}
            slug={"জাতীয়"}
          />
        )}

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4 xl:gap-6">
            <PremiumCategoryBlock
              title="আন্তর্জাতিক"
              news={internationalNews}
              slug={"আন্তর্জাতিক"}
            />
            <PremiumCategoryBlock
              title="খেলাধুলা"
              news={sportsNews}
              slug={"খেলা"}
            />
          </div>
        </Container>

        <Container>
          <div className=" h-32 bg-gray-100 dark:bg-[#1e1e1e] border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center font-bold text-gray-400 dark:text-gray-500">
            ADVERTISEMENT
          </div>
        </Container>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <PremiumCategoryBlock
              title="অপরাধ"
              news={crimeNews}
              vertical={true}
              slug={"অপরাধ"}
            />
            <PremiumCategoryBlock
              title="বিনোদন"
              news={entertainmentNews}
              vertical={true}
              slug={"বিনোদন"}
            />
            <PremiumCategoryBlock
              title="অর্থনীতি"
              news={economyNews}
              vertical={true}
              slug={"অর্থনীতি"}
            />
          </div>
        </Container>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4 xl:gap-6">
            <PremiumCategoryBlock
              title="শিক্ষা"
              news={educationNews}
              slug={"শিক্ষা"}
            />
            <PremiumCategoryBlock
              title="গ্রেপ্তার"
              news={arrestNews}
              slug={"গ্রেপ্তার"}
            />
          </div>
        </Container>
      </main>
    </div>
  );
}
