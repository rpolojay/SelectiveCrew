import { db } from './firebase';
import { doc, setDoc, updateDoc, getDoc, serverTimestamp, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export async function saveLead({ name, email, retail = '', source = 'training-landing' }) {
  try {
    const q = query(collection(db, 'trainingLeads'), where('email', '==', email));
    const existing = await getDocs(q);
    if (!existing.empty) return { success: true, duplicate: true };
    await addDoc(collection(db, 'trainingLeads'), {
      name, email, retail, source,
      createdAt: serverTimestamp(),
    });
    return { success: true, duplicate: false };
  } catch (e) {
    console.error('saveLead error:', e);
    return { success: false };
  }
}

export async function startSession(user) {
  const ref = doc(db, 'training_sessions', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid, email: user.email, displayName: user.displayName || '',
      startedAt: serverTimestamp(), lastActiveAt: serverTimestamp(),
      modulesCompleted: [], quizScore: null, quizAttempts: 0,
      certified: false, certId: null,
    });
    await saveLead({ name: user.displayName || '', email: user.email, source: 'full-registration' });
  } else {
    await updateDoc(ref, { lastActiveAt: serverTimestamp() });
  }
}

export async function completeModule(userId, moduleIndex) {
  const ref = doc(db, 'training_sessions', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const existing = snap.data().modulesCompleted || [];
  if (!existing.includes(moduleIndex)) {
    await updateDoc(ref, { modulesCompleted: [...existing, moduleIndex], lastActiveAt: serverTimestamp() });
  }
}

export async function saveQuizResult(userId, score, total) {
  const ref = doc(db, 'training_sessions', userId);
  const snap = await getDoc(ref);
  const attempts = snap.exists() ? (snap.data().quizAttempts || 0) : 0;
  await updateDoc(ref, { quizScore: score, quizTotal: total, quizAttempts: attempts + 1, lastActiveAt: serverTimestamp() });
}

export async function issueCertificate(userId, candidateName, score, total) {
  const certId = `SC-DF-${Date.now()}-${Math.random().toString(36).substring(2,7).toUpperCase()}`;
  await setDoc(doc(db, 'certificates', certId), {
    certId, userId, candidateName, score, total,
    percentage: Math.round((score/total)*100),
    issuedAt: serverTimestamp(),
    expiresAt: new Date(new Date().getFullYear()+1, new Date().getMonth(), new Date().getDate()),
    course: 'Duty-Free Sales Excellence',
    issuer: 'SelectiveCrew Training Institute',
    valid: true,
  });
  await updateDoc(doc(db, 'training_sessions', userId), { certified: true, certId, certifiedAt: serverTimestamp() });
  return certId;
}

export async function getCertificate(certId) {
  const snap = await getDoc(doc(db, 'certificates', certId));
  return snap.exists() ? snap.data() : null;
}