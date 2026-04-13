
import React from 'react';
import { OverviewCards } from './OverviewCards';
import { CountryLocationContent } from './CountryLocationContent';
import { TunisianWeatherContent } from './TunisianWeatherContent';
import { LinguisticDiversityContent } from './LinguisticDiversityContent';
import { ReligionsContent } from './ReligionsContent';

// Import new content-rich components
import { CitiesContent } from './content/CitiesContent';
import { CultureContent } from './content/CultureContent';
import { RegionsContent } from './content/RegionsContent';

const getCardColumnClass = () => {
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
};

interface AboutTunisiaContentProps {
  activeTab: string;
}

export function AboutTunisiaContent({ activeTab }: AboutTunisiaContentProps) {
  let content: React.ReactNode;
  if (activeTab === 'overview') {
    content = (
      <div className="space-y-10 animate-fade-in">
        <OverviewCards getCardColumnClass={getCardColumnClass} />
        <section className="mt-8">
          <CitiesContent />
        </section>
      </div>
    );
  } else if (activeTab === 'location') {
    content = <CountryLocationContent />;
  } else if (activeTab === 'culture') {
    // Use detailed culture component instead of placeholder
    content = <CultureContent />;
  } else if (activeTab === 'regions') {
    // Use detailed regions component instead of placeholder
    content = <RegionsContent />;
  } else if (activeTab === 'weather') {
    content = <TunisianWeatherContent />;
  } else if (activeTab === 'languages') {
    content = <LinguisticDiversityContent />;
  } else if (activeTab === 'religions') {
    content = <ReligionsContent />;
  } else {
    content = (
      <div className="space-y-10 animate-fade-in">
        <OverviewCards getCardColumnClass={getCardColumnClass} />
        <section className="mt-8">
          <CitiesContent />
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="min-h-[50vh]">
        {content}
      </div>
    </div>
  );
}
