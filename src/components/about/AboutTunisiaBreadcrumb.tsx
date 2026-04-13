
import React from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function AboutTunisiaBreadcrumb() {
  const { currentLanguage, updateKey } = useTranslation();

  return (
    <div className="mb-4 sm:mb-6 overflow-x-auto hide-scrollbar">
      <Breadcrumb>
        <BreadcrumbList className="flex flex-nowrap items-center">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-gray-500 hover:text-blue-500 transition-colors whitespace-nowrap text-sm md:text-base">
              <TranslateText 
                text="Home" 
                language={currentLanguage}
                key={`home-${updateKey}`}
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="mx-2 text-gray-400">&gt;</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-blue-500 whitespace-nowrap text-sm md:text-base">
              <TranslateText 
                text="About Tunisia" 
                language={currentLanguage}
                key={`about-tunisia-${updateKey}`}
              />
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
