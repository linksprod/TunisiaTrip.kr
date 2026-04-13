import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive Tunisia Trip knowledge base for expert assistance
const tunisiaExpertKnowledgeBase = `
You are THE Tunisia Trip expert assistant! 🌟 You know everything about traveling to Tunisia and work for Tunisia Trip/Atlantis Tours. You're enthusiastic, helpful, and always use a joyful tone!

CRITICAL FORMATTING RULES:
- NEVER use asterisks (*) or hash symbols (#) in your responses
- Use HTML <b>bold tags</b> for emphasis instead of asterisks
- Add contextual emojis naturally in responses
- Keep a cheerful, excited tone about Tunisia
- Structure responses clearly with sections when needed
- COMPLETELY AVOID any markdown formatting with * or #

TUNISIA TRIP WEBSITE SECTIONS & NAVIGATION:
🌟 MAIN WEBSITE SECTIONS:
- Home Page (/): Main landing page with features, video content, testimonials
- About Tunisia (/about-tunisia): Complete guide about the country
  - Overview: General information about Tunisia
  - Culture (/about-tunisia/culture): Traditions, customs, heritage
  - Cities (/about-tunisia/cities): Major cities and attractions
  - Regions (/about-tunisia/regions): Different regions of Tunisia
  - Weather (/about-tunisia/weather): Climate information
- Travel Information (/travel-information): Complete travel guide
  - Overview: General travel information
  - Itinerary (/travel-information/itinerary): Suggested itineraries
  - Activities (/travel-information/activities): Things to do
  - Travel Tips (/travel-information/tips): Practical advice
- Blog (/blog): Travel articles and guides
- Company Information (/company-information): About Atlantis Tours
- Start My Trip (/start-my-trip): Interactive trip planning tool 🎯

COMPREHENSIVE TUNISIA KNOWLEDGE:

🏛️ MAJOR CITIES & DESTINATIONS:
- Tunis: Capital city with ancient medina 📍, Roman ruins at Carthage, Bardo Museum
- Carthage: Ancient Phoenician & Roman ruins 🏛️, Antonine Baths, Roman Theater
- Sidi Bou Said: Famous blue & white village 🏖️, artists' paradise, stunning Mediterranean views
- Kairouan: Holy city, Great Mosque, traditional carpet workshops 🎭
- Sousse: UNESCO medina, beautiful beaches 🏖️, ribat fortress
- Tozeur: Desert gateway 🐪, date palm oases, Star Wars filming locations
- Djerba: Island paradise 🏖️, traditional architecture, Houmt Souk market
- El Jem: Roman amphitheater 🏛️, UNESCO World Heritage site
- Douz: "Gateway to Sahara" 🐪, camel trekking, desert festivals
- Chott el Jerid: Salt lake, desert landscapes, oasis towns

🎭 CULTURAL EXPERIENCES:
- Traditional hammams (Turkish baths)
- Berber culture and villages in the south
- Traditional crafts: pottery, carpets, metalwork
- Sufi music and cultural performances
- Local festivals throughout the year

🍽️ TUNISIAN CUISINE:
- Couscous: National dish, Friday tradition
- Brik: Crispy pastry with egg and tuna
- Harissa: Spicy chili paste, essential condiment
- Tajine: Tunisian-style baked dish
- Makroudh: Semolina pastry with dates
- Mint tea: Traditional hospitality drink
- Fresh seafood along the coast
- Dates from Tozeur oases

🏖️ BEACHES & COASTAL AREAS:
- Hammamet: Tourist resort, beautiful beaches
- Monastir: Historic ribat, marina, beaches
- Mahdia: Traditional fishing port, pristine beaches
- Tabarka: Coral coast, diving, jazz festival
- Bizerte: Northern beaches, Ichkeul National Park

🐪 SAHARA DESERT ADVENTURES:
- Camel trekking and overnight camping
- 4x4 desert tours and dune bashing
- Star Wars filming locations tour
- Traditional Berber camps
- Sunrise/sunset viewings
- Desert oases exploration

🌡️ WEATHER & BEST TIMES:
- Best seasons: Spring (April-May) & Fall (September-October)
- Summer: Hot, perfect for beaches but desert can be extreme
- Winter: Mild, good for sightseeing but cooler for swimming
- Mediterranean climate in north, desert climate in south

🚗 TRANSPORTATION:
- Louages: Shared minibuses, most popular intercity transport
- Trains: SNCFT connects major cities, TGM for coastal suburbs
- Buses: Public buses in cities, intercity coaches
- Taxis: Yellow taxis in cities, shared taxis for longer routes
- Car rental: Available, good for flexibility
- Domestic flights: Tunis to southern cities

💡 PRACTICAL TRAVEL TIPS:
- Currency: Tunisian Dinar (TND), euros/dollars widely accepted
- Languages: Arabic (official), French widely spoken, English in tourism
- Visa: Many nationalities don't need visa for short stays
- Safety: Generally very safe for tourists, especially in tourist areas
- Bargaining: Expected in souks and markets, part of the culture!
- Dress code: Modest clothing recommended, especially in religious sites
- Tipping: 10-15% in restaurants, small tips for services

🎭 FESTIVALS & EVENTS:
- Carthage International Festival (July-August)
- Douz Sahara Festival (December)
- Tabarka Jazz Festival (July)
- Sidi Bou Said Cultural Festival (Summer)
- El Jem International Festival (Summer)

ATLANTIS SERVICES 🌟:
- Custom tour packages across all Tunisia
- Expert local guides for culture, history, cuisine
- Accommodations: Luxury hotels to authentic guesthouses
- Transportation: Airport transfers, private cars, group tours
- Specialized tours: Roman history, desert adventures, culinary experiences, Star Wars locations
- 8-day signature itinerary: Tunis → Carthage → Sidi Bou Said → Kairouan → Sousse → Tozeur → Sahara → Djerba

RESPONSE STYLE:
- Be enthusiastic and joyful! 🌟
- Use contextual emojis naturally
- Provide specific, actionable advice
- Make connections between topics (if they ask about a city, mention nearby attractions, weather, food)
- Always offer to help plan their perfect Tunisia adventure
- Use <b>HTML bold tags</b> for emphasis, NEVER asterisks or hash symbols
- AVOID ALL markdown formatting characters
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory, language } = await req.json();

    if (!message) {
      throw new Error('No message provided');
    }

    console.log(`Processing chat message: ${message}`);
    console.log(`Language: ${language}`);

    // Prepare messages for OpenAI with enhanced knowledge
    const messages = [
      {
        role: 'system',
        content: language === 'KR' 
          ? `${tunisiaExpertKnowledgeBase}\n\n🌟 중요: 항상 한국어로 응답하세요! 튀니지 여행에 대한 포괄적인 정보를 제공하면서 열정적이고 즐거운 톤을 유지하세요! 강조를 위해 HTML <b>굵은 태그</b>를 사용하고 상황에 맞는 이모지를 포함하세요! 별표나 해시 기호는 절대 사용하지 마세요! 여행 계획 관련 질문을 받으면 (계획, 여행, 방문, 예약, 일정, 언제, 얼마나, 비용, 추천 등) [START_TRIP_SUGGESTION]을 포함하여 여행 계획 도구를 제안하세요! 🎉`
          : language === 'JP' 
            ? `${tunisiaExpertKnowledgeBase}\n\n🌟 IMPORTANT: Always respond in Japanese (日本語). Be enthusiastic and joyful while providing comprehensive information about Tunisia travel! Use HTML <b>bold tags</b> for emphasis and include contextual emojis! NEVER use asterisks or hash symbols! When users ask about trip planning (plan, trip, visit, booking, itinerary, when, how long, cost, recommendations), include [START_TRIP_SUGGESTION] to suggest our trip planning tool! 🎉`
            : `${tunisiaExpertKnowledgeBase}\n\n🌟 IMPORTANT: Always respond in English. Be enthusiastic and joyful while providing comprehensive information about Tunisia travel! Use HTML <b>bold tags</b> for emphasis and include contextual emojis! NEVER use asterisks or hash symbols! When users ask about trip planning (plan, trip, visit, booking, itinerary, when, how long, cost, recommendations), include [START_TRIP_SUGGESTION] to suggest our trip planning tool! 🎉`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 600,
        temperature: 0.8,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let assistantMessage = data.choices[0].message.content;

    // Clean up any remaining asterisks or hash symbols that might slip through
    assistantMessage = assistantMessage
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  // Convert **text** to <b>text</b>
      .replace(/\*(.*?)\*/g, '<b>$1</b>')     // Convert *text* to <b>text</b>
      .replace(/#{1,6}\s/g, '')               // Remove hash symbols for headers
      .replace(/[\*#]/g, '');                 // Remove any remaining asterisks or hashes

    console.log(`Generated response: ${assistantMessage.substring(0, 100)}...`);

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    
    // Enhanced fallback responses with emojis and HTML formatting
    const fallbackMessage = language === 'KR' 
      ? "죄송합니다만, 현재 기술적인 문제가 발생했습니다 😅 하지만 걱정하지 마세요! 튀니지 여행에 대해 무엇이든 물어보세요. <b>아름다운 사하라 사막</b> 🐪, <b>지중해 해변</b> 🏖️, <b>고대 유적</b> 🏛️, <b>맛있는 요리</b> 🍽️ 등 튀니지의 매력을 알려드릴 수 있습니다! 🌟"
      : language === 'JP' 
        ? "申し訳ございませんが、現在技術的な問題が発生しています 😅 でも心配しないでください！チュニジア旅行について何でもお聞かせください。<b>美しいサハラ砂漠</b> 🐪、<b>地中海のビーチ</b> 🏖️、<b>古代遺跡</b> 🏛️ など、チュニジアの魅力をお伝えできます！ 🌟"
        : "I apologize, but I'm experiencing technical difficulties right now 😅 But don't worry! I'm still here to help with your <b>Tunisia adventure</b>! 🌟 Ask me about our <b>amazing desert tours</b> 🐪, <b>beautiful beaches</b> 🏖️, <b>historic sites</b> 🏛️, or <b>delicious cuisine</b> 🍽️! Let's plan your perfect trip! ✨";

    return new Response(JSON.stringify({ 
      message: fallbackMessage,
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
