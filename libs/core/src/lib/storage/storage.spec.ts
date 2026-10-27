import { TestBed } from '@angular/core/testing';

import { getStorage, LocalStorage, MemoryStorage } from './storage';

function quotaExceeded(): never {
  throw new DOMException('Quota exceeded', 'QuotaExceededError');
}

describe('getStorage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('returns the browser storage when it works', () => {
    expect(getStorage('localStorage')).toBe(localStorage);
  });

  it('returns null when the storage throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Denied', 'SecurityError');
    });

    expect(getStorage('localStorage')).toBeNull();
  });

  it('keeps a full storage that already has data', () => {
    localStorage.setItem('existing', '1');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(quotaExceeded);

    expect(getStorage('localStorage')).toBe(localStorage);
  });

  it('drops an empty storage with no quota (Safari private mode)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(quotaExceeded);

    expect(getStorage('localStorage')).toBeNull();
  });
});

describe('MemoryStorage', () => {
  it('works like Storage', () => {
    const storage = new MemoryStorage();
    storage.setItem('a', '1');
    storage.setItem('b', '2');

    expect(storage.getItem('a')).toBe('1');
    expect(storage.getItem('missing')).toBeNull();
    expect(storage.length).toBe(2);
    expect(storage.key(1)).toBe('b');
    expect(storage.key(2)).toBeNull();

    storage.removeItem('a');
    expect(storage.getItem('a')).toBeNull();
    storage.clear();
    expect(storage.length).toBe(0);
  });
});

describe('LocalStorage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('writes to the browser storage', () => {
    TestBed.inject(LocalStorage).setItem('key', 'value');

    expect(localStorage.getItem('key')).toBe('value');
  });

  it('falls back to memory when the browser storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Denied', 'SecurityError');
    });
    const storage = TestBed.inject(LocalStorage);
    vi.restoreAllMocks();

    storage.setItem('key', 'value');
    expect(storage.getItem('key')).toBe('value');
    expect(localStorage.getItem('key')).toBeNull();
  });

  it('ignores a failed write', () => {
    localStorage.setItem('existing', '1');
    const storage = TestBed.inject(LocalStorage);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(quotaExceeded);

    expect(() => storage.setItem('key', 'value')).not.toThrow();
    expect(storage.getItem('key')).toBeNull();
  });
});
