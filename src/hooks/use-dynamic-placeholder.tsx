
import { useState, useEffect } from 'react';

interface PlaceholderSuggestion {
  en: string;
  jp: string;
  kr: string;
}

const placeholderSuggestions: PlaceholderSuggestion[] = [
  { en: 'Explore Djerba beaches...', jp: 'ジェルバのビーチを探索...', kr: '제르바 해변 탐험...' },
  { en: 'Visit El Jem amphitheater...', jp: 'エルジェム円形劇場を訪問...', kr: '엘 젬 원형극장 방문...' },
  { en: 'Discover Tunis medina...', jp: 'チュニスのメディナを発見...', kr: '튀니스 메디나 발견...' },
  { en: 'Experience Sahara desert...', jp: 'サハラ砂漠を体験...', kr: '사하라 사막 체험...' },
  { en: 'Find Star Wars locations...', jp: 'スターウォーズの撮影地を探す...', kr: '스타워즈 촬영지 찾기...' },
  { en: 'Book hotels in Sousse...', jp: 'スースのホテルを予約...', kr: '수스 호텔 예약...' },
  { en: 'Roman ruins in Dougga...', jp: 'ドゥッガのローマ遺跡...', kr: '두가 로마 유적...' },
  { en: 'Traditional crafts in Kairouan...', jp: 'カイルアンの伝統工芸...', kr: '카이로안 전통 공예...' },
  { en: 'Mountain oases adventure...', jp: '山のオアシス冒険...', kr: '산악 오아시스 모험...' },
  { en: 'Mediterranean cuisine...', jp: '地中海料理...', kr: '지중해 요리...' },
  { en: 'Desert camping tours...', jp: '砂漠キャンプツアー...', kr: '사막 캠핑 투어...' },
  { en: 'Ancient Carthage history...', jp: '古代カルタゴの歴史...', kr: '고대 카르타고 역사...' },
  { en: 'Berber villages exploration...', jp: 'ベルベル村の探索...', kr: '베르베르 마을 탐험...' },
  { en: 'Museums and galleries...', jp: '博物館とギャラリー...', kr: '박물관과 갤러리...' },
  { en: 'Transportation options...', jp: '交通オプション...', kr: '교통 옵션...' }
];

export const useDynamicPlaceholder = (language: string) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    const updatePlaceholder = () => {
      const suggestion = placeholderSuggestions[currentIndex];
      setPlaceholder(
        language === 'JP' ? suggestion.jp : 
        language === 'KR' ? suggestion.kr : 
        suggestion.en
      );
    };

    updatePlaceholder();
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % placeholderSuggestions.length
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, language]);

  return placeholder;
};
