"use client";
import React, { useEffect, useState } from 'react';
import Container from '@/components/common/Container';
import Image from 'next/image';

// Member card component
function MemberCard({ member, size = 'normal' }) {
    const isLarge = size === 'large';
    const cardWidth = isLarge ? 'w-[160px] md:w-[200px]' : 'w-[120px] md:w-[180px]';
    const imageHeight = isLarge ? 'h-[180px] md:h-[220px]' : 'h-[140px] md:h-[200px]';

    return (
        <div className={`${cardWidth} flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300`}>
            <div className={`relative ${cardWidth} ${imageHeight} border-2 border-slate-300 bg-gray-100 overflow-hidden rounded-sm`}>
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 120px, 150px"
                />
            </div>
            <div className="mt-2 text-center w-full">
                <h3 className="text-sm md:text-base lg:text-lg font-bold text-gray-900 leading-tight">{member.name}</h3>
                <p className="text-xs md:text-sm lg:text-base text-gray-600 leading-tight mt-0.5">{member.designation}</p>
            </div>
        </div>
    );
}

// Section header component
function SectionHeader({ title }) {
    return (
        <div className="flex justify-center mb-6 mt-10">
            <div className="relative">
                <div className="bg-gradient-to-r from-[#1a3a5c] via-[#1e4d7b] to-[#1a3a5c] text-white px-8 md:px-16 py-2.5 text-lg md:text-xl font-bold text-center rounded-sm shadow-md">
                    {title}
                </div>
                {/* Decorative triangle at bottom */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#1e4d7b]"></div>
            </div>
        </div>
    );
}

export default function TeamPage() {
    const [teamData, setTeamData] = useState({ head: null, sections: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch('/api/team');
                const data = await res.json();
                if (res.ok && data.success) {
                    const members = data.members;
                    
                    // Identify head
                    const head = members.find(m => m.isHead);
                    
                    // Group by section (excluding the head member)
                    const sectionsMap = {};
                    members.forEach(m => {
                        if (m.isHead) return;
                        
                        if (!sectionsMap[m.section]) {
                            sectionsMap[m.section] = [];
                        }
                        sectionsMap[m.section].push(m);
                    });

                    // Convert map to array of sections in a specific order if needed, 
                    // or just use the order from the enum
                    const sectionOrder = [
                        'পৃষ্ঠপোষক',
                        'উপদেষ্টা পরিষদ', 
                        'সম্পাদনা বিভাগ', 
                        'রিপোর্টিং বিভাগ', 
                        'ফটো ও ভিডিও বিভাগ', 
                        'অনলাইন বিভাগ', 
                        'জেলা প্রতিনিধি', 
                        'উপজেলা প্রতিনিধি'
                    ];

                    const sections = sectionOrder.map(title => ({
                        title,
                        members: sectionsMap[title] || []
                    })).filter(s => s.members.length > 0);

                    setTeamData({ head, sections });
                }
            } catch (err) {
                console.error("Failed to fetch team:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#eff3f6]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <main className="bg-[#eff3f6] py-6 md:py-10">
            <Container>
                <div className='flex flex-col items-center'>
                    <span className="text-center text-4xl font-bold text-gray-900 mb-10 pb-2 border-b border-gray-400">আমাদের পরিবার</span>
                    
                    {/* Head / Chief Section */}
                    {teamData.head && (
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-[180px] md:w-[220px] h-[210px] md:h-[260px] border-3 border-primary bg-gray-100 overflow-hidden rounded-sm shadow-lg">
                                <Image
                                    src={teamData.head.image}
                                    alt={teamData.head.name}
                                    fill
                                    className="object-cover"
                                    sizes="220px"
                                    priority
                                />
                            </div>
                            <div className="mt-3 text-center">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{teamData.head.name}</h2>
                                <p className="text-base md:text-lg text-primary font-semibold">{teamData.head.designation}</p>
                            </div>
                        </div>
                    )}

                    {/* Divider line */}
                    {teamData.head && teamData.sections.length > 0 && (
                        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4"></div>
                    )}

                    {/* Team Sections */}
                    {teamData.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-8 w-full flex flex-col items-center">
                            <SectionHeader title={section.title} />

                            {/* Members grid */}
                            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6">
                                {section.members.map((member, memberIndex) => (
                                    <MemberCard
                                        key={memberIndex}
                                        member={member}
                                        size="normal"
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    {!teamData.head && teamData.sections.length === 0 && (
                        <div className="py-20 text-gray-500">কোন সদস্য পাওয়া যায়নি।</div>
                    )}
                </div>
            </Container>
        </main>
    );
}
