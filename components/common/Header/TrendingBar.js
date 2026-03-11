"use client";

import Link from "next/link";
import Container from "../Container.jsx";
import { TrendingUp } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const TrendingBar = ({ trendingTags }) => {
  return (
    <div className=" py-3.5">
      <Container>
        <div className="flex items-center gap-4">

          {/* Left Title */}
          <div className="flex items-center gap-2 shrink-0 bg-red-100 px-3 md:px-4 py-0.5">
            <span className="text-[#EE1D23] font-black text-[15px] sm:text-base md:text-lg ">
              ট্রেন্ডিং
            </span>
            <TrendingUp
              size={16}
              className="text-[#EE1D23]"
            //   strokeWidth={2.5}
            />
          </div>



          {/* Swiper Slider */}
          <div className=" overflow-hidden">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={8}
              slidesPerView="auto"
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              className="!overflow-visible"
            >
              {trendingTags?.map((topic) => (
                <SwiperSlide
                  key={topic.id}
                  className="!w-auto "
                >
                  <Link
                    href={`/category/${topic?.slug}`}
                    className="text-[#003366] font-black text-[15px] sm:text-base md:text-lg hover:text-[#EE1D23] transition-colors
                     uppercase   bg-gray-200 px-3 md:px-4 py-1"
                  >
                    {topic?.name}
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default TrendingBar;