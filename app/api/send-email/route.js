import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Safely extract fields - handle missing or undefined values
    const to = body?.to || null;
    const subject = body?.subject || null;
    const html = body?.html || null;
    const text = body?.text || null;
    const cc = body?.cc || "";
    const attachments = body?.attachments || [];  // SAFE: default to empty array
    
    // Debug logging
    console.log("=== Email API Received ===");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Has HTML:", !!html);
    console.log("Has Text:", !!text);
    console.log("Attachments:", attachments?.length || 0);
    
    // Validate required fields
    if (!to) {
      return NextResponse.json({ error: "Recipient email (to) is required" }, { status: 400 });
    }
    
    if (!subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }
    
    if (!html && !text) {
      return NextResponse.json({ error: "Either HTML or text content is required" }, { status: 400 });
    }
    
    // Prepare email content
    let finalHtml = html;
    let finalText = text;
    
    if (!finalHtml && finalText) {
      finalHtml = `<div style="font-family: Arial, sans-serif;">${finalText.replace(/\n/g, '<br>')}</div>`;
    }
    
    if (!finalText && finalHtml) {
      finalText = finalHtml.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
    
    // Prepare Resend payload
    const resendPayload = {
      from: "Selective Crew <careers@selectivecrew.com>",
      to: [to],
      subject: subject,
      html: finalHtml,
      text: finalText,
    };
    
    // Add CC only if provided
    if (cc && cc.trim()) {
      resendPayload.cc = [cc];
    }
    
    // Add attachments only if there are any
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      resendPayload.attachments = attachments;
    }
    
    console.log("Sending to Resend...");
    
    // Send to Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(resendPayload),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      console.error("Resend API Error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to send email" }, 
        { status: res.status }
      );
    }
    
    console.log("Email sent successfully:", data.id);
    return NextResponse.json({ success: true, id: data.id });
    
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}
