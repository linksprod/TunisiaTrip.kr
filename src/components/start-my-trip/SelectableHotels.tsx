
import React from "react";
import { Hotel } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface SelectableHotelsProps {
  selectedHotels: string[];
  setSelectedHotels: (hotels: string[]) => void;
}

export function SelectableHotels({ selectedHotels, setSelectedHotels }: SelectableHotelsProps) {
  const hotels = [
    {
      id: "1",
      name: "Four Seasons Hotel",
      location: "Tunis, Tunisia",
      image: "/lovable-uploads/31fa750b-9618-4556-9aa2-c9b62cf3b480.png",
      rating: 5,
    },
    {
      id: "2",
      name: "Anantara Tozeur",
      location: "Tozeur, Tunisia",
      image: "/lovable-uploads/7848de0b-5463-4416-ae56-7922714a447b.png",
      rating: 5,
    },
    {
      id: "3",
      name: "Movenpick Sousse",
      location: "Sousse, Tunisia",
      image: "/lovable-uploads/d5b362eb-773a-485d-aa39-67eff2ccf55e.png",
      rating: 5,
    },
    {
      id: "4",
      name: "The Residence Tunis",
      location: "Tunis, Tunisia",
      image: "/lovable-uploads/4de6ef16-ca24-431b-899d-e5c7cf11c73c.png",
      rating: 5,
    },
    {
      id: "5",
      name: "Le Kasbah Kairouan",
      location: "Kairouan, Tunisia",
      image: "/lovable-uploads/4fdc3022-820b-4653-8401-6d31df53747b.png",
      rating: 5,
    },
    {
      id: "6",
      name: "Pansy KSAR Ghilene",
      location: "Ghilene, Tunisia",
      image: "/lovable-uploads/53341fca-0b8d-47ff-a07c-7a30290c0170.png",
      rating: 5,
    },
  ];

  const handleHotelToggle = (hotelId: string) => {
    if (selectedHotels.includes(hotelId)) {
      setSelectedHotels(selectedHotels.filter(id => id !== hotelId));
    } else {
      setSelectedHotels([...selectedHotels, hotelId]);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <Checkbox
                  checked={selectedHotels.includes(hotel.id)}
                  onCheckedChange={() => handleHotelToggle(hotel.id)}
                  className="h-5 w-5 bg-white border-2"
                />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{hotel.location}</p>
                  <h3 className="text-lg font-medium mt-1">{hotel.name}</h3>
                </div>
                <Hotel className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex mt-2">
                {Array.from({ length: hotel.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
