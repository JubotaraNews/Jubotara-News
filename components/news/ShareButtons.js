'use client';

import { useState, useEffect } from 'react';
import {  Link2, Check } from 'lucide-react';

const ShareButtons = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  const [absoluteUrl, setAbsoluteUrl] = useState('');

  useEffect(() => {
    // Check if the URL is already absolute
    if (url.startsWith('http')) {
      setAbsoluteUrl(url);
    } else {
      setAbsoluteUrl(`${window.location.origin}${url}`);
    }
  }, [url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12.06c0-5.52-4.47-10-10-10s-10 4.48-10 10c0 4.99 3.65 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33v6.99C18.35 21.18 22 17.05 22 12.06z" />
        </svg>
      ),
      color: 'text-gray-500 hover:text-[#1877F2] hover:border-[#1877F2]',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl)}`,
    },
    {
      name: 'X',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      ),
      color: 'text-gray-500 hover:text-black hover:border-black',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(absoluteUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      color: 'text-gray-500 hover:text-[#25D366] hover:border-[#25D366]',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + absoluteUrl)}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 py-2">
      <div className="flex items-center gap-3">
        {/* <span className="text-gray-400 font-bold hidden sm:flex items-center gap-1.5 text-xs uppercase tracking-widest">
          <Share2 className="w-4 h-4" /> শেয়ার
        </span> */}
        <div className="flex items-center gap-2">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-9 h-9 rounded-full border border-slate-300 bg-transparent flex items-center justify-center transition-all duration-300 hover:-translate-y-1 transform ${link.color}`}
              title={link.name}
            >
              {link.icon}
            </a>
          ))}

          <button
            onClick={handleCopy}
            className={`group relative flex items-center justify-center w-9 h-9 rounded-full border border-slate-300 bg-white text-gray-500 shadow-sm transition-all duration-300 hover:border-primary hover:text-primary ${copied ? 'bg-primary border-primary text-white' : ''
              }`}
            title="লিঙ্ক কপি করুন"
          >
            {copied ? <Check className="w-5 h-5 text-white" /> : <Link2 className="w-5 h-5" />}
            {copied && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
                কপি করা হয়েছে!
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareButtons;
