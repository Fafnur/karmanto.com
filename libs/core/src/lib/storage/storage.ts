import { Service } from '@angular/core';

/**
 * The browser storage if it works: absent on the server, may be disabled or throw on access (private mode, blocked
 * cookies). A full storage still counts as available.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#testing_for_availability
 */
export function getStorage(type: 'localStorage' | 'sessionStorage'): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  let storage: Storage | undefined;
  try {
    storage = window[type];
    const key = '__storage_test__';
    storage.setItem(key, key);
    storage.removeItem(key);
    return storage;
  } catch (error) {
    const full =
      error instanceof DOMException &&
      // Firefox before 77 names it differently.
      (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      !!storage &&
      storage.length !== 0;
    return full ? (storage ?? null) : null;
  }
}

/** Storage that lives until the page is closed: the fallback when the browser storage is unavailable. */
export class MemoryStorage implements Storage {
  private readonly items = new Map<string, string>();

  get length(): number {
    return this.items.size;
  }

  clear(): void {
    this.items.clear();
  }

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.items.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.items.delete(key);
  }

  setItem(key: string, value: string): void {
    this.items.set(key, String(value));
  }
}

/**
 * `localStorage` that never throws: in memory on the server and where the browser storage is unavailable.
 * A failed write (quota) is dropped: the value just is not remembered.
 */
@Service()
export class LocalStorage implements Storage {
  private readonly storage = getStorage('localStorage') ?? new MemoryStorage();

  get length(): number {
    return this.storage.length;
  }

  clear(): void {
    this.storage.clear();
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch {
      // Quota exceeded by someone else's data: ours is a few bytes and is not worth clearing the storage for.
    }
  }
}
