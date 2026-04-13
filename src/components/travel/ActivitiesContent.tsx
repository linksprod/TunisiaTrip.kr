import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDeviceSize } from "@/hooks/use-mobile";
import { HistoricalMuseums } from "./museums/HistoricalMuseums";
import { WinterFestivals } from "./festivals/WinterFestivals";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

// Activities data
const activities = [{
  id: 1,
  title: "Desert Safari & Camel Riding",
  location: "Sahara Desert, Douz",
  rating: 4.9,
  duration: "Half-day to multi-day",
  price: "$$",
  description: "Experience the magic of the Sahara Desert on a camel trek across golden dunes. Watch the sunset paint the landscape in spectacular colors before enjoying traditional Berber hospitality at a desert camp. Options range from short rides to overnight or multi-day adventures.",
  image: "/lovable-uploads/a2d95c89-23fc-48b3-b72b-742bdd9b0076.png",
  tags: ["Adventure", "Nature", "Cultural"]
}, {
  id: 2,
  title: "Explore Ancient Carthage",
  location: "Carthage, near Tunis",
  rating: 4.8,
  duration: "3-4 hours",
  price: "$",
  description: "Walk through the legendary ruins of Carthage, once the center of a powerful ancient civilization. This UNESCO World Heritage site features thermal baths, amphitheaters, residential quarters, and the Tophet sanctuary. The nearby Carthage Museum houses an impressive collection of artifacts.",
  image: "/lovable-uploads/59785105-2ab9-4ee5-9e99-65d6f4634e73.png",
  tags: ["Historical", "UNESCO Site", "Educational"]
}, {
  id: 3,
  title: "Wander Through Sidi Bou Said",
  location: "Sidi Bou Said, near Tunis",
  rating: 4.8,
  duration: "2-3 hours",
  price: "$",
  description: "Get lost in the picturesque blue and white village of Sidi Bou Said perched on a cliff overlooking the Mediterranean. Explore its charming cobblestone streets, browse artisanal shops, sip mint tea at cliff-side cafes, and enjoy breathtaking sea views that have inspired artists for generations.",
  image: "/lovable-uploads/2714f2c3-4465-4a55-8369-5484aa8f3b28.png",
  tags: ["Cultural", "Photography", "Relaxation"]
}, {
  id: 4,
  title: "Visit the El Jem Amphitheatre",
  location: "El Jem",
  rating: 4.9,
  duration: "1-2 hours",
  price: "$",
  description: "Marvel at one of the world's best-preserved Roman amphitheaters, El Jem. Built in the 3rd century, this massive structure could seat up to 35,000 spectators and rivals Rome's Colosseum in its scale and grandeur. Explore the underground passages where gladiators and wild animals once waited before their contests.",
  image: "/lovable-uploads/b1054a66-c723-4e47-b4d5-345f2c611881.png",
  tags: ["Historical", "UNESCO Site", "Architecture"]
}, {
  id: 6,
  title: "Shop in Traditional Souks",
  location: "Medinas across Tunisia",
  rating: 4.6,
  duration: "2-4 hours",
  price: "$-$$",
  description: "Immerse yourself in the vibrant atmosphere of Tunisia's traditional markets. Navigate labyrinthine alleys filled with colorful goods from handwoven carpets and ceramics to spices, perfumes, and metalwork. Practice your bargaining skills for an authentic local experience. The souks of Tunis, Sfax, and Kairouan are particularly renowned.",
  image: "/lovable-uploads/17d3abc2-7548-4528-9546-2db58e5b2029.png",
  tags: ["Shopping", "Cultural", "Crafts"]
}, {
  id: 9,
  title: "Star Wars Film Locations Tour",
  location: "Southern Tunisia",
  rating: 4.8,
  duration: "1-3 days",
  price: "$$-$$$",
  description: "Visit the otherworldly landscapes that served as Tatooine in the Star Wars films. Explore Luke Skywalker's home in Matmata, the Mos Espa set in the Ong Jemel desert, and other iconic filming locations. This tour combines science fiction nostalgia with Tunisia's unique desert geography.",
  image: "/lovable-uploads/9eb876d7-b767-4dea-a400-0ee661b1abdc.png",
  tags: ["Film Tourism", "Adventure", "Photography"]
}];

// Filter categories
const categories = [{
  name: "All Activities",
  count: activities.length
}, {
  name: "Adventure",
  count: activities.filter(a => a.tags.includes("Adventure")).length
}, {
  name: "Cultural",
  count: activities.filter(a => a.tags.includes("Cultural")).length
}, {
  name: "Historical",
  count: activities.filter(a => a.tags.includes("Historical")).length
}, {
  name: "Nature",
  count: activities.filter(a => a.tags.includes("Nature")).length
}];

export function ActivitiesContent() {
  const { currentLanguage } = useTranslation();
  const {
    isMobile,
    isTablet
  } = useDeviceSize();
  const [activeCategory, setActiveCategory] = React.useState("All Activities");
  const [filteredActivities, setFilteredActivities] = React.useState(activities);
  const getCardColumnClass = () => {
    if (isMobile) return "grid-cols-1";
    if (isTablet) return "grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };
  React.useEffect(() => {
    if (activeCategory === "All Activities") {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter(activity => activity.tags.includes(activeCategory)));
    }
  }, [activeCategory]);
  const renderStarRating = (rating: number) => {
    return <div className="flex items-center">
        <div className="flex items-center mr-1">
          {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : i < rating ? "text-yellow-400 fill-yellow-400 opacity-50" : "text-gray-300"}`} />)}
        </div>
        <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>;
  };
  return <div className="w-full">
      <div className="mb-8 sm:mb-12">
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
          <TranslateText 
            text="Tunisia offers a diverse range of activities for every type of traveler. From exploring ancient Roman ruins and wandering through picturesque blue-and-white villages to riding camels in the Sahara Desert and relaxing on Mediterranean beaches, there's something for everyone."
            language={currentLanguage}
          />
        </p>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
          <TranslateText 
            text="Browse our selection of top activities and experiences below to help plan your perfect Tunisian adventure."
            language={currentLanguage}
          />
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          <TranslateText text="Explore by Category" language={currentLanguage} />
        </h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map(category => (
            <button 
              key={category.name} 
              className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                activeCategory === category.name ? "bg-blue-500 text-white border-blue-500" : 
                "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`} 
              onClick={() => setActiveCategory(category.name)}
            >
              <TranslateText text={`${category.name} (${category.count})`} language={currentLanguage} />
            </button>
          ))}
        </div>
      </div>

      <div className={`grid ${getCardColumnClass()} gap-6 sm:gap-8 mb-16`}>
        {filteredActivities.map(activity => (
          <Card key={activity.id} className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="relative overflow-hidden">
              <img src={activity.image} alt={activity.title} className="w-full h-[200px] sm:h-[240px] object-cover hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 right-3 flex gap-1">
                {activity.tags.slice(0, 2).map(tag => <span key={tag} className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                    <TranslateText text={tag} language={currentLanguage} />
                  </span>)}
              </div>
            </div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  <TranslateText text={activity.title} language={currentLanguage} />
                </h3>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {activity.price.replace(/\$/g, '')}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">
                  <TranslateText text="Location:" language={currentLanguage} />
                </span>{" "}
                <TranslateText text={activity.location} language={currentLanguage} />
              </p>
              
              <div className="flex justify-between items-center mb-3">
                {renderStarRating(activity.rating)}
                <span className="text-sm text-gray-600">
                  <TranslateText text={activity.duration} language={currentLanguage} />
                </span>
              </div>
              
              <p className="text-gray-700 text-sm sm:text-base mb-4">
                <TranslateText text={activity.description} language={currentLanguage} />
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {activity.tags.map(tag => (
                  <span key={tag} className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    <Tag className="w-3 h-3 mr-1" />
                    <TranslateText text={tag} language={currentLanguage} />
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Historical Museums Section */}
      <section className="mb-16">
        <HistoricalMuseums />
      </section>
      
      {/* Winter Festivals Section */}
      <WinterFestivals />
      
      {/* Activity Booking Information */}
      <div className="bg-blue-50 rounded-lg p-6 sm:p-8 mb-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
          <TranslateText text="How to Book Activities" language={currentLanguage} />
        </h3>
        <p className="text-gray-700 mb-4">
          <TranslateText 
            text="Most activities can be booked through our Atlantis Tours packages or arranged separately. For the best experience, we recommend booking activities in advance, especially during the high season (June-September). Our team can help you customize your itinerary to include your preferred activities."
            language={currentLanguage}
          />
        </p>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white" asChild>
          <a href="https://atlantis-voyages.com/#contact" target="_blank" rel="noopener noreferrer">
            <TranslateText text="Contact Our Activity Specialists" language={currentLanguage} />
          </a>
        </Button>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2" asChild>
          <Link to="/travel" onClick={() => {
            window.scrollTo(0, 0);
            const event = new CustomEvent('changeTab', {
              detail: { tab: 'departure' }
            });
            window.dispatchEvent(event);
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4L17 12L9 20" stroke="#347EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)" />
            </svg>
            <TranslateText text="Pre-Departure Information" language={currentLanguage} />
          </Link>
        </Button>
        
        <div className="invisible">
          <Button variant="outline" className="text-blue-500 border-blue-500 gap-2">
            <TranslateText text="Next" language={currentLanguage} />
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>;
}
