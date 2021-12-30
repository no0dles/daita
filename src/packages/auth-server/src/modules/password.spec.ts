import { getLeakedCount } from './password';

describe('auth-server/modules/password', () => {
  it('should get leaked count', async () => {
    const count = await getLeakedCount('123456');
    expect(count).toBeGreaterThan(0);
  });
});
