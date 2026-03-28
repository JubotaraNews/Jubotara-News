import Logo from "./Logo";
import Navbar from "./Navbar";
import Container from "../Container.jsx";
import HeaderActions from "./HeaderActions.jsx";
import BreakingNews from "@/components/common/Header/BreakingNews";
import { getBreakingNews, getSettings, getNavbarItems } from "@/lib/localData";

const Header = async () => {
  const [breakingNews, news_categories, settings] = await Promise.all([
    getBreakingNews(),
    getNavbarItems(),
    getSettings(),
  ]);

  const logoUrl = settings.site_logo;
  // console.log("logo", logo)

  return (
    <header className="w-full sticky top-0 z-[100] shadow-sm bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md">
      {/* Top Thick Red Bar (Matching Fox style) */}

      {/* Main Section with Logo and Nav items */}
      <div className="text-black dark:text-white py-1 border-b border-gray-100 dark:border-gray-800">
        <Container className="flex items-center justify-between min-h-12.5">
          <div className="flex items-start pt-2">
            {/* Logo Container */}
            <div className="relative">
              <Logo logoUrl={logoUrl} />
            </div>

            {/* Empty spacer for the logo on desktop */}
            <div className="w-10 lg:w-5 hidden md:block"></div>

            {/* Navigation Items (Managed by Navbar now) */}
            <Navbar news_categories={news_categories} settings={settings} />
          </div>
          <HeaderActions />
        </Container>
      </div>

      {/* Row 2 Breakeing news */}
      <BreakingNews news={breakingNews} />
      {/* <TrendingBar /> */}
    </header>
  );
};

export default Header;
