import React from 'react';
import { TranslateText } from '../translation/TranslateText';
import { useTranslation } from '@/hooks/use-translation';
import { Calendar, MessageCircle, Users, Award } from 'lucide-react';

interface KoreanSeason {
  period: string;
  recommendation: string;
  koreanHolidays: string[];
  weatherInfo: string;
}

const koreanTravelSeasons: KoreanSeason[] = [
  {
    period: "봄 (3월-5월)",
    recommendation: "완벽한 날씨, 한국 학교 방학 피하기",
    koreanHolidays: ["어린이날 (5월 5일)", "부처님 오신 날"],
    weatherInfo: "온화한 기온, 관광에 이상적"
  },
  {
    period: "가을 (9월-11월)",
    recommendation: "한국 여행객에게 최고의 시기",
    koreanHolidays: ["추석 (중추절)", "한글날"],
    weatherInfo: "시원하고 쾌적, 사막 투어에 최적"
  },
  {
    period: "겨울 (12월-2월)",
    recommendation: "저렴한 가격, 한국의 추운 겨울 탈출",
    koreanHolidays: ["새해", "설날"],
    weatherInfo: "온화한 겨울, 한국 추위의 완벽한 대안"
  },
  {
    period: "여름 (6월-8월)",
    recommendation: "더운 날씨, 하지만 저렴한 가격",
    koreanHolidays: ["현충일", "광복절"],
    weatherInfo: "덥고 건조, 이른 아침/저녁 활동 권장"
  }
];

const koreanCulturalBridges = [
  {
    icon: Users,
    title: "유사한 환대 문화",
    description: "한국과 튀니지 문화 모두 어른 공경과 따뜻한 환대를 중시합니다"
  },
  {
    icon: Award,
    title: "차 문화의 연결",
    description: "한국의 차 의식과 유사한 전통 민트차 문화를 경험하세요"
  },
  {
    icon: MessageCircle,
    title: "가족 중심의 가치관",
    description: "두 문화 모두 강한 가족 유대와 전통에 대한 존중"
  },
  {
    icon: Calendar,
    title: "역사적 깊이",
    description: "수천 년에 걸친 풍부한 역사적 유산"
  }
];

export default function KoreanMarketFeatures() {
  const { currentLanguage } = useTranslation();
  const isKorean = currentLanguage === 'KR';

  if (!isKorean) return null;

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
      <div className="container mx-auto px-4">
        {/* Korean Travel Seasons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            <TranslateText text="한국인 방문객을 위한 최적의 여행 시기" language={currentLanguage} />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {koreanTravelSeasons.map((season, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold text-lg mb-3 text-primary">
                  <TranslateText text={season.period} language={currentLanguage} />
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  <TranslateText text={season.recommendation} language={currentLanguage} />
                </p>
                <div className="mb-3">
                  <h4 className="font-medium text-sm mb-2">
                    <TranslateText text="고려할 한국 휴일들:" language={currentLanguage} />
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {season.koreanHolidays.map((holiday, idx) => (
                      <li key={idx}>
                        <TranslateText text={holiday} language={currentLanguage} />
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-accent">
                  <TranslateText text={season.weatherInfo} language={currentLanguage} />
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Cultural Bridge Content */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8">
            <TranslateText text="한국-튀니지 문화적 연결점" language={currentLanguage} />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {koreanCulturalBridges.map((bridge, index) => {
              const Icon = bridge.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">
                    <TranslateText text={bridge.title} language={currentLanguage} />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <TranslateText text={bridge.description} language={currentLanguage} />
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Korean Customer Support */}
        <section className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            <TranslateText text="한국인 고객 지원" language={currentLanguage} />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                <TranslateText text="카카오톡 지원" language={currentLanguage} />
              </h3>
              <p className="text-sm text-muted-foreground">
                <TranslateText text="한국어를 구사하는 여행 전문가와 채팅" language={currentLanguage} />
              </p>
            </div>
            <div>
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                <TranslateText text="한국인 여행 그룹" language={currentLanguage} />
              </h3>
              <p className="text-sm text-muted-foreground">
                <TranslateText text="다른 한국인 여행객들과 함께 그룹 투어 참여" language={currentLanguage} />
              </p>
            </div>
            <div>
              <Award className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">
                <TranslateText text="한국인 여행 보험" language={currentLanguage} />
              </h3>
              <p className="text-sm text-muted-foreground">
                <TranslateText text="한국 시민을 위한 종합 보장" language={currentLanguage} />
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}