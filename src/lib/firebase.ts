import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import type { DiaryEntry } from '../types';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAOHl0FAHC6haDxXMpuNKdA6bRJXwOrjrk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "visit-e95d1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "visit-e95d1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "visit-e95d1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "707774967373",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:707774967373:web:646aefa243bb98e180b604"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

const COLLECTION_NAME = 'diaries';
const LOCAL_STORAGE_KEY = 'warm_diaries_cache_v1';

// Local storage helper
export function getLocalDiaries(): DiaryEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to read local diaries:', e);
    return [];
  }
}

export function saveLocalDiaries(diaries: DiaryEntry[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(diaries));
  } catch (e) {
    console.warn('Failed to save local diaries:', e);
  }
}

// Fetch diaries: Tries Firestore first, merges with local cache
export async function fetchAllDiaries(): Promise<{ diaries: DiaryEntry[]; isFromCloud: boolean }> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const cloudDiaries: DiaryEntry[] = [];
    
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as DiaryEntry;
      cloudDiaries.push({
        ...data,
        id: docSnap.id,
      });
    });

    if (cloudDiaries.length > 0) {
      saveLocalDiaries(cloudDiaries);
      return { diaries: cloudDiaries, isFromCloud: true };
    }
  } catch (err) {
    console.warn('Firestore fetch failed or rules restricted, using local storage cache:', err);
  }

  // Fallback to local cache
  const local = getLocalDiaries();
  return { diaries: local, isFromCloud: false };
}

// Save a diary entry: Writes to local cache immediately, then syncs to Firestore
export async function saveDiaryEntry(diary: DiaryEntry): Promise<void> {
  // Update local cache first
  const current = getLocalDiaries();
  const index = current.findIndex((d) => d.id === diary.id);
  const updated = index >= 0
    ? current.map((d) => (d.id === diary.id ? diary : d))
    : [diary, ...current];
  saveLocalDiaries(updated);

  // Sync to Firestore
  try {
    const docRef = doc(db, COLLECTION_NAME, diary.id);
    await setDoc(docRef, diary, { merge: true });
  } catch (err) {
    console.warn('Could not sync diary to Firestore (saved locally):', err);
  }
}

// Delete a diary entry
export async function removeDiaryEntry(id: string): Promise<void> {
  const current = getLocalDiaries();
  saveLocalDiaries(current.filter((d) => d.id !== id));

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Could not delete from Firestore:', err);
  }
}

// Update tomorrow action completion
export async function updateActionCompletion(id: string, completed: boolean): Promise<void> {
  const current = getLocalDiaries();
  const updated = current.map((d) =>
    d.id === id ? { ...d, completedTomorrowAction: completed } : d
  );
  saveLocalDiaries(updated);

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { completedTomorrowAction: completed });
  } catch (err) {
    console.warn('Could not update action status in Firestore:', err);
  }
}
