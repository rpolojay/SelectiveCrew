import { NextResponse } from 'next/server';
import { getAdminDb } from '../../../lib/firebaseAdmin';

const CLIENT_ID     = '36078031878-33j2resrbm3u7ppn7j6c1dvfpeiiq64s.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI  = 'https://selectivecrew.com/api/gmail-callback';

async function firestoreSet(collection, docId, fields) {
  await getAdminDb().collection(collection).doc(docId).set(fields, { merge: true });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code  = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) return NextResponse.redirect('https://selectivecrew.com/admin?gmail_error=' + encodeURIComponent(error));
  if (!CLIENT_SECRET) return NextResponse.redirect('https://selectivecrew.com/admin?gmail_error=not_configured');
  if (!code || !state) return NextResponse.redirect('https://selectivecrew.com/admin?gmail_error=invalid_oauth_response');
  const stateRef = getAdminDb().collection('gmailOAuthStates').doc(state);
  const stateSnap = await stateRef.get();
  if (!stateSnap.exists || Date.now() - Number(stateSnap.data().createdAt || 0) > 10 * 60 * 1000) return NextResponse.redirect('https://selectivecrew.com/admin?gmail_error=invalid_oauth_state');
  await stateRef.delete();

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uri: REDIRECT_URI, grant_type: 'authorization_code' }),
    });
    const data = await res.json();
    if (data.error) return NextResponse.redirect('https://selectivecrew.com/admin?gmail_error=' + encodeURIComponent(data.error + ': ' + (data.error_description || '')));

    await firestoreSet('settings', 'gmail_oauth', {
      access_token:  data.access_token,
      refresh_token: data.refresh_token || '',
      expires_at:    String(Date.now() + ((data.expires_in || 3600) * 1000)),
      connected_at:  String(Date.now()),
      scope:         data.scope || '',
    });

    return NextResponse.redirect('https://selectivecrew.com/admin?gmail_connected=1');
  } catch(e) {
    return NextResponse.redirect('https://selectivecrew.com/admin?gmail_error=' + encodeURIComponent(e.message));
  }
}
