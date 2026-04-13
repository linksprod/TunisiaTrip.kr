import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching contacts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("contacts")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setContacts(prev => 
        prev.map(contact => 
          contact.id === id 
            ? { ...contact, status, updated_at: new Date().toISOString() }
            : contact
        )
      );

      toast({
        title: "Status Updated",
        description: "Contact status has been updated successfully."
      });
    } catch (err) {
      console.error("Error updating contact status:", err);
      toast({
        title: "Update Failed",
        description: "Failed to update contact status.",
        variant: "destructive"
      });
    }
  };

  const submitContact = async (contactData: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => {
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: contactData
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon."
      });

      return { success: true };
    } catch (err) {
      console.error("Error submitting contact:", err);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    isLoading,
    error,
    updateContactStatus,
    submitContact,
    refetch: fetchContacts
  };
};