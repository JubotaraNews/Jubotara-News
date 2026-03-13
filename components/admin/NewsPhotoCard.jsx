"use client";

import React, { useState, useEffect, useRef } from "react";

const NewsPhotoCard = ({ 
  headline, 
  category, 
  imageSrc, 
  logoUrl, 
  date, 
  commentText = "বিস্তারিত কমেন্টে",
  accentColor = "#D9232D",
  imageScale = 1,
  isPreview = false,
  cardRef 
}) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!isPreview) return;

    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(containerWidth / 1080);
      }
    };

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    updateScale();
    return () => observer.disconnect();
  }, [isPreview]);

  const cardContent = (

    <div
      ref={isPreview ? null : cardRef}
      className="gradient-news-theme"
      style={{
        width: "1080px",
        height: "1080px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-solaiman-lipi), sans-serif",
        backgroundColor: "#000",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <img
          src={imageSrc}
          alt="Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: `scale(${imageScale})`,
            transition: "transform 0.2s ease-out",
          }}
          crossOrigin="anonymous"
        />
      </div>

      {/* Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "60%",
          background: `linear-gradient(to top, ${accentColor} 0%, transparent 100%)`,
          zIndex: 2,
        }}
      />

      {/* Top Logo Section */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "50px",
          zIndex: 10,
          width: "165px",
          height: "240px",
          backgroundColor: accentColor,
          borderBottomRightRadius: "80px",
          borderBottomLeftRadius: "80px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "25px",
        }}
      >
        <div
          style={{
            width: "135px",
            height: "130px",
            borderRadius: "50%",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "4px solid white",
          }}
        >
          <img
            src={logoUrl || "/images/logo4.png"}
            alt="Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "10px",
            }}
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {/* Content Section */}
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          left: 0,
          width: "100%",
          padding: "0 60px 40px 60px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: "25px",
          }}
        >
          <div
            style={{
              width: "10px",
              backgroundColor: "#facc15",
              flexShrink: 0,
              borderRadius: "2px",
            }}
          />
          <h1
            style={{
              fontSize: "60px",
              lineHeight: "1.2",
              fontWeight: "800",
              margin: 0,
              color: "white",
              textShadow: "0 4px 12px rgba(0,0,0,0.8)",
            }}
          >
            {headline}
          </h1>
        </div>
      </div>

      {/* Footer Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "80px",
          backgroundColor: accentColor,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          padding: "0 60px",
          fontSize: "24px",
        }}
      >
        {/* Left: Category | Date */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "15px",
            fontWeight: "600",
          }}
        >
          <span style={{ textTransform: "uppercase" }}>{category}</span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span>{date}</span>
        </div>

        {/* Center: Details in Comment */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "28px",
          }}
        >
          <span>{commentText}</span>
        </div>

        {/* Right: Domain */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            fontWeight: "700",
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
          <span>jubotaranews.com</span>
        </div>
      </div>
    </div>
  );

  if (isPreview) {
    return (
      <div
        ref={containerRef}
        className="preview-container"
        style={{
          width: "100%",
          maxWidth: "400px",
          aspectRatio: "1/1",
          overflow: "hidden",
          position: "relative",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            width: "1080px",
            height: "1080px",
            position: "absolute",
            top: 0,
          }}
        >
          {cardContent}
        </div>
      </div>
    );
  }

  return <div className="absolute -left-[9999px] top-0">{cardContent}</div>;
};

export default NewsPhotoCard;
