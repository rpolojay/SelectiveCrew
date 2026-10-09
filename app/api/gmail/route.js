import { NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { getAdminDb, requireAdmin } from '../../../lib/firebaseAdmin';

const CLIENT_ID     = '36078031878-33j2resrbm3u7ppn7j6c1dvfpeiiq64s.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI  = 'https://selectivecrew.com/api/gmail-callback';

async function firestoreGet(collection, docId) {
  const snap = await getAdminDb().collection(collection).doc(docId).get();
  return snap.exists ? snap.data() : null;
}

async function firestoreSet(collection, docId, fields) {
  await getAdminDb().collection(collection).doc(docId).set(fields, { merge: true });
}


async function removeLabelFromMessage(token, messageId, labelId) {
  try {
    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/' + messageId + '/modify', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ removeLabelIds: [labelId] }),
    });
  } catch(e) { console.error('Remove label error:', e); }
}


async function getValidToken() {
  try {
    const data = await firestoreGet('settings', 'gmail_oauth');
    if (!data) return null;
    const { access_token, refresh_token, expires_at } = data;
    if (expires_at && Date.now() < Number(expires_at) - 300000) return access_token;
    if (!refresh_token) return null;
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token, grant_type: 'refresh_token' }),
    });
    const tokenData = await res.json();
    if (tokenData.error) throw new Error('Refresh failed: ' + tokenData.error + ' - ' + (tokenData.error_description||''));
    await firestoreSet('settings', 'gmail_oauth', { access_token: tokenData.access_token, refresh_token, expires_at: String(Date.now() + (tokenData.expires_in * 1000)) });
    return tokenData.access_token;
  } catch(e) { throw e; }
}

export async function POST(request) {
  const admin = await requireAdmin(request);
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'create-event') {
    try {
      const token = await getValidToken();
      if (!token) return NextResponse.json({ error: 'Gmail not connected. Please reconnect.' }, { status: 401 });
      const body = await request.json();
      const { summary, description, startTime, endTime, attendeeEmail, ccEmail } = body;
      const event = {
        summary, description,
        start: { dateTime: startTime, timeZone: 'America/Bogota' },
        end:   { dateTime: endTime,   timeZone: 'America/Bogota' },
        attendees: [{ email: attendeeEmail }, ...(ccEmail ? [{ email: ccEmail, optional: true }] : [])],
        conferenceData: { createRequest: { requestId: Math.random().toString(36).substring(7), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
        reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 1440 }, { method: 'popup', minutes: 30 }] },
      };
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
        { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(event) });
      const data = await res.json();
      if (data.error) return NextResponse.json({ error: data.error.message }, { status: 400 });
      return NextResponse.json({ success: true, meetLink: data.conferenceData?.entryPoints?.[0]?.uri || '', htmlLink: data.htmlLink });
    } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function GET(request) {
  const admin = await requireAdmin(request);
  if (admin.error) return NextResponse.json({ error: admin.error }, { status: admin.status });
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'auth-url') {
    if (!CLIENT_SECRET) return NextResponse.json({ error: 'Gmail integration is not configured.' }, { status: 503 });
    const state = randomBytes(32).toString('hex');
    await getAdminDb().collection('gmailOAuthStates').doc(state).set({ uid: admin.decoded.uid, createdAt: Date.now() });
    const params = new URLSearchParams({
      client_id: CLIENT_ID, redirect_uri: REDIRECT_URI, response_type: 'code',
      scope: 'https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar',
      access_type: 'offline', prompt: 'consent', state,
    });
    return NextResponse.json({ url: 'https://accounts.google.com/o/oauth2/v2/auth?' + params });
  }

  if (action === 'exchange') return NextResponse.json({ error: 'Use the secured OAuth callback.' }, { status: 410 });

  if (action === 'status') {
    try {
      const token = await getValidToken();
      return NextResponse.json({ connected: !!token });
    } catch(e) { return NextResponse.json({ connected: false }); }
  }


  if (action === 'remove-label') {
    try {
      const messageId = searchParams.get('messageId');
      if (!messageId) return NextResponse.json({ error: 'No messageId' }, { status: 400 });
      const token = await getValidToken();
      if (!token) return NextResponse.json({ error: 'Not connected' }, { status: 401 });
      const labelsRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', { headers: { Authorization: 'Bearer ' + token } });
      const labelsData = await labelsRes.json();
      const label = labelsData.labels?.find(l => l.name.toLowerCase() === 'import to crm');
      if (!label) return NextResponse.json({ error: 'Label not found' }, { status: 404 });
      await removeLabelFromMessage(token, messageId, label.id);
      return NextResponse.json({ success: true });
    } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  if (action === 'assignments') {
    try {
      const token = await getValidToken();
      if (!token) return NextResponse.json({ error: 'Not authenticated. Please reconnect Gmail.' }, { status: 401 });
      const labelsRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', { headers: { Authorization: 'Bearer ' + token } });
      const labelsData = await labelsRes.json();
      const label = labelsData.labels?.find(l => l.name.toLowerCase() === 'starboard assignment');
      if (!label) return NextResponse.json({ error: 'Label "Starboard Assignment" not found in Gmail.' });
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
      let token;
      try { token = await getValidToken(); } catch(e) { return NextResponse.json({ error: 'Token error: ' + e.message }, { status: 401 }); }
      if (!token) return NextResponse.json({ error: 'Gmail not connected. Please reconnect.' }, { status: 401 });
      const labelsRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', { headers: { Authorization: 'Bearer ' + token } });
      const labelsData = await labelsRes.json();
      const label = labelsData.labels?.find(l => l.name.toLowerCase() === 'import to crm');
      if (!label) return NextResponse.json({ error: 'Label "Import to CRM" not found in Gmail.' });
      const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=' + label.id + '&maxResults=50', { headers: { Authorization: 'Bearer ' + token } });
      const listData = await listRes.json();
      if (!listData.messages) return NextResponse.json({ emails: [] });
      const emails = [];
      for (const msg of listData.messages) {
        try {
          const msgRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/' + msg.id + '?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date', { headers: { Authorization: 'Bearer ' + token } });
          if (!msgRes.ok) continue;
          const msgData = await msgRes.json();
          const headers = msgData.payload?.headers || [];
          const from    = headers.find(h => h.name === 'From')?.value || '';
          const subject = headers.find(h => h.name === 'Subject')?.value || '';
          const date    = headers.find(h => h.name === 'Date')?.value || '';
          const emailMatch = from.match(/<(.+)>/);
          const nameMatch  = from.match(/^(.+?)\s*</);
          emails.push({ id: msg.id, email: emailMatch ? emailMatch[1].trim() : from, name: nameMatch ? nameMatch[1].trim().replace(/"/g,'') : from, subject, date });
          await new Promise(r => setTimeout(r, 50));
        } catch(msgErr) { continue; }
      }
      return NextResponse.json({ emails, total: listData.messages.length });
    } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
