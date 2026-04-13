
import React from "react";
import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/ui/audio-player";

interface ExpressionCardProps {
  id: string;
  phrase: string;
  image: string;
  audio: string;
}

export function ExpressionCard({ id, phrase, image, audio }: ExpressionCardProps) {
  return (
    <Card key={id} className="bg-white border-2 border-gray-100 overflow-hidden rounded-3xl">
      <div className="p-6 flex flex-col items-center">
        <h3 className="text-3xl font-semibold text-gray-900 mb-4 text-center">{phrase}</h3>
        
        <div className="w-full h-[150px] flex items-center justify-center mb-6">
          <img 
            src={image} 
            alt={`${phrase} illustration`} 
            className="max-h-full object-contain" 
          />
        </div>
        
        {/* Minimalistic Audio Player with Voice Toggle */}
        <AudioPlayer audioSrc={audio} id={id} showVoiceToggle={true} />
      </div>
    </Card>
  );
}
