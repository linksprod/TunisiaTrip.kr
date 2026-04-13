
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { TranslateText } from '@/components/translation/TranslateText';
import { Building2, Waves, Sun } from 'lucide-react';

export const CitiesContent = () => {
    const { currentLanguage, updateKey } = useTranslation();
    
    const cities = [
        {
            name: "Tunis",
            nameKR: "튀니스",
            description: "Capital city, blend of history and modernity",
            descriptionKR: "수도, 역사와 현대의 조화",
            icon: Building2,
            color: "from-blue-500 to-blue-600"
        },
        {
            name: "Sousse",
            nameKR: "수스",
            description: "Coastal city with beautiful beaches",
            descriptionKR: "해안 도시, 아름다운 해변",
            icon: Waves,
            color: "from-cyan-500 to-blue-500"
        },
        {
            name: "Tozeur",
            nameKR: "토제르",
            description: "Gateway to the Sahara",
            descriptionKR: "사하라의 관문",
            icon: Sun,
            color: "from-orange-500 to-yellow-500"
        }
    ];

    return (
        <div id="cities" className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300" data-section="cities">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                <h2 
                    className="text-2xl md:text-3xl font-bold text-gray-800"
                    style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
                >
                    <TranslateText 
                        text="Cities of Tunisia"
                        language={currentLanguage}
                    />
                </h2>
            </div>
            
            <div className="space-y-6">
                <div className="text-gray-700 leading-relaxed space-y-4">
                    <p style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}>
                        <TranslateText 
                            text="Tunisia offers a variety of cities, each with its own unique charm. Tunis, the capital city, is a blend of ancient ruins and modern amenities."
                            language={currentLanguage}
                        />
                    </p>
                    <p style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}>
                        <TranslateText 
                            text="The coastal city of Sousse is known for its beautiful beaches and historic medina. Tozeur, the gateway to the Sahara Desert, offers unique desert landscapes and traditional architecture."
                            language={currentLanguage}
                        />
                    </p>
                </div>

                {/* City Cards - Korean style interactive elements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {cities.map((city, index) => {
                        const Icon = city.icon;
                        return (
                            <div 
                                key={index}
                                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${city.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                <div className="relative p-5">
                                    <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${city.color} text-white mb-3`}>
                                        <Icon size={20} />
                                    </div>
                                    <h3 
                                        className="font-bold text-lg text-gray-800 mb-2"
                                        style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
                                    >
                                        <TranslateText 
                                            text={city.name}
                                            language={currentLanguage}
                                        />
                                    </h3>
                                    <p 
                                        className="text-sm text-gray-600"
                                        style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
                                    >
                                        <TranslateText 
                                            text={city.description}
                                            language={currentLanguage}
                                        />
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
