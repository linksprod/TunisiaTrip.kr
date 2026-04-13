import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { MessageCircle, X } from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';

interface ChatButtonProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ChatButton({ isOpen, setIsOpen }: ChatButtonProps) {
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const { currentLanguage } = useTranslation();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleChat}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50 flex items-center justify-center"
            size="lg"
          >
            {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{currentLanguage === "KR" ? "AI 어시스턴트와 채팅" : "Chat with AI Assistant"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
