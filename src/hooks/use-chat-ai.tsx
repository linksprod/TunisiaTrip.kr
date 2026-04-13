
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChatAI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (
    message: string, 
    conversationHistory: ChatMessage[], 
    language: string
  ): Promise<string> => {
    setIsLoading(true);
    
    try {
      console.log('Sending message to Tunisia Trip expert chat-assistant:', message);
      
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: {
          message,
          conversationHistory,
          language
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get response from Tunisia Trip expert');
      }

      if (!data?.success) {
        console.error('AI response error:', data?.error);
        throw new Error(data?.error || 'Tunisia Trip expert service error');
      }

      console.log('Received Tunisia Trip expert response:', data.message);
      return data.message;

    } catch (error) {
      console.error('Tunisia Trip expert chat error:', error);
      
      // Enhanced fallback responses with emojis and HTML formatting
      const fallbackMessage = language === 'KR' 
        ? "죄송합니다. 현재 AI 서비스에 연결할 수 없습니다 😅 하지만 걱정하지 마세요! 여전히 <b>튀니지 모험</b>에 대해 도움을 드릴 수 있어요! <b>놀라운 사막 투어</b> 🐪, <b>아름다운 해변</b> 🏖️, <b>역사적인 유적지</b> 🏛️에 대해 물어보세요! 🌟"
        : "I apologize, but I'm currently unable to connect to the Tunisia Trip expert service 😅 But don't worry! I'm still here to help with your <b>Tunisia adventure</b>! Ask me about our <b>amazing desert tours</b> 🐪, <b>beautiful beaches</b> 🏖️, or <b>historic sites</b> 🏛️! 🌟";
      
      toast.error(language === 'KR' 
        ? "일시적인 연결 문제입니다 😅 다시 시도해 주세요" 
        : "Temporary connection issue 😅 Please try again"
      );
      
      return fallbackMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading
  };
};
