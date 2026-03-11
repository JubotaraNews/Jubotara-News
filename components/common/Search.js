
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Search = () => {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative group">
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-0 group-hover:w-64 focus:w-64 transition-all duration-300 bg-transparent border-b border-black text-black text-sm focus:outline-none placeholder-black/50 py-1"
                />
                <button type="submit" className="p-2 text-black hover:text-black/80 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </form>
    );
};

export default Search;

