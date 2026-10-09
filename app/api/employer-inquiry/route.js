import { NextResponse } from 'next/server';

const INQUIRY_RECIPIENT = 'careers@selectivecrew.com';
const MAX_FIELD_LENGTH = 2000;

export async function POST(request) {
  try {
    const body = await request.json();
    const fields = ['company', 'name', 'email', 'positions', 'hires', 'locations', 'timeline'];
    const values = Object.fromEntries(fields.map((field) => [field, String(body?.[field] || '').trim()]));

    if (fields.some((field) => !values[field])) {
      return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      return NextResponse.json({ error: 'Please provide a valid work email.' }, { status: 400 });
    }
    const optionalValues = [String(body?.phone || '').trim(), String(body?.needs || '').trim()];
    if ([...Object.values(values), ...optionalValues].some((value) => value.length > MAX_FIELD_LENGTH)) {
      return NextResponse.json({ error: 'One or more fields are too long.' }, { status: 413 });
    }

    const text = [
      'New employer recruiting inquiry from selectivecrew.com/employers',
      '',
      `Company: ${values.company}`,
      `Contact name: ${values.name}`,
      `Email: ${values.email}`,
      `Phone: ${String(body?.phone || '').trim() || '-'}`,
      `Positions needed: ${values.positions}`,
      `Number of hires: ${values.hires}`,
      `Countries/locations: ${values.locations}`,
      `Hiring timeline: ${values.timeline}`,
      `Hiring needs: ${String(body?.needs || '').trim() || '-'}`,
    ].join('\n');

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Selective Crew <careers@selectivecrew.com>',
        to: [INQUIRY_RECIPIENT],
        reply_to: values.email,
        subject: `LATAM Recruiting Inquiry - ${values.company}`,
        text,
      }),
    });

    if (!resendResponse.ok) {
      console.error('Employer inquiry email failed:', await resendResponse.json().catch(() => ({})));
      return NextResponse.json({ error: 'Unable to send your inquiry right now.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Employer inquiry error:', error);
    return NextResponse.json({ error: 'Unable to send your inquiry right now.' }, { status: 500 });
  }
}
