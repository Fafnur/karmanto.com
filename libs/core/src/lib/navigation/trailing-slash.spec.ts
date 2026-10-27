import { addTrailingSlash, removeTrailingSlash } from './trailing-slash';

describe('addTrailingSlash', () => {
  it('adds the slash before the query and the fragment', () => {
    expect(addTrailingSlash('/privacy')).toBe('/privacy/');
    expect(addTrailingSlash('/privacy?a=1#b')).toBe('/privacy/?a=1#b');
    expect(addTrailingSlash('/#features')).toBe('/#features');
    expect(addTrailingSlash('/')).toBe('/');
  });
});

describe('removeTrailingSlash', () => {
  it('keeps the root and strips the slash before the query and the fragment', () => {
    expect(removeTrailingSlash('/')).toBe('/');
    expect(removeTrailingSlash('/privacy/')).toBe('/privacy');
    expect(removeTrailingSlash('/privacy/?a=1#b')).toBe('/privacy?a=1#b');
    expect(removeTrailingSlash('/#features')).toBe('/#features');
  });
});
