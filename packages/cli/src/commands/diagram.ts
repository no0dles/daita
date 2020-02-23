import {Command, flags} from '@oclif/command';
import * as fs from 'fs';
import * as path from 'path';
import {getSchemaInformation, getSchemaLocation} from '../utils/path';
import {AstContext} from '../ast/ast-context';

export default class Diagram extends Command {
  static description = 'create diagram for schema';

  static flags = {
    schema: flags.string({char: 's', description: 'path to schema'}),
    filename: flags.string({char: 'f', description: 'output svg filename', default: 'docs/schema.svg'}),
    cwd: flags.string({description: 'working directory', default: '.'}),
  };

  async run() {
    const {flags} = this.parse(Diagram);
    const schemaLocation = await getSchemaLocation(flags, this);
    const astContext = new AstContext();
    const schemaInfo = await getSchemaInformation(astContext, schemaLocation, this);
    if (!schemaInfo) {
      this.warn('could not load schema');
      return;
    }

    const nomnoml = require('nomnoml');

    let content =
      '#direction: right\n' +
      '#edges: rounded\n' +
      '#zoom: 2\n' +
      '#fillArrows: true\n' +
      '#leading: 1.75\n' +
      '#spacing: 90\n' +
      '#arrowSize: 0.5\n';

    const relationalSchema = schemaInfo.getRelationalSchema();
    for (const table of relationalSchema.tables) {
      content += `[${table.name}|${table.fields.map(f => `${f.name}${f.required ? '!' : ''}:${f.type}`).join(';')}]\n`;
      for (const foreignKey of table.foreignKeys) {
        let required = true;
        for (const key of foreignKey.keys) {
          const field = table.field(key);
          if (field && !field.required) {
            required = false;
          }
        }

        content += `[${table.name}] ${foreignKey.name}${required ? '+' : 'o'}-> [${foreignKey.table}]\n`;
      }
    }

    const svg = nomnoml.renderSvg(content);
    //const svg = await (<any>yuml2svg)(content, { isDark: true, type:  'class', dir: 'LR' });
    const cwd = flags.cwd ? path.resolve(flags.cwd) : process.cwd();
    const svgFile = path.join(cwd, flags.filename || 'docs/schema.svg');
    const svgDirectory = path.dirname(svgFile);
    if (!fs.existsSync(svgDirectory)) {
      fs.mkdirSync(svgDirectory, {recursive: true});
    }
    this.log(`Writing diagram to "${svgFile}"`);
    await fs.promises.writeFile(svgFile, svg);
  }
}
