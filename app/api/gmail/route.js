import { NextResponse } from 'next/server';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';

const CLIENT_ID     = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI  = 'https://selectivecrew.com/api/gmail-callback';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

function getDb() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getFirestore(app);
}

async function getValidToken() {
  const db = getDb();
  const snap = await getDoc(doc(db, 'settings', 'gmail_oauth'));
  if (!snap.exists()) return null;
  const { access_token, refresh_token, expires_at } = snap.data();
  if (expires_at && Date.now() < expires_at - 300000) return access_token;
  if (!refresh_token) return null;
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token, grant_type: 'refresh_token' }),
    });
    const data = await res.json();
    if (data.error) return null;
    await setDoc(doc(db, 'settings', 'gmail_oauth'), { access_token: data.access_token, refresh_token, expires_at: Date.now() + (data.expires_in * 1000) });
    return data.access_token;
  } catch(e) { return null; }
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'create-event') {
    try {
      const token = await getValidToken();
      if (!token) return NextResponse.json({ error: 'Gmail not connected. Please reconnect in the admin panel under Import from Gmail.' }, { status: 401 });
      const body = await request.json();
      const { summary, description, startTime, endTime, attendeeEmail } = body;
      const event = {
        summary, description,
        start: { dateTime: startTime, timeZone: 'America/Bogota' },
        end: { dateTime: endTime, timeZone: 'America/Bogota' },
        attendees: [{ email: attendeeEmail }],
        conferenceData: { createRequest: { requestId: Math.random().toString(36).substring(7), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
        reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 1440 }, { method: 'popup', minutes: 30 }] },
      };
      const res = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
        { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(event) }
      );
      const data = await res.json();
      if (data.error) return NextResponse.json({ error: data.error.message }, { status: 400 });
      return NextResponse.json({ success: true, meetLink: data.conferenceData?.entryPoints?.[0]?.uri || '', htmlLink: data.htmlLink });
    } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const code   = searchParams.get('code');

  if (action === 'auth-url') {
    const params = new URLSearchParams({
      client_id: CLIENT_ID, redirect_uri: REDIRECT_URI, response_type: 'code',
      scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar',
      access_type: 'offline', prompt: 'consent', state: 'gmail-auth',
    });
    return NextResponse.json({ url: 'https://accounts.google.com/o/oauth2/v2/auth?' + params });
  }

  if (action === 'exchange' && code) {
    try {
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uri: REDIRECT_URI, grant_type: 'authorization_code' }),
      });
      const data = await res.json();
      console.log('OAuth exchange response:', JSON.stringify(data));
      if (data.error) return NextResponse.json({ error: data.error + ': ' + (data.error_description || '') }, { status: 400 });
      const db = getDb();
      await setDoc(doc(db, 'settings', 'gmail_oauth'), {
        access_token:  data.access_token,
        refresh_token: data.refresh_token,
        expires_at:    Date.now() + (data.expires_in * 1000),
        connected_at:  Date.now(),
      });
      return NextResponse.json({ access_token: data.access_token, saved: true });
    } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  if (action === 'status') {
    try {
      const token = await getValidToken();
      return NextResponse.json({ connected: !!token });
    } catch(e) { return NextResponse.json({ connected: false }); }
  }

  if (action === 'assignments') {
    try {
      const token = await getValidToken();
      if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
      const labelsRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', { headers: { Authorization: 'Bearer ' + token } });
      const labelsData = await labelsRes.json();
      const label = labelsData.labels?.find(l => l.name.toLowerCase() === 'starboard assignment');
      if (!label) return NextResponse.json({ error: 'Label not found. Create a label called "Starboard Assignment" in Gmail.' }, { status: 404 });
      const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=' + label.id + '&maxResults=50', { headers: { Authorization: 'Bearer ' + token } });
      const listData = await listRes.json();
      if (!listData.messages) return NextResponse.json({ emails: [] });
      const emails = await Promise.all(listData.messages.map(async (msg) => {
        const msgRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/' + msg.id + '?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date', { headers: { Authorization: 'Bearer ' + token } });
        const msgData = await msgRes.json();
        const headers = msgData.payload?.headers || [];
        const from    = headers.find(h => h.name === 'From')?.value || '';
        const subject = headers.find(h => h.name === 'Subject')?.value || '';
        const date    = headers.find(h => h.name === 'Date')?.value || '';
        const emailMatch = from.match(/<(.+)>/);
        return { id: msg.id, email: emailMatch ? emailMatch[1].trim() : from, subject, date };
      }));
      return NextResponse.json({ emails });
    } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }
  if (action === 'emails' || action === 'labeled') {
    try {
      const token = await getValidToken();
      if (!token) return NextResponse.json({ error: 'Not authenticated. Please reconnect Gmail.' }, { status: 401 });
      const labelsRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', { headers: { Authorization: 'Bearer ' + token } });
      const labelsData = await labelsRes.json();
      const label = labelsData.labels?.find(l => l.name.toLowerCase() === 'import to crm');
      if (!label) return NextResponse.json({ error: 'Label not found. Create a label called "Import to CRM" in Gmail.' }, { status: 404 });
      const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=' + label.id + '&maxResults=50', { headers: { Authorization: 'Bearer ' + token } });
      const listData = await listRes.json();
      if (!listData.messages) return NextResponse.json({ emails: [] });
      const emails = await Promise.all(listData.messages.map(async (msg) => {
        const msgRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/' + msg.id + '?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date', { headers: { Authorization: 'Bearer ' + token } });
        const msgData = await msgRes.json();
        const headers = msgData.payload?.headers || [];
        const from    = headers.find(h => h.name === 'From')?.value || '';
        const subject = headers.find(h => h.name === 'Subject')?.value || '';
        const date    = headers.find(h => h.name === 'Date')?.value || '';
        const emailMatch = from.match(/<(.+)>/);
        const nameMatch  = from.match(/^(.+?)\s*</);
        return { id: msg.id, email: emailMatch ? emailMatch[1].trim() : from, name: nameMatch ? nameMatch[1].trim().replace(/"/g,'') : from, subject, date, snippet: msgData.snippet || '' };
      }));
      return NextResponse.json({ emails });
    } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}