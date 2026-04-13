import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactRequest = await req.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Save contact to database
    const { error: dbError } = await supabase
      .from("contacts")
      .insert([
        {
          name,
          email,
          subject: subject || "Contact Form Submission",
          message,
          status: "new"
        }
      ]);

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save contact");
    }

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Tunisia Trip <noreply@resend.dev>",
      to: ["hello.tunisiatrip@gmail.com"],
      subject: `New Contact: ${subject || "Contact Form Submission"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || "Contact Form Submission"}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e8f4f8; border-radius: 5px; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              This message was sent through the Tunisia Trip contact form.<br>
              Reply directly to this email to respond to ${name}.
            </p>
          </div>
        </div>
      `,
      replyTo: email
    });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "Tunisia Trip <noreply@resend.dev>",
      to: [email],
      subject: "Thank you for contacting Tunisia Trip!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066cc;">Thank you for contacting us, ${name}!</h2>
          
          <p style="line-height: 1.6; color: #333;">
            We have received your message and will get back to you as soon as possible.
          </p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your message:</h3>
            <p style="color: #666; font-style: italic;">"${message}"</p>
          </div>
          
          <p style="line-height: 1.6; color: #333;">
            Our team typically responds within 24 hours during business days.
          </p>
          
          <p style="line-height: 1.6; color: #333;">
            Best regards,<br>
            <strong>The Tunisia Trip Team</strong>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #888; text-align: center;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `
    });

    console.log("Admin email sent:", adminEmailResponse);
    console.log("User confirmation sent:", userEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Contact saved and emails sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to process contact" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);