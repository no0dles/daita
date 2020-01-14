import { Command } from '@oclif/command';
import { cli } from 'cli-ux';

export default class Doc extends Command {
  static description = 'open documentation website';

  async run() {
    const url = 'https://docs.daita.ch';
    await cli.open(url);
  }
}
