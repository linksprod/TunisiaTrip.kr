import React from 'react';
import { TranslateText } from '../translation/TranslateText';
import { useTranslation } from '@/hooks/use-translation';
import { Award, Shield, Star, Users, Globe, BookOpen } from 'lucide-react';

const certifications = [
  {
    icon: Award,
    title: "IATA Certified Agent",
    description: "International Air Transport Association certified travel agent",
    badge: "IATA 인증"
  },
  {
    icon: Shield,
    title: "Tunisia Tourism Board Partner",
    description: "Official partnership with Tunisia National Tourism Office",
    badge: "공식 파트너"
  },
  {
    icon: Star,
    title: "TripAdvisor Excellence",
    description: "Certificate of Excellence for outstanding traveler reviews",
    badge: "우수상 수상"
  },
  {
    icon: Users,
    title: "Korean Travel Association",
    description: "Member of Korea Association of Travel Agents (KATA)",
    badge: "KATA 회원"
  }
];

const trustMetrics = [
  {
    icon: Users,
    value: "50,000+",
    label: "Korean Travelers Served",
    koreanLabel: "한국인 여행객 서비스"
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Average Rating",
    koreanLabel: "평균 평점"
  },
  {
    icon: Globe,
    value: "15+",
    label: "Years of Experience",
    koreanLabel: "년의 경험"
  },
  {
    icon: BookOpen,
    value: "200+",
    label: "Positive Reviews",
    koreanLabel: "긍정적인 리뷰"
  }
];

const koreanReviews = [
  {
    name: "김민수",
    location: "서울, 한국",
    rating: 5,
    review: "튀니지 여행이 정말 환상적이었습니다. 사하라 사막에서의 경험은 평생 잊을 수 없을 것 같아요.",
    date: "2024년 8월"
  },
  {
    name: "박지영",
    location: "부산, 한국",
    rating: 5,
    review: "한국어 가이드 서비스가 정말 도움이 되었어요. 튀니지의 역사와 문화를 깊이 이해할 수 있었습니다.",
    date: "2024년 7월"
  },
  {
    name: "이준호",
    location: "인천, 한국",
    rating: 5,
    review: "가족 여행으로 완벽했습니다. 아이들도 너무 즐거워했고, 안전하게 여행할 수 있어서 좋았어요.",
    date: "2024년 6월"
  }
];

export default function AuthorityBuilding() {
  const { currentLanguage } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-background to-secondary/5 py-16">
      <div className="container mx-auto px-4">
        {/* Certifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            <TranslateText text="Official Certifications & Partnerships" language={currentLanguage} />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">
                    <TranslateText text={cert.title} language={currentLanguage} />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    <TranslateText text={cert.description} language={currentLanguage} />
                  </p>
                  <div className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                    {cert.badge}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trust Metrics */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            <TranslateText text="Trusted by Korean Travelers" language={currentLanguage} />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm font-medium mb-1">
                    <TranslateText text={metric.label} language={currentLanguage} />
                  </div>
                  {currentLanguage === 'KR' && (
                    <div className="text-xs text-muted-foreground">
                      {metric.koreanLabel}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Korean Reviews */}
        {currentLanguage === 'KR' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              한국인 고객 후기
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {koreanReviews.map((review, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "{review.review}"
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-muted-foreground">{review.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Security & Trust Badges */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            <TranslateText text="Security & Trust" language={currentLanguage} />
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-sm font-medium"><TranslateText text="SSL Secured" language={currentLanguage} /></span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-medium"><TranslateText text="Verified Business" language={currentLanguage} /></span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-purple-600" />
              <span className="text-sm font-medium"><TranslateText text="24/7 Support" language={currentLanguage} /></span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-6 h-6 text-orange-600" />
              <span className="text-sm font-medium"><TranslateText text="Global Coverage" language={currentLanguage} /></span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}