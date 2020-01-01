import {Command, flags} from '@oclif/command'
import * as fs from "fs";
import * as path from "path";

export default class Diagram extends Command {
  static description = 'create diagram for schema';

  static flags = {};

  async run() {
    const nomnoml = require("nomnoml");
    const content = '#direction: right\n' +
      '#edges: rounded\n' +
      '#zoom: 2\n' +
      '#fillArrows: true\n' +
      '#leading: 1.75\n' +
      '#spacing: 90\n' +
      '#arrowSize: 0.5\n' +
      '[Author|\n' +
      'id:string\n' +
      'username: string\n' +
      'firstName: string\n' +
      'lastName: string\n' +
      'biography: string\n' +
      ']\n' +
      '\n' +
      '[BlogPost|\n' +
      'slug: string\n' +
      'title: string\n' +
      'content: string\n' +
      'created: Date\n' +
      ']\n' +
      '\n' +
      '[BlogComment|\n' +
      'id: string\n' +
      'text: string\n' +
      'created: Date\n' +
      ']\n' +
      '\n' +
      '[BlogPost] author+-> [Author]\n' +
      '[BlogComment] blog+-> [BlogPost]\n' +
      '[BlogComment] auhtor+-> [Author]\n';
    const svg = nomnoml.renderSvg(content);
    //const svg = await (<any>yuml2svg)(content, { isDark: true, type:  'class', dir: 'LR' });
    await fs.promises.writeFile(path.join(process.cwd(), 'diagram.svg'), svg);
  }
}
