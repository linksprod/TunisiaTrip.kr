
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { TranslateText } from '@/components/translation/TranslateText';
import { Music, Palette, Scroll, Star } from 'lucide-react';

export const CultureContent = () => {
    const { currentLanguage, updateKey } = useTranslation();
    
    const culturalElements = [
        {
            icon: Music,
            title: "Music",
            desc: "Traditional music & dance",
            color: "text-purple-600"
        },
        {
            icon: Palette,
            title: "Art",
            desc: "Mosaics & ceramics",
            color: "text-blue-600"
        },
        {
            icon: Scroll,
            title: "Literature",
            desc: "Rich literary tradition",
            color: "text-green-600"
        },
        {
            icon: Star,
            title: "Festivals",
            desc: "Year-round celebrations",
            color: "text-orange-600"
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                <h2 
                    className="text-2xl md:text-3xl font-bold text-gray-800"
                    style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
                >
                    <TranslateText 
                        text="Culture of Tunisia"
                        language={currentLanguage}
                        key={`culture-title-${updateKey}`}
                    />
                </h2>
            </div>
            
            <div className="space-y-6">
                <div className="text-gray-700 leading-relaxed space-y-4">
                    <p style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}>
                        <TranslateText 
                            text="Tunisian culture is a rich tapestry of Berber, Arab, Ottoman, and European influences. This is evident in its music, art, and literature."
                            language={currentLanguage}
                            key={`culture-p1-${updateKey}`}
                        />
                    </p>
                    <p style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}>
                        <TranslateText 
                            text="Traditional music and dance play a significant role in festivals and celebrations, while intricate mosaics and ceramics showcase the beauty of Tunisian craftsmanship."
                            language={currentLanguage}
                            key={`culture-p2-${updateKey}`}
                        />
                    </p>
                </div>

                {/* Cultural Elements Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {culturalElements.map((element, index) => {
                        const Icon = element.icon;
                        return (
                            <div 
                                key={index}
                                className="group relative p-4 rounded-xl bg-white border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
                            >
                                <div className={`inline-flex p-3 rounded-full bg-gray-100 ${element.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={20} />
                                </div>
                                <h3 
                                    className="font-bold text-sm text-gray-800 mb-1"
                                    style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
                                >
                                    <TranslateText 
                                        text={element.title}
                                        language={currentLanguage}
                                        key={`element-title-${index}-${updateKey}`}
                                    />
                                </h3>
                                <p 
                                    className="text-xs text-gray-600"
                                    style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
                                >
                                    <TranslateText 
                                        text={element.desc}
                                        language={currentLanguage}
                                        key={`element-desc-${index}-${updateKey}`}
                                    />
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
