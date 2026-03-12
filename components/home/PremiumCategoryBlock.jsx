import truncate from '@/utils/truncate';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default function PremiumCategoryBlock({ title, news, vertical = false, slug }) {
  const firstNews = news[0];
  let others;
  if (vertical) {
    others = news.slice(1, 3)
  }
  else {
    others = news.slice(1, 6)
  }



  if (!news || news.length === 0) return null;
  const main = news[0];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-t-4 border-primary pt-3 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-secondary  ">{title}</h2>
        <Link href={`/category/${slug}`} className="text-xl md:text-2xl font-semibold text-secondary  flex items-center gap-1 hover:underline">
          আরও খবর
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </Link>
      </div>

      <div className={`${vertical ? 'flex flex-col gap-6' : 'grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6'}`}>
        {/* Main Item in Category */}
        <div className="space-y-2 group">
          <div className="relative h-48 md:h-60 w-full overflow-hidden">
            <Image src={firstNews?.featured_image} alt={firstNews?.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          <a href={`/news/${main.slug}`} className="block">
            <h3 className="text-gray-600 text-lg md:text-[22px] leading-[24px] md:leading-[26px] group-hover:text-primary font-semibold transition-colors line-clamp-2">
              {firstNews?.name}
            </h3>
          </a>

          <p className="text-gray-500 text-base md:text-xl line-clamp-2 leading-relaxed ">

            {truncate(firstNews?.description)}
          </p>

        </div>

        {/* Other Items in Category */}
        <div className="flex flex-col divide-y divide-gray-100">
          {others?.map(item => (
            <div
              key={item.id}>

              <Link
                href={`/news/${item?.slug}`} className="flex gap-2 md:gap-4 py-3 group first:pt-0">
                <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden">
                  <Image src={item?.featured_image} alt={item?.name} fill className="object-cover" />
                </div>
                <div className='space-y-1'>
                  <h4 className="text-gray-600 text-lg md:text-[22px] leading-[24px] md:leading-[26px] group-hover:text-primary font-semibold transition-colors line-clamp-2 ">
                    {item?.name}
                  </h4>
                  {/* <p className="text-gray-600 text-base md:text-xl leading-relaxed line-clamp-1">
                 {item.reporterInfo}               </p> */}
                </div>

              </Link>


            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
