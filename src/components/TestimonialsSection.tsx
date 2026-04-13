
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar } from "@/components/ui/avatar";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface TestimonialCardProps {
  date: string;
  location: string;
  title: string;
  content: string;
  personName: string;
  personRole: string;
  personImage: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  date,
  location,
  title,
  content,
  personName,
  personRole,
  personImage,
}) => {
  const isMobile = useIsMobile();
  const { currentLanguage } = useTranslation();

  // Special case for Korean translations for Takashi Ito
  const getKoreanContent = () => {
    if (currentLanguage === "KR" && personName === "Takashi Ito") {
      return "카르타고 유적을 걸으며 소름이 돋았습니다. 현지 가이드는 모든 것을 알고 있었고, 음식도! 그 매운 하리사는 커피보다 더 저를 깨워주었습니다. 교육과 모험의 완벽한 조합이었습니다.";
    }
    return content;
  };

  const getKoreanTitle = () => {
    if (currentLanguage === "KR" && personName === "Takashi Ito") {
      return "지금까지 받은 최고의 역사 수업";
    }
    return title;
  };

  if (isMobile) {
    return (
      <div className="bg-[#F6F7FB] rounded-xl p-5">
        <div className="flex items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-[60px] h-[60px] rounded-[20px]">
              <img 
                src={personImage} 
                alt={personName} 
                className="w-full h-full object-cover rounded-[20px]"
              />
            </Avatar>
            <div>
              <p className="text-lg font-semibold">
                <TranslateText text={personName} language={currentLanguage} />
              </p>
              <p className="text-sm text-gray-600">
                {currentLanguage === "KR" && personRole === "Japanese" ? "일본인" : 
                  <TranslateText text={personRole} language={currentLanguage} />
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <p className="text-[#9BB0D6] text-sm">
            <TranslateText text={date} language={currentLanguage} />
          </p>
          <h3 className="text-[#1F1F20] text-xl font-semibold mt-2">
            {currentLanguage === "KR" && personName === "Takashi Ito" ? 
              getKoreanTitle() : 
              <TranslateText text={title} language={currentLanguage} />
            }
          </h3>
        </div>
        
        <div className="text-[#1F1F20] text-base font-light leading-6 mb-3">
          {currentLanguage === "KR" && personName === "Takashi Ito" ? 
            getKoreanContent() : 
            <TranslateText text={content} language={currentLanguage} />
          }
        </div>
        
        <div className="flex justify-end">
          <div className="bg-blue-500 text-white px-3 py-1 text-xs rounded-3xl">
            {currentLanguage === "KR" && location === "Carthage, Tunisia" ? 
              "카르타고, 튀니지" : 
              currentLanguage === "KR" && location === "Sidi Bou Said, Tunisia" ? 
              "시디 부 사이드, 튀니지" :
              currentLanguage === "KR" && location === "Douz, Tunisia" ? 
              "두즈, 튀니지" :
              <TranslateText text={location} language={currentLanguage} />
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start">
      {/* Profile section with reduced left spacing */}
      <div className="w-[15%] pr-4">
        <div className="flex flex-col items-center text-[#1F1F20]">
          <div className="w-[130px] aspect-square rounded-[34px]">
            <img 
              src={personImage} 
              alt={personName} 
              className="w-full h-full object-cover rounded-[34px]"
            />
          </div>
          <p className="text-lg font-normal mt-2 text-center">
            {currentLanguage === "KR" && personRole === "Japanese" ? "일본인" : 
              <TranslateText text={personRole} language={currentLanguage} />
            }
          </p>
          <p className="text-xl font-semibold mt-2 text-center">
            <TranslateText text={personName} language={currentLanguage} />
          </p>
        </div>
      </div>

      {/* Testimonial content with increased width to balance spacing */}
      <div className="w-[85%] bg-[#F6F7FB] rounded-xl p-6 md:p-10">
        <div className="flex justify-between items-center flex-wrap gap-5">
          <p className="text-[#9BB0D6] text-lg">
            <TranslateText text={date} language={currentLanguage} />
          </p>
          <div className="bg-blue-500 text-white px-6 py-2 rounded-3xl">
            {currentLanguage === "KR" && location === "Carthage, Tunisia" ? 
              "카르타고, 튀니지" : 
              currentLanguage === "KR" && location === "Sidi Bou Said, Tunisia" ? 
              "시디 부 사이드, 튀니지" :
              currentLanguage === "KR" && location === "Douz, Tunisia" ? 
              "두즈, 튀니지" :
              <TranslateText text={location} language={currentLanguage} />
            }
          </div>
        </div>
        
        <h3 className="text-[#1F1F20] text-2xl font-semibold mt-6">
          {currentLanguage === "KR" && personName === "Takashi Ito" ? 
            getKoreanTitle() : 
            <TranslateText text={title} language={currentLanguage} />
          }
        </h3>
        
        <div className="mt-4 text-[#1F1F20] text-xl font-light leading-7">
          {currentLanguage === "KR" && personName === "Takashi Ito" ? 
            getKoreanContent() : 
            <TranslateText text={content} language={currentLanguage} />
          }
        </div>
      </div>
    </div>
  );
};

export default function TestimonialsSection(): JSX.Element {
  const { currentLanguage } = useTranslation();
  
  const testimonials = [
    {
      date: "2023.06.15",
      location: "Sidi Bou Said, Tunisia",
      title: "I felt so safe traveling alone here!",
      content: "Never expected Tunisia to be this welcoming! The women looked out for me, the food was amazing (try the brik!), and those blue-and-white streets were magical. Already planning my next trip!",
      personName: "Ji-Won Park",
      personRole: "South Korean",
      personImage: "https://cdn.builder.io/api/v1/image/assets/62d9bdcbd9e942429261da212732eafc/f3b9cbcbf0f8a0b210578454bb4c403751d8fced"
    },
    {
      date: "2023.09.22",
      location: "Carthage, Tunisia",
      title: "Best history lesson I've ever had",
      content: "Walking through Carthage's ruins gave me chills. The local guides knew everything - and the food! That spicy harissa woke me up better than coffee. Perfect mix of education and adventure.",
      personName: "Takashi Ito",
      personRole: "Japanese",
      personImage: "https://cdn.builder.io/api/v1/image/assets/62d9bdcbd9e942429261da212732eafc/883ca7180b5a4e36831ed56a5ffb939a50862218"
    },
    {
      date: "2023.11.08",
      location: "Douz, Tunisia",
      title: "This country surprised me every day",
      content: "From desert sunsets to Mediterranean beaches, Tunisia kept amazing me. The people were so proud to share their culture. Pro tip: bargain with a smile in the souks - it's all part of the fun!",
      personName: "Seung-Ho Kim",
      personRole: "South Korean",
      personImage: "https://cdn.builder.io/api/v1/image/assets/62d9bdcbd9e942429261da212732eafc/9595977f7bde2b15c505deb3b86cdb78efcb70fa"
    }
  ];

  return (
    <div className="flex flex-col items-center w-full bg-white font-inter">
      <div className="w-full max-w-[1200px] rounded-[10px] shadow-[0px_0px_0px_1.956px_rgba(0,0,0,0.05)] p-[24px] md:p-[32px] lg:p-[42px]">
        <div className="flex flex-col mb-6 md:mb-8">
          <div className="text-[#347EFF] text-[16px] md:text-[18px] lg:text-[20px] text-left">
            {currentLanguage === "KR" ? "고객 후기" : 
              <TranslateText text="Testimonials" language={currentLanguage} />
            }
          </div>
          <div className="text-[#1F1F20] text-[22px] md:text-[28px] lg:text-[36px] font-semibold leading-tight text-left">
            {currentLanguage === "KR" ? "아틀란티스와 함께한 튀니지 여행에 대한 사람들의 이야기" : 
              <TranslateText text="What People Say About Traveling to Tunisia With Atlantis" language={currentLanguage} />
            }
          </div>
        </div>

        <div className="mt-6 md:mt-12 space-y-6 md:space-y-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              date={testimonial.date}
              location={testimonial.location}
              title={testimonial.title}
              content={testimonial.content}
              personName={testimonial.personName}
              personRole={testimonial.personRole}
              personImage={testimonial.personImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
