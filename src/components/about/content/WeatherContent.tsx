
import React from 'react';
import { useTranslation } from '@/hooks/use-translation';

export const WeatherContent = () => {
    const { currentLanguage } = useTranslation();
    return (
        <div id="weather" className="bg-white rounded-lg shadow-sm p-6 md:p-8" data-section="weather">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                {currentLanguage === "KR" ? "튀니지 날씨" : "Weather in Tunisia"}
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                    {currentLanguage === "KR"
                    ? "튀니지는 덥고 건조한 여름과 온화하고 습한 겨울이 있는 지중해성 기후를 가지고 있습니다. 해안 지역은 온화한 기온을 경험하는 반면, 내륙 지역은 더운 여름과 추운 겨울을 경험할 수 있습니다."
                    : "Tunisia has a Mediterranean climate with hot, dry summers and mild, wet winters. The coastal areas experience moderate temperatures, while the inland regions can experience hot summers and cold winters."
                    }
                </p>
                <p>
                    {currentLanguage === "KR"
                    ? "방문하기 가장 좋은 시기는 날씨가 쾌적한 봄과 가을입니다. 여름은 특히 사막 지역에서 매우 더울 수 있습니다."
                    : "The best time to visit is during the spring and fall when the weather is pleasant. The summer months can be very hot, especially in the desert regions."
                    }
                </p>
            </div>
        </div>
    );
};
