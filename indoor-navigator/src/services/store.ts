import AsyncStorage from '@react-native-async-storage/async-storage';
import { type UserProfile } from '../types/user';

export type { UserProfile };

const KEY = 'indoor-recents-v1';
const MAX = 5;

export async function loadRecents(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string').slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export async function saveRecent(id: string): Promise<string[]> {
  try {
    const cur = await loadRecents();
    const next = [id, ...cur.filter((x) => x !== id)].slice(0, MAX);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

export async function clearRecents(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}



const USER_KEY = 'indoor-user-profile-v1';

export async function loadUserProfile(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string' && (parsed.type === 'guest' || parsed.type === 'edu')) {
      return parsed as UserProfile;
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(profile));
  } catch {
    /* noop */
  }
}

export async function clearUserProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch {
    /* noop */
  }
}

