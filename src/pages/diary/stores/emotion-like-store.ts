import { useEffect, useState } from 'react';

export type EmotionLikeState = Record<number, boolean>;
type Listener = () => void;

const LS_KEY = 'MY_EMOTION_LIKES_V1';

class EmotionLikeStore {
  private state: EmotionLikeState = {};
  private listeners = new Set<Listener>();
  private version = 0;

  constructor() {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
      if (raw) this.state = JSON.parse(raw) as EmotionLikeState;
    } catch {
      this.state = {};
    }
  }

  getVersion() {
    return this.version;
  }

  isLiked(id?: number): boolean {
    if (!id) return false;
    return !!this.state[id];
  }

  setLiked(id: number, liked: boolean) {
    this.state[id] = liked;
    this.persist();
    this.bump();
  }

  toggle(id: number) {
    this.setLiked(id, !this.isLiked(id));
  }

  subscribe(cb: Listener) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private persist() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LS_KEY, JSON.stringify(this.state));
      }
    } catch {
      void 0;
    }
  }

  private bump() {
    this.version += 1;
    this.listeners.forEach((l) => l());
  }
}

export const emotionLikeStore = new EmotionLikeStore();

export function useEmotionLikesVersion() {
  const [v, setV] = useState<number>(emotionLikeStore.getVersion());
  useEffect(() => {
    return emotionLikeStore.subscribe(() => {
      setV(emotionLikeStore.getVersion());
    });
  }, []);
  return v;
}
