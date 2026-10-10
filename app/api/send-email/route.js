import { NextResponse } from "next/server";

import { getAdminDb, requireAdmin } from '../../../lib/firebaseAdmin';
import { takeRateLimit } from '../../../lib/rateLimit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// The only addresses public (non-admin) callers may send to.
const PUBLIC_RECIPIENTS = new Set(['careers@selectivecrew.com', 'staffing@selectivecrew.com']);

export async function POST(request) {
  try {
    const body = await request.json();
    const admin = await requireAdmin(request);
    const hasBearer = Boolean(request.headers.get('authorization'));
    if (admin.error && hasBearer) return NextResponse.json({ error: admin.error }, { status: admin.status });
    const isAdmin = !admin.error;
    
    // Safely extract fields - handle missing or undefined values
    let to = body?.to || null;
    let subject = body?.subject || null;
    let html = body?.html || null;
    let text = body?.text || null;
    let cc = body?.cc || [];
    let attachments = Array.isArray(body?.attachments) ? body.attachments : [];
    let scheduledAt = body?.scheduledAt || null;

    if (!isAdmin && body?.type === 'training-access') {
      const email = String(body?.email || '').trim().toLowerCase();
      const name = String(body?.name || '').trim().slice(0, 120);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
      }
      const [ipAllowed, emailAllowed] = await Promise.all([
        takeRateLimit(request, { scope: 'training-access-ip', limit: 5, windowMs: 60 * 60 * 1000 }),
        takeRateLimit(request, { scope: 'training-access-email', subject: email, limit: 2, windowMs: 24 * 60 * 60 * 1000 }),
      ]);
      if (!ipAllowed || !emailAllowed) return NextResponse.json({ error: 'Please try again later' }, { status: 429 });
      const leads = await getAdminDb().collection('trainingLeads').where('email', '==', email).limit(1).get();
      if (leads.empty) return NextResponse.json({ success: true });
      to = email;
      subject = 'Your Free Duty-Free Sales Training Access - Selective Crew';
      text = `Hi ${name || 'there'},\n\nThank you for registering! Here is your access to the free Duty-Free Sales Excellence course:\n\nhttps://selectivecrew.com/training\n\nOnce you complete the course, please submit your resume/CV in English to careers@selectivecrew.com.\n\nSelective Crew\ncareers@selectivecrew.com\nWhatsApp: +57 318 847 4058`;
      html = null;
      cc = [];
      attachments = [];
      scheduledAt = null;
    } else if (!isAdmin) {
      if (!PUBLIC_RECIPIENTS.has(String(to || '').trim().toLowerCase()) || body?.cc || scheduledAt || html) {
        return NextResponse.json({ error: 'This email operation is not permitted' }, { status: 403 });
      }
      if (!(await takeRateLimit(request, { scope: 'public-careers-email', limit: 8, windowMs: 60 * 60 * 1000 }))) {
        return NextResponse.json({ error: 'Please try again later' }, { status: 429 });
      }
      if (String(subject || '').length > 180 || String(text || '').length > 12000) {
        return NextResponse.json({ error: 'Email content is too long' }, { status: 400 });
      }
      if (attachments.length > 3 || attachments.some(a => a?.path || !a?.content || (a?.type && a.type !== 'application/pdf'))) {
        return NextResponse.json({ error: 'Public emails may include up to three PDF attachments only' }, { status: 400 });
      }
    }
    
    if (body?.attachments != null && !Array.isArray(body.attachments)) {
      return NextResponse.json({ error: 'attachments must be an array' }, { status: 400 });
    }
    
    // Validate required fields
    if (!to) {
      return NextResponse.json({ error: "Recipient email (to) is required" }, { status: 400 });
    }
    
    if (!subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }
    if (!EMAIL_RE.test(String(to)) || String(subject).length > 250) {
      return NextResponse.json({ error: 'Invalid recipient or subject' }, { status: 400 });
    }
    
    if (!html && !text) {
      return NextResponse.json({ error: "Either HTML or text content is required" }, { status: 400 });
    }
    
    // Prepare email content
    let finalHtml = html;
    let finalText = text;
    
    if (!finalHtml && finalText) {
      const safeText = String(finalText).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
      finalHtml = `<div style="font-family: Arial, sans-serif;">${safeText.replace(/\n/g, '<br>')}</div>`;
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
    
    // Add CC - supports array of emails or single string
    if (cc) {
      const ccList = Array.isArray(cc) ? cc.filter(Boolean) : (typeof cc === 'string' && cc.trim() ? [cc.trim()] : []);
      if (ccList.length > 10 || ccList.some(address => !EMAIL_RE.test(String(address)))) {
        return NextResponse.json({ error: 'Invalid CC address' }, { status: 400 });
      }
      if (ccList.length > 0) resendPayload.cc = ccList;
    }
    
    // Add attachments only if there are any
    if (attachments && Array.isArray(attachments) && attachments.length > 0) {
      resendPayload.attachments = await Promise.all(attachments.map(async a => {
        if (a.content) {
          const content = String(a.content);
          if (content.length > 14 * 1024 * 1024) return null;
          return { filename: String(a.filename || 'attachment').slice(0, 150), content };
        }
        if (a.path && isAdmin) {
          // Fetch the file from URL and convert to base64
          try {
            const url = new URL(a.path);
            if (!['firebasestorage.googleapis.com', 'storage.googleapis.com'].includes(url.hostname)) return null;
            const fileRes = await fetch(url);
            if (!fileRes.ok) return null;
            const arrayBuffer = await fileRes.arrayBuffer();
            if (arrayBuffer.byteLength > 10 * 1024 * 1024) return null;
            const base64 = Buffer.from(arrayBuffer).toString('base64');
            return { filename: String(a.filename || 'attachment').slice(0, 150), content: base64 };
          } catch (e) {
            console.error('Failed to fetch attachment from path:', a.path, e);
            return null;
          }
        }
        return null;
      })).then(results => results.filter(Boolean));
    }
    
    if (scheduledAt) resendPayload.scheduled_at = scheduledAt;
    if (!process.env.RESEND_API_KEY) return NextResponse.json({ error: 'Email service is not configured' }, { status: 503 });
    
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
    
    return NextResponse.json({ success: true, id: data.id });
    
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}
