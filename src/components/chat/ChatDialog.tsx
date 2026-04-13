import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, X, Plane } from "lucide-react";
import { useTranslation } from '@/hooks/use-translation';
import { useChatAI } from '@/hooks/use-chat-ai';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createSafeHTML } from '@/utils/sanitize';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded-lg px-4 py-2 max-w-[85%] ${
        message.role === 'user' 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        <div 
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={createSafeHTML(message.content)}
        />
      </div>
    </div>
  );
};

interface ChatDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ChatDialog({ isOpen, setIsOpen }: ChatDialogProps) {
  const { currentLanguage } = useTranslation();
  const { sendMessage, isLoading } = useChatAI();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [showStartTripButton, setShowStartTripButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Add welcome message when chat opens for the first time
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: getWelcomeMessage()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // Update conversation history (keep last 10 messages)
    const newHistory = [...conversationHistory, userMessage].slice(-10);
    setConversationHistory(newHistory);
    
    setInput('');

    try {
      // Send message to AI
      const aiResponse = await sendMessage(input, newHistory, currentLanguage);
      
      // Check for trip planning suggestion
      if (aiResponse.includes('[START_TRIP_SUGGESTION]')) {
        setShowStartTripButton(true);
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiResponse.replace('[START_TRIP_SUGGESTION]', '')
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setConversationHistory(prev => [...prev, assistantMessage].slice(-10));
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: getErrorMessage()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleStartTrip = () => {
    toast.success(currentLanguage === "KR" 
      ? "여행 계획 페이지로 이동합니다! 🌟" 
      : "Moving to trip planning page! 🌟"
    );
    navigate('/start-my-trip');
    setIsOpen(false);
  };

  const getErrorMessage = () => {
    return currentLanguage === "KR"
      ? "죄송합니다. 일시적인 연결 문제가 발생했습니다. 😅 다시 시도해 주세요!"
      : "Sorry, there was a temporary connection issue. 😅 Please try again!";
  };

  const getPlaceholderText = () => {
    return currentLanguage === "KR" 
      ? "튀니지 여행에 대해 무엇이든 물어보세요! 🌟" 
      : "Ask me anything about Tunisia travel! 🌟";
  };

  const getWelcomeMessage = () => {
    return currentLanguage === "KR"
      ? "안녕하세요! 🌟 저는 여러분의 튀니지 여행 전문 어시스턴트입니다! 🎉 놀라운 튀니지를 발견하는 데 도움을 드리게 되어 매우 기쁩니다! <b>사하라 사막 모험</b> 🐪부터 <b>지중해 해변</b> 🏖️, <b>고대 유적</b> 🏛️부터 <b>맛있는 요리</b> 🍽️까지 - 모든 것을 알고 있어요! 무엇을 탐험하고 싶으신가요? ✨"
      : "Hello! 🌟 I'm your Tunisia Trip expert assistant! 🎉 I'm absolutely thrilled to help you discover amazing Tunisia! From <b>Sahara desert adventures</b> 🐪 to <b>Mediterranean beaches</b> 🏖️, <b>ancient ruins</b> 🏛️ to <b>delicious cuisine</b> 🍽️ - I know it all! What would you like to explore? ✨";
  };

  const getSendButtonText = () => {
    return currentLanguage === "KR" ? "전송" : "Send";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile: Full screen overlay */}
      <div className={`fixed inset-0 bg-white z-[100] flex flex-col transition-transform duration-300 md:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Mobile Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-blue-600 text-white">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} />
            <h3 className="text-base font-semibold">
              {currentLanguage === "KR" ? "튀니지 AI 어시스턴트" : "Tunisia AI Assistant"}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Mobile Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {showStartTripButton && (
            <div className="flex justify-center py-2">
              <Button
                onClick={handleStartTrip}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Plane size={16} />
                {currentLanguage === "KR" ? "여행 계획하기" : "Plan Your Trip"}
              </Button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mobile Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={getPlaceholderText()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send size={16} />
            </Button>
          </form>
        </div>
      </div>

      {/* Desktop: Bottom right widget */}
      <div className={`fixed bottom-24 right-6 w-[350px] h-[500px] max-w-[400px] bg-white border border-gray-200 rounded-lg shadow-xl z-40 flex-col transition-all duration-300 hidden md:flex ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`}>
        {/* Desktop Header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <MessageCircle size={18} />
            <h3 className="text-sm font-semibold">
              {currentLanguage === "KR" ? "튀니지 AI 어시스턴트" : "Tunisia AI Assistant"}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-6 w-6 p-0"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Desktop Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {showStartTripButton && (
            <div className="flex justify-center py-2">
              <Button
                onClick={handleStartTrip}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Plane size={14} />
                {currentLanguage === "KR" ? "여행 계획하기" : "Plan Your Trip"}
              </Button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Desktop Input */}
        <div className="border-t border-gray-200 p-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={getPlaceholderText()}
              disabled={isLoading}
              className="flex-1 text-sm"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="sm">
              <Send size={14} />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
