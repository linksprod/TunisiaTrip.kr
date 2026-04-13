
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { TranslateText } from '@/components/translation/TranslateText';
import { MapPin, Users, Calendar, Landmark } from 'lucide-react';

export const OverviewContent = () => {
    const { currentLanguage, updateKey } = useTranslation();
    
    const quickStats = [
        {
            icon: MapPin,
            label: 'Location',
            value: 'North Africa',
            color: "text-blue-600"
        },
        {
            icon: Users,
            label: 'Population',
            value: "11.8M",
            color: "text-green-600"
        },
        {
            icon: Calendar,
            label: 'Independence',
            value: "1956",
            color: "text-orange-600"
        },
        {
            icon: Landmark,
            label: 'Capital',
            value: 'Tunis',
            color: "text-purple-600"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Main Overview Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-orange-500 rounded-full"></div>
                    <h2 
                        className="text-2xl md:text-3xl font-bold text-gray-800"
                        style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
                    >
                        <TranslateText 
                            text="Overview of Tunisia"
                            language={currentLanguage}
                            key={`overview-title-${updateKey}`}
                        />
                    </h2>
                </div>
                
                <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p 
                        className="text-lg"
                        style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
                    >
                        <TranslateText 
                            text="Tunisia is a captivating country located in the Maghreb region of North Africa. It boasts diverse landscapes from Mediterranean coastlines to the Sahara Desert and a rich historical heritage."
                            language={currentLanguage}
                            key={`overview-p1-${updateKey}`}
                        />
                    </p>
                    <p style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}>
                        <TranslateText 
                            text="From the ancient ruins of Carthage to the blue-and-white town of Sidi Bou Said, Tunisia offers a unique experience for every traveler. Its rich culture, delicious cuisine, and warm hospitality await you."
                            language={currentLanguage}
                            key={`overview-p2-${updateKey}`}
                        />
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div 
                            key={index}
                            className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                                <div 
                                    className="text-sm text-gray-600 font-medium"
                                    style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
                                >
                                    <TranslateText 
                                        text={stat.label}
                                        language={currentLanguage}
                                        key={`stat-label-${index}-${updateKey}`}
                                    />
                                </div>
                                <div 
                                    className="text-lg font-bold text-gray-800"
                                    style={{ fontFamily: `'Pretendard', 'Noto Sans KR', sans-serif` }}
                                >
                                    <TranslateText 
                                        text={stat.value}
                                        language={currentLanguage}
                                        key={`stat-value-${index}-${updateKey}`}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
