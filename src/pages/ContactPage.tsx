import React from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { ContactForm } from "@/components/ContactForm";
import { ContactBanner } from "@/components/ContactBanner";
import { DynamicMetaTags } from "@/components/DynamicMetaTags";

const ContactPage: React.FC = () => {
  return (
    <MainLayout>
      <DynamicMetaTags />
      
      {/* Contact Banner */}
      <ContactBanner />
      
      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ContactForm />
        </div>
      </section>
    </MainLayout>
  );
};

export default ContactPage;