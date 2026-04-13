
import React, { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

// Video chapters data
const videoChapters = [
  { time: "00:00", title: "Intro", seconds: 0 },
  { time: "00:10", title: "Speak to stranger", seconds: 10 },
  { time: "01:34", title: "Walk more slowly", seconds: 94 },
  { time: "01:49", title: "Buy something special", seconds: 109 },
  { time: "02:25", title: "Eat bravely", seconds: 145 },
  { time: "03:06", title: "Do nothing", seconds: 186 },
  { time: "03:26", title: "Love myself", seconds: 206 }
];

export function KoreanCreatorsSection(): JSX.Element {
  const isMobile = useIsMobile();
  const { currentLanguage } = useTranslation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const handleChapterClick = (chapter: typeof videoChapters[0]) => {
    console.log(`🕒 Seeking to timestamp: ${chapter.time} (${chapter.seconds}s)`);
    
    if (iframeRef.current) {
      // Send message to YouTube iframe to seek to specific time
      const iframe = iframeRef.current;
      const message = {
        event: 'command',
        func: 'seekTo',
        args: [chapter.seconds, true]
      };
      
      try {
        iframe.contentWindow?.postMessage(JSON.stringify(message), '*');
        console.log(`✅ Sent seek command to video: ${chapter.seconds}s`);
      } catch (error) {
        console.warn('⚠️ Could not seek video, falling back to URL approach');
        // Fallback: Update iframe src with timestamp
        const currentSrc = iframe.src;
        const baseUrl = currentSrc.split('?')[0];
        iframe.src = `${baseUrl}?start=${chapter.seconds}&autoplay=1`;
      }
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full bg-white font-inter">
      <div className="w-full max-w-[1200px] rounded-[10px] shadow-[0px_0px_0px_1.956px_rgba(0,0,0,0.05)] p-[24px] md:p-[32px] lg:p-[42px]">
        <div className="flex flex-col mb-6 md:mb-8">
          <div className="text-[#347EFF] text-[16px] md:text-[18px] lg:text-[20px] text-left">
            <TranslateText text="To the Unknown Beauties of Tunisia with Hae In Jung" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-[22px] md:text-[28px] lg:text-[36px] font-semibold leading-tight text-left">
            <TranslateText text="Welcome to Tunisia" language={currentLanguage} />
          </div>
          <div className="text-[#666] text-[16px] md:text-[18px] mt-2">
            <TranslateText text="Visit Tunisia, a place full of undiscovered beauty!" language={currentLanguage} />
          </div>
        </div>
          
        <div className="rounded-[12px] overflow-hidden">
          <iframe 
            ref={iframeRef}
            width="100%" 
            height={isMobile ? "250" : "550"}
            src="https://www.youtube.com/embed/dC9Z91qOLLk?enablejsapi=1" 
            title="To the Unknown Beauties of Tunisia with Hae In Jung" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="rounded-[12px]"
          ></iframe>
        </div>
        
        {/* Video Chapters Section */}
        <div className="bg-[#F6F8FB] rounded-[12px] p-[20px] md:p-[24px] lg:p-[32px] mt-6 md:mt-8">
          <div className="text-[18px] md:text-[22px] font-normal text-[#1F1F20] mb-[16px] md:mb-[20px]">
            <TranslateText text="Video Chapters" language={currentLanguage} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
            {videoChapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => handleChapterClick(chapter)}
                className="flex items-center gap-3 p-3 md:p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors text-left border border-gray-100 hover:border-[#347EFF] group"
              >
                <span className="text-[#347EFF] font-mono text-sm md:text-base font-medium min-w-[50px]">
                  {chapter.time}
                </span>
                <span className="text-[#1F1F20] text-sm md:text-base group-hover:text-[#347EFF] transition-colors">
                  <TranslateText text={chapter.title} language={currentLanguage} />
                </span>
              </button>
            ))}
          </div>
          
          <div className="text-[18px] md:text-[22px] font-normal text-[#1F1F20] mb-[10px] md:mb-[12px]">
            <TranslateText text="About This Video" language={currentLanguage} />
          </div>
          <div className="text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-normal text-[#1F1F20] leading-[26px] md:leading-[32px] lg:leading-[38px]">
            <TranslateText 
              text="This film was created in collaboration between Hyundai Motor Group and Tunisia. Join Korean actor Hae In Jung as he discovers the hidden beauties of Tunisia, from speaking to strangers and walking slowly through ancient streets, to buying something special and eating bravely. Experience the authentic Tunisian hospitality and take time to love yourself in this magical North African destination." 
              language={currentLanguage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
