import React from 'react';
import { Share2, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { TranslateText } from '../translation/TranslateText';
import { toast } from 'sonner';

interface SocialShareProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

export function SocialShareWidget({ title, description, url, image }: SocialShareProps) {
  const { currentLanguage } = useTranslation();
  const isKorean = currentLanguage === 'KR';
  
  const shareUrl = url || window.location.href;
  const shareTitle = title || (isKorean ? '튀니지 여행 정보' : 'Tunisia Travel Information');
  const shareDescription = description || (isKorean 
    ? '한국인을 위한 튀니지 여행 가이드와 투어 정보' 
    : 'Tunisia travel guide and tour information for Koreans');
  const shareImage = image?.startsWith('http') 
    ? image 
    : `${window.location.origin}${image || '/lovable-uploads/61a2c6de-ab60-42e6-ac0a-d47a00bb14f2.png'}`;

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}&hashtags=Tunisia,Travel,Korea,튀니지여행`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleInstagramShare = () => {
    // Instagram doesn't support direct sharing, so copy to clipboard
    const shareText = `${shareTitle}\n\n${shareDescription}\n\n${shareUrl}`;
    navigator.clipboard.writeText(shareText);
    toast.success(isKorean ? '클립보드에 복사되었습니다!' : 'Copied to clipboard!');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Native sharing failed:', err);
      }
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-lg border">
      <span className="text-sm font-medium text-muted-foreground mr-2">
        {isKorean ? '공유하기:' : 'Share:'}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleFacebookShare}
        className="flex items-center gap-1"
      >
        <Facebook className="h-4 w-4" />
        <span className="hidden sm:inline">
          <TranslateText text="Facebook" language={currentLanguage} />
        </span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleTwitterShare}
        className="flex items-center gap-1"
      >
        <Twitter className="h-4 w-4" />
        <span className="hidden sm:inline">X</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleInstagramShare}
        className="flex items-center gap-1"
      >
        <Instagram className="h-4 w-4" />
        <span className="hidden sm:inline">
          <TranslateText text="Instagram" language={currentLanguage} />
        </span>
      </Button>
      
      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="flex items-center gap-1"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isKorean ? '더보기' : 'More'}
          </span>
        </Button>
      )}
    </div>
  );
}

export function SocialProofBadges() {
  const { currentLanguage } = useTranslation();
  const isKorean = currentLanguage === 'KR';
  
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1">
        <span className="font-semibold text-primary">5,000+</span>
        <span>{isKorean ? '한국인 여행객' : 'Korean Travelers'}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-semibold text-primary">4.8★</span>
        <span>{isKorean ? '평균 만족도' : 'Average Rating'}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-semibold text-primary">10+</span>
        <span>{isKorean ? '년 경험' : 'Years Experience'}</span>
      </div>
    </div>
  );
}