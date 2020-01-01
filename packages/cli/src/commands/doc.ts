import {Command, flags} from '@oclif/command'
import {cli} from 'cli-ux';

export default class Doc extends Command {
  static description = 'open documentation';

  async run() {
    const url = 'https://app.gitbook.com/@no0dles/s/aion';
    await cli.open(url);
  }
}
