import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            'AIzaSyBVk-wMrhNxNGiAg8WhFlMsE4x1uiEXbkc',
  authDomain:        'studio-6715036493-baccc.firebaseapp.com',
  projectId:         'studio-6715036493-baccc',
  storageBucket:     'studio-6715036493-baccc.firebasestorage.app',
  messagingSenderId: '36078031878',
  appId:             '1:36078031878:web:cb72a09fdd9e0362265f87'
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;