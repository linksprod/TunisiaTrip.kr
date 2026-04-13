
import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface VideoCard {
  title: string;
  subtitle?: string;
  image: string;
  videoUrl?: string;
  comingSoon?: boolean;
  id: string; // Add unique ID for better tracking
}

// Add version timestamp to force cache refresh
const COMPONENT_VERSION = Date.now();

const videos: VideoCard[] = [
  {
    id: "tunisia-discover-v2", // Unique ID to force refresh
    title: "튀니지를 발견하세요",
    subtitle: "튀니지의 아름다움과 마법 탐험하기",
    image: "/lovable-uploads/f490eb11-b7d5-4bb1-86c7-33f38275a59b.png",
    videoUrl: "https://youtu.be/dC9Z91qOLLk",
    comingSoon: false
  },
  {
    id: "tunis-vlog",
    title: "튀니스 브이로그",
    subtitle: "튀니스 메디나에서의 브이로그",
    image: "/lovable-uploads/7004eb7b-0db7-4919-a8fd-c6eb54f3e157.png",
    comingSoon: true
  },
  {
    id: "discover-tozeur",
    title: "토주르 발견",
    subtitle: "토주르를 탐험하세요",
    image: "/lovable-uploads/2a55f591-b880-443b-bfe4-1f5662503a3d.png",
    videoUrl: "https://www.youtube.com/watch?v=InHloF4XTOE",
    comingSoon: false
  }
];

const SECTION_TITLE = "주요 비디오";

export default function VideoSection() {
  const { currentLanguage } = useTranslation();
  
  const handleVideoClick = (video: VideoCard) => {
    console.log(`🎥 Video clicked:`, {
      title: video.title,
      videoUrl: video.videoUrl,
      comingSoon: video.comingSoon,
      timestamp: new Date().toISOString()
    });
    
    if (video.videoUrl && !video.comingSoon) {
      console.log(`🔗 Opening video URL: ${video.videoUrl}`);
      window.open(video.videoUrl, '_blank');
    } else if (video.comingSoon) {
      console.log(`⏳ Video is coming soon: ${video.title}`);
    } else {
      console.warn(`⚠️ No video URL available for: ${video.title}`);
    }
  };
  
  return (
    <section className="w-full bg-gray-50 py-12 md:py-16" key={`video-section-${COMPONENT_VERSION}`}>
      <div className="container max-w-[1200px] mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          <TranslateText text={SECTION_TITLE} language={currentLanguage} />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div 
              key={`${video.id}-${COMPONENT_VERSION}`} // Force unique key
              className="group flex flex-col"
            >
              {/* Video Thumbnail */}
              <div 
                className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4 cursor-pointer hover:transform hover:scale-[1.02] transition-all duration-300"
                onClick={() => handleVideoClick(video)}
              >
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-black rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoClick(video);
                    }}
                  >
                    <Play className="w-4 h-4" />
                    <TranslateText 
                      text={video.comingSoon ? "곧 출시" : "재생"} 
                      language={currentLanguage} 
                    />
                  </Button>
                </div>
              </div>
              
              {/* Text Content Below */}
              <div className="space-y-1">
                <h3 className="text-gray-900 text-lg font-bold">
                  <TranslateText text={video.title} language={currentLanguage} />
                </h3>
                {video.subtitle && (
                  <p className="text-gray-600 text-sm">
                    <TranslateText text={video.subtitle} language={currentLanguage} />
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
