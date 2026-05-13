import { NextResponse } from 'next/server';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code  = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect('https://selectivecrew.com/admin?gmail_error=' + error);
  }

  if (!code) {
    return NextResponse.redirect('https://selectivecrew.com/admin?gmail_error=no_code');
  }

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    const data = await res.json();

    if (data.error) {
      console.error('OAuth error:', data);
      return NextResponse.redirect('https://selectivecrew.com/admin?gmail_error=' + encodeURIComponent(data.error + ': ' + (data.error_description || '')));
    }

    const db = getDb();
    try {
      await setDoc(doc(db, 'settings', 'gmail_oauth'), {
        access_token:  data.access_token,
        refresh_token: data.refresh_token || '',
        expires_at:    Date.now() + ((data.expires_in || 3600) * 1000),
        connected_at:  Date.now(),
        scope:         data.scope || '',
      });
      console.log('Token saved. Has refresh_token:', !!data.refresh_token);
    } catch(dbError) {
      console.error('Firestore save failed:', dbError.message);
      return NextResponse.redirect('https://selectivecrew.com/admin?gmail_error=' + encodeURIComponent('Firestore: ' + dbError.message));
    }

    return NextResponse.redirect('https://selectivecrew.com/admin?gmail_connected=1');
  } catch(e) {
    return NextResponse.redirect('https://selectivecrew.com/admin?gmail_error=' + encodeURIComponent(e.message));
  }
}