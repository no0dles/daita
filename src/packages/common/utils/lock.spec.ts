import {Lock} from './lock';
import {sleep} from './sleep';

describe('common/utils/lock', () => {
  it('should hold lock', async () => {
    const lock = new Lock();
    let value = 0;
    const result1 = lock.acquire(async () => {
      await sleep(50);
      value++;
      return value;
    });
    const result2 = lock.acquire(() => {
      value = 10;
      return value;
    });
    expect(value).toEqual(0);
    const result = await Promise.all([result1, result2]);
    expect(value).toEqual(10);
    expect(result).toEqual([1, 10]);
  });

  it('should return error', async () => {
    const lock = new Lock();
    try {
      await lock.acquire(async () => {
        throw new Error('err');
      });
      throw new Error('should not be called');
    } catch (e) {
      expect(e.message).toEqual('err');
    }
  });
});
