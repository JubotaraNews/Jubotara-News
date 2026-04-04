/* eslint-disable @next/next/no-img-element -- photocard HTML template uses placeholder src strings */
import { formatBengaliDate } from "@/utils/formatDate";

const newsPhotoCard = (news) => {
  const formattedPublishedDate = formatBengaliDate(news?.created_at);
  const photocardTemplate = {
    accentColor: "#D9232D",
    bgColor: "#000000",
    textColor: "#ffffff",
    heading: news?.name || "নিউজ শিরোনাম",
    category: news?.category || "বিভাগ",
    date: formattedPublishedDate || "প্রকাশের তারিখ",
    domain: "jubotaranews.com",
    image:
      news?.featured_image ||
      "https://via.placeholder.com/800x450?text=No+Image",
    jsx: (
      <div
        className="template-wrapper gradient-news-theme"
        style={{
          "--accent": "{accentColor}",
          "--bg": "{bgColor}",
          "--text": "{textColor}",
          "--font": "'{font}'",
        }}
      >
        <div className="bg-container">
          <img src="{image}" alt="Background" className="bg-image" />
        </div>

        <div className="top-logo">
          <div className="logo-wrapper">
            <img src="{logo}" alt="" className="logo-img" />
          </div>
        </div>

        <div className="content-section">
          <div className="headline-container">
            <div className="vertical-bar"></div>
            <h1 className="heading">{heading}</h1>
          </div>
        </div>

        <div className="footer-bar">
          <div className="footer-left">
            <span className="category">{category}</span>
            <span className="separator">|</span>
            <span className="date">{date}</span>
          </div>
          <div className="footer-right">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-globe-icon lucide-globe"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span className="domain">{domain}</span>
          </div>
        </div>
        <div className="ad-container">
          <img src="{adImage}" alt="Ad" />
        </div>
      </div>
    ),
    css: `
      .template-wrapper.gradient-news-theme {
        width: 1080px;
        height: 1080px;
        position: relative;
        overflow: hidden;
        font-family: var(--font), sans-serif;
        background-color: var(--bg);
        color: white;
        display: flex;
        flex-direction: column;
      }

      .gradient-news-theme .bg-container {
        position: absolute;
        overflow: hidden;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }

      .gradient-news-theme .bg-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .gradient-news-theme .content-section::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 250%;
        background: linear-gradient(to top, var(--accent) 0%, transparent 100%);
        z-index: -1;
      }

      .gradient-news-theme .top-logo {
        position: absolute;
        top: 0;
        right: 50px;
        z-index: 10;
        width: 140px;
        height: 280px;
        background: white;
        border-bottom-right-radius: 65px;
        border-bottom-left-radius: 65px;
        display: flex;
        align-items: end;
        justify-content: center;
        background-color: var(--accent);
      }

      .gradient-news-theme .logo-wrapper {
        width: 130px;
        height: 130px;
        margin-bottom: 5px;
        border-radius: 50%;
        background-color: white;
        border: 1px solid white;
      }

      .gradient-news-theme .logo-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 50%;
        border: 4px solid white;
      }

      .gradient-news-theme .content-section {
        position: absolute;
        bottom: 100px; /* Height of footer */
        left: 0;
        width: 100%;
        padding: 0 60px 50px 60px;
        z-index: 10;
      }

      .gradient-news-theme .headline-container {
        display: flex;
        align-items: stretch;
        gap: 30px;
      }

      .gradient-news-theme .vertical-bar {
        width: 12px;
        background-color: #facc15; /* Yellow */
        flex-shrink: 0;
      }

      .gradient-news-theme .heading {
        font-size: 48px;
        line-height: 1.2;
        font-weight: 700;
        margin: 0;
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      }

      .gradient-news-theme .footer-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
        background-color: var(--accent);
        z-index: 10;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 60px;
        font-size: 32px;
      }

      .gradient-news-theme .footer-left {
        display: flex;
        align-items: center;
        gap: 20px;
        font-weight: 500;
      }

      .gradient-news-theme .separator {
        opacity: 0.7;
      }

      .gradient-news-theme .footer-right {
        display: flex;
        gap: 15px;
        font-weight: 600;
        align-items: center;
      }

      /* Ad support */
      .gradient-news-theme .ad-container {
        display: none;
      }

      .gradient-news-theme.has-ad .ad-container {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 120px;
        background: white;
        z-index: 20;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .gradient-news-theme.has-ad .footer-bar {
        bottom: 120px;
      }
      
      .gradient-news-theme.has-ad .content-section {
        bottom: 220px;
      }
    `,
  };

  return photocardTemplate;
};

export default newsPhotoCard;
