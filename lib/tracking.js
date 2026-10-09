import { db, auth } from './firebase';
import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function saveLead({ name, email, retail = '', source = 'training-landing', cvUrl = '' }) {
  try {
    const response = await fetch('/api/candidate-action', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save-training-lead', name, email, retail, source, cvUrl }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to save registration');
    return result;
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

export async function saveQuizResult(userId, answers) {
  const user = auth.currentUser;
  if (!user || user.uid !== userId) throw new Error('Please sign in to save quiz results.');
  const token = await user.getIdToken();
  const response = await fetch('/api/candidate-action', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action: 'save-quiz-result', userId, answers }),
  });
  if (!response.ok) throw new Error('Unable to save quiz result.');
}

export async function issueCertificate(userId, candidateName, score, total) {
  const user = auth.currentUser;
  if (!user || user.uid !== userId) throw new Error('Please sign in to issue your certificate.');
  const token = await user.getIdToken();
  const response = await fetch('/api/candidate-action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ action: 'issue-certificate', userId, candidateName, score, total }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to issue certificate.');
  return result.certId;
}

export async function getCertificate(certId) {
  const snap = await getDoc(doc(db, 'certificates', certId));
  return snap.exists() ? snap.data() : null;
}
