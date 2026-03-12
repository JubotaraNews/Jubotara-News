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

export const dynamic = "force-dynamic";

export default async function Home() {
  const trendingTags = await getTrendingTags();

  const politicsNews = await getNewsByCat("বিজ্ঞাপন", 7);
  const politicsFirstNews = politicsNews[0];
  const politicsSideNews = politicsNews.slice(1, 7);

  const nationalNews = await getNewsByCat("national", 10);
  const crimeNews = await getNewsByCat("crime", 10);
  const lifestyleNews = await getNewsByCat("lifestyle", 10);
  const sportsNews = await getNewsByCat("sports", 7);
  const sportsFirstNews = sportsNews[0];
  const sportsSideNews = sportsNews.slice(1, 7);

  const saraDeshNews = await getNewsByCat("town_village", 7);
  const saradeshFirstNews = saraDeshNews[0];
  const saradeshSideNews = saraDeshNews.slice(1, 7);

  const videoNewsResponse = await getVideoNews(1, 4);
  const videoNews = videoNewsResponse?.data || [];

  const internationalNews = await getNewsByCat("আন্তর্জাতিক", 10);
  const entertainmentNews = await getNewsByCat("entertainment", 10);
  const economyNews = await getNewsByCat("economy", 10);

  return (
    <div className=" min-h-screen bg-[#eff3f6]">
      <Container>
        <div className=" h-32 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center font-bold text-gray-400">
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
          title="বিজ্ঞাপন"
          firstNews={politicsFirstNews}
          sideNews={politicsSideNews}
          slug={"politics"}
        />

        <Container>
          <div className=" h-32 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center font-bold text-gray-400">
            ADVERTISEMENT
          </div>
        </Container>

        <CountryWideSection
          title="সারাদেশ"
          featureNews={saradeshFirstNews}
          gridNews={saradeshSideNews}
          slug={"town_village"}
        />

        <VideoSection videos={videoNews} />

        {sportsFirstNews && (
          <SpecialCategorySection
            title="খেলাধুলা"
            firstNews={sportsFirstNews}
            sideNews={sportsSideNews}
            slug={"sports"}
          />
        )}

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4 xl:gap-6">
            <PremiumCategoryBlock
              title="জাতীয়"
              news={nationalNews}
              slug={"national"}
            />
            <PremiumCategoryBlock
              title="আন্তর্জাতিক"
              news={internationalNews}
              slug={"international"}
            />
          </div>
        </Container>

        <Container>
          <div className=" h-32 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center font-bold text-gray-400">
            ADVERTISEMENT
          </div>
        </Container>

        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <PremiumCategoryBlock
              title="অপরাধ"
              news={crimeNews}
              vertical={true}
              slug={"crime"}
            />
            <PremiumCategoryBlock
              title="বিনোদন"
              news={entertainmentNews}
              vertical={true}
              slug={"entertainment"}
            />
            <PremiumCategoryBlock
              title="অর্থনীতি"
              news={economyNews}
              vertical={true}
              slug={"economy"}
            />
          </div>
        </Container>
      </main>
    </div>
  );
}
