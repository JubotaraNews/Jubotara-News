'use client';

import { useEffect } from 'react';
import Container from '@/components/common/Container';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-[#eff3f6] dark:bg-[#121212]">
            <Container>
                <div className="text-center space-y-6 py-20">
                    <div className="flex justify-center">
                        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            দুঃখিত, কোনো সমস্যা হয়েছে!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-md mx-auto">
                            সাময়িকভাবে তথ্য লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।
                        </p>
                    </div>
                    <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => reset()}
                            className="inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-[#003366] rounded-md hover:bg-[#002244] transition-colors shadow-lg"
                        >
                            আবার চেষ্টা করুন
                        </button>
                        <a
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-[#003366] dark:text-blue-400 bg-white dark:bg-gray-800 border border-[#003366] dark:border-blue-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                        >
                            হোমে ফিরে যান
                        </a>
                    </div>
                </div>
            </Container>
        </div>
    );
}
