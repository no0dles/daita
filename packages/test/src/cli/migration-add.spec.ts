import * as cli from '@daita/cli';

const schemaPath = './src/schema.ts';

describe('migration:add', () => {
  // it('add', () => {
  //   Add.run(['init'], {
  //
  //   });
  // });

  it('should create initial migration', async() => {
    await cli.run(['migration:add', 'foo', '-s', schemaPath, '--cwd', './test/schema']);
  });
  // test
  //   .loadConfig({root})
  //   .stdout()
  //   .command(['migration:add', 'foo', '-s', schemaPath, '--cwd', './test/schema'])
  //   .do(output => expect(output.stdout).to.equal('hello world!\n'))
  //   .it()
});