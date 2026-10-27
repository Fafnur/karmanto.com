import { PATHS, toRoutes } from './navigation';

describe('toRoutes', () => {
  it('strips the leading slash', () => {
    expect(toRoutes([{ path: PATHS.privacy }, { path: PATHS.home }]).map((route) => route.path)).toEqual(['privacy', '']);
  });

  it('keeps the wildcard and the empty path', () => {
    expect(toRoutes([{ path: PATHS.any }, { path: PATHS.current }]).map((route) => route.path)).toEqual(['**', '']);
  });

  it('makes children relative to the parent', () => {
    const [layout] = toRoutes([{ path: PATHS.current, children: [{ path: PATHS.support }] }]);

    expect(layout.children?.[0].path).toBe('support');
  });
});
