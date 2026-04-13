export const slugTranslations = {
  // Travel related terms
  "travel": "여행",
  "trip": "여행",
  "vacation": "휴가",
  "holiday": "휴일",
  "journey": "여정",
  "adventure": "모험",
  "explore": "탐험",
  "discover": "발견",
  "experience": "경험",
  "visit": "방문",
  "tour": "투어",
  "guide": "가이드",
  "destination": "목적지",
  "attractions": "명소",
  "sightseeing": "관광",
  
  // Tunisia specific terms
  "tunisia": "튀니지",
  "tunis": "튀니스",
  "carthage": "카르타고",
  "sahara": "사하라",
  "desert": "사막",
  "medina": "메디나",
  "sousse": "수스",
  "sfax": "스팍스",
  "bizerte": "비제르트",
  "kairouan": "카이루안",
  "tozeur": "토제르",
  "djerba": "제르바",
  "mediterranean": "지중해",
  "africa": "아프리카",
  "north-africa": "북아프리카",
  
  // General blog terms
  "tips": "팁",
  "best": "최고",
  "top": "최고의",
  "must": "필수",
  "should": "해야할",
  "places": "장소",
  "things": "것들",
  "to-do": "할것들",
  "activities": "활동",
  "culture": "문화",
  "history": "역사",
  "food": "음식",
  "cuisine": "요리",
  "local": "지역",
  "traditional": "전통",
  "authentic": "진정한",
  "unique": "독특한",
  "amazing": "놀라운",
  "beautiful": "아름다운",
  "stunning": "멋진",
  "incredible": "믿을수없는",
  
  // Seasons and time
  "summer": "여름",
  "winter": "겨울",
  "spring": "봄",
  "autumn": "가을",
  "season": "계절",
  "weather": "날씨",
  "climate": "기후",
  
  // Accommodation and transport
  "hotel": "호텔",
  "accommodation": "숙박",
  "flight": "항공편",
  "airport": "공항",
  "transport": "교통",
  "car": "자동차",
  "bus": "버스",
  "train": "기차",
  
  // Common words (empty values to remove them from slugs)
  "and": "",
  "or": "",
  "with": "",
  "for": "",
  "in": "",
  "at": "",
  "on": "",
  "the": "",
  "a": "",
  "an": "",
  "is": "",
  "are": "",
  "was": "",
  "were": "",
  "be": "",
  "been": "",
  "have": "",
  "has": "",
  "had": "",
  "will": "",
  "would": "",
  "could": "",
  "should-word": "", // renamed to avoid conflict
  "may": "",
  "might": "",
  "can": "",
  "do": "",
  "does": "",
  "did": "",
  "get": "",
  "got": "",
  "go": "",
  "went": "",
  "come": "",
  "came": "",
  "see": "",
  "saw": "",
  "know": "",
  "knew": "",
  "think": "",
  "thought": "",
  "say": "",
  "said": "",
  "take": "",
  "took": "",
  "make": "",
  "made": "",
  "give": "",
  "gave": "",
  "find": "",
  "found": "",
  "use": "",
  "used": "",
  "work": "",
  "worked": "",
  "call": "",
  "called": "",
  "try": "",
  "tried": "",
  "ask": "",
  "asked": "",
  "need": "",
  "want": "",
  "like": "",
  "look": "",
  "seem": "",
  "feel": "",
  "leave": "",
  "put": "",
  "mean": "",
  "keep": "",
  "let": "",
  "begin": "",
  "help": "",
  "show": "",
  "hear": "",
  "play": "",
  "run": "",
  "move": "",
  "live": "",
  "believe": "",
  "bring": "",
  "happen": "",
  "write": "",
  "sit": "",
  "stand": "",
  "lose": "",
  "pay": "",
  "meet": "",
  "include": "",
  "continue": "",
  "set": "",
  "learn": "",
  "change": "",
  "lead": "",
  "understand": "",
  "watch": "",
  "follow": "",
  "stop": "",
  "create": "",
  "speak": "",
  "read": "",
  "spend": "",
  "grow": "",
  "open": "",
  "walk": "",
  "win": "",
  "teach": "",
  "offer": "",
  "remember": "",
  "love": "",
  "consider": "",
  "appear": "",
  "buy": "",
  "serve": "",
  "die": "",
  "send": "",
  "build": "",
  "stay": "",
  "fall": "",
  "cut": "",
  "reach": "",
  "kill": "",
  "remain": "",
  "suggest": "",
  "raise": "",
  "pass": "",
  "sell": "",
  "require": "",
  "report": "",
  "decide": "",
  "pull": ""
};

// Function to translate a title to Korean and generate a slug
export const translateTitleToKoreanSlug = (title: string): string => {
  if (!title?.trim()) return '';
  
  // Convert to lowercase for consistent matching
  const lowerTitle = title.toLowerCase();
  
  // Split title into words
  const words = lowerTitle
    .split(/[\s\-_.,!?;:()[\]{}]+/)
    .filter(word => word.length > 0);
  
  // Translate each word
  const translatedWords = words.map(word => {
    const translation = slugTranslations[word as keyof typeof slugTranslations];
    return translation || word;
  }).filter(word => word.length > 0); // Remove empty translations
  
  // Join with hyphens and clean up
  return translatedWords
    .join('-')
    .replace(/--+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100); // Limit length for URL compatibility
};

// Function to romanize Korean text for URL-friendly slugs
export const romanizeKorean = (text: string): string => {
  // Basic romanization mapping (simplified)
  const romanization: Record<string, string> = {
    'ㄱ': 'g', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄹ': 'r', 'ㅁ': 'm',
    'ㅂ': 'b', 'ㅅ': 's', 'ㅇ': '', 'ㅈ': 'j', 'ㅊ': 'ch',
    'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
    'ㅏ': 'a', 'ㅑ': 'ya', 'ㅓ': 'eo', 'ㅕ': 'yeo', 'ㅗ': 'o',
    'ㅛ': 'yo', 'ㅜ': 'u', 'ㅠ': 'yu', 'ㅡ': 'eu', 'ㅣ': 'i',
    '튀': 'twi', '니': 'ni', '지': 'ji', '여': 'yeo', '행': 'haeng',
    '가': 'ga', '이': 'i', '드': 'deu', '최': 'choi', '고': 'go',
    '의': 'ui', '을': 'eul', '를': 'reul', '에': 'e', '서': 'seo',
    '와': 'wa', '과': 'gwa', '은': 'eun', '는': 'neun',
    '부': 'bu', '터': 'teo', '까': 'kka', '한': 'han', '국': 'guk', '어': 'eo'
  };
  
  // Replace Korean characters with romanized equivalents
  let romanized = text;
  Object.entries(romanization).forEach(([korean, roman]) => {
    romanized = romanized.replace(new RegExp(korean, 'g'), roman);
  });
  
  // Clean up the result
  return romanized
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};