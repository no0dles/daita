import { getKey } from './key';
import { UserPoolAlgorithm } from '@daita/auth';

describe('auth-server/modules/key', () => {
  const algorithms: UserPoolAlgorithm[] = ['RS256', 'RS384', 'RS512', 'EC384', 'EC512'];
  describe.each(algorithms)('%s', (algo) => {
    it('should get key', async () => {
      const key = await getKey('a', algo);
      if (algo.startsWith('RS')) {
        expect(key.kty).toBe('RSA');
      } else {
        expect(key.kty).toBe('EC');
      }
    });

    it('should get the same key', async () => {
      const key = await getKey('a', algo);
      const key2 = await getKey('a', algo);
      expect(key.kid).toBe(key2.kid);
    });
  });
});
