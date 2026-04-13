import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { useContacts } from "@/hooks/use-contacts";
import { Loader2, Mail, Send } from "lucide-react";

export function ContactForm(): JSX.Element {
  const { currentLanguage } = useTranslation();
  const { submitContact } = useContacts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitContact(formData);
      if (result.success) {
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      console.error("Failed to submit contact:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            <TranslateText text="Contact Us" language={currentLanguage} />
          </CardTitle>
          <CardDescription>
            <TranslateText text="We'd love to hear from you. Send us a message and we'll respond as soon as possible." language={currentLanguage} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  <TranslateText text="Name" language={currentLanguage} /> *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={currentLanguage === 'KR' ? "성함을 입력하세요" : "Enter your name"}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  <TranslateText text="Email" language={currentLanguage} /> *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={currentLanguage === 'KR' ? "이메일을 입력하세요" : "Enter your email"}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                <TranslateText text="Subject" language={currentLanguage} />
              </label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder={currentLanguage === 'KR' ? "제목을 입력하세요" : "Enter subject"}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                <TranslateText text="Message" language={currentLanguage} /> *
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={currentLanguage === 'KR' ? "메시지를 입력하세요" : "Enter your message"}
                rows={6}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-12"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <TranslateText text="Sending..." language={currentLanguage} />
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  <TranslateText text="Send Message" language={currentLanguage} />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}