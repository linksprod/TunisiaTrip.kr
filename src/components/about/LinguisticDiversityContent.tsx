import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TranslateText } from "@/components/translation/TranslateText";

export function LinguisticDiversityContent() {
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);

  // Language cards data
  const languageCards = [
    {
      id: "arabic",
      category: "Primary Language",
      title: "Arabic in Tunisia",
      description: "Article 1 of the Tunisian Constitution, enacted after the 2011 revolution, defines Arabic as the \"language of the state.\" Article 39 of the Constitution...",
      content: "Article 1 of the Tunisian Constitution, enacted after the 2011 revolution, defines Arabic as the \"language of the state.\" Article 39 of the Constitution also stipulates the universalization of Arab identity and Arabic language education.\n\nTunisian Arabic is similar to the dialects of Algerian and Moroccan dialects that border the country. It is different from standard Arabic, so there is a joke that Tunisian is spoken in Tunisia. Tunisian Arabic is a mixture of many languages, including standard Arabic, French, and Italian.",
      image: "/lovable-uploads/51d60728-8778-4e74-826d-4640ab4aea8b.png"
    },
    {
      id: "french",
      category: "Second Language",
      title: "French in Tunisia",
      description: "During the French colonial rule of Tunisia, French was introduced into public institutions and the education system. It is also a full member of the Francophonie...",
      content: "During the French colonial rule of Tunisia, French was introduced into public institutions and the education system. It is also a full member of the Francophonie, an international organization of French-speaking countries.",
      image: "/lovable-uploads/3c0b1725-00a1-4c11-a832-7c4b586eebdf.png"
    },
    {
      id: "english",
      category: "Growing Language",
      title: "English in Tunisia",
      description: "Young Tunisians speak English quite well and tend to prefer it to French. With increasing globalization and tourism, English is becoming more popular...",
      content: "Young Tunisians speak English quite well and tend to prefer it to French. With the growing influence of global media and the tourism industry, many younger Tunisians are becoming increasingly proficient in English.",
      image: "/lovable-uploads/145d185a-0057-45ba-ba8b-33d5e5f960a3.png"
    },
    {
      id: "amazigh",
      category: "Indigenous Language",
      title: "Amazigh Language",
      description: "The language spoken by the Berber people, also called Berber, was the language used in North Africa before Arabic spread in the Middle Ages...",
      content: "The language spoken by the Berber people, also called Amazigh, was the language used in North Africa before Arabic spread in the Middle Ages. Although only a small percentage of Tunisians speak Berber languages today, they represent an important part of Tunisia's cultural heritage.",
      image: "/lovable-uploads/5d0e792c-e35e-43a4-ae97-71f48ca58d1d.png"
    }
  ];

  const handleCardClick = (id: string) => {
    setActiveLanguage(id === activeLanguage ? null : id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Section Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
          <TranslateText text="Linguistic Diversity in Tunisia" />
        </h2>
      </div>

      {/* Language Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {languageCards.map((card) => (
          <Card 
            key={card.id} 
            className={`overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-md ${
              activeLanguage === card.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="h-[180px] overflow-hidden bg-gray-100">
              <img 
                src={card.image} 
                alt={card.title} 
                className="w-full h-full object-contain"
              />
            </div>
            <CardContent className="p-4">
              <p className="text-blue-500 text-sm mb-1"><TranslateText text={card.category} /></p>
              <h3 className="text-lg font-semibold mb-2"><TranslateText text={card.title} /></h3>
              <p className="text-gray-700 text-sm line-clamp-3"><TranslateText text={card.description} /></p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Language Content */}
      {activeLanguage && (
        <div className="w-full border border-blue-200 rounded-lg p-8 mb-10">
          {languageCards
            .filter(card => card.id === activeLanguage)
            .map(card => (
              <div key={card.id} className="flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="md:w-1/2">
                  <h2 className="text-3xl font-semibold mb-6"><TranslateText text={card.title} /></h2>
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                    <TranslateText text={card.content} />
                  </p>
                </div>
                <div className="md:w-1/2 flex justify-center bg-gray-50 p-6 rounded-lg">
                  <img 
                    src={card.image} 
                    alt={`${card.title} representation`} 
                    className="max-w-full h-auto max-h-[300px]"
                  />
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Language Facts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3"><TranslateText text="Linguistic Diversity" /></h3>
          <p>
            <TranslateText text="Tunisia is a linguistically diverse country with Arabic as the official language, but with significant influence from French, Berber languages, and increasingly English. This diversity reflects Tunisia's rich history and position at the crossroads of different civilizations." />
          </p>
        </div>
        
        <div className="bg-amber-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3"><TranslateText text="Language Education" /></h3>
          <p>
            <TranslateText text="Tunisia's education system places strong emphasis on language learning. Arabic is taught from the early years, with French introduced in elementary school. English is typically taught from middle school onward, and many students also study Italian, Spanish, German, or Turkish." />
          </p>
        </div>
      </div>
    </div>
  );
}
