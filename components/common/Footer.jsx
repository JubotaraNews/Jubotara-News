import Link from "next/link";
import Logo from "./Header/Logo";
import Container from "./Container";
import { getSettings } from "@/lib/localData";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = async () => {
  const currentYear = new Date().getFullYear();
  const settings = await getSettings();

  return (
    <footer className="bg-white text-black pt-16 pb-4 mt-12 border-t border-gray-100">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 xl:gap-12">
          {/* About */}
          <div className="space-y-3 md:space-y-6">
            <div className="flex p-1.5 w-fit">
              <Logo logoUrl={settings.site_logo} />
            </div>
            <div className="text-gray-700 text-base md:text-xl lg:text-xl leading-relaxed whitespace-pre-line">
              {settings.about_text ||
                "বাংলাদেশের অন্যতম নির্ভরযোগ্য অনলাইন সংবাদ মাধ্যম।"}
            </div>
            <div className="flex items-center gap-4">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 rounded-full"
                >
                  <FaFacebookF size={18} />
                </a>
              )}
              {settings.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 rounded-full"
                >
                  <FaTwitter size={18} />
                </a>
              )}
              {settings.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 rounded-full"
                >
                  <FaYoutube size={18} />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 rounded-full"
                >
                  <FaInstagram size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:space-y-6">
            <h3 className="text-base md:text-xl  font-bold border-l-4 border-primary pl-3 text-gray-800 ">
              বিভাগসমূহ
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-base md:text-lg lg:text-xl text-gray-700 ">
              <li>
                <Link
                  href="/category/national"
                  className="hover:text-primary transition-colors"
                >
                  জাতীয়
                </Link>
              </li>
              <li>
                <Link
                  href="/category/politics"
                  className="hover:text-primary transition-colors"
                >
                  রাজনীতি
                </Link>
              </li>
              <li>
                <Link
                  href="/category/international"
                  className="hover:text-primary transition-colors"
                >
                  আন্তর্জাতিক
                </Link>
              </li>
              <li>
                <Link
                  href="/category/sports"
                  className="hover:text-primary transition-colors"
                >
                  খেলা
                </Link>
              </li>
              <li>
                <Link
                  href="/category/entertainment"
                  className="hover:text-primary transition-colors"
                >
                  বিনোদন
                </Link>
              </li>
              <li>
                <Link
                  href="/category/lifestyle"
                  className="hover:text-primary transition-colors"
                >
                  লাইফস্টাইল
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3 md:space-y-6">
            <h3 className="text-base md:text-xl font-bold border-l-4 border-primary pl-3 text-gray-800">
              প্রতিষ্ঠান
            </h3>
            <ul className="space-y-2 text-base md:text-lg lg:text-xl text-gray-700 ">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="hover:text-primary transition-colors"
                >
                  আমাদের টিম
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  যোগাযোগ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  গোপনীয়তা নীতি
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  ব্যবহারের শর্তাবলী
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 md:space-y-6">
            <h3 className="text-base md:text-xl font-bold border-l-4 border-primary pl-3 text-gray-800">
              যোগাযোগ
            </h3>
            <div className="text-base md:text-lg lg:text-xl text-gray-700 space-y-2">
              {settings.address && <p>{settings.address}</p>}
              {settings.phone && <p>ফোন: {settings.phone}</p>}
              {settings.email && <p>ইমেইল: {settings.email}</p>}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-3 pt-4 border-t border-gray-200 text-center text-base md:text-lg text-gray-700 ">
          <p>© {currentYear} যুবতারা নিউজ | সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
