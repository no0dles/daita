import { handleTimeout } from './timeout';
import { sleep } from './sleep';
import { TimeoutError } from './timeout-error';

describe('common/utils/timeout', () => {
  it('should throw timeout when it expires', async () => {
    try {
      await handleTimeout(() => sleep(1000), 500);
      throw new Error('no timeout');
    } catch (e) {
      expect(e.message).not.toEqual(' no timeout');
      expect(e).toBeInstanceOf(TimeoutError);
    }
  });

  it('should not throw timeout when it ends before', async () => {
    try {
      await handleTimeout(() => sleep(200), 500);
    } catch (e) {
      expect(e).not.toBeInstanceOf(TimeoutError);
    }
  });

  it('should not throw error of action if it happens before timeout', async () => {
    try {
      await handleTimeout(async () => {
        throw new Error('test');
      }, 500);
    } catch (e) {
      expect(e.message).toEqual('test');
      expect(e).not.toBeInstanceOf(TimeoutError);
    }
  });
});
