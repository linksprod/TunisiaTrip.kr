
import React from "react";
import { Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface SelectableGuestHousesProps {
  selectedGuestHouses: string[];
  setSelectedGuestHouses: (guestHouses: string[]) => void;
}

export function SelectableGuestHouses({ selectedGuestHouses, setSelectedGuestHouses }: SelectableGuestHousesProps) {
  const guestHouses = [
    {
      id: "1",
      name: "Dar Ben Gacem",
      location: "Medina of Tunis, Tunisia",
      image: "/lovable-uploads/549c131b-140c-4a2b-a663-3d920f194f91.png",
      rating: 5,
    },
    {
      id: "2",
      name: "Dar Fatma",
      location: "Sidi Bou Said, Tunis, Tunisia",
      image: "/lovable-uploads/cbd7751a-e460-45c8-847d-849a5ca51bcc.png",
      rating: 5,
    },
    {
      id: "3",
      name: "Dar Ellama",
      location: "Bizerte, Tunisia",
      image: "/lovable-uploads/549c131b-140c-4a2b-a663-3d920f194f91.png",
      rating: 5,
    },
  ];

  const handleGuestHouseToggle = (guestHouseId: string) => {
    if (selectedGuestHouses.includes(guestHouseId)) {
      setSelectedGuestHouses(selectedGuestHouses.filter(id => id !== guestHouseId));
    } else {
      setSelectedGuestHouses([...selectedGuestHouses, guestHouseId]);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {guestHouses.map((guestHouse) => (
          <Card key={guestHouse.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={guestHouse.image}
                alt={guestHouse.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <Checkbox
                  checked={selectedGuestHouses.includes(guestHouse.id)}
                  onCheckedChange={() => handleGuestHouseToggle(guestHouse.id)}
                  className="h-5 w-5 bg-white border-2"
                />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{guestHouse.location}</p>
                  <h3 className="text-lg font-medium mt-1">{guestHouse.name}</h3>
                </div>
                <Home className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex mt-2">
                {Array.from({ length: guestHouse.rating }).map((_, i) => (
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
