// Comprehensive Korean SEO keywords for Tunisia travel
export const koreanSEOKeywords = {
  core: [
    '튀니지 여행', '튀니지 관광', '북아프리카 여행', '아프리카 여행', '튀니지 투어',
    '튀니지 여행 패키지', '튀니지 자유여행', '튀니지 가이드 투어', '튀니지 개별여행',
    '튀니지 신혼여행', '튀니지 가족여행', '튀니지 배낭여행', '튀니지 럭셔리 여행'
  ],
  seasonal: [
    '튀니지 봄 여행', '튀니지 여름 여행', '튀니지 가을 여행', '튀니지 겨울 여행',
    '튀니지 성수기', '튀니지 비수기', '튀니지 날씨 좋은 시기', '튀니지 여행 시기',
    '튀니지 12월 여행', '튀니지 1월 여행', '튀니지 2월 여행', '튀니지 3월 여행'
  ],
  activities: [
    '사막 투어', '사하라 사막', '낙타 트레킹', '별 관측', '오아시스 투어',
    '튀니지 문화 체험', '베르베르족 문화', '이슬람 문화', '로마 유적지',
    '지중해 해변', '튀니지 스쿠버다이빙', '튀니지 서핑', '튀니지 골프'
  ],
  destinations: [
    '튀니스', '카르타고', '시디부사이드', '함마메트', '수스', '케로안', '토즈',
    '사하라 사막', '도즈', '마트마타', '엘젬', '비제르타', '가베스', '스팩스',
    '튀니지 북부', '튀니지 남부', '튀니지 해안도시', '튀니지 내륙도시'
  ],
  food: [
    '튀니지 음식', '쿠스쿠스', '타진', '브릭', '하리사', '튀니지 전통음식',
    '북아프리카 요리', '할랄 음식', '튀니지 디저트', '민트티', '튀니지 올리브'
  ],
  weather: [
    '튀니지 날씨', '튀니지 기후', '지중해성 기후', '튀니지 온도', '튀니지 강수량',
    '튀니지 여행 옷차림', '튀니지 햇볕', '튀니지 자외선', '튀니지 바람'
  ],
  practical: [
    '튀니지 여행 준비물', '튀니지 비자', '튀니지 입국', '튀니지 환율', '튀니지 팁',
    '튀니지 안전', '튀니지 교통', '튀니지 숙박', '튀니지 쇼핑', '튀니지 와이파이',
    '튀니지 전압', '튀니지 언어', '아랍어', '프랑스어', '튀니지 문화 예절'
  ],
  accommodation: [
    '튀니지 호텔', '튀니지 리조트', '튀니지 리야드', '튀니지 펜션', '튀니지 게스트하우스',
    '튀니지 럭셔리 호텔', '튀니지 부티크 호텔', '사막 캠프', '튀니지 숙소'
  ],
  travelStyle: [
    '튀니지 허니문', '튀니지 가족여행', '튀니지 여자 혼자 여행', '튀니지 남자 혼자 여행',
    '튀니지 단체여행', '튀니지 효도여행', '튀니지 졸업여행', '튀니지 워킹홀리데이'
  ],
  comparison: [
    '튀니지 vs 모로코', '튀니지 vs 이집트', '튀니지 vs 터키', '튀니지 vs 그리스',
    '북아프리카 여행지 비교', '중동 여행지 추천', '지중해 여행지'
  ],
  longTail: [
    '튀니지 여행 10일 일정', '튀니지 여행 1주일 코스', '튀니지 사막투어 2박3일',
    '튀니지 허니문 5박7일', '튀니지 가족여행 추천 코스', '튀니지 맛집 투어',
    '한국인이 좋아하는 튀니지 여행지', '튀니지 여행 후기', '튀니지 여행 경비',
    '튀니지 여행 가격', '튀니지 항공료', '튀니지 현지 투어', '튀니지 한국어 가이드'
  ],
  cultural: [
    '튀니지 역사', '카르타고 문명', '로마 제국', '오스만 제국', '프랑스 식민지',
    '튀니지 독립', '부르기바', '벤 알리', '재스민 혁명', '아랍의 봄',
    '이슬람 건축', '모스크', '메디나', '수크', '함맘'
  ]
};

// Generate combined keyword string
export function generateKeywordString(categories?: string[]): string {
  if (!categories) {
    return Object.values(koreanSEOKeywords).flat().join(', ');
  }
  
  return categories
    .filter(cat => cat in koreanSEOKeywords)
    .map(cat => koreanSEOKeywords[cat as keyof typeof koreanSEOKeywords])
    .flat()
    .join(', ');
}

// Page-specific keyword mapping
export const pageKeywordMapping = {
  '/': ['core', 'seasonal', 'destinations', 'activities'],
  '/travel-information': ['practical', 'weather', 'accommodation'],
  '/atlantis': ['travelStyle', 'activities', 'accommodation'],
  '/about-tunisia': ['cultural', 'destinations', 'food'],
  '/blog': ['food', 'cultural', 'longTail'],
  '/activities': ['activities', 'destinations', 'travelStyle']
};