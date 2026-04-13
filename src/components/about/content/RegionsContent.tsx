
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Mountain, Waves, TreePine, Sun } from 'lucide-react';

export const RegionsContent = () => {
    const { currentLanguage } = useTranslation();
    
    const regions = [
        {
            name: currentLanguage === "KR" ? "지중해 연안" : "Mediterranean Coast",
            description: currentLanguage === "KR" ? "무성한 녹지와 비옥한 농지" : "Lush greenery and fertile farmlands",
            icon: Waves,
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50"
        },
        {
            name: currentLanguage === "KR" ? "산악 지대" : "Mountain Regions",
            description: currentLanguage === "KR" ? "험준한 산과 전통 마을" : "Rugged mountains and traditional villages",
            icon: Mountain,
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50"
        },
        {
            name: currentLanguage === "KR" ? "내륙 평야" : "Interior Plains",
            description: currentLanguage === "KR" ? "고대 유적과 역사적 장소" : "Ancient ruins and historical sites",
            icon: TreePine,
            color: "from-amber-500 to-orange-500",
            bgColor: "bg-amber-50"
        },
        {
            name: currentLanguage === "KR" ? "사막 지역" : "Desert Regions",
            description: currentLanguage === "KR" ? "사하라 사막의 광활한 광활함" : "Vast expanses of the Sahara Desert",
            icon: Sun,
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-50"
        }
    ];

    return (
        <div id="regions" className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300" data-section="regions">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {currentLanguage === "KR" ? "튀니지 지역" : "Regions of Tunisia"}
                </h2>
            </div>
            
            <div className="space-y-6">
                <div className="text-gray-700 leading-relaxed space-y-4">
                    <p>
                        {currentLanguage === "KR"
                        ? "튀니지는 지중해 연안, 비옥한 평야, 험준한 산, 사막 지대 등 다양한 지역으로 나뉩니다. 각 지역은 고유한 풍경과 문화적 경험을 제공합니다."
                        : "Tunisia is divided into several distinct regions, including the Mediterranean coast, the fertile plains, the rugged mountains, and the desert regions. Each region offers its own unique landscapes and cultural experiences."
                        }
                    </p>
                    <p>
                        {currentLanguage === "KR"
                        ? "북쪽은 무성한 녹지와 비옥한 농지로 유명하며, 남쪽은 사하라 사막의 광활한 광활함을 특징으로 합니다. 내륙 지역은 고대 유적과 전통 마을을 제공합니다."
                        : "The north is known for its lush greenery and fertile farmlands, while the south is characterized by the vast expanses of the Sahara Desert. The interior regions offer ancient ruins and traditional villages."
                        }
                    </p>
                </div>

                {/* Regions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {regions.map((region, index) => {
                        const Icon = region.icon;
                        return (
                            <div 
                                key={index}
                                className={`group relative overflow-hidden rounded-xl ${region.bgColor} border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                            >
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${region.color} opacity-20 rounded-bl-full`}></div>
                                <div className="relative p-5">
                                    <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${region.color} text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                                        {region.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {region.description}
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
