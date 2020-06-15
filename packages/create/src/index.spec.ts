import {create} from './create';

describe('index', () => {
  it('should create project', async() => {
    process.stdout.on('data', evt => {
      //process.stdin.write('foo');
      const data = evt;
    });
    await create();
  });
});
